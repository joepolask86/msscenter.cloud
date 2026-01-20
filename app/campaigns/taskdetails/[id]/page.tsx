import { Metadata } from "next"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChevronRight, Grid3x3 } from "lucide-react"
import { TaskDetailsSidebar } from "@/components/campaigns/task-details-sidebar"
import { TaskDetailsContent } from "@/components/campaigns/task-details-content"

export const metadata: Metadata = {
    title: "Campaign Tasks | MSSCenter.Cloud",
    description: "Manage all site to do list, offpage and base campaign details",
}

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
                        {/* Page Header */}
                        <div className="px-4 py-3 lg:px-6 space-y-2">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-sm text-gray-600/80">
                                <Link href="/" className="hover:text-gray-700 transition-colors">
                                    Dashboard
                                </Link>
                                <ChevronRight className="h-4 w-4" />
                                <Link href={`/campaigns/${resolvedParams.id}`} className="hover:text-gray-700 transition-colors">
                                    Campaign Details
                                </Link>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-gray-400">Tasks</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col lg:flex-row gap-4 py-4 md:pt-0 md:gap-6 md:py-6 px-4 lg:px-6">
                            {/* Left Sidebar */}
                            <div className="w-full lg:w-72 shrink-0">
                                <TaskDetailsSidebar campaignId={resolvedParams.id} />
                            </div>

                            {/* Main Content */}
                            <div className="flex-1">
                                <TaskDetailsContent campaignId={resolvedParams.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
