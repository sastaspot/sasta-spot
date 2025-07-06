import { NextResponse } from "next/server"
import { cuelinks } from "@/lib/cuelinks"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.trim() === "") {
    return NextResponse.json({
      products: [],
      total: 0,
      query: query || "",
      message: "Please enter a search term",
    })
  }

  try {
    // Get all active sites from database
    const activeSites = await getActiveSites()

    if (activeSites.length === 0) {
      return NextResponse.json({
        products: [],
        total: 0,
        query: query,
        message: "No e-commerce sites configured. Please contact administrator.",
      })
    }

    // Scrape all sites concurrently
    const scrapePromises = activeSites.map((site) => scrapeProductsFromSite(site, query))
    const results = await Promise.allSettled(scrapePromises)

    // Combine and process results
    const allProducts = []
    const allUrls: string[] = []

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.products) {
        const siteProducts = result.value.products.map((product) => ({
          ...product,
          source: activeSites[index].name,
          originalUrl: product.originalUrl,
        }))
        allProducts.push(...siteProducts)

        // Collect all URLs for bulk affiliate conversion
        siteProducts.forEach((product) => {
          allUrls.push(product.originalUrl)
        })
      }
    })

    // Convert all URLs to CueLinks affiliate URLs in bulk
    const affiliateUrls = await cuelinks.convertMultipleUrls(allUrls)

    // Update products with affiliate URLs
    const productsWithAffiliateUrls = allProducts.map((product) => ({
      ...product,
      affiliateUrl: affiliateUrls[product.originalUrl] || product.originalUrl,
    }))

    // Sort by relevance and price
    const sortedProducts = productsWithAffiliateUrls.sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      return a.price - b.price
    })

    // Group similar products and find best deals
    const groupedProducts = groupSimilarProducts(sortedProducts)

    return NextResponse.json({
      products: groupedProducts,
      total: groupedProducts.length,
      query: query,
      scrapedSites: activeSites.length,
      totalResults: allProducts.length,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      {
        products: [],
        total: 0,
        query: query,
        error: "Failed to search products. Please try again.",
      },
      { status: 500 },
    )
  }
}

// Helper functions
async function getActiveSites() {
  return [
    {
      id: "1",
      name: "Amazon",
      baseUrl: "https://amazon.in",
      searchUrl: "https://amazon.in/s?k={query}",
      selectors: {
        title: "[data-component-type='s-search-result'] h2 a span",
        price: ".a-price-whole",
        image: "[data-component-type='s-search-result'] img",
        rating: ".a-icon-alt",
      },
      isActive: true,
    },
    {
      id: "2",
      name: "Flipkart",
      baseUrl: "https://flipkart.com",
      searchUrl: "https://flipkart.com/search?q={query}",
      selectors: {
        title: "._4rR01T",
        price: "._30jeq3",
        image: "._396cs4",
        rating: "._3LWZlK",
      },
      isActive: true,
    },
    // Add more sites
  ]
}

async function scrapeProductsFromSite(site: any, query: string) {
  try {
    const searchUrl = site.searchUrl.replace("{query}", encodeURIComponent(query))

    // Mock implementation - replace with actual scraping
    const mockProducts = [
      {
        id: `${site.name}-1`,
        title: `${query} - Premium Model`,
        price: Math.floor(Math.random() * 50000) + 10000,
        originalPrice: Math.floor(Math.random() * 60000) + 15000,
        image: "/placeholder.svg?height=200&width=200",
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 1000) + 100,
        originalUrl: `${site.baseUrl}/product/${Math.random().toString(36).substr(2, 9)}`,
        availability: "In Stock",
        relevanceScore: Math.random() * 100,
      },
    ]

    return { products: mockProducts, success: true }
  } catch (error) {
    console.error(`Error scraping ${site.name}:`, error)
    return { products: [], success: false, error: error.message }
  }
}

function groupSimilarProducts(products: any[]) {
  const groups = new Map()

  products.forEach((product) => {
    const normalizedTitle = product.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
    const key = normalizedTitle.split(" ").slice(0, 3).join(" ")

    if (!groups.has(key)) {
      groups.set(key, {
        id: `group-${groups.size + 1}`,
        title: product.title,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        prices: [],
      })
    }

    groups.get(key).prices.push({
      platform: product.source,
      price: product.price,
      originalPrice: product.originalPrice,
      url: product.affiliateUrl, // Use CueLinks affiliate URL
      availability: product.availability,
    })
  })

  return Array.from(groups.values()).map((group) => ({
    ...group,
    prices: group.prices.sort((a, b) => a.price - b.price),
  }))
}
