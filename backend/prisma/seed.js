const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@tcrypto.com' },
    update: {},
    create: {
      email: 'admin@tcrypto.com',
      name: 'Nguyễn Hữu Trường',
      password: hashedPassword,
      phone: '0987654321',
      tier: 'VIP 1',
      verificationLevel: 'Đã xác minh Plus'
    },
  });

  console.log('✅ Seed data success:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
