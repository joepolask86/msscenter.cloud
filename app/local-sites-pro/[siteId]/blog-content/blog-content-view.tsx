"use client"

import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import { BlogGenerator } from "@/components/blog/blog-generator"

export function BlogContentView({ params }: { params: { siteId: string } }) {
    // Mock data - will be replaced with real API calls
    const siteData = {
        id: params.siteId,
        name: "Chicago Emergency Plumber",
        researchProjectId: "proj_123", // Link to parent research project
    }

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
                        {/* Breadcrumb */}
                        <div className="px-4 py-3 lg:px-6 border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Link href="/local-sites-pro" className="hover:text-foreground transition-colors">
                                        Local Sites Pro
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <Link href={`/local-sites-pro/${params.siteId}`} className="hover:text-foreground transition-colors">
                                        {siteData.name}
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-foreground font-medium">Blog Content</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2">Blog Content</h1>
                                <p className="text-sm text-muted-foreground">
                                    Generate and manage SEO-optimized blog posts for your site
                                </p>
                            </div>

                            {/* Blog Generator Component */}
                            <BlogGenerator
                                siteId={params.siteId}
                                researchProjectId={siteData.researchProjectId}
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
