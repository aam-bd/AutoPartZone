import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    dropAndRecreateIndexes();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

async function dropAndRecreateIndexes() {
  try {
    const collections = await mongoose.connection.db.collections();
    
    for (const collection of collections) {
      console.log(`Processing collection: ${collection.collectionName}`);
      
      // Get all indexes
      const indexes = await collection.indexes();
      console.log(`Current indexes:`, indexes.map(idx => idx.name));
      
      // Drop all indexes
      for (const index of indexes) {
        if (index.name !== '_id_') { // Don't drop _id_ index
          await collection.dropIndex(index.name);
          console.log(`Dropped index: ${index.name}`);
        }
      }
      
      // Recreate only essential indexes
      if (collection.collectionName === 'orders') {
        await collection.createIndex({ userId: 1, createdAt: -1 });
        await collection.createIndex({ status: 1, createdAt: -1 });
        console.log('Created indexes for orders collection');
      } else if (collection.collectionName === 'products') {
        await collection.createIndex({ isAvailable: 1 });
        await collection.createIndex({ category: 1 });
        await collection.createIndex({ brand: 1 });
        await collection.createIndex({ name: 'text', brand: 'text', category: 'text', description: 'text' });
        console.log('Created indexes for products collection');
      } else if (collection.collectionName === 'users') {
        await collection.createIndex({ email: 1 });
        console.log('Created indexes for users collection');
      } else if (collection.collectionName === 'carts') {
        await collection.createIndex({ userId: 1 });
        console.log('Created indexes for carts collection');
      }
    }
    
    console.log('Index recreation completed');
    process.exit(0);
    
  } catch (error) {
    console.error('Error recreating indexes:', error);
    process.exit(1);
  }
}