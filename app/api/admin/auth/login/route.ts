import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SignJWT } from "jose"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this")

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Rate limiting check (simple in-memory for demo)
    const clientIP = request.headers.get("x-forwarded-for") || "unknown"

    // For now, use simple string comparison (you can enhance with bcrypt later)
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      // Log failed attempt
      console.log(`Failed admin login attempt from IP: ${clientIP} at ${new Date().toISOString()}`)

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = await new SignJWT({
      username,
      role: "admin",
      loginTime: Date.now(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET)

    // Set secure cookie
    const cookieStore = cookies()
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/admin",
    })

    // Log successful login
    console.log(`Successful admin login from IP: ${clientIP} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
