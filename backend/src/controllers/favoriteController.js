const prisma = require('../models/prismaClient');

// GET /api/favorites — Lấy danh sách coin yêu thích của user đang đăng nhập
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, symbol: true, createdAt: true }
    });
    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/favorites/toggle — Toggle yêu thích
exports.toggleFavorite = async (req, res) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Symbol là bắt buộc.' });
    }

    const upperSymbol = symbol.toUpperCase();

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_symbol: { userId: req.user.id, symbol: upperSymbol }
      }
    });

    if (existing) {
      // Đã có → xóa
      await prisma.favorite.delete({
        where: { userId_symbol: { userId: req.user.id, symbol: upperSymbol } }
      });
      return res.json({
        success: true,
        isFavorited: false,
        symbol: upperSymbol,
        message: `Đã xóa ${upperSymbol} khỏi danh sách yêu thích.`
      });
    } else {
      // Chưa có → thêm
      const favorite = await prisma.favorite.create({
        data: { userId: req.user.id, symbol: upperSymbol }
      });
      return res.status(201).json({
        success: true,
        isFavorited: true,
        data: favorite,
        symbol: upperSymbol,
        message: `Đã thêm ${upperSymbol} vào danh sách yêu thích.`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/favorites/:symbol — Kiểm tra 1 coin cụ thể có đang yêu thích không
exports.checkFavorite = async (req, res) => {
  try {
    const { symbol } = req.params;
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_symbol: { userId: req.user.id, symbol: symbol.toUpperCase() }
      }
    });
    res.json({ success: true, isFavorited: !!favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/favorites/:symbol — Xóa cụ thể 1 coin khỏi yêu thích
exports.removeFavorite = async (req, res) => {
  try {
    const { symbol } = req.params;
    await prisma.favorite.delete({
      where: {
        userId_symbol: { userId: req.user.id, symbol: symbol.toUpperCase() }
      }
    });
    res.json({ success: true, message: 'Đã xóa khỏi danh sách yêu thích.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy coin trong danh sách yêu thích.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
