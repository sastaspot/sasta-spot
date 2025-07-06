"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Lock, Shield, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Password Change Instructions",
          description: "Check the instructions below to complete the password change",
        })

        // Show instructions
        alert(`Password Change Instructions:
        
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit ADMIN_PASSWORD variable  
3. Set new value to: ${passwordForm.newPassword}
4. Redeploy the project
5. Use new password for future logins

Your new password: ${passwordForm.newPassword}`)

        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to change password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground">Manage your Sasta Spot admin account</p>
          </div>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Admin Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    placeholder="Enter current password (default: admin123)"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    minLength={6}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    placeholder="Confirm new password"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Changing Password..." : "Change Password"}
                </Button>
              </form>

              <Alert className="mt-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> After changing password, you'll need to update the ADMIN_PASSWORD
                  environment variable in Vercel and redeploy the project.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Environment Variables Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Environment Variables Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Required Environment Variables:</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                  <div>
                    <strong>DATABASE_URL</strong> = Your Neon connection string
                  </div>
                  <div>
                    <strong>ADMIN_USERNAME</strong> = admin
                  </div>
                  <div>
                    <strong>ADMIN_PASSWORD</strong> = admin123 (change this!)
                  </div>
                  <div>
                    <strong>JWT_SECRET</strong> = your-random-secret-key
                  </div>
                  <div>
                    <strong>CUELINKS_API_KEY</strong> = your-cuelinks-api-key
                  </div>
                  <div>
                    <strong>NEXTAUTH_SECRET</strong> = your-nextauth-secret
                  </div>
                  <div>
                    <strong>NEXTAUTH_URL</strong> = https://sastaspot.vercel.app
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Go to Vercel Dashboard → Your Project → Settings → Environment Variables to update these values.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
