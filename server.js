require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const videoProgressRoutes = require('./routes/videoProgress');
const testRoutes = require('./routes/test');

const app = express();

// Middleware untuk menangani CORS secara fleksibel
const corsOptions = {
  origin: [
      'https://eng-sight-web.vercel.app', 
      'http://localhost:3000'
  ], // Daftar semua domain yang diizinkan
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Untuk mendukung cookie/sesi
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Request received from origin: ${req.headers.origin}`);
  next();
});


// Middleware lainnya
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoProgressRoutes);
app.use('/api', testRoutes);

// Sync database
sequelize
  .sync()
  .then(() => console.log('Database synced.'))
  .catch((err) => console.error('Error syncing database:', err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
