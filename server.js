const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

console.log('MONGO_URI:', process.env.MONGO_URI); // Add this line to confirm the value

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// RapidAPI details
const RAPIDAPI_KEY = 'f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89'; // Replace with your key
const RAPIDAPI_HOST = 'nfl-api-data.p.rapidapi.com';

const MATCHUPS_URL = 'https://nfl-api-data.p.rapidapi.com/nfl-weeks-events';
const EVENT_URL = 'https://nfl-api-data.p.rapidapi.com/nfl-single-events';

// Auth routes (assuming you have auth.js set up)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// GET Weekly Matchups
app.get('/api/matchups', async (req, res) => {
  try {
    // Use the current year dynamically
    const currentYear = new Date().getFullYear();
    const queryYear = req.query.year || currentYear;
    const queryWeek = req.query.week;

    if (!queryWeek) {
      return res.status(400).json({ message: 'Week parameter is required.' });
    }

    const queryParams = new URLSearchParams({
      year: queryYear,
      week: queryWeek,
      type: req.query.type || '2', // Default to type 2 if not provided
    });

    const url = `${MATCHUPS_URL}?${queryParams.toString()}`;
    console.log('Fetching matchups from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Failed to fetch matchups, status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Matchups data received:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching matchups:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET Single Event Details
app.get('/api/event-details', async (req, res) => {
  const eventId = req.query.id;
  if (!eventId) {
    return res.status(400).json({ message: 'Missing event id' });
  }

  try {
    const url = `${EVENT_URL}?id=${eventId}`;
    console.log('Fetching event details from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });

    console.log('Event details response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Failed to fetch event details for ID: ${eventId}, status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Event ${eventId} details:`, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching event details:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET Whitelist Data
app.get('/api/whitelist', async (req, res) => {
  const WHITELIST_URL = 'https://nfl-api-data.p.rapidapi.com/nfl-whitelist';

  try {
    const response = await fetch(WHITELIST_URL, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Failed to fetch whitelist, status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Whitelist data received:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching whitelist data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve static files from the 'frontend' folder
app.use(express.static('frontend'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
