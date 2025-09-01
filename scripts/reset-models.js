require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const resetModels = async() => {
    if (!MONGODB_URI) {
        console.error('FATAL: MONGODB_URI is not defined in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected for resetting models...');

        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {
            console.log(`Dropping collection: ${collection.collectionName}`);
            await collection.drop();
        }

        console.log('\n✅ All collections dropped successfully!');
    } catch (error) {
        console.error('❌ Error resetting models:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

resetModels();