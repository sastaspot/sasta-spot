import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
      return NextResponse.redirect(new URL("/auth/login?error=facebook_not_configured", request.url))
    }

    if (!code) {
      // Redirect to Facebook OAuth
      const facebookAuthUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth")
      facebookAuthUrl.searchParams.set("client_id", process.env.FACEBOOK_CLIENT_ID)
      facebookAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXTAUTH_URL}/api/auth/social/facebook`)
      facebookAuthUrl.searchParams.set("response_type", "code")
      facebookAuthUrl.searchParams.set("scope", "email,public_profile")
      facebookAuthUrl.searchParams.set("state", crypto.randomUUID())

      return NextResponse.redirect(facebookAuthUrl.toString())
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/social/facebook`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for access token")
    }

    const tokens = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.access_token}`,
    )

    if (!userResponse.ok) {
      throw new Error("Failed to get user info")
    }

    const facebookUser = await userResponse.json()

    // In real implementation, save/update user in database
    console.log("Facebook user login:", facebookUser)

    // For demo, redirect to success page
    return NextResponse.redirect(
      new URL(
        `/auth/social-success?provider=facebook&name=${encodeURIComponent(facebookUser.name)}&email=${encodeURIComponent(facebookUser.email || "")}`,
        request.url,
      ),
    )
  } catch (error) {
    console.error("Facebook OAuth error:", error)
    return NextResponse.redirect(new URL("/auth/login?error=facebook_oauth_failed", request.url))
  }
}
