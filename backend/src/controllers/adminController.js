const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Không trả về password cho client
    const sanitizedUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    res.json({ success: true, data: sanitizedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách người dùng', error: error.message });
  }
};

// Xóa người dùng bằng ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Không cho phép tự xóa tài khoản của chính mình
    if (userId === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Bạn không thể tự xóa tài khoản của chính mình.' });
    }

    // Xóa liên kết (Favorites) trước (hoặc Cascade Delete tùy vào Database Schema)
    // Prisma mặc định cascade nếu thiết lập, nếu không ta có thể xóa thủ công
    await prisma.favorite.deleteMany({
      where: { userId: userId }
    });

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ success: true, message: 'Xóa tài khoản thành công.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa người dùng', error: error.message });
  }
};
