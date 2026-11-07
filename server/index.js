const express = require('express');
const cors = require('cors');
require('dotenv').config();

const database = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('client'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ComputingMaster API is running' });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const { data, error } = await database
            .from('questions')
            .select('*');

        if (error) {
            throw error;
        }

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

app.listen(PORT, () => {
    console.log(`Server is running on https://curly-fishstick-q76vxxg4xw77h6w7w-3000.app.github.dev/`);
});    console.log(`Test API: https://curly-fishstick-q76vxxg4xw77h6w7w-3000.app.github.dev/api/test-db`);
