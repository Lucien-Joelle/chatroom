import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'
import { registerSchema } from '@/lib/validation'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证输入数据
    const validatedData = registerSchema.parse(body)
    
    // 注册用户
    const user = await registerUser(validatedData)
    
    return NextResponse.json({
      message: '注册成功',
      code: 0,
      data: user
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        message: '输入数据验证失败',
        code: 400,
        data: null
      }, { status: 400 })
    }
    
    const errorMessage = error instanceof Error ? error.message : '注册失败'
    return NextResponse.json({
      message: errorMessage,
      code: 500,
      data: null
    }, { status: 500 })
  }
}
