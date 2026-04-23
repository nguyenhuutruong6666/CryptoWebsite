const binanceService = require('../services/binanceService');

let updateInterval = null;

function initializeWebSocket(io) {
  console.log('WebSocket server initialized');

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    sendInitialData(socket);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  startPriceUpdates(io);
}

async function sendInitialData(socket) {
  try {
    const markets = await binanceService.getAllMarkets();
    socket.emit('initialData', {
      markets,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error sending initial data:', error.message);
  }
}

function startPriceUpdates(io) {
  if (updateInterval) clearInterval(updateInterval);

  updateInterval = setInterval(async () => {
    try {
      const markets = await binanceService.getAllMarkets();
      io.emit('priceUpdate', {
        markets,
        timestamp: Date.now()
      });
      if (io.engine.clientsCount > 0) {
        console.log(`Price update → ${io.engine.clientsCount} client(s)`);
      }
    } catch (error) {
      console.error('Error sending price update:', error.message);
    }
  }, 2000);
}

function stopPriceUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
    console.log('Price updates stopped');
  }
}

module.exports = { initializeWebSocket, stopPriceUpdates };
