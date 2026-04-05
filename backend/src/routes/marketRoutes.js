const express = require('express');
const router = express.Router();
const binanceService = require('../services/binanceService');

// GET /api/markets/all
router.get('/all', async (req, res) => {
  try {
    const markets = await binanceService.getAllMarkets();
    res.json({ success: true, data: markets, total: markets.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/markets/popular
router.get('/popular', async (req, res) => {
  try {
    const popular = await binanceService.getPopularCoins();
    res.json({ success: true, data: popular });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/markets/gainers
router.get('/gainers', async (req, res) => {
  try {
    const gainers = await binanceService.getTopGainers();
    res.json({ success: true, data: gainers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/markets/volume
router.get('/volume', async (req, res) => {
  try {
    const topVolume = await binanceService.getTopVolume();
    res.json({ success: true, data: topVolume });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/markets/new
router.get('/new', async (req, res) => {
  try {
    const newListings = await binanceService.getNewListings();
    res.json({ success: true, data: newListings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/markets/history/:symbol?timeframe=1h
router.get('/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;
    const historicalData = await binanceService.getHistoricalPrices(symbol, timeframe);
    res.json({ success: true, data: historicalData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
