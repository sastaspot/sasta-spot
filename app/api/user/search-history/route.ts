import { NextResponse } from "next/server"

export async function GET() {
  // In a real implementation, fetch user's search history from database
  const history = {
    history: [
      {
        id: "1",
        query: "iPhone 15",
        date: "2024-01-15",
        resultsCount: 25,
      },
      {
        id: "2",
        query: "MacBook Pro",
        date: "2024-01-14",
        resultsCount: 18,
      },
    ],
    total: 2,
  }

  return NextResponse.json(history)
}
