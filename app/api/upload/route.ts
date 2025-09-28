import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = "force-dynamic"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let requestId = Math.random().toString(36).substring(7)
  
  try {
    console.log(`[UPLOAD:${requestId}] 🚀 Starting file upload request`)

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      console.log(`[UPLOAD:${requestId}] ❌ No files provided`)
      return NextResponse.json({ 
        success: false, 
        error: 'No files provided' 
      }, { status: 400 })
    }

    console.log(`[UPLOAD:${requestId}] 📁 Processing ${files.length} files`)

    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${index}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      console.log(`[UPLOAD:${requestId}] ⬆️ Uploading file ${index + 1}: ${file.name} -> ${filePath}`)

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error(`[UPLOAD:${requestId}] ❌ Upload error for file ${index + 1}:`, error)
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      console.log(`[UPLOAD:${requestId}] ✅ File ${index + 1} uploaded: ${publicUrl}`)
      return publicUrl
    })

    const urls = await Promise.all(uploadPromises)
    const totalTime = Date.now() - startTime
    
    console.log(`[UPLOAD:${requestId}] 🏁 Upload completed in ${totalTime}ms - ${urls.length} files`)
    
    return NextResponse.json({ 
      success: true, 
      urls,
      total: urls.length,
      requestId,
      totalTime: `${totalTime}ms`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`[UPLOAD:${requestId}] ❌ Error after ${totalTime}ms:`, error)
    
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? (error instanceof Error ? error.message : 'Unknown error')
      : 'Upload failed'
    
    return NextResponse.json({ 
      success: false,
      error: 'Upload failed',
      details: errorMessage,
      requestId,
      totalTime: `${totalTime}ms`,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}