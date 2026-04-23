const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Từ chối truy cập. Vui lòng đăng nhập.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });

    if (!user || user.role.name !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập chức năng này.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xác thực quyền Admin', error: error.message });
  }
};

module.exports = adminMiddleware;
