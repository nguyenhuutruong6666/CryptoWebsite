const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Áp dụng middleware: Phải đăng nhập, và phải là ADMIN
router.use(authMiddleware, adminMiddleware);

router.get('/', adminController.getAllUsers);
router.delete('/:id', adminController.deleteUser);

module.exports = router;
