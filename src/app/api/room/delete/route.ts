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
      where: { id: parseInt(roomId) },
      include: { creator: true }
    })

    if (!room) {
      return NextResponse.json({
        message: '聊天室不存在',
        code: 404,
        data: null
      }, { status: 404 })
    }

    // 检查用户是否有权限删除（只有创建者可以删除）
    if (room.createdBy !== req.user.userId) {
      return NextResponse.json({
        message: '没有权限删除此聊天室',
        code: 403,
        data: null
      }, { status: 403 })
    }

    // 删除聊天室（消息会通过级联删除自动删除）
    await prisma.room.delete({
      where: { id: parseInt(roomId) }
    })

    return NextResponse.json({
      message: '删除聊天室成功',
      code: 0,
      data: null
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '删除聊天室失败'
    return NextResponse.json({
      message: errorMessage,
      code: 500,
      data: null
    }, { status: 500 })
  }
}

export const DELETE = withAuth(handler)
