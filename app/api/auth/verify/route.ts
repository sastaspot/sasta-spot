import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this")

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("user-token")

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token.value, JWT_SECRET)

    if (payload.role !== "user") {
      return NextResponse.json({ authenticated: false }, { status: 403 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
