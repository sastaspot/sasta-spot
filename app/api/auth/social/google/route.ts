import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(new URL("/auth/login?error=google_not_configured", request.url))
    }

    if (!code) {
      // Redirect to Google OAuth
      const googleAuthUrl = new URL("https://accounts.google.com/oauth/authorize")
      googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID)
      googleAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXTAUTH_URL}/api/auth/social/google`)
      googleAuthUrl.searchParams.set("response_type", "code")
      googleAuthUrl.searchParams.set("scope", "openid email profile")
      googleAuthUrl.searchParams.set("state", crypto.randomUUID())

      return NextResponse.redirect(googleAuthUrl.toString())
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/social/google`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for tokens")
    }

    const tokens = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error("Failed to get user info")
    }

    const googleUser = await userResponse.json()

    // In real implementation, save/update user in database
    console.log("Google user login:", googleUser)

    // For demo, redirect to success page
    return NextResponse.redirect(
      new URL(
        `/auth/social-success?provider=google&name=${encodeURIComponent(googleUser.name)}&email=${encodeURIComponent(googleUser.email)}`,
        request.url,
      ),
    )
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(new URL("/auth/login?error=google_oauth_failed", request.url))
  }
}
