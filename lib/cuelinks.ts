// CueLinks integration utility
export class CueLinksService {
  private apiKey: string
  private baseUrl = "https://api.cuelinks.com/v2"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Convert regular product URL to CueLinks affiliate URL
  async convertToAffiliateUrl(originalUrl: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/link/convert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: originalUrl,
          format: "json",
        }),
      })

      const data = await response.json()

      if (data.success && data.shortUrl) {
        return data.shortUrl
      }

      // Fallback to original URL if conversion fails
      return originalUrl
    } catch (error) {
      console.error("CueLinks conversion failed:", error)
      return originalUrl
    }
  }

  // Bulk convert multiple URLs
  async convertMultipleUrls(urls: string[]): Promise<Record<string, string>> {
    const results: Record<string, string> = {}

    // Process in batches to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize)
      const promises = batch.map(async (url) => {
        const affiliateUrl = await this.convertToAffiliateUrl(url)
        return { original: url, affiliate: affiliateUrl }
      })

      const batchResults = await Promise.all(promises)
      batchResults.forEach(({ original, affiliate }) => {
        results[original] = affiliate
      })
    }

    return results
  }

  // Track click for analytics
  async trackClick(affiliateUrl: string, metadata?: any): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/analytics/click`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: affiliateUrl,
          metadata: {
            source: "sasta-spot",
            timestamp: Date.now(),
            ...metadata,
          },
        }),
      })
    } catch (error) {
      console.error("Click tracking failed:", error)
    }
  }
}

// Initialize CueLinks service
export const cuelinks = new CueLinksService(process.env.CUELINKS_API_KEY || "")
