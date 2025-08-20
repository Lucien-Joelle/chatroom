import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMessageSchema } from '@/lib/validation'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { ZodError } from 'zod'

async function handler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('roomId')
    const body = await req.json()

    if (!roomId) {
      return NextResponse.json({
        message: '缺少房间ID参数',
        code: 400,
        data: null
      }, { status: 400 })
    }

    // 验证输入数据
    const validatedData = sendMessageSchema.parse(body)

    // 确保用户已认证
    if (!req.user) {
      return NextResponse.json({
        message: '用户未认证',
        code: 401,
        data: null
      }, { status: 401 })
    }

    // 检查聊天室是否存在
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) }
    })

    if (!room) {
      return NextResponse.json({
        message: '聊天室不存在',
        code: 404,
        data: null
      }, { status: 404 })
    }

    // 创建消息
    const message = await prisma.message.create({
      data: {
        roomId: parseInt(roomId),
        senderId: req.user.userId,
        content: validatedData.content,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            nickname: true,
          }
        }
      }
    })

    // 更新聊天室的更新时间
    await prisma.room.update({
      where: { id: parseInt(roomId) },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      message: '发送消息成功',
      code: 0,
      data: {
        messageId: message.id,
        roomId: message.roomId,
        sender: message.sender.nickname || message.sender.username,
        content: message.content,
        time: message.createdAt.getTime(),
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
    
    const errorMessage = error instanceof Error ? error.message : '发送消息失败'
    return NextResponse.json({
      message: errorMessage,
      code: 500,
      data: null
    }, { status: 500 })
  }
}

export const POST = withAuth(handler)
