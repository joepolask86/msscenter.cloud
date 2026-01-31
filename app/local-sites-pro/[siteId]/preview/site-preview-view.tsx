"use client"

import { useState } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    ChevronRight,
    Monitor,
    Smartphone,
    Tablet,
    RefreshCw,
    ExternalLink,
    ArrowLeft,
    Download,
    Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type DeviceType = "desktop" | "tablet" | "mobile"

export function SitePreviewView({ params }: { params: { siteId: string } }) {
    const [device, setDevice] = useState<DeviceType>("desktop")
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Mock site data
    const siteData = {
        id: params.siteId,
        name: "Chicago Emergency Plumber",
        previewUrl: "https://example.com", // This would be the actual preview URL
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        // Simulate refresh
        setTimeout(() => {
            setIsRefreshing(false)
            // Reload iframe
            const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement
            if (iframe) {
                iframe.src = iframe.src
            }
        }, 500)
    }

    const getDeviceDimensions = () => {
        switch (device) {
            case "mobile":
                return { width: "375px", height: "667px" }
            case "tablet":
                return { width: "768px", height: "1024px" }
            case "desktop":
            default:
                return { width: "100%", height: "100%" }
        }
    }

    const dimensions = getDeviceDimensions()

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
                    <div className="@container/main flex flex-1 flex-col gap-0">
                        {/* Breadcrumb & Controls */}
                        <div className="px-4 py-3 lg:px-6 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Link href="/local-sites-pro" className="hover:text-foreground transition-colors">
                                        Local Sites Pro
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <Link href={`/local-sites-pro/${params.siteId}/details`} className="hover:text-foreground transition-colors">
                                        {siteData.name}
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-foreground font-medium">Preview</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/local-sites-pro/${params.siteId}/details`}>
                                        <Button variant="outline" size="sm">
                                            <ArrowLeft className="h-4 w-4" />
                                            Back to Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Preview Controls */}
                        <div className="px-4 py-2 lg:px-6 border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                                {/* Device Toggle */}
                                <Tabs value={device} onValueChange={(value) => setDevice(value as DeviceType)}>
                                    <TabsList>
                                        <TabsTrigger value="desktop" className="gap-2">
                                            <Monitor className="h-4 w-4" />
                                            Desktop
                                        </TabsTrigger>
                                        <TabsTrigger value="tablet" className="gap-2">
                                            <Tablet className="h-4 w-4" />
                                            Tablet
                                        </TabsTrigger>
                                        <TabsTrigger value="mobile" className="gap-2">
                                            <Smartphone className="h-4 w-4" />
                                            Mobile
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                                        Refresh
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => window.open(siteData.previewUrl, "_blank")}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Open in New Tab
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="flex-1 flex items-center justify-center p-0 lg:p-0 bg-muted/20">
                            <Card
                                className="overflow-hidden py-0 rounded-none shadow-2xl transition-all duration-300"
                                style={{
                                    width: dimensions.width,
                                    height: device === "desktop" ? "calc(100vh - 195px)" : dimensions.height,
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                }}
                            >
                                <iframe
                                    id="preview-iframe"
                                    src={siteData.previewUrl}
                                    className="w-full h-full border-0"
                                    title="Site Preview"
                                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                />
                            </Card>
                        </div>

                        {/* Info Bar */}
                        <div className="px-4 py-2 lg:px-6 border-t bg-muted/30">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <span>Viewing: <span className="font-medium text-foreground">{device.charAt(0).toUpperCase() + device.slice(1)}</span></span>
                                    <span>•</span>
                                    <span>Resolution: <span className="font-medium text-foreground">{dimensions.width} × {dimensions.height}</span></span>
                                </div>
                                <div>
                                    <span className="text-green-600 dark:text-green-400">● Live Preview</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
