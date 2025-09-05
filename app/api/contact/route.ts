
import { NextRequest, NextResponse } from 'next/server'
import * as nodemailer from 'nodemailer'

export const dynamic = "force-dynamic"

// Configurar el transporter de nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Please enter a valid email address'
      }, { status: 400 })
    }

    // Log the contact submission for debugging
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    })

    // Preparar el contenido del correo
    const subjectLine = `Nuevo mensaje de contacto: ${subject}`
    const emailContent = `
      <h2>Nuevo mensaje de contacto - FaeLight Crafts</h2>
      <hr>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <hr>
      <p style="color: #666; font-size: 12px;">
        Este mensaje fue enviado desde el formulario de contacto de FaeLight Crafts el ${new Date().toLocaleString('es-ES', { timeZone: 'America/Vancouver' })}
      </p>
    `

    try {
      // Crear el transporter
      const transporter = createTransporter()

      // Configurar las opciones del correo
      const mailOptions = {
        from: {
          name: 'FaeLight Crafts - Contacto',
          address: process.env.EMAIL_FROM || 'creations.faelight@gmail.com'
        },
        to: process.env.EMAIL_TO || 'creations.faelight@gmail.com',
        cc: process.env.EMAIL_CC || 'franklin.tejadag@gmail.com',
        replyTo: email,
        subject: subjectLine,
        html: emailContent,
        text: `
Nuevo mensaje de contacto - FaeLight Crafts

Nombre: ${name}
Email: ${email}
Asunto: ${subject}

Mensaje:
${message}

---
Este mensaje fue enviado desde el formulario de contacto de FaeLight Crafts el ${new Date().toLocaleString('es-ES', { timeZone: 'America/Vancouver' })}
        `.trim()
      }

      // Enviar el correo
      const result = await transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', result.messageId)

    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Si falla el envío de correo, aún así retornamos éxito al usuario
      // pero registramos el error internamente
      console.error('Failed to send email, but form submission logged')
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We\'ll get back to you within 24 hours!'
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send message. Please try again later.'
    }, { status: 500 })
  }
}
