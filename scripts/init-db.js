const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  // 创建示例用户
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const user1 = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nickname: '管理员',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'user1' },
    update: {},
    create: {
      username: 'user1',
      password: hashedPassword,
      nickname: '用户1',
    },
  });

  // 创建示例聊天室
  const room1 = await prisma.room.upsert({
    where: { id: 1 },
    update: {},
    create: {
      roomName: '欢迎聊天室',
      createdBy: user1.id,
    },
  });

  const room2 = await prisma.room.upsert({
    where: { id: 2 },
    update: {},
    create: {
      roomName: '技术讨论',
      createdBy: user2.id,
    },
  });

  // 创建示例消息
  await prisma.message.upsert({
    where: { id: 1 },
    update: {},
    create: {
      roomId: room1.id,
      senderId: user1.id,
      content: '欢迎来到聊天室！',
    },
  });

  await prisma.message.upsert({
    where: { id: 2 },
    update: {},
    create: {
      roomId: room1.id,
      senderId: user2.id,
      content: '大家好！',
    },
  });

  await prisma.message.upsert({
    where: { id: 3 },
    update: {},
    create: {
      roomId: room2.id,
      senderId: user1.id,
      content: '有什么技术问题可以在这里讨论',
    },
  });

  console.log('数据库初始化完成！');
  console.log('示例用户:');
  console.log('- 用户名: admin, 密码: admin123');
  console.log('- 用户名: user1, 密码: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
