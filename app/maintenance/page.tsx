import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wrench, Clock, Mail, Zap } from "lucide-react"
import Link from "next/link"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl">Sasta Spot</span>
            </div>
            <Wrench className="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">We'll be back soon!</h1>
            <p className="text-muted-foreground">
              We're currently performing scheduled maintenance to bring you even better deals and faster search results.
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Expected downtime: 30 minutes</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Get notified when we're back</h3>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" type="email" />
                <Button className="bg-primary hover:bg-primary/90">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Follow us for updates:</p>
              <div className="flex justify-center gap-4">
                <Link href="#" className="text-primary hover:underline">
                  Twitter
                </Link>
                <Link href="#" className="text-primary hover:underline">
                  Facebook
                </Link>
                <Link href="#" className="text-primary hover:underline">
                  Instagram
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
