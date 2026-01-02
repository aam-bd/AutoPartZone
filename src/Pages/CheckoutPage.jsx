import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useVehicle } from '../context/VehicleContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { selectedVehicle } = useVehicle();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh'
  });

  const [billingAddress, setBillingAddress] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh'
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const shippingCost = totalPrice >= 10000 ? 0 : 15.00;
  const tax = totalPrice * 0.05;
  const grandTotal = totalPrice + shippingCost + tax;

  // Set loading to false when component mounts
  useEffect(() => {
    if (cartItems.length >= 0) {
      setLoading(false);
    }
  }, [cartItems]);

  // Auto-fill customer info from auth context
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  // Save shipping address to localStorage when changed
  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  // Sync billing address with shipping when sameAsShipping changes
  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(prev => ({
        ...prev,
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country
      }));
    }
  }, [sameAsShipping, shippingAddress]);

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
    setError('');
    setProcessing(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to continue');
        setProcessing(false);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/orders/place`;
      console.log('Making order request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId?._id || item.productId || item.id,
            quantity: item.quantity,
            price: item.price
          })),
          subtotal: totalPrice,
          tax,
          shippingCost,
          totalAmount: grandTotal,
          shippingAddress,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
          paymentMethod: paymentMethod === 'card' ? 'card' : 'cod',
          status: 'pending'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Checkout error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Failed to place order');
        } catch {
          throw new Error(errorText || 'Failed to place order. Please contact support.');
        }
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        if (responseText.includes('<!DOCTYPE')) {
          throw new Error('Order service is temporarily unavailable. Please try again later.');
        }
        throw new Error('Invalid response from server. Please try again.');
      }

      const orderData = await response.json();
      const orderId = orderData.order?.id || orderData.id || 'ORD-' + Date.now();
      console.log('🔥 Setting localStorage with orderId:', orderId);
      console.log('🔥 Full orderData:', orderData);
      localStorage.setItem('lastOrderId', orderId);
      
      // Store order details for confirmation page
      console.log('📝 Storing order in localStorage:', {
        id: orderId,
        orderData: orderData,
        orderNumber: orderData.order?.orderNumber
      });
      localStorage.setItem('lastOrder', JSON.stringify({
        id: orderId,
        _id: orderData.order?._id || orderId,
        orderNumber: orderData.order?.orderNumber || orderId,
        items: cartItems,
        subtotal: totalPrice,
        tax,
        shippingCost,
        totalAmount: grandTotal,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod: paymentMethod === 'card' ? 'card' : 'cod',
        status: 'pending',
        createdAt: new Date().toISOString()
      }));
      
      clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost ml-4" onClick={() => setError('')}>
            ×
          </button>
        </div>
      )}

      {/* Vehicle Selection Summary */}
      {selectedVehicle && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18L12 10.5V18l-3.75 3.75M8.25 18l3.75-7.5M12 10.5V2.25M12 10.5h4.5M12 2.25h4.5M16.5 2.25V18" />
            </svg>
            <div>
              <p className="font-semibold text-blue-800">Selected Vehicle:</p>
              <p className="text-blue-700">
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </p>
            </div>
          </div>
        </div>
      )}

       {/* Order Summary */}
       <div className="bg-red-50 rounded-lg shadow-lg border-2 border-red-200 p-6 mb-6">
         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2 mb-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span>৳{((item.price || 0) * item.quantity).toFixed(2)}</span>
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
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>৳{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Shipping Information */}
           <div className="space-y-6">
             <div className="bg-red-50 rounded-lg shadow-lg border-2 border-red-200 p-6">
               <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Information</h2>
               <div className="space-y-4">
                 <div className="form-control">
                   <label className="label">
                     <span className="label-text font-semibold text-gray-700">Full Name</span>
                   </label>
                   <input 
                     type="text" 
                     value={shippingAddress.fullName}
                     onChange={(e) => handleInputChange(e, 'shipping', 'fullName')}
                     className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                     required 
                   />
                 </div>
                 <div className="form-control">
                   <label className="label">
                     <span className="label-text font-semibold text-gray-700">Email</span>
                   </label>
                   <input 
                     type="email" 
                     value={shippingAddress.email}
                     onChange={(e) => handleInputChange(e, 'shipping', 'email')}
                     className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                     required 
                   />
                 </div>
                 <div className="form-control">
                   <label className="label">
                     <span className="label-text font-semibold text-gray-700">Phone Number</span>
                   </label>
                   <input 
                     type="tel" 
                     value={shippingAddress.phone}
                     onChange={(e) => handleInputChange(e, 'shipping', 'phone')}
                     className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                     required 
                   />
                 </div>
               </div>
             </div>

             {/* Shipping Address */}
             <div className="bg-red-50 rounded-lg shadow-lg border-2 border-red-200 p-6">
               <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
               <div className="space-y-4">
                 <div className="form-control">
                   <label className="label">
                     <span className="label-text font-semibold text-gray-700">Street Address</span>
                   </label>
                   <input 
                     type="text" 
                     value={shippingAddress.street}
                     onChange={(e) => handleInputChange(e, 'shipping', 'street')}
                     className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                     required 
                   />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="form-control">
                     <label className="label">
                       <span className="label-text font-semibold text-gray-700">City</span>
                     </label>
                     <input 
                       type="text" 
                       value={shippingAddress.city}
                       onChange={(e) => handleInputChange(e, 'shipping', 'city')}
                       className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                       required 
                     />
                   </div>
                   <div className="form-control">
                     <label className="label">
                       <span className="label-text font-semibold text-gray-700">State</span>
                     </label>
                     <input 
                       type="text" 
                       value={shippingAddress.state}
                       onChange={(e) => handleInputChange(e, 'shipping', 'state')}
                       className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                       required 
                     />
                   </div>
                   <div className="form-control">
                     <label className="label">
                       <span className="label-text font-semibold text-gray-700">ZIP Code</span>
                     </label>
                     <input 
                       type="text" 
                       value={shippingAddress.zipCode}
                       onChange={(e) => handleInputChange(e, 'shipping', 'zipCode')}
                       className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                       required 
                     />
                   </div>
                 </div>
                 <div className="form-control">
                   <label className="label">
                     <span className="label-text font-semibold text-gray-700">Country</span>
                   </label>
                   <select
                     value={shippingAddress.country}
                     onChange={(e) => handleInputChange(e, 'shipping', 'country')}
                     className="select select-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full"
                   >
                     <option value="Bangladesh">Bangladesh</option>
                     <option value="United States">United States</option>
                     <option value="United Kingdom">United Kingdom</option>
                     <option value="India">India</option>
                   </select>
                 </div>
               </div>
             </div>
           </div>

         {/* Billing Information */}
         <div className="space-y-6">
           <div className="bg-red-50 rounded-lg shadow-lg border-2 border-red-200 p-6">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold text-gray-800">Billing Information</h2>
               <div className="form-control">
                 <label className="cursor-pointer label">
                   <input
                     type="checkbox"
                     checked={sameAsShipping}
                     onChange={(e) => setSameAsShipping(e.target.checked)}
                     className="checkbox checkbox-primary mr-2"
                   />
                   <span className="label-text font-medium text-gray-700">Same as shipping</span>
                 </label>
               </div>
             </div>

             <div className={`space-y-4 ${sameAsShipping ? 'opacity-50 pointer-events-none' : ''}`}>
               <div className="form-control">
                 <label className="label">
                   <span className="label-text font-semibold text-gray-700">Full Name</span>
                 </label>
                 <input 
                   type="text" 
                   value={billingAddress.fullName}
                   onChange={(e) => handleInputChange(e, 'billing', 'fullName')}
                   className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                   disabled={sameAsShipping}
                 />
               </div>
               <div className="form-control">
                 <label className="label">
                   <span className="label-text font-semibold text-gray-700">Email</span>
                 </label>
                 <input 
                   type="email" 
                   value={billingAddress.email}
                   onChange={(e) => handleInputChange(e, 'billing', 'email')}
                   className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                   disabled={sameAsShipping}
                 />
               </div>
               <div className="form-control">
                 <label className="label">
                   <span className="label-text font-semibold text-gray-700">Phone Number</span>
                 </label>
                 <input 
                   type="tel" 
                   value={billingAddress.phone}
                   onChange={(e) => handleInputChange(e, 'billing', 'phone')}
                   className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                   disabled={sameAsShipping}
                 />
               </div>
               <div className="form-control">
                 <label className="label">
                   <span className="label-text font-semibold text-gray-700">Street Address</span>
                 </label>
                 <input 
                   type="text" 
                   value={billingAddress.street}
                   onChange={(e) => handleInputChange(e, 'billing', 'street')}
                   className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                   disabled={sameAsShipping}
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="form-control">
                   <label className="label">
                     <span className="label-text font-semibold text-gray-700">City</span>
                   </label>
                   <input 
                     type="text" 
                     value={billingAddress.city}
                     onChange={(e) => handleInputChange(e, 'billing', 'city')}
                     className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                     disabled={sameAsShipping}
                   />
                 </div>
                 <div className="form-control">
                   <label className="label">
                     <span className="label-text font-semibold text-gray-700">State</span>
                   </label>
                   <input 
                     type="text" 
                     value={billingAddress.state}
                     onChange={(e) => handleInputChange(e, 'billing', 'state')}
                     className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                     disabled={sameAsShipping}
                   />
                 </div>
                 <div className="form-control">
                   <label className="label">
                     <span className="label-text font-semibold text-gray-700">ZIP Code</span>
                   </label>
                   <input 
                     type="text" 
                     value={billingAddress.zipCode}
                     onChange={(e) => handleInputChange(e, 'billing', 'zipCode')}
                     className="input input-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full" 
                     disabled={sameAsShipping}
                   />
                 </div>
               </div>
               <div className="form-control">
                 <label className="label">
                   <span className="label-text font-semibold text-gray-700">Country</span>
                 </label>
                 <select
                   value={billingAddress.country}
                   onChange={(e) => handleInputChange(e, 'billing', 'country')}
                   className="select select-bordered border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full"
                   disabled={sameAsShipping}
                 >
                   <option value="Bangladesh">Bangladesh</option>
                   <option value="United States">United States</option>
                   <option value="United Kingdom">United Kingdom</option>
                   <option value="India">India</option>
                 </select>
               </div>
             </div>
           </div>

           {/* Payment Method */}
           <div className="bg-red-50 rounded-lg shadow-lg border-2 border-red-200 p-6">
             <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h2>
             <div className="space-y-3">
               <div className="form-control">
                 <label className="cursor-pointer label">
                   <input
                     type="radio"
                     value="cod"
                     checked={paymentMethod === 'cod'}
                     onChange={(e) => setPaymentMethod(e.target.value)}
                     className="radio radio-primary mr-2"
                   />
                   <span className="label-text font-medium text-gray-700">Cash on Delivery (COD)</span>
                 </label>
               </div>
               <div className="form-control">
                 <label className="cursor-pointer label">
                   <input
                     type="radio"
                     value="card"
                     checked={paymentMethod === 'card'}
                     onChange={(e) => setPaymentMethod(e.target.value)}
                     className="radio radio-primary mr-2"
                   />
                   <span className="label-text font-medium text-gray-700">Credit/Debit Card</span>
                 </label>
               </div>
             </div>
           </div>
         </div>

        {/* Submit Button */}
        <div className="lg:col-span-2 flex gap-4">
          <button 
            type="submit" 
            className="btn btn-primary w-full flex items-center justify-center"
            disabled={processing}
          >
            {processing ? (
               <span className="loading loading-spinner"></span>
            ) : (
               `Confirm Order - ৳${grandTotal.toFixed(2)}`
            )}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/cart')}
            className="btn btn-outline w-full"
          >
            Back to Cart
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;