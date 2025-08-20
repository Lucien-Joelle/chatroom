# 聊天室项目

这是一个基于 Next.js + TypeScript + Prisma 的全栈聊天室应用，支持用户注册登录、创建聊天室、实时消息等功能。

## 功能特性

- 🔐 用户认证：注册、登录、JWT令牌认证
- 💬 聊天室管理：创建、删除聊天室
- 📨 实时消息：发送和接收消息
- 🎨 现代化UI：使用Tailwind CSS构建
- 🚀 全栈部署：支持Docker容器化部署

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript, Tailwind CSS, SWR
- **后端**: Next.js API Routes, Prisma ORM, PostgreSQL
- **认证**: JWT, bcryptjs
- **验证**: Zod
- **部署**: Docker, Docker Compose

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (可选)

### 本地开发

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd xlab
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   创建 `.env` 文件：
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/chatroom_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **设置数据库**
   ```bash
   # 生成Prisma客户端
   pnpm db:generate
   
   # 推送数据库架构
   pnpm db:push
   
   # 初始化示例数据
   pnpm db:seed
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

6. **访问应用**
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### Docker部署

1. **构建并启动服务**
   ```bash
   pnpm docker:run
   ```

2. **查看日志**
   ```bash
   pnpm docker:logs
   ```

3. **停止服务**
   ```bash
   pnpm docker:stop
   ```

## API接口

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 聊天室接口

- `GET /api/room/list` - 获取聊天室列表
- `POST /api/room/add` - 创建聊天室
- `DELETE /api/room/delete?roomId={id}` - 删除聊天室

### 消息接口

- `GET /api/room/message/list?roomId={id}` - 获取聊天室消息
- `POST /api/room/message/send?roomId={id}` - 发送消息

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── auth/          # 认证相关API
│   │   └── room/          # 聊天室相关API
│   ├── chat/              # 聊天页面
│   └── page.tsx           # 首页
├── components/            # React组件
├── lib/                   # 工具库
│   ├── auth.ts           # 认证工具
│   ├── prisma.ts         # Prisma客户端
│   ├── validation.ts     # Zod验证模式
│   └── middleware.ts     # 认证中间件
├── services/             # API服务
└── types/                # TypeScript类型定义
```

## 示例用户

初始化后可以使用以下账户登录：

- 用户名: `admin`, 密码: `admin123`
- 用户名: `user1`, 密码: `admin123`

## 开发指南

### 数据库操作

```bash
# 生成Prisma客户端
pnpm db:generate

# 推送数据库架构变更
pnpm db:push

# 创建迁移文件
pnpm db:migrate

# 打开Prisma Studio
pnpm db:studio

# 初始化示例数据
pnpm db:seed
```

### 代码规范

项目使用ESLint进行代码检查：

```bash
pnpm lint
```

## 部署

### 生产环境部署

1. **使用Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **手动部署**
   ```bash
   pnpm build
   pnpm start
   ```

### 环境变量配置

生产环境需要配置以下环境变量：

- `DATABASE_URL`: PostgreSQL数据库连接字符串
- `JWT_SECRET`: JWT签名密钥
- `NEXTAUTH_SECRET`: NextAuth.js密钥
- `NEXTAUTH_URL`: 应用URL

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
