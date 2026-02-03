const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.set('debug', process.env.NODE_ENV !== 'production');

const options = {
    serverSelectionTimeoutMS: 10000, // wait up to 10s to find server
    socketTimeoutMS: 45000,          // socket timeout 45s
    maxPoolSize: 50,                 // max concurrent connections
    retryWrites: true,               // retry writes if fail
};

mongoose.connect(process.env.MONGO_URI, options)
    .then(() => console.log('✅ Database Connected Successfully'))
    .catch((err) => {
        console.error('❌ Database Connection Error:', err);
        process.exit(1);
    });

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection lost. Retrying...');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

module.exports = mongoose;