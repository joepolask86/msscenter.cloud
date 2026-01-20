"use client"

import { useState } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"

import { ElocalChart } from "@/components/elocal/elocal-chart"
import { ElocalStats } from "@/components/elocal/elocal-stats"
import { CampaignsTable } from "@/components/elocal/campaigns-table"
import { CalendarDatePicker } from "@/components/earnings/date-range-picker"

export function ElocalDashboard() {
    const getInitialDateRange = () => {
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth()

        const from = new Date(year, month, 1)
        const to = new Date(year, month + 1, 0)

        return { from, to }
    }

    const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>(getInitialDateRange())

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
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600/80">
                                    <Link href="/" className="hover:text-gray-700 transition-colors">
                                        Dashboard
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-gray-400">eLocal Overview</span>
                                </div>

                                <CalendarDatePicker
                                    date={selectedDateRange}
                                    numberOfMonths={2}
                                    onDateSelect={setSelectedDateRange}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-8 p-4 lg:p-6 lg:pt-0">
                            <ElocalChart dateRange={selectedDateRange} />
                            <ElocalStats dateRange={selectedDateRange} />
                            <CampaignsTable dateRange={selectedDateRange} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
