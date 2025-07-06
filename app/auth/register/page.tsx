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
import { Zap, UserPlus, Eye, EyeOff, Mail, Chrome } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Account created! Please check your email to verify your account.")
        setFormData({ name: "", email: "", password: "", confirmPassword: "" })
        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account",
        })
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider)
    try {
      // Redirect to social login endpoint
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
            <UserPlus className="w-5 h-5" />
            Join Sasta Spot - It's Free!
          </CardTitle>
          <p className="text-sm text-muted-foreground">Create your account and get unlimited price comparisons</p>
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

          {/* Email Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <Mail className="h-4 w-4" />
                <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  minLength={6}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Create Account with Email
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-green-700 dark:text-green-300">
              🎉 Free Account Benefits:
              <br />✅ Unlimited searches
              <br />✅ Price alerts
              <br />✅ Wishlist
              <br />✅ Search history
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
