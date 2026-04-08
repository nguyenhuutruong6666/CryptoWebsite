const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  // Dọn dẹp Database cũ (Chú ý thứ tự quan hệ logic)
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Khởi tạo bảng danh mục Role
  const roleAdmin = await prisma.role.create({ data: { name: 'ADMIN' } });
  const roleUser = await prisma.role.create({ data: { name: 'USER' } });

  // Khởi tạo Admin có móc roleId
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tcrypto.com',
      name: 'Admin Tổng TCrypto',
      password: hashedPassword,
      phone: '0987111222',
      tier: 'VIP 5',
      verificationLevel: 'Đã xác minh KYC 2',
      roleId: roleAdmin.id
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      email: 'user@tcrypto.com',
      name: 'Khách hàng A',
      password: hashedPassword,
      phone: '0988000111',
      tier: 'Thành viên',
      roleId: roleUser.id
    },
  });

  console.log('✅ Seed data success. Đã tạo Bảng Role riêng và cấu hình tài khoản Admin/User.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
