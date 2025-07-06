import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = cookies()

    // Clear the admin token cookie
    cookieStore.delete("admin-token")

    // Log logout
    console.log(`Admin logout at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
