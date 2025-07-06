"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, Users, Plus, Edit, Trash2, Eye, Globe, Link, Settings, AlertTriangle, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalSites: 0,
    totalSearches: 0,
    totalAffiliateClicks: 0,
    revenue: 0,
  })
  const [sites, setSites] = useState([])
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [systemSettings, setSystemSettings] = useState({
    scrapingInterval: 30,
    maxConcurrentRequests: 5,
    requestTimeout: 10,
    retryAttempts: 3,
    cacheDuration: 1,
    maxCacheSize: 100,
  })
  const [loading, setLoading] = useState(true)
  const [newSite, setNewSite] = useState({
    name: "",
    baseUrl: "",
    searchUrl: "",
    selectors: {
      title: "",
      price: "",
      image: "",
      rating: "",
      availability: "",
    },
    affiliateId: "",
    isActive: true,
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsRes, sitesRes, settingsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/sites"),
        fetch("/api/admin/settings"),
      ])

      const statsData = await statsRes.json()
      const sitesData = await sitesRes.json()
      const settingsData = await settingsRes.json()

      setStats(statsData)
      setSites(sitesData.sites || [])
      setMaintenanceMode(settingsData.maintenanceMode || false)
      setSystemSettings({ ...systemSettings, ...settingsData.system })
    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleMaintenanceMode = async () => {
    try {
      const response = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !maintenanceMode }),
      })

      if (response.ok) {
        setMaintenanceMode(!maintenanceMode)
        toast({
          title: maintenanceMode ? "Maintenance Mode Disabled" : "Maintenance Mode Enabled",
          description: maintenanceMode
            ? "Sasta Spot is now live for all users"
            : "Sasta Spot is now in maintenance mode",
        })
      }
    } catch (error) {
      console.error("Error toggling maintenance mode:", error)
      toast({
        title: "Error",
        description: "Failed to toggle maintenance mode",
        variant: "destructive",
      })
    }
  }

  const handleAddSite = async () => {
    try {
      const response = await fetch("/api/admin/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSite),
      })

      if (response.ok) {
        const result = await response.json()
        setSites([...sites, result.site])
        setNewSite({
          name: "",
          baseUrl: "",
          searchUrl: "",
          selectors: {
            title: "",
            price: "",
            image: "",
            rating: "",
            availability: "",
          },
          affiliateId: "",
          isActive: true,
        })
        toast({
          title: "Success",
          description: "E-commerce site added successfully to Sasta Spot",
        })
      }
    } catch (error) {
      console.error("Error adding site:", error)
      toast({
        title: "Error",
        description: "Failed to add site",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSite = async (siteId: string) => {
    try {
      await fetch(`/api/admin/sites/${siteId}`, {
        method: "DELETE",
      })
      setSites(sites.filter((s) => s.id !== siteId))
      toast({
        title: "Success",
        description: "Site removed from Sasta Spot successfully",
      })
    } catch (error) {
      console.error("Error deleting site:", error)
      toast({
        title: "Error",
        description: "Failed to delete site",
        variant: "destructive",
      })
    }
  }

  const handleToggleSite = async (siteId: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/sites/${siteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      setSites(sites.map((s) => (s.id === siteId ? { ...s, isActive } : s)))
      toast({
        title: "Success",
        description: `Site ${isActive ? "enabled" : "disabled"} successfully`,
      })
    } catch (error) {
      console.error("Error updating site:", error)
      toast({
        title: "Error",
        description: "Failed to update site",
        variant: "destructive",
      })
    }
  }

  const saveSystemSettings = async () => {
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemSettings }),
      })
      toast({
        title: "Success",
        description: "Sasta Spot settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sasta Spot Admin</h1>
              <p className="text-muted-foreground">Manage your price comparison platform</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={maintenanceMode ? "destructive" : "outline"} onClick={toggleMaintenanceMode}>
              <Settings className="w-4 h-4 mr-2" />
              {maintenanceMode ? "Disable Maintenance" : "Enable Maintenance"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add E-commerce Site
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New E-commerce Site to Sasta Spot</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        placeholder="Amazon, Flipkart, Myntra, etc."
                        value={newSite.name}
                        onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="baseUrl">Base URL</Label>
                      <Input
                        id="baseUrl"
                        placeholder="https://amazon.in"
                        value={newSite.baseUrl}
                        onChange={(e) => setNewSite({ ...newSite, baseUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="searchUrl">Search URL Pattern</Label>
                    <Input
                      id="searchUrl"
                      placeholder="https://amazon.in/s?k={query}"
                      value={newSite.searchUrl}
                      onChange={(e) => setNewSite({ ...newSite, searchUrl: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>CSS Selectors for Data Extraction</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        placeholder="Title selector"
                        value={newSite.selectors.title}
                        onChange={(e) =>
                          setNewSite({
                            ...newSite,
                            selectors: { ...newSite.selectors, title: e.target.value },
                          })
                        }
                      />
                      <Input
                        placeholder="Price selector"
                        value={newSite.selectors.price}
                        onChange={(e) =>
                          setNewSite({
                            ...newSite,
                            selectors: { ...newSite.selectors, price: e.target.value },
                          })
                        }
                      />
                      <Input
                        placeholder="Image selector"
                        value={newSite.selectors.image}
                        onChange={(e) =>
                          setNewSite({
                            ...newSite,
                            selectors: { ...newSite.selectors, image: e.target.value },
                          })
                        }
                      />
                      <Input
                        placeholder="Rating selector"
                        value={newSite.selectors.rating}
                        onChange={(e) =>
                          setNewSite({
                            ...newSite,
                            selectors: { ...newSite.selectors, rating: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="affiliateId">Affiliate ID</Label>
                    <Input
                      id="affiliateId"
                      placeholder="Your affiliate ID for this site"
                      value={newSite.affiliateId}
                      onChange={(e) => setNewSite({ ...newSite, affiliateId: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={newSite.isActive}
                      onCheckedChange={(checked) => setNewSite({ ...newSite, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <Button onClick={handleAddSite} className="w-full">
                    Add Site to Sasta Spot
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Maintenance Mode Alert */}
        {maintenanceMode && (
          <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Maintenance mode is currently enabled. Only admins can access Sasta Spot.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Sites</p>
                  <p className="text-2xl font-bold">{stats.totalSites}</p>
                </div>
                <Globe className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Searches</p>
                  <p className="text-2xl font-bold">{stats.totalSearches.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Affiliate Clicks</p>
                  <p className="text-2xl font-bold">{stats.totalAffiliateClicks.toLocaleString()}</p>
                </div>
                <Link className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="sites" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sites">E-commerce Sites</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="sites">
            <Card>
              <CardHeader>
                <CardTitle>E-commerce Sites Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site Name</TableHead>
                      <TableHead>Base URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Affiliate ID</TableHead>
                      <TableHead>Last Scraped</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading sites...
                        </TableCell>
                      </TableRow>
                    ) : sites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No e-commerce sites configured. Add your first site to start finding cheap deals on Sasta
                          Spot.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sites.map((site) => (
                        <TableRow key={site.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Globe className="w-5 h-5 text-muted-foreground" />
                              <span className="font-medium">{site.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{site.baseUrl}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={site.isActive}
                                onCheckedChange={(checked) => handleToggleSite(site.id, checked)}
                              />
                              <Badge variant={site.isActive ? "default" : "secondary"}>
                                {site.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{site.affiliateId || "Not set"}</TableCell>
                          <TableCell>{site.lastScraped || "Never"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteSite(site.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Sasta Spot Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">User management features</p>
                  <p className="text-sm text-muted-foreground">
                    View and manage Sasta Spot user accounts, activity, and savings
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Sasta Spot Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Search Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Search analytics chart</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Savings Generated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">User savings chart</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sasta Spot System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Maintenance Mode</h3>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label>Enable Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            When enabled, only admins can access Sasta Spot
                          </p>
                        </div>
                        <Switch checked={maintenanceMode} onCheckedChange={toggleMaintenanceMode} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Price Scraping Settings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Scraping Interval (minutes)</Label>
                          <Input
                            type="number"
                            value={systemSettings.scrapingInterval}
                            onChange={(e) =>
                              setSystemSettings({
                                ...systemSettings,
                                scrapingInterval: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Max Concurrent Requests</Label>
                          <Input
                            type="number"
                            value={systemSettings.maxConcurrentRequests}
                            onChange={(e) =>
                              setSystemSettings({
                                ...systemSettings,
                                maxConcurrentRequests: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Request Timeout (seconds)</Label>
                          <Input
                            type="number"
                            value={systemSettings.requestTimeout}
                            onChange={(e) =>
                              setSystemSettings({
                                ...systemSettings,
                                requestTimeout: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Retry Attempts</Label>
                          <Input
                            type="number"
                            value={systemSettings.retryAttempts}
                            onChange={(e) =>
                              setSystemSettings({
                                ...systemSettings,
                                retryAttempts: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Cache Settings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cache Duration (hours)</Label>
                          <Input
                            type="number"
                            value={systemSettings.cacheDuration}
                            onChange={(e) =>
                              setSystemSettings({
                                ...systemSettings,
                                cacheDuration: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Max Cache Size (MB)</Label>
                          <Input
                            type="number"
                            value={systemSettings.maxCacheSize}
                            onChange={(e) =>
                              setSystemSettings({
                                ...systemSettings,
                                maxCacheSize: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={saveSystemSettings}>Save Sasta Spot Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
