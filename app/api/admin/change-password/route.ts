import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this")

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const cookieStore = cookies()
    const token = cookieStore.get("admin-token")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      await jwtVerify(token.value, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Verify current password
    const CURRENT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
    if (currentPassword !== CURRENT_ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Hash the new password with bcrypt
    // 2. Update the database
    // 3. Update environment variables

    // For now, we'll just return success and instructions
    return NextResponse.json({
      success: true,
      message: "Password change initiated",
      instructions: [
        "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables",
        "2. Edit ADMIN_PASSWORD variable",
        "3. Set new value to your new password",
        "4. Redeploy the project",
        "5. Use new password for future logins",
      ],
    })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Password change failed" }, { status: 500 })
  }
}
