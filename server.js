const express = require('express');
const dotenv =require('dotenv');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');

//load env variables 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(express.json());

// Montage des routeurs
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);

/// Asynchronously connect to MongoDB Atlas before listening
(async () => {
    try {
        // 1. Establish remote connection to Atlas
        await connectDB(process.env.MONGODB_URI);

        // 2. Start HTTP server listener
        app.listen(PORT, () => {
            console.log(`MERN server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Critical server startup error:', err.message);
        process.exit(1);
    }
})();