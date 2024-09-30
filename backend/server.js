const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY; // Replace with your OpenAI API Key

// Function to fetch data from OpenAI API
const fetchData = async (url, data) => {
    const response = await axios.post(url, data, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

// Endpoint to handle budget estimation
app.post('/get-budget-estimate', async (req, res) => {
    const { monthlyIncome, city } = req.body; // Get income and city from frontend input

    if (!monthlyIncome || !city) {
        return res.status(400).json({ error: 'Income and city are required.' });
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Estimate a budget breakdown for someone living in ${city} with a monthly income of ${monthlyIncome}. Use the following categories: Housing, Groceries, Transportation, Body care, Entertainment, Shopping, Investments`
            }
        ],
        max_tokens: 200, // Adjust as necessary
        temperature: 0.6, // Adjust as necessary
        n: 1,
        stop: null
    };

    try {
        const result = await fetchData(url, data);
        res.json(result); // Send the response data as JSON
    } catch (error) {
        console.error('Error fetching data from OpenAI API:', error.message);
        if (error.response && error.response.status === 429) {
            console.log('Too Many Requests - Retry strategy initiated');
            res.status(429).json({ error: 'Too Many Requests' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
