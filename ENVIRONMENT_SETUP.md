# Environment Setup Guide

## Required Environment Variables

### Backend (.env)
Create a `.env` file in `autopartzone-backend/` directory with:

```env
# Database
MONGO_URI=mongodb://localhost:27017/autopartzone

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Stripe Keys (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)
Create a `.env` file in the root directory with:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Getting Started

### 1. Start Backend
```bash
cd autopartzone-backend
npm start
```

### 2. Start Frontend
```bash
npm run dev
```

## URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Admin Dashboard: http://localhost:5173/admin/dashboard
- Reports: http://localhost:5173/admin/reports
- Order History: http://localhost:5173/orders

## Features Implemented

### ✅ Critical Features (Working)
- User authentication and authorization
- Product browsing and search with filters
- Shopping cart with backend persistence
- Complete checkout with Stripe payments
- Order management and tracking
- Admin dashboard with analytics
- Comprehensive reporting system
- Security hardening and audit logging

### ⚠️ Optional Features (Not Required for MVP)
- Notification system for low stock alerts
- Demand prediction system
- Enhanced recommendation algorithms
- Supplier management

## Testing Checklist

- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Add to cart functionality
- [ ] Checkout process with Stripe
- [ ] Order tracking
- [ ] Admin dashboard access
- [ ] Report generation (PDF/CSV)

## Production Deployment

### Frontend
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend
```bash
# Set production environment variables
# Use PM2 for process management: pm2 start server.js
# Connect to production MongoDB
# Set up proper SSL certificates
```

## Common Issues & Solutions

### 1. Stripe Integration Issues
- Ensure both STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set
- For development, use test keys from Stripe dashboard
- Check webhook endpoint configuration in Stripe dashboard

### 2. MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string format
- Ensure user has proper permissions

### 3. CORS Issues
- Verify FRONTEND_URL matches your frontend URL
- Check that CORS middleware is properly configured

### 4. Cart Sync Issues
- Users must be logged in for cart persistence
- Check local storage clearing on logout
- Verify token validity in browser storage

## API Documentation

### Authentication Endpoints
- POST `/auth/register` - User registration
- POST `/auth/login` - User login
- POST `/auth/forgot-password` - Password reset request
- GET `/auth/profile` - Get user profile

### Product Endpoints
- GET `/products` - Get all products with filters
- GET `/products/:id` - Get product by ID
- GET `/products/categories` - Get all categories
- GET `/products/brands` - Get all brands
- GET `/products/featured` - Get featured products

### Cart Endpoints
- GET `/cart` - Get user cart
- POST `/cart/add` - Add item to cart
- PUT `/cart/update` - Update cart item
- DELETE `/cart/remove` - Remove item from cart
- DELETE `/cart/clear` - Clear cart

### Order Endpoints
- GET `/orders/user` - Get user orders
- GET `/orders/:id` - Get order details
- POST `/orders/place` - Place new order
- PATCH `/orders/:id/cancel` - Cancel order

## Support

For issues:
1. Check browser console for JavaScript errors
2. Check backend console logs
3. Verify all environment variables are set
4. Test with sample data in MongoDB