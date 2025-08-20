import { z } from 'zod'

// 用户注册验证
export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
  nickname: z.string().min(1).max(20).optional(),
})

// 用户登录验证
export const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
})

// 创建聊天室验证
export const createRoomSchema = z.object({
  roomName: z.string().min(1).max(50),
})

// 发送消息验证
export const sendMessageSchema = z.object({
  content: z.string().min(1).max(1000),
})

// 类型导出
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
