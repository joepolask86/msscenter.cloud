"use client"

import { useState } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChevronRight, Globe, Plus, Rocket, Settings, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateSiteDialog } from "@/components/local-sites/create-site-dialog"
import { EditSiteDialog } from "@/components/local-sites/edit-site-dialog"

export function LocalSitesView() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedSite, setSelectedSite] = useState<any>(null)

    // Mock data - will be replaced with real API calls
    const sites = [
        {
            id: "1",
            name: "Chicago Plumber",
            domain: "emergency-plumber-chicago.com",
            status: "built",
            pages: 12,
            template: "Plumber V1",
            deployed: "2 days ago",
            websiteName: "Chicago Emergency Plumber",
            companyName: "ABC Plumbing",
            phoneNumber: "(312) 555-0123",
            city: "Chicago",
            state: "IL",
            country: "United States",
        },
        {
            id: "2",
            name: "Miami Roofer",
            domain: null,
            status: "draft",
            pages: 5,
            template: "Roofing V2",
            created: "Just now",
        },
        {
            id: "32",
            name: "Electrician Dallas TX",
            domain: null,
            status: "draft",
            pages: 5,
            template: "Electrician V1",
            created: "Just now",
        },
    ]

    const handleCreateSite = (data: any) => {
        console.log("Creating site with data:", data)
        // TODO: Navigate to site builder page
        // router.push(`/local-sites-pro/${newSiteId}/builder`)
    }

    const handleUpdateSite = (data: any) => {
        console.log("Updating site with data:", data)
        // TODO: Update sites list or invalidate query
    }

    const openEditDialog = (site: any) => {
        setSelectedSite(site)
        setEditDialogOpen(true)
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
                                    <Link href="/" className="hover:text-foreground transition-colors">
                                        Dashboard
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-foreground font-medium">Local Sites Pro</span>
                                </div>
                                <Button onClick={() => setCreateDialogOpen(true)} className="cursor-pointer">
                                    <Plus className="h-4 w-4" />
                                    Build New Site
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header */}
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Manage your entity-optimized lead generation sites
                                </p>
                            </div>

                            {/* Sites Grid */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {sites.map((site) => (
                                    <Card key={site.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">{site.name}</CardTitle>
                                                <Badge
                                                    variant={site.status === "built" ? "default" : "secondary"}
                                                    className={site.status === "built" ? "bg-green-700 hover:bg-green-600" : ""}
                                                >
                                                    {site.status === "built" ? "Built" : "Draft"}
                                                </Badge>
                                            </div>
                                            <CardDescription>
                                                {site.domain || "Not deployed yet"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Pages:</span>
                                                    <span className="font-medium text-foreground">{site.pages}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Template:</span>
                                                    <span className="font-medium text-foreground">{site.template}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>{site.status === "live" ? "Deployed:" : "Created:"}</span>
                                                    <span className="font-medium text-foreground">
                                                        {site.status === "live" ? site.deployed : site.created}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between gap-2 px-4">
                                            {site.status === "built" ? (
                                                <>
                                                    <div className="flex flex-wrap w-full justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="cursor-pointer"
                                                            onClick={() => openEditDialog(site)}
                                                        >
                                                            <Settings className="h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                        <Link href={`/local-sites-pro/${site.id}/details`}>
                                                            <Button variant="outline" size="sm" className="w-full cursor-pointer">
                                                                <Eye className="h-3 w-3" />
                                                                Details
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-wrap w-full justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        onClick={() => openEditDialog(site)}
                                                    >
                                                        <Settings className="h-3 w-3" />
                                                        Edit
                                                    </Button>
                                                    <Link href={`/local-sites-pro/${site.id}/details`}>
                                                        <Button variant="outline" size="sm" className=" cursor-pointer">
                                                            <Eye className="h-3 w-3" />
                                                            Details
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/local-sites-pro/${site.id}/builder`}>
                                                        <Button size="sm" className="cursor-pointer">
                                                            Start Building
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}

                                {/* Empty State / Create New Card */}
                                {sites.length === 0 && (
                                    <Card
                                        className="border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
                                        onClick={() => setCreateDialogOpen(true)}
                                    >
                                        <CardContent className="flex flex-col items-center justify-center py-12">
                                            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="font-semibold mb-2">No sites yet</h3>
                                            <p className="text-sm text-muted-foreground text-center mb-4">
                                                Create your first entity-optimized site
                                            </p>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Build New Site
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>

            {/* Create Site Dialog */}
            <CreateSiteDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSubmit={handleCreateSite}
            />

            {/* Edit Site Dialog */}
            <EditSiteDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                site={selectedSite}
                onUpdated={handleUpdateSite}
            />
        </SidebarProvider>
    )
}
