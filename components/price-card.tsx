"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star, TrendingDown } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

interface PriceCardProps {
  product: {
    id: string
    name: string
    image: string
    prices: Array<{
      site: string
      price: number
      originalPrice?: number
      discount?: number
      url: string
      rating?: number
      reviews?: number
      inStock: boolean
    }>
    category: string
  }
}

export function PriceCard({ product }: PriceCardProps) {
  const { formatPrice, currency, convertPrice } = useCurrency()

  // Sort prices to find the cheapest
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price)
  const cheapestPrice = sortedPrices[0]
  const highestPrice = sortedPrices[sortedPrices.length - 1]
  const savings = highestPrice.price - cheapestPrice.price

  const handleClick = async (url: string, site: string) => {
    // Track click
    try {
      await fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          site,
          url,
        }),
      })
    } catch (error) {
      console.error("Failed to track click:", error)
    }

    // Open in new tab
    window.open(url, "_blank")
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        <Badge className="absolute top-2 left-2" variant="secondary">
          {product.category}
        </Badge>
        {savings > 0 && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            <TrendingDown className="w-3 h-3 mr-1" />
            Save {formatPrice(savings)}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-3 line-clamp-2">{product.name}</h3>

        {/* Currency Notice */}
        {currency !== "INR" && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              💱 Prices converted to {currency} • Original prices in INR
            </p>
          </div>
        )}

        <div className="space-y-3">
          {sortedPrices.map((price, index) => (
            <div
              key={`${price.site}-${index}`}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                index === 0
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{price.site}</span>
                  {index === 0 && (
                    <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                      Cheapest
                    </Badge>
                  )}
                  {!price.inStock && (
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{formatPrice(price.price)}</span>

                  {currency !== "INR" && (
                    <span className="text-xs text-muted-foreground">(₹{price.price.toFixed(2)})</span>
                  )}

                  {price.originalPrice && price.originalPrice > price.price && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(price.originalPrice)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {price.discount}% off
                      </Badge>
                    </>
                  )}
                </div>

                {price.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {price.rating} ({price.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              <Button
                size="sm"
                onClick={() => handleClick(price.url, price.site)}
                disabled={!price.inStock}
                className="ml-3"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                {price.inStock ? "Buy" : "Unavailable"}
              </Button>
            </div>
          ))}
        </div>

        {/* Savings Summary */}
        {savings > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">💰 You can save:</span>
              <div className="text-right">
                <div className="font-bold text-green-600 dark:text-green-400">{formatPrice(savings)}</div>
                {currency !== "INR" && <div className="text-xs text-muted-foreground">(₹{savings.toFixed(2)})</div>}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              By choosing {cheapestPrice.site} over {highestPrice.site}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
