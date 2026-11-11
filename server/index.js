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

// Get dashboard statistics
app.get('/api/dashboard/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const { data: attempts, error: attemptsError } = await database
            .from('attempts')
            .select('aid, score, total_questions, created_at')
            .eq('uid', uid)
            .order('created_at', { ascending: true });

        if (attemptsError) throw attemptsError;

        const { data: details, error: detailsError } = await database
            .from('attempt_details')
            .select(`
                is_correct,
                attempts!inner(uid),
                questions(topic)
            `)
            .eq('attempts.uid', uid);

        if (detailsError) throw detailsError;

        const topicStats = {};
        details.forEach(detail => {
            const topic = detail.questions.topic;
            if (!topicStats[topic]) {
                topicStats[topic] = { correct: 0, total: 0 };
            }
            topicStats[topic].total += 1;
            if (detail.is_correct) {
                topicStats[topic].correct += 1;
            }
        });

        const proficiency = Object.keys(topicStats).map(topic => {
            const stats = topicStats[topic];
            return {
                topic: topic,
                percentage: Math.round((stats.correct / stats.total) * 100)
            };
        });

        res.json({
            status: 'success',
            data: {
                attempts: attempts,
                proficiency: proficiency
            }
        });

    } catch (error) {
        console.error('Dashboard API error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});


// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});