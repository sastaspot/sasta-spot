import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check if we have cached rates (less than 1 hour old)
    const cacheKey = "exchange-rates"
    const cacheTimestampKey = "exchange-rates-timestamp"

    // In a real app, you'd use Redis or similar for server-side caching
    // For now, we'll fetch fresh rates each time

    // Fetch from exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/INR", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      rates: data.rates,
      base: "INR",
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Currency API error:", error)

    // Return fallback rates
    const fallbackRates = {
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      INR: 1,
      JPY: 1.8,
      CAD: 0.016,
      AUD: 0.018,
      SGD: 0.016,
      AED: 0.044,
      SAR: 0.045,
    }

    return NextResponse.json({
      success: true,
      rates: fallbackRates,
      base: "INR",
      timestamp: Date.now(),
      fallback: true,
    })
  }
}
