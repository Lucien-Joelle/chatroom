import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'

async function handler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return NextResponse.json({
        message: '缺少房间ID参数',
        code: 400,
        data: null
      }, { status: 400 })
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

    // 获取聊天室的所有消息
    const messages = await prisma.message.findMany({
      where: { roomId: parseInt(roomId) },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            nickname: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // 格式化返回数据
    const formattedMessages = messages.map(message => ({
      messageId: message.id,
      roomId: message.roomId,
      sender: message.sender.nickname || message.sender.username,
      content: message.content,
      time: message.createdAt.getTime(),
    }))

    return NextResponse.json({
      message: '获取消息列表成功',
      code: 0,
      data: formattedMessages
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '获取消息列表失败'
    return NextResponse.json({
      message: errorMessage,
      code: 500,
      data: null
    }, { status: 500 })
  }
}

export const GET = withAuth(handler)
