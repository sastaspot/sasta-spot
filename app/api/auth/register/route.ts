import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"

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

    // Check if user already exists (in real implementation)
    // const existingUser = await db.user.findUnique({ where: { email } })
    // if (existingUser) {
    //   return NextResponse.json({ error: "User already exists" }, { status: 400 })
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

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
    await sendVerificationEmail(email, name, verificationToken)

    // Log registration for analytics
    console.log(`New user registered: ${email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email to verify your account.",
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

async function sendVerificationEmail(email: string, name: string, token: string) {
  try {
    // In production, use a real email service like Resend, Nodemailer, etc.
    const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/verify?token=${token}`

    // For demo purposes, we'll just log the email
    console.log(`
📧 VERIFICATION EMAIL (Demo Mode)
To: ${email}
Subject: Verify your Sasta Spot account

Hi ${name},

Welcome to Sasta Spot! Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create this account, please ignore this email.

Best regards,
Sasta Spot Team
    `)

    // In production, replace with actual email sending:
    /*
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sasta Spot <noreply@sastaspot.com>',
        to: [email],
        subject: 'Verify your Sasta Spot account',
        html: `
          <h2>Welcome to Sasta Spot!</h2>
          <p>Hi ${name},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
          <p>Or copy and paste this link: ${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>Sasta Spot Team</p>
        `
      })
    })
    */

    return true
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}
