import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get("filter") || "all"

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real implementation, you would fetch deals from your database
  const mockDeals = {
    deals: [],
    total: 0,
    filter: filter,
    message: "No deals available at the moment. Check back soon!",
  }

  return NextResponse.json(mockDeals)
}
