import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { loginSchema } from '@/lib/validation'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证输入数据
    const validatedData = loginSchema.parse(body)
    
    // 登录用户
    const result = await loginUser(validatedData)
    
    return NextResponse.json({
      message: '登录成功',
      code: 0,
      data: result
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        message: '输入数据验证失败',
        code: 400,
        data: null
      }, { status: 400 })
    }
    
    const errorMessage = error instanceof Error ? error.message : '登录失败'
    return NextResponse.json({
      message: errorMessage,
      code: 500,
      data: null
    }, { status: 500 })
  }
}
