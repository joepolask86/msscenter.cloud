import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CardTitle } from "@/components/ui/card"
import { SitemapScraperTool } from "@/components/tools/sitemap-scraper"

export const metadata: Metadata = {
    title: "Sitemap Scraper | MSSCenter.Cloud",
    description: "Get URLs from XML sitemaps.",
}

export default function SitemapScraperPage() {
    return (
        <SidebarProvider
            style={
                {
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        {/* Page Header with Breadcrumb */}
                        <div className="px-4 py-3 lg:px-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600/80">
                                <Link href="/" className="hover:text-gray-700 transition-colors">
                                    Dashboard
                                </Link>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-gray-400">Sitemap Scraper</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-4 py-4 md:pt-0 md:gap-6 md:py-3 px-4 lg:px-6">
                            <CardTitle className="text-lg font-medium  text-orange-500">Get URLs from XML sitemaps</CardTitle>
                            <SitemapScraperTool />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
