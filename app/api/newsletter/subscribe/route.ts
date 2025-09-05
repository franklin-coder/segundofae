
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Valid email is required'
      }, { status: 400 })
    }

    // Here you would typically save to database or send to email service
    // For now, we'll just simulate success
    console.log('Newsletter subscription for:', email)
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to subscribe to newsletter'
    }, { status: 500 })
  }
}
