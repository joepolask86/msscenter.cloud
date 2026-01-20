import { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardStatsCards } from "@/components/dashboard/stats-cards"
import { IncomingCallsChart } from "@/components/dashboard/incoming-calls-chart"
import { ElocalOverview } from "@/components/dashboard/elocal-overview"
import { LatestCampaigns } from "@/components/dashboard/latest-campaigns"
import { TopNicheBuilds } from "@/components/dashboard/top-niche-builds"

export const metadata: Metadata = {
    title: "Dashboard | MSSCenter.Cloud",
    description: "MSSCenter Dashboard - Manage your campaigns, calls, and earnings",
}

export default function DashboardPage() {
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
                        <div className="flex flex-col gap-6 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                            {/* Stats Cards Row */}
                            <DashboardStatsCards />

                            {/* Incoming Calls Chart */}
                            <IncomingCallsChart />

                            {/* eLocal Overview Section */}
                            <ElocalOverview />

                            {/* Latest Campaigns and Top Niche Builds Row */}
                            <div className="grid gap-4 lg:grid-cols-3">
                                <LatestCampaigns />
                                <TopNicheBuilds />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}