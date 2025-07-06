"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, CheckCircle, Chrome } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SocialSuccessPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const provider = searchParams.get("provider")
  const { toast } = useToast()

  useEffect(() => {
    // Simulate OAuth callback processing
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Welcome to Sasta Spot!",
        description: `Successfully signed in with ${provider}. You now have unlimited searches!`,
      })
    }, 2000)
  }, [provider, toast])

  const handleContinue = () => {
    router.push("/")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">Sasta Spot</span>
          </div>
          <CardTitle>Welcome to Sasta Spot!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {loading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Setting up your account...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Account Created Successfully!</h3>
                <p className="text-muted-foreground">
                  You've successfully signed in with <span className="capitalize font-medium">{provider}</span>
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  🎉 Your account is ready!
                  <br />✅ Unlimited searches
                  <br />✅ Price alerts
                  <br />✅ Wishlist & history
                </p>
              </div>

              <Button onClick={handleContinue} className="w-full">
                <Chrome className="w-4 h-4 mr-2" />
                Start Finding Cheapest Deals
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
