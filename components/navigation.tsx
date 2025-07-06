"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CurrencySelector } from "@/components/currency-selector"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Deals", href: "/deals" },
  { name: "Categories", href: "/categories" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`
      setIsOpen(false)
    }
  }

  return (
    <nav
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2" aria-label="Sasta Spot Home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="font-bold text-xl">Sasta Spot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1 ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <CurrencySelector />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:flex bg-transparent hover:bg-accent focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Link href="/account">My Account</Link>
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 h-10 w-10"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]" id="mobile-menu">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Mobile Search */}
                <form onSubmit={handleMobileSearch} className="space-y-2">
                  <label htmlFor="mobile-search" className="text-sm font-medium">
                    Search Products
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="mobile-search"
                      type="search"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                      autoComplete="off"
                    />
                    <Button type="submit" size="sm" className="px-3">
                      <Search className="w-4 h-4" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </div>
                </form>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-3" role="navigation" aria-label="Mobile navigation">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-2 ${
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                      }`}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <Button
                  asChild
                  variant="outline"
                  className="w-fit bg-transparent hover:bg-accent focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Link href="/account" onClick={() => setIsOpen(false)}>
                    My Account
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
