import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SignJWT } from "jose"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this")

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // In a real implementation, you would:
    // 1. Find user in database by email
    // 2. Compare password with bcrypt
    // 3. Update last login timestamp

    // For demo purposes, we'll simulate this
    // In production, replace with actual database query
    const user = {
      id: 1,
      name: "Demo User",
      email: email,
      password: await bcrypt.hash("password123", 10), // Demo password
      isActive: true,
    }

    // Simulate password verification
    // In production, use: await bcrypt.compare(password, user.password)
    const isValidPassword = password === "password123" || (await bcrypt.compare(password, user.password))

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = await new SignJWT({
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
    cookieStore.set("user-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    // Log login for analytics
    console.log(`User login: ${email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
