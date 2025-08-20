import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import { RegisterInput, LoginInput } from './validation'

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// 生成JWT令牌
export function generateToken(userId: number, username: string): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret'
  return jwt.sign({ userId, username }, secret, { expiresIn: '7d' })
}

// 验证JWT令牌
export function verifyToken(token: string): { userId: number; username: string } | null {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret'
    const decoded = jwt.verify(token, secret) as { userId: number; username: string }
    return decoded
  } catch {
    return null
  }
}

// 用户注册
export async function registerUser(data: RegisterInput) {
  const { username, password, nickname } = data

  // 检查用户是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { username }
  })

  if (existingUser) {
    throw new Error('用户名已存在')
  }

  // 加密密码
  const hashedPassword = await hashPassword(password)

  // 创建用户
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      nickname: nickname || username,
    },
    select: {
      id: true,
      username: true,
      nickname: true,
      createdAt: true,
    }
  })

  return user
}

// 用户登录
export async function loginUser(data: LoginInput) {
  const { username, password } = data

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user) {
    throw new Error('用户名或密码错误')
  }

  // 验证密码
  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    throw new Error('用户名或密码错误')
  }

  // 生成令牌
  const token = generateToken(user.id, user.username)

  return {
    user: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
    },
    token
  }
}
