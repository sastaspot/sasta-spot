"use client"

import type React from "react"

import { useState } from "react"
import { Search, Star, ExternalLink, Zap, Clock, TrendingDown, Shield, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CurrencyBanner } from "@/components/currency-selector"
import { useCurrency } from "@/hooks/use-currency"

export default function SastaSpotWebsite() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchStats, setSearchStats] = useState(null)

  const { formatPrice } = useCurrency()

  const getBestDeal = (prices: any[]) => {
    return prices.reduce((min, current) => (current.price < min.price ? current : min))
  }

  const getPlatformIcon = (platform: string) => {
    return (
      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium" aria-hidden="true">
        {platform[0]}
      </div>
    )
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      setProducts(data.products || [])
      setSearchStats({
        total: data.total,
        scrapedSites: data.scrapedSites,
        totalResults: data.totalResults,
      })
    } catch (error) {
      console.error("Error searching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const trackAffiliateClick = async (url: string, platform: string, productId: string, productTitle: string) => {
    // Track click for analytics
    try {
      await fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          platform,
          productId,
          productTitle,
          timestamp: Date.now(),
        }),
      })
    } catch (error) {
      console.error("Error tracking click:", error)
    }

    // Open CueLinks affiliate link
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Search */}
      <main>
        <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center">
            <header>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Find the <span className="text-primary">Cheapest Deals</span> Automatically
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Compare prices across Amazon, Flipkart, Myntra & 1000+ stores instantly. We automatically find the
                cheapest deals for you - because every rupee saved counts!
              </p>
            </header>

            {/* Search Form */}
            <div className="max-w-2xl mx-auto mb-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearch()
                }}
                role="search"
              >
                <label htmlFor="product-search" className="sr-only">
                  Search for products to compare prices
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5"
                    aria-hidden="true"
                  />
                  <Input
                    id="product-search"
                    type="search"
                    placeholder="Search for any product (e.g., iPhone 15, MacBook Pro, Samsung TV)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary w-full"
                    autoComplete="off"
                    aria-describedby="search-help"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    onClick={handleSearch}
                    disabled={loading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 md:px-8 text-sm md:text-base h-12 md:h-14"
                    aria-describedby="search-status"
                  >
                    {loading ? (
                      <>
                        <div
                          className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                          aria-hidden="true"
                        ></div>
                        <span className="hidden md:inline">Finding Cheapest...</span>
                        <span className="md:hidden">Finding...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden md:inline">Find Cheapest Deals</span>
                        <span className="md:hidden">Search</span>
                      </>
                    )}
                  </Button>
                </div>
                <p id="search-help" className="text-sm text-muted-foreground mt-2">
                  Search across 1000+ stores to find the best prices
                </p>
              </form>
            </div>

            {/* Search Stats */}
            {searchStats && (
              <div
                className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" aria-hidden="true" />
                  <span>Searched {searchStats.scrapedSites} sites</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" aria-hidden="true" />
                  <span>Found {searchStats.totalResults} products</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>Real-time prices</span>
                </div>
              </div>
            )}

            {/* Currency Banner */}
            <CurrencyBanner />

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-4">
                <Shield className="w-8 h-8 text-primary mb-2" aria-hidden="true" />
                <span className="text-sm font-medium">Secure & Trusted</span>
              </div>
              <div className="flex flex-col items-center p-4">
                <Users className="w-8 h-8 text-primary mb-2" aria-hidden="true" />
                <span className="text-sm font-medium">1L+ Users</span>
              </div>
              <div className="flex flex-col items-center p-4">
                <Award className="w-8 h-8 text-primary mb-2" aria-hidden="true" />
                <span className="text-sm font-medium">Best Prices</span>
              </div>
              <div className="flex flex-col items-center p-4">
                <Zap className="w-8 h-8 text-primary mb-2" aria-hidden="true" />
                <span className="text-sm font-medium">Instant Results</span>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Ad Space */}
        <section className="py-4 bg-muted/30" aria-label="Advertisement">
          <div className="container mx-auto px-4">
            <div className="h-20 md:h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              <span className="text-sm">Advertisement Space - Partner with Sasta Spot</span>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {(loading || products.length > 0 || searchQuery) && (
          <section className="py-12" aria-label="Search results">
            <div className="container mx-auto px-4">
              {searchQuery && (
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      {loading
                        ? `Finding cheapest deals for "${searchQuery}"...`
                        : `Cheapest deals for "${searchQuery}"`}
                    </h2>
                    {searchStats && (
                      <p className="text-muted-foreground">
                        {searchStats.total} product groups found from {searchStats.scrapedSites} sites • Powered by
                        CueLinks
                      </p>
                    )}
                  </div>
                  <Button variant="outline" className="w-fit bg-transparent">
                    Sort by Price
                  </Button>
                </header>
              )}

              {loading ? (
                <div className="grid gap-6 md:gap-8" role="status" aria-label="Loading search results">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="animate-pulse flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                          <div className="rounded-lg bg-muted h-48 w-full md:w-48 flex-shrink-0"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                            <div className="space-y-2 mt-4">
                              <div className="h-12 bg-muted rounded"></div>
                              <div className="h-12 bg-muted rounded"></div>
                              <div className="h-12 bg-muted rounded"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 && searchQuery ? (
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-4">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    No products found for "{searchQuery}". Try searching for something else.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Popular searches: iPhone, MacBook, Samsung Galaxy, iPad, AirPods, OnePlus
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:gap-8">
                  {products.map((product) => {
                    const bestDeal = getBestDeal(product.prices)

                    return (
                      <article key={product.id} className="group">
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                          <CardContent className="p-0">
                            <div className="grid md:grid-cols-[300px_1fr] gap-0">
                              {/* Product Info */}
                              <div className="p-6 border-r">
                                <div className="flex flex-col items-center text-center">
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.title}
                                    width={200}
                                    height={200}
                                    className="rounded-lg mb-4 object-cover"
                                    loading="lazy"
                                  />
                                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                                      <span>{product.rating}</span>
                                    </div>
                                    <span>({product.reviews} reviews)</span>
                                  </div>
                                </div>
                              </div>

                              {/* Price Comparison */}
                              <div className="p-6">
                                <div className="grid gap-4">
                                  {product.prices.map((priceInfo, index) => (
                                    <div
                                      key={index}
                                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-4 ${
                                        priceInfo.platform === bestDeal.platform
                                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                                          : "border-border"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        {getPlatformIcon(priceInfo.platform)}
                                        <div>
                                          <div className="font-medium">{priceInfo.platform}</div>
                                          {priceInfo.platform === bestDeal.platform && (
                                            <Badge
                                              variant="secondary"
                                              className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                            >
                                              Cheapest Deal! 🎯
                                            </Badge>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="text-left sm:text-right">
                                          <div className="font-bold text-lg">{formatPrice(priceInfo.price)}</div>
                                          {priceInfo.originalPrice > priceInfo.price && (
                                            <div className="text-sm text-muted-foreground line-through">
                                              {formatPrice(priceInfo.originalPrice)}
                                            </div>
                                          )}
                                        </div>

                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            trackAffiliateClick(
                                              priceInfo.url,
                                              priceInfo.platform,
                                              product.id,
                                              product.title,
                                            )
                                          }
                                          className={`w-full sm:w-auto min-h-[44px] ${
                                            priceInfo.platform === bestDeal.platform
                                              ? "bg-green-600 hover:bg-green-700"
                                              : ""
                                          }`}
                                          aria-label={`Buy ${product.title} from ${priceInfo.platform} for ${formatPrice(priceInfo.price)}`}
                                        >
                                          Buy Now
                                          <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <section className="py-16 bg-muted/30" aria-labelledby="how-it-works">
          <div className="container mx-auto px-4">
            <h2 id="how-it-works" className="text-3xl font-bold text-center mb-12">
              How Sasta Spot Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 text-primary" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-4">1. Search Any Product</h3>
                  <p className="text-muted-foreground">
                    Enter any product name and we'll automatically search across all major e-commerce sites in India.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-primary" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-4">2. Real-time Price Comparison</h3>
                  <p className="text-muted-foreground">
                    Our system scrapes live prices from multiple sites and compares them instantly to find the cheapest
                    deals.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <TrendingDown className="w-12 h-12 mx-auto mb-4 text-primary" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-4">3. Cheapest Deals Found</h3>
                  <p className="text-muted-foreground">
                    We highlight the cheapest deals and provide direct affiliate links. Every purchase helps support
                    Sasta Spot!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Sasta Spot */}
        <section className="py-16" aria-labelledby="why-choose-us">
          <div className="container mx-auto px-4">
            <h2 id="why-choose-us" className="text-3xl font-bold text-center mb-12">
              Why Choose Sasta Spot?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Zap className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">Always Cheapest</h3>
                <p className="text-sm text-muted-foreground">We guarantee to find the lowest prices available online</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Clock className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">Prices updated in real-time from all major platforms</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Shield className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">Get results in seconds, not minutes</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <TrendingDown className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">Trusted Affiliate Links</h3>
                <p className="text-sm text-muted-foreground">Secure purchases through verified CueLinks network</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
