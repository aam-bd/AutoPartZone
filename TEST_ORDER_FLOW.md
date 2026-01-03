# Test Order Flow - Step by Step

## Step 1: Start Backend with Logging
```
npm start
```
Leave terminal open to see logs

## Step 2: Place an Order
1. Go to http://localhost:5173
2. Add a product to cart
3. Go to Checkout
4. Complete checkout (COD payment)
5. **Check backend console for logs:**
   - `🔐 Token decoded - user ID from token: [ID]`
   - `🔐 User found: {userId, userIdType, name}`
   - `=== PLACE ORDER CONTROLLER CALLED ===`
   - `req.user._id: [ID]`
   - `✅ Order saved successfully: {userId: [ID], _id: [ObjectId], orderNumber: [ORD-...]}`

**Record the userId from this log** - call it `PLACING_USER_ID`

## Step 3: Navigate to Order History
1. Go to http://localhost:5173/orders
2. **Check backend console for logs:**
   - `🔐 Token decoded - user ID from token: [ID]`
   - `🔐 User found: {userId, userIdType, name}`
   - `=== GET USER ORDERS CALLED ===`
   - `req.user full object: {...}`
   - `🔍 Querying orders with userId: {userId: [ID], userIdType: "..."}`
   - `✅ Orders found: [number]`

**Record the userId from this log** - call it `FETCHING_USER_ID`

## Step 4: Compare IDs
```
Are PLACING_USER_ID and FETCHING_USER_ID the same?
- If YES: Problem is in database query or data format
- If NO: Token is different between place and fetch (shouldn't happen)
```

## Step 5: Check Database (if needed)
If orders not found, add this to backend temporarily to debug:

In `/api/orders/user` endpoint, the logs will show:
- `📊 Total orders in DB: [count]`
- `📊 Sample userIds in DB: [{userId, userIdString}, ...]`

Compare these sample userIds with the FETCHING_USER_ID

## Expected Results:
✅ Order placed: userId saved correctly
✅ Order fetched: Same userId found in query
✅ Orders list: Should show 1+ orders in /orders page

## If Orders Still Not Found:
Provide the FULL backend logs from placing order through fetching, including:
- All 🔐 logs from authentication
- Both `=== PLACE ORDER ===` and `=== GET USER ORDERS ===` sections
- The sample userIds from database
