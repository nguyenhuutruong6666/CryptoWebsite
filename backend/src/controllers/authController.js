const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prismaClient');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lấy Role USER mặc định cho người dùng đăng ký mới
    let defaultRole = await prisma.role.findUnique({ where: { name: 'USER' } });
    if (!defaultRole) {
      defaultRole = await prisma.role.create({ data: { name: 'USER' }});
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: defaultRole.id,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, token },
      message: 'Đăng ký thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { role: true } 
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng này.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác.' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        tier: user.tier,
        verificationLevel: user.verificationLevel,
        token,
      },
      message: 'Đăng nhập thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin user
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        tier: true,
        verificationLevel: true,
        createdAt: true,
        role: { select: { name: true } }
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const formattedUser = {
      ...user,
      role: user.role?.name || 'USER'
    };

    res.json({ success: true, data: formattedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật thông tin user
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        tier: true,
        verificationLevel: true,
        role: { select: { name: true } }
      },
    });

    const formattedUser = {
      ...user,
      role: user.role?.name || 'USER'
    };

    res.json({ success: true, data: formattedUser, message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
