"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CurrencySelector } from "@/components/currency-selector"
import { User, Mail, Calendar, Heart, Bell, History, Settings, Trash2, ExternalLink, Globe } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

interface UserData {
  id: string
  name: string
  email: string
  registrationMethod: "email" | "google" | "facebook"
  emailVerified: boolean
  createdAt: string
  searchCount: number
  totalSavings: number
}

interface WishlistItem {
  id: string
  productName: string
  targetPrice: number
  currentPrice: number
  site: string
  url: string
  createdAt: string
}

interface PriceAlert {
  id: string
  productName: string
  targetPrice: number
  currentPrice: number
  isActive: boolean
  createdAt: string
}

interface SearchHistoryItem {
  id: string
  query: string
  resultsCount: number
  searchedAt: string
}

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const { formatPrice, currency } = useCurrency()

  useEffect(() => {
    loadUserData()
    loadWishlist()
    loadPriceAlerts()
    loadSearchHistory()
  }, [])

  const loadUserData = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadWishlist = async () => {
    try {
      const response = await fetch("/api/user/wishlist", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist || [])
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error)
    }
  }

  const loadPriceAlerts = async () => {
    try {
      const response = await fetch("/api/user/price-alerts", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setPriceAlerts(data.alerts || [])
      }
    } catch (error) {
      console.error("Failed to load price alerts:", error)
    }
  }

  const loadSearchHistory = async () => {
    try {
      const response = await fetch("/api/user/search-history", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setSearchHistory(data.history || [])
      }
    } catch (error) {
      console.error("Failed to load search history:", error)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      const response = await fetch(`/api/user/wishlist/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (response.ok) {
        setWishlist((prev) => prev.filter((item) => item.id !== itemId))
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
    }
  }

  const togglePriceAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/user/price-alerts/${alertId}`, {
        method: "PATCH",
        credentials: "include",
      })
      if (response.ok) {
        setPriceAlerts((prev) =>
          prev.map((alert) => (alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert)),
        )
      }
    } catch (error) {
      console.error("Failed to toggle price alert:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to access your account</h1>
            <Button asChild>
              <a href="/auth/login">Login</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your profile, wishlist, and preferences</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={user.name} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center gap-2">
                        <Input value={user.email} readOnly />
                        {user.emailVerified ? (
                          <Badge variant="default">Verified</Badge>
                        ) : (
                          <Badge variant="destructive">Unverified</Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Registration Method</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {user.registrationMethod === "email" && <Mail className="w-3 h-3 mr-1" />}
                          {user.registrationMethod === "google" && "🔍"}
                          {user.registrationMethod === "facebook" && "📘"}
                          {user.registrationMethod}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Searches</span>
                      <Badge variant="secondary">{user.searchCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Savings</span>
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        {formatPrice(user.totalSavings)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Wishlist Items</span>
                      <Badge variant="outline">{wishlist.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Active Alerts</span>
                      <Badge variant="outline">{priceAlerts.filter((alert) => alert.isActive).length}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    My Wishlist ({wishlist.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                      <p className="text-muted-foreground">Start adding products to track their prices</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>Target: {formatPrice(item.targetPrice)}</span>
                              <span>Current: {formatPrice(item.currentPrice)}</span>
                              <span>Site: {item.site}</span>
                            </div>
                            {item.currentPrice <= item.targetPrice && (
                              <Badge variant="default" className="mt-2 bg-green-500 hover:bg-green-600">
                                Price Target Reached!
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => removeFromWishlist(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Price Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Price Alerts ({priceAlerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {priceAlerts.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No price alerts set</h3>
                      <p className="text-muted-foreground">Set up alerts to get notified when prices drop</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {priceAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{alert.productName}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>Alert Price: {formatPrice(alert.targetPrice)}</span>
                              <span>Current: {formatPrice(alert.currentPrice)}</span>
                              <Badge variant={alert.isActive ? "default" : "secondary"}>
                                {alert.isActive ? "Active" : "Paused"}
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => togglePriceAlert(alert.id)}>
                            {alert.isActive ? "Pause" : "Activate"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Search History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Search History ({searchHistory.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {searchHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No search history</h3>
                      <p className="text-muted-foreground">Your search history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchHistory.map((search) => (
                        <div key={search.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">{search.query}</span>
                            <div className="text-sm text-muted-foreground">
                              {search.resultsCount} results • {new Date(search.searchedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/?search=${encodeURIComponent(search.query)}`}>Search Again</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Currency Preference</Label>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred currency for price display
                        </p>
                      </div>
                      <CurrencySelector />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Current Currency</Label>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">
                          All prices are displayed in <strong>{currency}</strong>
                          {currency !== "INR" && " (converted from Indian Rupees)"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
