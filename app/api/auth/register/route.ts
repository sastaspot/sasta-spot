import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check if user already exists (in real implementation with database)
    // For now, we'll simulate this check

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // In real implementation, save to database:
    // const user = await db.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //     verificationToken,
    //     tokenExpiry,
    //     isVerified: false
    //   }
    // })

    // For demo, simulate user creation
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      verificationToken,
      tokenExpiry,
      isVerified: false,
      createdAt: new Date().toISOString(),
    }

    // Send verification email
    if (process.env.RESEND_API_KEY) {
      await sendVerificationEmailWithResend(email, name, verificationToken)
    } else {
      // Fallback to console logging for demo
      console.log(`
📧 VERIFICATION EMAIL (Demo Mode - Set RESEND_API_KEY to send real emails)
To: ${email}
Subject: Verify your Sasta Spot account

Hi ${name},

Welcome to Sasta Spot! Please verify your email address by clicking the link below:

${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/verify?token=${verificationToken}

This link will expire in 24 hours.

Best regards,
Sasta Spot Team
      `)
    }

    // Log registration for analytics
    console.log(`New user registered: ${email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: process.env.RESEND_API_KEY
        ? "Account created successfully. Please check your email to verify your account."
        : "Account created successfully. Check console for verification link (demo mode).",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isVerified: false,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

async function sendVerificationEmailWithResend(email: string, name: string, token: string) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/verify?token=${token}`

    await resend.emails.send({
      from: "Sasta Spot <noreply@sastaspot.com>",
      to: [email],
      subject: "Verify your Sasta Spot account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your Sasta Spot account</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #000; margin-bottom: 30px;">Welcome to Sasta Spot!</h1>
            <p style="font-size: 16px; margin-bottom: 30px;">Hi ${name},</p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              Thank you for signing up! Please verify your email address by clicking the button below:
            </p>
            <a href="${verificationUrl}" 
               style="background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 20px 0;">
              Verify Email Address
            </a>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Or copy and paste this link in your browser:<br>
              <a href="${verificationUrl}" style="color: #000;">${verificationUrl}</a>
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              This link will expire in 24 hours.
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you didn't create this account, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #999;">
              Best regards,<br>
              Sasta Spot Team
            </p>
          </div>
        </body>
        </html>
      `,
    })

    return true
  } catch (error) {
    console.error("Resend email error:", error)
    throw error
  }
}
