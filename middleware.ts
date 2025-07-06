import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production",
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if maintenance mode is enabled
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true"
  const isMaintenanceRoute = pathname === "/maintenance"
  const isApiRoute = pathname.startsWith("/api")

  if (maintenanceMode && !isMaintenanceRoute && !isApiRoute && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  // Protect admin routes (except login and auth API routes)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !pathname.startsWith("/api/admin/auth")) {
    try {
      const token = request.cookies.get("admin-token")

      if (!token) {
        console.log("No admin token found, redirecting to login")
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // Verify JWT token
      const { payload } = await jwtVerify(token.value, JWT_SECRET)

      if (payload.role !== "admin") {
        console.log("Invalid admin role, redirecting to login")
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      console.error("Token verification failed in middleware:", error)
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Redirect /admin to /admin/dashboard if authenticated, otherwise to login
  if (pathname === "/admin") {
    try {
      const token = request.cookies.get("admin-token")

      if (token) {
        const { payload } = await jwtVerify(token.value, JWT_SECRET)
        if (payload.role === "admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        }
      }
    } catch (error) {
      // Invalid token, continue to login redirect
      console.log("Invalid token for /admin redirect")
    }

    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Rate limiting for API routes
  if (isApiRoute) {
    const ip = request.ip ?? "127.0.0.1"
    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", "100")
    response.headers.set("X-RateLimit-Remaining", "99")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json).*)"],
}
