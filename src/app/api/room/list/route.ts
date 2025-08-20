import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'

async function handler(req: AuthenticatedRequest) {
  try {
    // 获取所有聊天室，包含最后一条消息
    const rooms = await prisma.room.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            nickname: true,
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                nickname: true,
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // 格式化返回数据
    const formattedRooms = rooms.map(room => ({
      roomId: room.id,
      roomName: room.roomName,
      createdBy: room.creator.username,
      lastMessage: room.messages[0] ? {
        messageId: room.messages[0].id,
        roomId: room.messages[0].roomId,
        sender: room.messages[0].sender.nickname || room.messages[0].sender.username,
        content: room.messages[0].content,
        time: room.messages[0].createdAt.getTime(),
      } : null
    }))

    return NextResponse.json({
      message: '获取聊天室列表成功',
      code: 0,
      data: formattedRooms
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '获取聊天室列表失败'
    return NextResponse.json({
      message: errorMessage,
      code: 500,
      data: null
    }, { status: 500 })
  }
}

export const GET = withAuth(handler)
