"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api-client"

import { RevShareTable } from "@/components/revshare/revshare-table"

interface PriceListNiche {
    id: number
    name: string
    niche_name?: string
    categoryId?: string | number
}

interface NichesResponse {
    niches: PriceListNiche[]
}

const ELOCAL_VERSIONS = [
    { value: "247", label: "24/7" },
    { value: "sat", label: "Sat" },
    { value: "sun", label: "Sun" },
]

export function PriceListDashboard() {
    const [niches, setNiches] = useState<PriceListNiche[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

    useEffect(() => {
        const fetchNiches = async () => {
            try {
                const response = await api.get<NichesResponse>("/niches?limit=1000&status=true")
                setNiches(response.niches)
            } catch (error) {
                console.error("Failed to fetch niches for price lists:", error)
            }
        }

        fetchNiches()
    }, [])

    return (
        <SidebarProvider
            style={
                {

                    "--header-height": "calc(var(--spacing) * 12)",
                } as CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">

                        {/* Breadcrumb and Selects Row */}
                        <div className="px-4 py-3 lg:px-6 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600/80">
                                <Link href="/" className="hover:text-gray-700 transition-colors">
                                    Dashboard
                                </Link>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-gray-400">eLocal Price Lists</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Select
                                    value={selectedCategoryId ?? undefined}
                                    onValueChange={(value) => setSelectedCategoryId(value)}
                                >
                                    <SelectTrigger className="w-[200px] h-9">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {niches
                                            .filter((niche) => niche.categoryId != null)
                                            .map((niche) => (
                                                <SelectItem
                                                    key={niche.id}
                                                    value={String(niche.categoryId)}
                                                >
                                                    {niche.niche_name || niche.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={selectedVersion ?? undefined}
                                    onValueChange={setSelectedVersion}
                                >
                                    <SelectTrigger className="w-[120px] h-9">
                                        <SelectValue placeholder="Version" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ELOCAL_VERSIONS.map((version) => (
                                            <SelectItem
                                                key={version.value}
                                                value={version.value}
                                            >
                                                {version.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-6 p-4 lg:p-6 lg:pt-0">
                            <RevShareTable
                                categoryId={selectedCategoryId}
                                version={selectedVersion}
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
