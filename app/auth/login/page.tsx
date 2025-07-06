"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Zap, User, Eye, EyeOff, Chrome, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Welcome back!",
          description: "You now have unlimited searches on Sasta Spot",
        })
        router.push("/")
        window.location.reload()
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider)
    try {
      window.location.href = `/api/auth/social/${provider}`
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to connect with ${provider}`,
        variant: "destructive",
      })
      setSocialLoading("")
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
          <CardTitle className="flex items-center justify-center gap-2">
            <User className="w-5 h-5" />
            Sign In for Unlimited Searches
          </CardTitle>
          <p className="text-sm text-muted-foreground">Get unlimited price comparisons and save more money!</p>
        </CardHeader>
        <CardContent>
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading === "google"}
            >
              {socialLoading === "google" ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : (
                <Chrome className="w-4 h-4 mr-2" />
              )}
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => handleSocialLogin("facebook")}
              disabled={socialLoading === "facebook"}
            >
              {socialLoading === "facebook" ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : (
                <div className="w-4 h-4 mr-2 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                  f
                </div>
              )}
              Continue with Facebook
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Sign In with Email
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              ✨ Free users: 5 searches per day
              <br />🚀 Registered users: Unlimited searches
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
