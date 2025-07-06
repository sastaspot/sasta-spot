import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this")

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    // In real implementation, verify token from database:
    // const user = await db.user.findFirst({
    //   where: {
    //     verificationToken: token,
    //     tokenExpiry: { gt: new Date() }
    //   }
    // })

    // For demo purposes, simulate token verification
    // In production, replace with actual database query
    const isValidToken = token.length === 64 // Simulate valid token format

    if (!isValidToken) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Simulate user data (replace with actual database query)
    const user = {
      id: 1,
      name: "Demo User",
      email: "user@example.com",
      isVerified: false,
    }

    // Update user as verified in database:
    // await db.user.update({
    //   where: { id: user.id },
    //   data: {
    //     isVerified: true,
    //     verificationToken: null,
    //     tokenExpiry: null,
    //     emailVerifiedAt: new Date()
    //   }
    // })

    // Create JWT token for auto-login
    const jwtToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: "user",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(JWT_SECRET)

    // Set secure cookie
    const cookieStore = cookies()
    cookieStore.set("user-token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    // Log verification for analytics
    console.log(`Email verified: ${user.email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      email: user.email,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
