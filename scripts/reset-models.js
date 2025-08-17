const mongoose = require('mongoose');

async function resetModels() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mentorcodeai:RTDmJJixL1EIlu0l@cluster0.88ntzbp.mongodb.net/coment-ai-project');

        console.log('Connected to MongoDB');

        // Delete existing models to force recreation
        if (mongoose.models.User) {
            delete mongoose.models.User;
            console.log('Deleted User model');
        }

        if (mongoose.models.Company) {
            delete mongoose.models.Company;
            console.log('Deleted Company model');
        }

        // Clear model cache
        mongoose.deleteModel('User');
        mongoose.deleteModel('Company');

        console.log('Model cache cleared');

        // Disconnect
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error resetting models:', error);
    }
}

resetModels();