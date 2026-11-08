const express = require('express');
const cors = require('cors');
require('dotenv').config();

const database = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client'));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ComputingMaster API is running' });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const { data, error } = await database.from('questions').select('*');
        if (error) throw error;
        res.json({
            status: 'success',
            message: 'Read data successfully from Database.',
            count: data.length,
            sample: data[0]
        });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Error: Cannot read data.', 
            details: error.message 
        });
    }
});

app.get('/api/questions', async (req, res) => {
    try {
        const { topic } = req.query;
        let query = database.from('questions').select('*');

        if (topic) {
            query = query.eq('topic', topic);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json({
            status: 'success',
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch questions',
            details: error.message
        });
    }
});


// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});