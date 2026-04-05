const express = require('express');
const router = express.Router();
const binanceService = require('../services/binanceService');

router.get('/all', async (req, res) => {
  try {
    const markets = await binanceService.getAllMarkets();
    res.json({ success: true, data: markets, total: markets.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const popular = await binanceService.getPopularCoins();
    res.json({ success: true, data: popular });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/gainers', async (req, res) => {
  try {
    const gainers = await binanceService.getTopGainers();
    res.json({ success: true, data: gainers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/volume', async (req, res) => {
  try {
    const topVolume = await binanceService.getTopVolume();
    res.json({ success: true, data: topVolume });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/new', async (req, res) => {
  try {
    const newListings = await binanceService.getNewListings();
    res.json({ success: true, data: newListings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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
