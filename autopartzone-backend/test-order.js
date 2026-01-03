import Order from "./src/models/Order.js";

console.log('Testing Order model directly...');
console.log('Order:', Order);
console.log('Order.find:', typeof Order.find);

async function testOrder() {
  try {
    const orders = await Order.find({}).limit(1);
    console.log('Query successful, found orders:', orders.length);
  } catch (err) {
    console.error('Query failed:', err.message);
  }
}

testOrder().then(() => {
  console.log('Test completed');
  process.exit(0);
}).catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});