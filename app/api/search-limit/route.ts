import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this")

export async function GET() {
  try {
    const cookieStore = cookies()
    const userToken = cookieStore.get("user-token")

    // Check if user is authenticated
    if (userToken) {
      try {
        const { payload } = await jwtVerify(userToken.value, JWT_SECRET)
        if (payload.role === "user") {
          return NextResponse.json({
            isAuthenticated: true,
            searchCount: 0,
            hasUnlimitedSearches: true,
            user: {
              id: payload.userId,
              name: payload.name,
              email: payload.email,
            },
          })
        }
      } catch (error) {
        // Invalid token, continue as anonymous
      }
    }

    // Handle anonymous user search limits
    const searchCookie = cookieStore.get("search-count")
    const lastResetCookie = cookieStore.get("search-reset")

    const today = new Date().toDateString()
    const lastReset = lastResetCookie?.value || ""

    let searchCount = 0

    if (lastReset === today && searchCookie) {
      searchCount = Number.parseInt(searchCookie.value) || 0
    }

    return NextResponse.json({
      isAuthenticated: false,
      searchCount,
      hasUnlimitedSearches: false,
      remainingSearches: Math.max(0, 5 - searchCount),
    })
  } catch (error) {
    console.error("Search limit check error:", error)
    return NextResponse.json({
      isAuthenticated: false,
      searchCount: 0,
      hasUnlimitedSearches: false,
      remainingSearches: 5,
    })
  }
}

export async function POST() {
  try {
    const cookieStore = cookies()
    const userToken = cookieStore.get("user-token")

    // Check if user is authenticated
    if (userToken) {
      try {
        const { payload } = await jwtVerify(userToken.value, JWT_SECRET)
        if (payload.role === "user") {
          // Log search for analytics
          console.log(`Search by user ${payload.email} at ${new Date().toISOString()}`)

          return NextResponse.json({
            success: true,
            isAuthenticated: true,
            searchCount: 0,
            hasUnlimitedSearches: true,
          })
        }
      } catch (error) {
        // Invalid token, continue as anonymous
      }
    }

    // Handle anonymous user search tracking
    const searchCookie = cookieStore.get("search-count")
    const lastResetCookie = cookieStore.get("search-reset")

    const today = new Date().toDateString()
    const lastReset = lastResetCookie?.value || ""

    let searchCount = 0

    if (lastReset === today && searchCookie) {
      searchCount = Number.parseInt(searchCookie.value) || 0
    }

    // Check if user has exceeded limit
    if (searchCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Daily search limit exceeded",
          searchCount,
          hasUnlimitedSearches: false,
          remainingSearches: 0,
        },
        { status: 429 },
      )
    }

    // Increment search count
    const newSearchCount = searchCount + 1

    // Set cookies for tracking
    const response = NextResponse.json({
      success: true,
      isAuthenticated: false,
      searchCount: newSearchCount,
      hasUnlimitedSearches: false,
      remainingSearches: Math.max(0, 5 - newSearchCount),
    })

    response.cookies.set("search-count", newSearchCount.toString(), {
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    response.cookies.set("search-reset", today, {
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    // Log anonymous search for analytics
    console.log(`Anonymous search #${newSearchCount} at ${new Date().toISOString()}`)

    return response
  } catch (error) {
    console.error("Search tracking error:", error)
    return NextResponse.json({ error: "Search tracking failed" }, { status: 500 })
  }
}
