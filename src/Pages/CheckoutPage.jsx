import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  const [billingAddress, setBillingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);

  const shippingCost = totalPrice >= 140 ? 0 : 15.00;
  const tax = totalPrice * 0.05;
  const grandTotal = totalPrice + shippingCost + tax;

  const handleInputChange = (e, type, field) => {
    const value = e.target.value;
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
      if (sameAsShipping) {
        if (field === 'fullName' || field === 'email' || field === 'phone') {
          setBillingAddress(prev => ({ ...prev, [field]: value }));
        }
      }
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      const orderId = 'ORD-' + Date.now();
      localStorage.setItem('lastOrderId', orderId);
      clearCart();
      setProcessing(false);
      navigate('/order-confirmation');
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <button 
          onClick={() => navigate('/shop')}
          className="btn btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input 
                  type="text" 
                  value={shippingAddress.fullName}
                  onChange={(e) => handleInputChange(e, 'shipping', 'fullName')}
                  className="input input-bordered" 
                  required 
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  value={shippingAddress.email}
                  onChange={(e) => handleInputChange(e, 'shipping', 'email')}
                  className="input input-bordered" 
                  required 
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input 
                  type="tel" 
                  value={shippingAddress.phone}
                  onChange={(e) => handleInputChange(e, 'shipping', 'phone')}
                  className="input input-bordered" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Street Address</span>
                </label>
                <input 
                  type="text" 
                  value={shippingAddress.street}
                  onChange={(e) => handleInputChange(e, 'shipping', 'street')}
                  className="input input-bordered" 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <input 
                    type="text" 
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange(e, 'shipping', 'city')}
                    className="input input-bordered" 
                    required 
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">State</span>
                  </label>
                  <input 
                    type="text" 
                    value={shippingAddress.state}
                    onChange={(e) => handleInputChange(e, 'shipping', 'state')}
                    className="input input-bordered" 
                    required 
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">ZIP Code</span>
                  </label>
                  <input 
                    type="text" 
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleInputChange(e, 'shipping', 'zipCode')}
                    className="input input-bordered" 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
            <div className="form-control mb-4">
              <label className="label cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="checkbox" 
                />
                <span className="label-text ml-2">Same as shipping address</span>
              </label>
            </div>
            
            {!sameAsShipping && (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input 
                    type="text" 
                    value={billingAddress.fullName}
                    onChange={(e) => handleInputChange(e, 'billing', 'fullName')}
                    className="input input-bordered" 
                    required 
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Street Address</span>
                  </label>
                  <input 
                    type="text" 
                    value={billingAddress.street}
                    onChange={(e) => handleInputChange(e, 'billing', 'street')}
                    className="input input-bordered" 
                    required 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="radio" 
                />
                <div className="ml-3">
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay when you receive your order</div>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="radio" 
                />
                <div className="ml-3">
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600">Pay securely with your card</div>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  value="bkash"
                  checked={paymentMethod === 'bkash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="radio" 
                />
                <div className="ml-3">
                  <div className="font-medium">bKash</div>
                  <div className="text-sm text-gray-600">Pay with bKash mobile banking</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {cartItems.map((item, index) => (
                <div key={`checkout-item-${item.id}-${index}`} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                  {shippingCost === 0 ? 'FREE' : `৳${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>৳{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>৳{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6"
              disabled={processing}
            >
              {processing ? (
                <span className="loading loading-spinner"></span>
              ) : (
                `Place Order - ৳${grandTotal.toFixed(2)}`
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => navigate('/cart')}
              className="btn btn-outline w-full mt-2"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}