"use client"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Zap } from "lucide-react"

interface SearchLimitBannerProps {
  searchCount: number
  isAuthenticated: boolean
}

export function SearchLimitBanner({ searchCount, isAuthenticated }: SearchLimitBannerProps) {
  if (isAuthenticated) return null

  const remainingSearches = Math.max(0, 5 - searchCount)

  if (remainingSearches === 0) {
    return (
      <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>🚫 You've used all 5 free searches today. Sign up for unlimited searches!</span>
          <div className="flex gap-2 ml-4">
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/register">Sign Up Free</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (remainingSearches <= 2) {
    return (
      <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <Zap className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>⚡ Only {remainingSearches} free searches left today. Sign up for unlimited!</span>
          <div className="flex gap-2 ml-4">
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/register">Sign Up Free</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
