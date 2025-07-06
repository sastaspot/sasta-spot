import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2, Tv, Home } from "lucide-react"

const categories = [
  {
    id: "smartphones",
    name: "Smartphones",
    icon: Smartphone,
    count: 1250,
    description: "Latest smartphones from all major brands",
  },
  {
    id: "laptops",
    name: "Laptops",
    icon: Laptop,
    count: 890,
    description: "Gaming, business, and everyday laptops",
  },
  {
    id: "headphones",
    name: "Headphones",
    icon: Headphones,
    count: 650,
    description: "Wireless, wired, and gaming headphones",
  },
  {
    id: "smartwatches",
    name: "Smart Watches",
    icon: Watch,
    count: 420,
    description: "Fitness trackers and smartwatches",
  },
  {
    id: "cameras",
    name: "Cameras",
    icon: Camera,
    count: 380,
    description: "DSLR, mirrorless, and action cameras",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    count: 750,
    description: "Consoles, games, and accessories",
  },
  {
    id: "tv",
    name: "TVs",
    icon: Tv,
    count: 320,
    description: "Smart TVs and home entertainment",
  },
  {
    id: "home",
    name: "Home & Kitchen",
    icon: Home,
    count: 980,
    description: "Appliances and home essentials",
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Categories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse products by category to find the best deals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.id} href={`/category/${category.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                      <Badge variant="secondary">{category.count.toLocaleString()} products</Badge>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
