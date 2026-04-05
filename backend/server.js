require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const marketRoutes = require('./src/routes/marketRoutes');
const { initializeWebSocket } = require('./src/websocket/websocket');

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize WebSocket
initializeWebSocket(io);

// REST API routes
app.use('/api/markets', marketRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CryptoWebsite Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 CryptoWebsite API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      markets: {
        all: '/api/markets/all',
        popular: '/api/markets/popular',
        gainers: '/api/markets/gainers',
        volume: '/api/markets/volume',
        new: '/api/markets/new',
        history: '/api/markets/history/:symbol'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('🚀 CryptoWebsite Backend Started');
  console.log('═══════════════════════════════════════');
  console.log(`📍 Server:    http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`🌐 Frontend:  ${process.env.FRONTEND_URL}`);
  console.log('═══════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
