import { NextResponse } from "next/server"

export async function GET() {
  // In a real implementation, fetch affiliate link performance from database
  const affiliateData = {
    links: [
      {
        id: "1",
        site: "Amazon",
        affiliateId: "your-amazon-id",
        commissionRate: "4-8%",
        clicks: 1250,
        conversions: 89,
        revenue: 4500,
      },
      {
        id: "2",
        site: "Flipkart",
        affiliateId: "your-flipkart-id",
        commissionRate: "2-6%",
        clicks: 890,
        conversions: 67,
        revenue: 2800,
      },
    ],
    total: 2,
  }

  return NextResponse.json(affiliateData)
}
