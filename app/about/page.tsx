import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Zap, Award, TrendingDown } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Sasta Spot</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to help Indian consumers find the cheapest deals across multiple platforms, saving time
            and money on every purchase. Because every rupee saved is a rupee earned!
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To democratize price comparison in India and help consumers make informed purchasing decisions by
                  finding the cheapest deals available.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-4">Our Team</h3>
                <p className="text-muted-foreground">
                  A dedicated team of Indian developers and data analysts working tirelessly to bring you the best deals
                  from across the internet.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-4">Our Values</h3>
                <p className="text-muted-foreground">
                  Transparency, accuracy, and a user-first approach. We believe in helping Indians save money on every
                  purchase.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Sasta Spot by the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10L+</div>
              <div className="text-muted-foreground">Products Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Partner Stores</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1L+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">₹10Cr+</div>
              <div className="text-muted-foreground">Money Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sasta Spot */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why We Built Sasta Spot</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">The Problem</h3>
                <p className="text-muted-foreground mb-6">
                  Indian consumers were spending hours comparing prices across different e-commerce platforms, often
                  missing out on the best deals. With so many options available - Amazon, Flipkart, Myntra, Ajio, Croma,
                  and more - it became impossible to manually check every site.
                </p>
                <h3 className="text-2xl font-semibold mb-4">Our Solution</h3>
                <p className="text-muted-foreground">
                  Sasta Spot automates this entire process. Search once, and we'll instantly compare prices from all
                  major Indian e-commerce sites, highlighting the cheapest deals so you can save money on every
                  purchase.
                </p>
              </div>
              <div className="bg-muted p-8 rounded-2xl">
                <TrendingDown className="w-16 h-16 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">Average Savings</h4>
                <div className="text-3xl font-bold text-primary mb-2">₹2,500</div>
                <p className="text-sm text-muted-foreground">per purchase when using Sasta Spot</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
