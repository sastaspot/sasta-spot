import { NextResponse } from "next/server"
import { SignJWT } from "jose"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production",
)

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Get client IP for logging
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Verify credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      // Log failed attempt
      console.log(`Failed admin login attempt from IP: ${clientIP} at ${new Date().toISOString()}`)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token with longer expiration
    const token = await new SignJWT({
      username,
      role: "admin",
      loginTime: Date.now(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // 7 days
      .sign(JWT_SECRET)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        username,
        role: "admin",
      },
    })

    // Set secure cookie with proper settings
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from "strict" to "lax" for better compatibility
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/", // Changed from "/admin" to "/" for broader access
    })

    // Log successful login
    console.log(`Successful admin login from IP: ${clientIP} at ${new Date().toISOString()}`)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
