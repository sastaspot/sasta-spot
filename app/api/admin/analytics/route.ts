import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real implementation, you would fetch this data from your database
    // For demo purposes, we'll return mock data

    const analytics = {
      overview: {
        totalUsers: 1247,
        registeredUsers: 892,
        anonymousUsers: 355,
        totalSearches: 15420,
        searchesToday: 234,
        avgSearchesPerUser: 12.4,
      },
      userGrowth: [
        { date: "2024-01-01", users: 50 },
        { date: "2024-01-02", users: 75 },
        { date: "2024-01-03", users: 120 },
        { date: "2024-01-04", users: 180 },
        { date: "2024-01-05", users: 250 },
      ],
      searchActivity: [
        { hour: "00:00", searches: 12 },
        { hour: "06:00", searches: 45 },
        { hour: "12:00", searches: 89 },
        { hour: "18:00", searches: 156 },
        { hour: "23:00", searches: 34 },
      ],
      topSearches: [
        { query: "iPhone 15", count: 1250 },
        { query: "MacBook Pro", count: 890 },
        { query: "Samsung Galaxy", count: 675 },
        { query: "iPad", count: 543 },
        { query: "AirPods", count: 432 },
      ],
      recentUsers: [
        {
          id: 1,
          name: "Rahul Sharma",
          email: "rahul@example.com",
          createdAt: "2024-01-15T10:30:00Z",
          searchCount: 23,
          isActive: true,
        },
        {
          id: 2,
          name: "Priya Patel",
          email: "priya@example.com",
          createdAt: "2024-01-14T15:45:00Z",
          searchCount: 18,
          isActive: true,
        },
        {
          id: 3,
          name: "Amit Kumar",
          email: "amit@example.com",
          createdAt: "2024-01-13T09:20:00Z",
          searchCount: 31,
          isActive: true,
        },
      ],
      dailyStats: [
        {
          date: "2024-01-15",
          newUsers: 45,
          searches: 234,
          registrations: 12,
        },
        {
          date: "2024-01-14",
          newUsers: 38,
          searches: 198,
          registrations: 9,
        },
        {
          date: "2024-01-13",
          newUsers: 52,
          searches: 267,
          registrations: 15,
        },
      ],
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
