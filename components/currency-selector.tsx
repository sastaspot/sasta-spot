"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useCurrency, SUPPORTED_CURRENCIES } from "@/hooks/use-currency"

export function CurrencySelector() {
  const { currency, setCurrency, userCountry, loading } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Globe className="w-4 h-4 mr-2" />
        <div className="w-8 h-4 bg-muted animate-pulse rounded"></div>
      </Button>
    )
  }

  const currentCurrency = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Globe className="w-4 h-4 mr-2" />
          {currentCurrency?.symbol} {currency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <div className="text-sm font-medium mb-2">Select Currency</div>
          <div className="text-xs text-muted-foreground mb-3">
            Detected location: {userCountry} • Prices converted in real-time
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto">
          {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => {
                setCurrency(code)
                setIsOpen(false)
              }}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm w-8">{info.symbol}</span>
                <div>
                  <div className="font-medium">{code}</div>
                  <div className="text-xs text-muted-foreground">{info.name}</div>
                </div>
              </div>
              {currency === code && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="text-xs text-muted-foreground">Exchange rates updated hourly</div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CurrencyBanner() {
  const { currency, userCountry, loading } = useCurrency()
  const [dismissed, setDismissed] = useState(false)

  // Don't show if loading, dismissed, or currency matches country
  if (loading || dismissed) return null

  const countryCurrencyMap: Record<string, string> = {
    US: "USD",
    GB: "GBP",
    IN: "INR",
    JP: "JPY",
    AU: "AUD",
    CA: "CAD",
    SG: "SGD",
    AE: "AED",
    SA: "SAR",
  }

  const expectedCurrency = countryCurrencyMap[userCountry]
  if (!expectedCurrency || currency === expectedCurrency) return null

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900 dark:text-blue-100">
                Prices shown in {SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES]?.name}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                We detected you're in {userCountry}. All prices are converted from Indian Rupees.
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Auto-converted
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
              ×
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
