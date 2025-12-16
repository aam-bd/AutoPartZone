import stripe from 'stripe';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';

// Initialize Stripe with your secret key
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { cartId, shippingAddress } = req.body;

    // Get cart and validate
    const cart = await Cart.findById(cartId).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate stock availability
    for (const item of cart.items) {
      const product = item.productId;
      if (!product.isActive) {
        return res.status(400).json({ 
          message: `Product ${product.name} is no longer available` 
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    const tax = subtotal * 0.05; // 5% tax
    const shippingCost = 10.00; // Flat shipping rate
    const totalAmount = subtotal + tax + shippingCost;

    // Create payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        cartId: cartId,
        userId: req.user.id
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      totalAmount,
      subtotal,
      tax,
      shippingCost
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
};

// Confirm payment and create order
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, cartId, shippingAddress, billingAddress } = req.body;

    // Retrieve payment intent to verify
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Get cart
    const cart = await Cart.findById(cartId).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    const tax = subtotal * 0.05;
    const shippingCost = 10.00;
    const totalAmount = subtotal + tax + shippingCost;

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity
      })),
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      status: 'processing',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod: {
        type: 'card',
        last4: paymentIntent.charges.data[0]?.payment_method_details?.card?.last4 || '0000',
        transactionId: paymentIntent.id
      }
    });

    await order.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    await Cart.findByIdAndDelete(cartId);

    // Audit log
    await AuditLog.create({
      userId: req.user.id,
      action: 'ORDER_CREATE',
      resource: 'Order',
      resourceId: order._id,
      details: {
        orderId: order._id,
        totalAmount,
        itemCount: order.items.length
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      success: true
    });

    // Generate invoice (this would be done asynchronously in production)
    // TODO: Implement PDF invoice generation

    res.json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        items: order.items.length
      }
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
};

// Webhook for Stripe events
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      // Additional processing if needed
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

// Process refund
export const processRefund = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Order must be completed to process refund' });
    }

    // Create refund
    const refund = await stripeClient.refunds.create({
      payment_intent: order.paymentMethod.transactionId,
      amount: amount ? Math.round(amount * 100) : undefined, // If no amount, full refund
    });

    // Update order status
    order.status = 'refunded';
    order.refundDetails = {
      refundId: refund.id,
      amount: refund.amount / 100,
      reason: req.body.reason || 'Customer request'
    };

    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }

    // Audit log
    await AuditLog.create({
      userId: req.user.id,
      action: 'ORDER_CANCEL',
      resource: 'Order',
      resourceId: order._id,
      details: {
        refundId: refund.id,
        refundAmount: refund.amount / 100
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      success: true
    });

    res.json({
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });

  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({ message: 'Refund failed', error: error.message });
  }
};