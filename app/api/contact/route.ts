// app/api/contact/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // Debug seguro de variables de entorno
    console.log("🟢 EMAIL_USER:", process.env.EMAIL_USER);
    console.log("🟢 EMAIL_PASS length:", process.env.EMAIL_PASS?.length || 0);
    console.log("🟢 EMAIL_FROM:", process.env.EMAIL_FROM);
    console.log("🟢 EMAIL_TO:", process.env.EMAIL_TO);
    console.log("🟢 EMAIL_CC:", process.env.EMAIL_CC);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { success: false, error: "Email credentials not configured." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      cc: process.env.EMAIL_CC || undefined,
      replyTo: email,
      subject: `[Website Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error sending email:", error);
    let message = "Internal server error";
    if (error.code === "EAUTH") {
      message = "Authentication failed. Check Gmail App Password.";
    }
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}