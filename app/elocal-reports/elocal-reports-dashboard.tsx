"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChevronRight, FileText } from "lucide-react"

import { ElocalReportStats } from "@/components/elocal/elocal-reports-stats"
import { ReportsTable } from "@/components/elocal/reports-table"
import { CalendarDatePicker } from "@/components/earnings/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api-client"
import type { Niche } from "@/lib/types"

export function ElocalReportsDashboard() {
    const getInitialDateRange = () => {
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth()

        const from = new Date(year, month, 1)
        const to = new Date(year, month + 1, 0)

        return { from, to }
    }

    const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>(getInitialDateRange)
    const [niches, setNiches] = useState<Niche[]>([])
    const [selectedNicheId, setSelectedNicheId] = useState<string | undefined>(undefined)
    const [refreshToken, setRefreshToken] = useState(0)

    useEffect(() => {
        const fetchNiches = async () => {
            try {
                const response = await api.get<{ niches: Niche[] }>("/niches?limit=100&status=true")
                setNiches(response.niches)
            } catch (error) {
                console.error("Failed to load niches for eLocal reports:", error)
            }
        }

                        fetchNiches()
    }, [])

    const handleCallsChanged = () => {
        setRefreshToken((prev) => prev + 1)
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

                        {/* Page Header with Breadcrumb and Controls */}
                        <div className="px-4 py-3 lg:px-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600/80">
                                    <Link href="/" className="hover:text-gray-700 transition-colors">
                                        Dashboard
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-gray-400">eLocal Reports</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CalendarDatePicker
                                        date={selectedDateRange}
                                        numberOfMonths={2}
                                        onDateSelect={setSelectedDateRange}
                                    />
                                    <Select
                                        value={selectedNicheId}
                                        onValueChange={setSelectedNicheId}
                                    >
                                        <SelectTrigger className="w-[180px] bg-white">
                                            <SelectValue placeholder="- Select Campaign -" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {niches.map((niche) => (
                                                <SelectItem key={niche.id} value={niche.id.toString()}>
                                                    {niche.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-8 p-4 lg:p-6 lg:pt-0">
                            <ElocalReportStats
                                dateRange={selectedDateRange}
                                nicheId={selectedNicheId}
                                refreshToken={refreshToken}
                            />
                            <ReportsTable
                                dateRange={selectedDateRange}
                                nicheId={selectedNicheId}
                                onCallsChanged={handleCallsChanged}
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
