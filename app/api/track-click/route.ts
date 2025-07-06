import { NextResponse } from "next/server"
import { cuelinks } from "@/lib/cuelinks"

export async function POST(request: Request) {
  try {
    const { url, platform, productId, productTitle, timestamp } = await request.json()

    // Track click with CueLinks
    await cuelinks.trackClick(url, {
      platform,
      productId,
      productTitle,
      source: "sasta-spot-search",
      userAgent: request.headers.get("user-agent"),
      timestamp,
    })

    // Also store in your own analytics if needed
    console.log(`Click tracked: ${platform} - ${productTitle}`)

    return NextResponse.json({
      success: true,
      message: "Click tracked successfully",
    })
  } catch (error) {
    console.error("Error tracking click:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to track click",
      },
      { status: 500 },
    )
  }
}
