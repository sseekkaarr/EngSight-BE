require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const videoProgressRoutes = require('./routes/videoProgress'); // Import video progress routes

const app = express();

app.use(express.json());

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/videos', videoProgressRoutes); // Video progress routes

// Sync database
sequelize.sync()
    .then(() => console.log('Database synced.'))
    .catch((err) => console.error('Error syncing database:', err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
