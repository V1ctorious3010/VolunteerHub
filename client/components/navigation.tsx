"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mock auth state - in real app, this would come from auth context
  const isAuthenticated =
    pathname.startsWith("/dashboard") || pathname.startsWith("/events/") || pathname.startsWith("/profile")
  const userRole = pathname.includes("manager") ? "manager" : pathname.includes("admin") ? "admin" : "volunteer"

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">VolunteerHub</span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                <Button asChild variant={pathname.startsWith("/dashboard") ? "secondary" : "ghost"} size="sm">
                  <Link href={`/dashboard/${userRole}`}>Dashboard</Link>
                </Button>
                <Button asChild variant={pathname.startsWith("/events") ? "secondary" : "ghost"} size="sm">
                  <Link href="/events">Events</Link>
                </Button>
                {userRole === "manager" && (
                  <Button asChild variant={pathname.startsWith("/manage") ? "secondary" : "ghost"} size="sm">
                    <Link href="/manage/events">Manage</Link>
                  </Button>
                )}
                {userRole === "admin" && (
                  <Button asChild variant={pathname.startsWith("/admin") ? "secondary" : "ghost"} size="sm">
                    <Link href="/admin/users">Admin</Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                  <Link href="/profile">Profile</Link>
                </Button>
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="hidden md:inline-flex">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href={`/dashboard/${userRole}`}>Dashboard</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/events">Events</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/profile">Profile</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="justify-start">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function Heart({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
