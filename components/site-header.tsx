"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"
import { NotificationDrawer } from "./notification-drawer"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/campaigns": "Campaigns",
  "/niches": "Niches",
  "/elocal": "eLocal Calls",
  "/elocal-reports": "eLocal Reports",
  "/elocal-category": "eLocal Categories",
  "/earnings": "Earnings",
  "/transactions": "Transactions",
  "/server": "Hosting Server",
  "/domains": "Domains",
  "/price-lists": "Price Lists",
  "/sitemap-scraper": "Sitemap Scraper",
  "/brand-finder": "Brand Backlink Finder",
  "/settings": "Settings",
}

export function SiteHeader() {
  const pathname = usePathname()

  // Handle dynamic routes
  let pageTitle = pageTitles[pathname]

  // Check for campaign details page
  if (!pageTitle && pathname.startsWith("/campaigns/")) {
    const pathParts = pathname.split("/")

    // /campaigns/[id] - Campaign Details
    if (pathParts.length === 3 && pathParts[2]) {
      pageTitle = "Campaign Details"
    }

    // /campaigns/taskdetails/[id] - Campaign Tasks
    if (pathParts.length === 4 && pathParts[2] === "taskdetails") {
      pageTitle = "Campaign Tasks"
    }
  }

  // Default to Dashboard if no match
  if (!pageTitle) {
    pageTitle = "Dashboard"
  }

  return (
    <header className="sticky top-0 z-40 bg-background flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 mt-2"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-3">
          <NotificationDrawer />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
