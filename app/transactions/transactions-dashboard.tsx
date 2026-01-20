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

import { TransactionsStats } from "@/components/transactions/transactions-stats"
import { TransactionsTable } from "@/components/transactions/transactions-table"
import { CalendarDatePicker } from "@/components/earnings/date-range-picker"

export function TransactionsDashboard() {
    const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>(() => {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return {
            from: monthStart,
            to: monthEnd,
        }
    })

    const [refreshToken, setRefreshToken] = useState(0)

    const handleTransactionsChanged = () => {
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

                        {/* Page Header with Breadcrumb */}
                        <div className="px-4 py-3 lg:px-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600/80">
                                    <Link href="/" className="hover:text-gray-700 transition-colors">
                                        Dashboard
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-gray-400">Transactions</span>
                                </div>

                                <CalendarDatePicker
                                    date={selectedDateRange}
                                    onDateSelect={setSelectedDateRange}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-6 p-4 lg:p-6 lg:pt-0">
                            <TransactionsStats dateRange={selectedDateRange} refreshToken={refreshToken} />
                            <TransactionsTable
                                dateRange={selectedDateRange}
                                onTransactionsChanged={handleTransactionsChanged}
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
