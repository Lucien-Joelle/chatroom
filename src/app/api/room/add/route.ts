import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRoomSchema } from '@/lib/validation'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { ZodError } from 'zod'

async function handler(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    
    // 验证输入数据
    const validatedData = createRoomSchema.parse(body)
    
    // 确保用户已认证
    if (!req.user) {
      return NextResponse.json({
        message: '用户未认证',
        code: 401,
        data: null
      }, { status: 401 })
    }

    // 创建聊天室
    const room = await prisma.room.create({
      data: {
        roomName: validatedData.roomName,
        createdBy: req.user.userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            nickname: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: '创建聊天室成功',
      code: 0,
      data: {
        roomId: room.id,
        roomName: room.roomName,
        createdBy: room.creator.username,
      }
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        message: '输入数据验证失败',
        code: 400,
        data: null
      }, { status: 400 })
    }
    
    const errorMessage = error instanceof Error ? error.message : '创建聊天室失败'
    return NextResponse.json({
      message: errorMessage,
      code: 500,
      data: null
    }, { status: 500 })
  }
}

export const POST = withAuth(handler)
