"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Users, Search, TrendingUp, Calendar, UserCheck, Zap, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      registeredUsers: 0,
      anonymousUsers: 0,
      totalSearches: 0,
      searchesToday: 0,
      avgSearchesPerUser: 0,
    },
    userGrowth: [],
    searchActivity: [],
    topSearches: [],
    recentUsers: [],
    dailyStats: [],
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/verify")
      if (response.ok) {
        setIsAuthenticated(true)
        fetchAnalytics()
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics")
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sasta Spot Analytics</h1>
              <p className="text-muted-foreground">User engagement and search analytics</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
              <Zap className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{analytics.overview.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Registered Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.overview.registeredUsers.toLocaleString()}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Searches</p>
                  <p className="text-2xl font-bold">{analytics.overview.totalSearches.toLocaleString()}</p>
                </div>
                <Search className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Searches Today</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics.overview.searchesToday.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="searches">Searches</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Registration Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analytics.overview.registeredUsers}</div>
                      <div className="text-sm text-muted-foreground">Registered Users</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{analytics.overview.anonymousUsers}</div>
                      <div className="text-sm text-muted-foreground">Anonymous Users</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.overview.registeredUsers > 0
                          ? Math.round((analytics.overview.registeredUsers / analytics.overview.totalUsers) * 100)
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent User Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.recentUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No user registrations yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead>Searches</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.recentUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{user.searchCount}</TableCell>
                            <TableCell>
                              <Badge variant={user.isActive ? "default" : "secondary"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="searches">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{analytics.overview.totalSearches}</div>
                      <div className="text-sm text-muted-foreground">Total Searches</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analytics.overview.searchesToday}</div>
                      <div className="text-sm text-muted-foreground">Searches Today</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.overview.avgSearchesPerUser.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg per User</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Search Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.topSearches.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No search data available yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analytics.topSearches.map((search, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                              {index + 1}
                            </div>
                            <span className="font-medium">{search.query}</span>
                          </div>
                          <Badge variant="secondary">{search.count} searches</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.dailyStats.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No activity data available yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.dailyStats.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{new Date(day.date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {day.newUsers} new users, {day.searches} searches
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{day.searches}</div>
                          <div className="text-sm text-muted-foreground">searches</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">User Engagement</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {analytics.overview.registeredUsers > 0
                          ? `${Math.round((analytics.overview.registeredUsers / analytics.overview.totalUsers) * 100)}% of users have registered for unlimited searches`
                          : "No registered users yet - consider improving the registration flow"}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100">Search Activity</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Average of {analytics.overview.avgSearchesPerUser.toFixed(1)} searches per user shows
                        {analytics.overview.avgSearchesPerUser > 3 ? " high" : " moderate"} engagement
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100">Growth Opportunity</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        {analytics.overview.anonymousUsers > analytics.overview.registeredUsers
                          ? "Many anonymous users - focus on conversion strategies"
                          : "Good registration rate - focus on user retention"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
