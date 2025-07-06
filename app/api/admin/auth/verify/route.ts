import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production",
)

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("admin-token")

    if (!token) {
      console.log("No admin token found in cookies")
      return NextResponse.json({ error: "No token found" }, { status: 401 })
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token.value, JWT_SECRET)

    if (payload.role !== "admin") {
      console.log("Invalid role in token:", payload.role)
      return NextResponse.json({ error: "Invalid role" }, { status: 403 })
    }

    // Check if token is expired (additional check)
    if (payload.exp && payload.exp < Date.now() / 1000) {
      console.log("Token expired")
      return NextResponse.json({ error: "Token expired" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        username: payload.username,
        role: payload.role,
        loginTime: payload.loginTime,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
