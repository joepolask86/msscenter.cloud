import { Metadata } from "next"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ServerTable } from "@/components/server/server-table"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
    title: "Server Manager | MSSCenter.Cloud",
    description: "Manage all your hosting dedicated servers.",
}

export default function ServerPage() {
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
                                <span className="text-gray-400">Servers</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-4 py-4 md:pt-0 md:gap-6 md:py-6 px-4 lg:px-6">
                            <ServerTable />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
