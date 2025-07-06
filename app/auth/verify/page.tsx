"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, CheckCircle, XCircle, Mail, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      verifyEmail(token)
    } else {
      setStatus("error")
      setMessage("Invalid verification link")
    }
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("Your email has been verified successfully!")
        setEmail(data.email)
        toast({
          title: "Email Verified!",
          description: "You now have unlimited searches on Sasta Spot",
        })
        // Auto redirect after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        if (data.error === "Token expired") {
          setStatus("expired")
          setEmail(data.email)
        } else {
          setStatus("error")
        }
        setMessage(data.error || "Verification failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Verification failed. Please try again.")
    }
  }

  const resendVerification = async () => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email for the new verification link",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to resend verification email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification email",
        variant: "destructive",
      })
    }
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
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">Redirecting you to Sasta Spot in 3 seconds...</p>
              <Button onClick={() => router.push("/")} className="w-full">
                Continue to Sasta Spot
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <XCircle className="w-12 h-12 mx-auto text-red-600" />
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button onClick={() => router.push("/auth/login")} className="w-full">
                  Go to Login
                </Button>
                <Button onClick={() => router.push("/auth/register")} variant="outline" className="w-full">
                  Create New Account
                </Button>
              </div>
            </div>
          )}

          {status === "expired" && (
            <div className="space-y-4">
              <Mail className="w-12 h-12 mx-auto text-orange-600" />
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <Mail className="h-4 w-4" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  Your verification link has expired. We can send you a new one.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button onClick={resendVerification} className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </Button>
                <Button onClick={() => router.push("/auth/login")} variant="outline" className="w-full">
                  Go to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
