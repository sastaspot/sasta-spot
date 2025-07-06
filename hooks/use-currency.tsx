"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CurrencyContextType {
  currency: string
  setCurrency: (currency: string) => void
  exchangeRates: Record<string, number>
  isLoading: boolean
  convertPrice: (price: number, fromCurrency?: string) => number
  formatPrice: (price: number, currency?: string) => string
  detectedCountry: string | null
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const SUPPORTED_CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  JPY: { symbol: "¥", name: "Japanese Yen" },
  CAD: { symbol: "C$", name: "Canadian Dollar" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  SGD: { symbol: "S$", name: "Singapore Dollar" },
  AED: { symbol: "د.إ", name: "UAE Dirham" },
  SAR: { symbol: "ر.س", name: "Saudi Riyal" },
}

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  IN: "INR",
  JP: "JPY",
  CA: "CAD",
  AU: "AUD",
  SG: "SGD",
  AE: "AED",
  SA: "SAR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<string>("INR")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)

  // Detect user's location and set default currency
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get location from IP
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()

        if (data.country_code) {
          setDetectedCountry(data.country_code)
          const detectedCurrency = COUNTRY_TO_CURRENCY[data.country_code] || "USD"

          // Check if user has a saved preference
          const savedCurrency = localStorage.getItem("preferred-currency")
          if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency as keyof typeof SUPPORTED_CURRENCIES]) {
            setCurrencyState(savedCurrency)
          } else {
            setCurrencyState(detectedCurrency)
            localStorage.setItem("preferred-currency", detectedCurrency)
          }
        }
      } catch (error) {
        console.error("Failed to detect location:", error)
        // Fallback to saved preference or USD
        const savedCurrency = localStorage.getItem("preferred-currency") || "USD"
        setCurrencyState(savedCurrency)
      }
    }

    detectLocation()
  }, [])

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setIsLoading(true)

        // Check if we have cached rates (less than 1 hour old)
        const cachedRates = localStorage.getItem("exchange-rates")
        const cachedTimestamp = localStorage.getItem("exchange-rates-timestamp")

        if (cachedRates && cachedTimestamp) {
          const hourAgo = Date.now() - 60 * 60 * 1000
          if (Number.parseInt(cachedTimestamp) > hourAgo) {
            setExchangeRates(JSON.parse(cachedRates))
            setIsLoading(false)
            return
          }
        }

        // Fetch fresh rates from exchangerate-api.com (free tier: 1500 requests/month)
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/INR")
        const data = await response.json()

        if (data.rates) {
          setExchangeRates(data.rates)
          localStorage.setItem("exchange-rates", JSON.stringify(data.rates))
          localStorage.setItem("exchange-rates-timestamp", Date.now().toString())
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error)
        // Fallback rates (approximate)
        const fallbackRates = {
          USD: 0.012,
          EUR: 0.011,
          GBP: 0.0095,
          INR: 1,
          JPY: 1.8,
          CAD: 0.016,
          AUD: 0.018,
          SGD: 0.016,
          AED: 0.044,
          SAR: 0.045,
        }
        setExchangeRates(fallbackRates)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRates()
  }, [])

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("preferred-currency", newCurrency)
  }

  const convertPrice = (price: number, fromCurrency = "INR"): number => {
    if (currency === fromCurrency) return price

    // Convert from source currency to INR first, then to target currency
    let priceInINR = price
    if (fromCurrency !== "INR") {
      priceInINR = price / (exchangeRates[fromCurrency] || 1)
    }

    // Convert from INR to target currency
    if (currency === "INR") {
      return priceInINR
    }

    return priceInINR * (exchangeRates[currency] || 1)
  }

  const formatPrice = (price: number, targetCurrency?: string): string => {
    const curr = targetCurrency || currency
    const convertedPrice = convertPrice(price)
    const currencyInfo = SUPPORTED_CURRENCIES[curr as keyof typeof SUPPORTED_CURRENCIES]

    if (!currencyInfo) return `${price.toFixed(2)}`

    // Format based on currency
    if (curr === "JPY") {
      return `${currencyInfo.symbol}${Math.round(convertedPrice).toLocaleString()}`
    }

    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRates,
        isLoading,
        convertPrice,
        formatPrice,
        detectedCountry,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

export { SUPPORTED_CURRENCIES }
