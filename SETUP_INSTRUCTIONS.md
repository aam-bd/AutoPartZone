# Environment Variables Setup

Create a `.env` file in the `autopartzone-backend` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/autopartzone

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Server Port
PORT=5000

# Admin Registration Key (for creating admin accounts)
ADMIN_REGISTRATION_KEY=admin-key-2024-dev

# Node Environment
NODE_ENV=development
```

## How to Register as Admin:

1. **Start the backend server:**
   ```bash
   cd autopartzone-backend
   npm start
   ```

2. **Register an admin account:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register-admin \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin User",
       "email": "admin@example.com",
       "password": "admin123",
       "adminKey": "admin-key-2024-dev"
     }'
   ```

3. **Login with admin credentials:**
   - Go to http://localhost:5173/login
   - Email: admin@example.com
   - Password: admin123
   - You'll be redirected to the admin dashboard

## How to Test Password Reset:

1. **Trigger password reset:**
   - Go to login page
   - Click "Forgot Password?"
   - Enter your email
   - Check browser console for the reset token (development mode)

2. **Reset password with token:**
   ```bash
   curl -X PATCH http://localhost:5000/api/auth/reset-password/YOUR_TOKEN_HERE \
     -H "Content-Type: application/json" \
     -d '{"newPassword": "newPassword123"}'
   ```

## How to Access New Features:

### User Profile Page:
- After login, click on your profile picture or name in the navbar
- Access: http://localhost:5173/profile
- Features: Edit personal info, manage address, view order history

### Admin Dashboard:
- After admin login, click "Dashboard" in the navbar
- Access: http://localhost:5173/admin
- Features: Sidebar navigation, quick actions, overview stats, user/product/order management

### Navigation:
- **For Users:** Profile button appears in navbar after login
- **For Admins:** Both Profile and Dashboard buttons appear in navbar

## Testing Instructions:

### Test Forgot Password Flow:
1. Go to login page
2. Click "Forgot Password?"
3. Enter any registered email
4. Check browser console for reset token (dev mode)
5. Use the token to reset password via API or frontend

### Test Admin Registration:
1. Use the API call above with the correct admin key
2. Login with admin credentials
3. Verify you're redirected to admin dashboard
4. Check that admin dashboard has sidebar navigation and quick actions

### Test User Profile:
1. Register/login as regular user
2. Navigate to profile page
3. Test editing personal information
4. Test updating address
5. View order history section
6. Test the edit/save functionality

All features should now work as expected!