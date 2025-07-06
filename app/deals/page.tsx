"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PriceCard } from "@/components/price-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Clock, TrendingDown, Zap } from "lucide-react"

export default function DealsPage() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`/api/deals?filter=${filter}`)
        const data = await response.json()
        setDeals(data.deals || [])
      } catch (error) {
        console.error("Error fetching deals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [filter])

  const dealCategories = [
    { id: "all", name: "All Deals", icon: Zap },
    { id: "hot", name: "Hot Deals", icon: Flame },
    { id: "limited", name: "Limited Time", icon: Clock },
    { id: "trending", name: "Trending", icon: TrendingDown },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sasta Spot Deals</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the hottest deals and biggest savings across all categories. Every deal verified for maximum
            savings!
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {dealCategories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={filter === category.id ? "default" : "outline"}
                  onClick={() => setFilter(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-lg bg-muted h-48 w-48"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No deals found for this category.</p>
              <p className="text-sm text-muted-foreground">Check back soon for the latest cheap deals on Sasta Spot!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {deals.map((product) => (
                <div key={product.id} className="relative">
                  <Badge className="absolute top-4 left-4 z-10 bg-red-500 hover:bg-red-600">
                    <Flame className="w-3 h-3 mr-1" />
                    Hot Deal
                  </Badge>
                  <PriceCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
