"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, Calculator, Percent } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

interface SavingsCalculatorProps {
  products: Array<{
    id: string
    name: string
    prices: Array<{
      site: string
      price: number
      originalPrice?: number
    }>
  }>
}

export function SavingsCalculator({ products }: SavingsCalculatorProps) {
  const { formatPrice, currency } = useCurrency()

  // Calculate total savings across all products
  const calculateSavings = () => {
    let totalSavings = 0
    let totalOriginalPrice = 0
    let totalBestPrice = 0
    const savingsBreakdown: Array<{
      productName: string
      savings: number
      percentage: number
      cheapestSite: string
      expensiveSite: string
    }> = []

    products.forEach((product) => {
      const prices = product.prices.map((p) => p.price).sort((a, b) => a - b)
      const cheapestPrice = prices[0]
      const expensivePrice = prices[prices.length - 1]
      const savings = expensivePrice - cheapestPrice

      if (savings > 0) {
        const cheapestSite = product.prices.find((p) => p.price === cheapestPrice)?.site || ""
        const expensiveSite = product.prices.find((p) => p.price === expensivePrice)?.site || ""
        const percentage = (savings / expensivePrice) * 100

        savingsBreakdown.push({
          productName: product.name,
          savings,
          percentage,
          cheapestSite,
          expensiveSite,
        })

        totalSavings += savings
        totalBestPrice += cheapestPrice
        totalOriginalPrice += expensivePrice
      }
    })

    const overallPercentage = totalOriginalPrice > 0 ? (totalSavings / totalOriginalPrice) * 100 : 0

    return {
      totalSavings,
      totalOriginalPrice,
      totalBestPrice,
      overallPercentage,
      savingsBreakdown,
    }
  }

  const savings = calculateSavings()

  if (savings.totalSavings === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Calculator className="w-5 h-5" />
          Your Savings Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Savings */}
        <div className="text-center p-6 bg-white/50 dark:bg-black/20 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown className="w-6 h-6 text-green-600" />
            <span className="text-lg font-medium">Total Savings</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {formatPrice(savings.totalSavings)}
          </div>
          {currency !== "INR" && (
            <div className="text-sm text-muted-foreground">(₹{savings.totalSavings.toFixed(2)})</div>
          )}
          <div className="flex items-center justify-center gap-2 mt-2">
            <Percent className="w-4 h-4" />
            <span className="text-sm font-medium">{savings.overallPercentage.toFixed(1)}% saved overall</span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/30 dark:bg-black/10 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">If you bought from expensive sites</div>
            <div className="text-xl font-semibold text-red-600 dark:text-red-400">
              {formatPrice(savings.totalOriginalPrice)}
            </div>
          </div>
          <div className="text-center p-4 bg-white/30 dark:bg-black/10 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">By choosing cheapest options</div>
            <div className="text-xl font-semibold text-green-600 dark:text-green-400">
              {formatPrice(savings.totalBestPrice)}
            </div>
          </div>
        </div>

        {/* Savings Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Savings Breakdown:</h4>
          {savings.savingsBreakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/30 dark:bg-black/10 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm line-clamp-1">{item.productName}</div>
                <div className="text-xs text-muted-foreground">
                  {item.cheapestSite} vs {item.expensiveSite}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600 dark:text-green-400">{formatPrice(item.savings)}</div>
                <Badge variant="secondary" className="text-xs">
                  {item.percentage.toFixed(1)}% off
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            💡 Smart shopping tip: Always compare prices before buying!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You could save {formatPrice(savings.totalSavings)} on these {products.length} products
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
