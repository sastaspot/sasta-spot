import { NextResponse } from "next/server"

export async function GET() {
  // In a real implementation, calculate these stats from your database
  const stats = {
    totalSites: 5,
    totalSearches: 15420,
    totalAffiliateClicks: 2340,
    revenue: 8750,
  }

  return NextResponse.json(stats)
}
