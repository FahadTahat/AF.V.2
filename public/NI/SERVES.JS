const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from frontend
app.use(express.json());

app.post('/api/deepseek', async (req, res) => {
    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_DEEPSEEK_API_KEY' // استبدلي بالمفتاح الجديد
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: `DeepSeek API error: ${errorText}` });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));