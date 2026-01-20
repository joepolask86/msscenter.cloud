import { Metadata } from "next"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import { CampaignDetailsSidebar } from "@/components/campaigns/campaign-details-sidebar"
import { CampaignDetailsContent } from "@/components/campaigns/campaign-details-content"

export const metadata: Metadata = {
    title: "Campaign Details | MSSCenter.Cloud",
    description: "View campaign details and analytics",
}

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params

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
                                <Link href="/campaigns" className="hover:text-gray-700 transition-colors">
                                    Campaigns
                                </Link>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-gray-400">Details</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col lg:flex-row gap-4 py-4 md:pt-0 md:gap-6 md:py-6 px-4 lg:px-6">
                            {/* Left Sidebar */}
                            <div className="w-full lg:w-80 shrink-0">
                                <CampaignDetailsSidebar campaignId={resolvedParams.id} />
                            </div>

                            {/* Main Content */}
                            <div className="flex-1">
                                <CampaignDetailsContent campaignId={resolvedParams.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
