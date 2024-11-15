require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const videoProgressRoutes = require('./routes/videoProgress'); // Import video progress routes
const testRoutes = require('./routes/test');

const app = express();

// Middleware
app.use(cors({ origin: 'https://eng-sight-web.vercel.app' })); // Restrict CORS to your frontend domain
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/videos', videoProgressRoutes); // Video progress routes
app.use('/api', testRoutes); // Other routes

// Sync database
sequelize
  .sync()
  .then(() => console.log('Database synced.'))
  .catch((err) => console.error('Error syncing database:', err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
