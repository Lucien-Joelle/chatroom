import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

// 扩展NextRequest类型以包含用户信息
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: number
    username: string
  }
}

// 认证中间件
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { message: '未提供认证令牌', code: 401 },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      const decoded = verifyToken(token)

      if (!decoded) {
        return NextResponse.json(
          { message: '无效的认证令牌', code: 401 },
          { status: 401 }
        )
      }

      // 将用户信息添加到请求对象
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = decoded

      return handler(authenticatedReq)
    } catch {
      return NextResponse.json(
        { message: '认证失败', code: 401 },
        { status: 401 }
      )
    }
  }
}
