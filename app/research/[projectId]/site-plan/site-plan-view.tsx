"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    ChevronRight,
    FileText,
    Home,
    Layers,
    MapPin,
    Network,
    ArrowRight,
    CheckCircle2,
    Info,
    Download,
    Sparkles,
    Edit,
    Plus,
    Minus,
    X,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkGraph } from "@/components/research/link-graph"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SitePlanView({ params }: { params: { projectId: string } }) {
    const router = useRouter()
    const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)

    // Mock data - will be replaced with real API calls
    const [siteStructure, setSiteStructure] = useState({
        totalPages: 24,
        servicePages: 8,
        locationPages: 12,
        blogPosts: 3,
        homepageSectionCount: 8,
        internalLinks: 156,
        services: [
            { name: "Emergency Plumbing", entity: "Emergency Plumbing", targetPages: 3, priority: "high" },
            { name: "Water Heater Repair", entity: "Water Heater Repair", targetPages: 2, priority: "high" },
            { name: "Drain Cleaning", entity: "Drain Cleaning", targetPages: 2, priority: "medium" },
            { name: "Pipe Repair", entity: "Pipe Repair", targetPages: 2, priority: "medium" },
            { name: "Faucet Repair", entity: "Faucet Repair", targetPages: 1, priority: "medium" },
            { name: "Toilet Repair", entity: "Toilet Repair", targetPages: 1, priority: "low" },
            { name: "Sewer Line Repair", entity: "Sewer Line", targetPages: 1, priority: "low" },
            { name: "Water Line Repair", entity: "Water Line", targetPages: 1, priority: "low" },
        ],
        locations: [
            { name: "Chicago Downtown", slug: "chicago-downtown", serviceLinks: 8 },
            { name: "Lincoln Park", slug: "lincoln-park", serviceLinks: 8 },
            { name: "Wicker Park", slug: "wicker-park", serviceLinks: 6 },
            { name: "Logan Square", slug: "logan-square", serviceLinks: 6 },
            { name: "River North", slug: "river-north", serviceLinks: 5 },
            { name: "Gold Coast", slug: "gold-coast", serviceLinks: 5 },
            { name: "Lakeview", slug: "lakeview", serviceLinks: 4 },
            { name: "Bucktown", slug: "bucktown", serviceLinks: 4 },
            { name: "West Loop", slug: "west-loop", serviceLinks: 3 },
            { name: "South Loop", slug: "south-loop", serviceLinks: 3 },
            { name: "Old Town", slug: "old-town", serviceLinks: 2 },
            { name: "Ukrainian Village", slug: "ukrainian-village", serviceLinks: 2 },
        ],
        blogs: [
            { title: "How Much Does Emergency Plumbing Cost in Chicago?", entity: "Emergency Plumbing", type: "Cost Guide" },
            { title: "Signs You Need Water Heater Replacement", entity: "Water Heater Replacement", type: "Guide" },
            { title: "DIY vs Professional Drain Cleaning: What You Need to Know", entity: "Drain Cleaning", type: "Comparison" },
        ],
        sections: [
            { order: 1, name: "Hero", description: "Primary intent + CTA", required: true },
            { order: 2, name: "Trust Signals", description: "Experience, credentials, guarantees", required: true },
            { order: 3, name: "Core Services", description: "Top 8 entity-driven services", required: true },
            { order: 4, name: "Why Choose Us", description: "SERP-based differentiators", required: true },
            { order: 5, name: "Service Areas", description: "12 location links", required: true },
            { order: 6, name: "Process", description: "How it works (4 steps)", required: false },
            { order: 7, name: "FAQs", description: "Entity-driven questions", required: false },
            { order: 8, name: "Final CTA", description: "Conversion-focused", required: true },
        ],
        utilityPages: [
            {
                name: "About Us",
                type: "utility",
                sections: [
                    { name: "About Hero", slots: ["headline", "description"] },
                    { name: "About Content", slots: ["subheadline", "company_story"] },
                    { name: "Why Choose Us", slots: ["reused from homepage component"] },
                ]
            },
            {
                name: "Contact Us",
                type: "utility",
                sections: [
                    { name: "Contact Hero", slots: ["headline", "description"] },
                    { name: "Contact Form", slots: ["template-driven"] },
                ]
            },
            {
                name: "Privacy Policy",
                type: "legal",
                sections: [
                    { name: "Legal Header", slots: ["title", "last_updated"] },
                    { name: "Legal Content", slots: ["boilerplate_content"] },
                ]
            },
            {
                name: "Terms of Service",
                type: "legal",
                sections: [
                    { name: "Legal Header", slots: ["title", "last_updated"] },
                    { name: "Legal Content", slots: ["boilerplate_content"] },
                ]
            },
        ]
    })

    const handleGenerateBriefs = () => {
        router.push(`/research/${params.projectId}/content-briefs`)
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
                                    <Link href="/project-planner" className="hover:text-foreground transition-colors">
                                        Projects
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <Link href={`/research/${params.projectId}/overview`} className="hover:text-foreground transition-colors">
                                        Project #{params.projectId}
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-foreground font-medium">Site Structure</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setAdjustDialogOpen(true)}>
                                        <Edit className="h-4 w-4" />
                                        Adjust Structure
                                    </Button>
                                    <Button variant="default" size="sm" className="cursor-pointer">
                                        <Download className="h-4 w-4" />
                                        Export Plan
                                    </Button>
                                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-8 cursor-pointer" onClick={handleGenerateBriefs}>
                                        <Sparkles className="h-4 w-4" />
                                        Generate Content Briefs
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header Section */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-2">Site Structure</h1>
                                    <p className="text-sm text-muted-foreground">
                                        Entity-driven page hierarchy and internal linking strategy
                                    </p>
                                </div>
                            </div>

                            {/* Info Banner */}
                            <div className="flex gap-3 p-4 border border-foreground/10 rounded-lg bg-orange-300/10 text-foreground/70 text-sm">
                                <Info className="h-4 w-4 shrink-0 text-foreground/70" />
                                <p>
                                    This structure is based on <strong>Page Math</strong> analysis of your SERP competitors and extracted entities. Services, locations, and blog recommendations are derived from what's actually ranking, not guesswork.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                                        <FileText className="h-6 w-6 text-blue-500 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{siteStructure.totalPages}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Entity-driven pages
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            + {siteStructure.utilityPages.length} utility pages
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Service Pages</CardTitle>
                                        <Layers className="h-6 w-6 text-purple-500 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{siteStructure.servicePages}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Entity-driven services
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Location Pages</CardTitle>
                                        <MapPin className="h-6 w-6 text-green-500 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{siteStructure.locationPages}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Geographic coverage
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Internal Links</CardTitle>
                                        <Network className="h-6 w-6 text-orange-500 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{siteStructure.internalLinks}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Entity silo structure
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-6 group-data-horizontal/tabs:h-10">
                                    <TabsTrigger value="overview" className="text-md data-[state=active]:text-slate-700 shadow-none">Overview</TabsTrigger>
                                    <TabsTrigger value="services" className="text-md data-[state=active]:text-slate-700 shadow-none">Services</TabsTrigger>
                                    <TabsTrigger value="locations" className="text-md data-[state=active]:text-slate-700 shadow-none">Locations</TabsTrigger>
                                    <TabsTrigger value="homepage" className="text-md data-[state=active]:text-slate-700 shadow-none">Homepage</TabsTrigger>
                                    <TabsTrigger value="utility" className="text-md data-[state=active]:text-slate-700 shadow-none">Utility</TabsTrigger>
                                    <TabsTrigger value="linking" className="text-md data-[state=active]:text-slate-700 shadow-none">Internal Links</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-4 mt-4">
                                    {/* Site Hierarchy Visualization */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Network className="h-5 w-5 text-blue-500" />
                                                Site Hierarchy
                                            </CardTitle>
                                            <CardDescription>
                                                Entity-driven page structure with internal linking strategy
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {/* Homepage */}
                                                <div className="flex items-start gap-3 p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
                                                    <Home className="h-5 w-5 text-blue-500 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-blue-700 dark:text-blue-400">Homepage</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Links to: {siteStructure.servicePages} services, {siteStructure.locationPages} locations
                                                        </p>
                                                    </div>
                                                    <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                                                        Hub
                                                    </Badge>
                                                </div>

                                                {/* Services Layer */}
                                                <div className="ml-8 space-y-2">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                        <ArrowRight className="h-4 w-4" />
                                                        Service Pages ({siteStructure.servicePages})
                                                    </div>
                                                    <div className="grid gap-2 md:grid-cols-2">
                                                        {siteStructure.services.slice(0, 4).map((service, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 p-3 rounded-lg border bg-card text-sm">
                                                                <Layers className="h-4 w-4 text-purple-500" />
                                                                <span className="flex-1">{service.name}</span>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {service.targetPages} locations
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground ml-6">+ {siteStructure.servicePages - 4} more services</p>
                                                </div>

                                                {/* Locations Layer */}
                                                <div className="ml-16 space-y-2">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                        <ArrowRight className="h-4 w-4" />
                                                        Location Pages ({siteStructure.locationPages})
                                                    </div>
                                                    <div className="grid gap-2 md:grid-cols-3">
                                                        {siteStructure.locations.slice(0, 6).map((location, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg border bg-card text-xs">
                                                                <MapPin className="h-3 w-3 text-green-500" />
                                                                <span className="flex-1 truncate">{location.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground ml-6">+ {siteStructure.locationPages - 6} more locations</p>
                                                </div>

                                                {/* Blog Layer */}
                                                {siteStructure.blogPosts > 0 && (
                                                    <div className="ml-8 space-y-2">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                            <ArrowRight className="h-4 w-4" />
                                                            Blog Posts ({siteStructure.blogPosts})
                                                        </div>
                                                        <div className="space-y-2">
                                                            {siteStructure.blogs.map((blog, idx) => (
                                                                <div key={idx} className="flex items-center gap-2 p-3 rounded-lg border bg-card text-sm">
                                                                    <FileText className="h-4 w-4 text-orange-500" />
                                                                    <span className="flex-1">{blog.title}</span>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {blog.type}
                                                                    </Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Page Math Insights */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Page Math Insights</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">Service-Heavy Structure</p>
                                                    <p className="text-xs text-muted-foreground">SERP analysis shows 8 distinct service entities warrant dedicated pages</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">Strong Geographic Intent</p>
                                                    <p className="text-xs text-muted-foreground">12 location pages recommended based on service area mentions in top competitors</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">Minimal Blog Content</p>
                                                    <p className="text-xs text-muted-foreground">Only 3 informational posts detected in SERP - focus remains on service/transactional intent</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="services" className="space-y-4 mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Service Pages ({siteStructure.servicePages})</CardTitle>
                                            <CardDescription>
                                                Entity-driven service pages with priority ranking
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {siteStructure.services.map((service, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-sm font-bold text-purple-700 dark:text-purple-400">
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{service.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Entity: {service.entity} • Links to {service.targetPages} location pages
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            className={
                                                                service.priority === "high"
                                                                    ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                                                                    : service.priority === "medium"
                                                                        ? "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20"
                                                                        : "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
                                                            }
                                                        >
                                                            {service.priority} priority
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="locations" className="space-y-4 mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Location Pages ({siteStructure.locationPages})</CardTitle>
                                            <CardDescription>
                                                Geographic coverage with service cross-linking
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-3 md:grid-cols-2">
                                                {siteStructure.locations.map((location, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <MapPin className="h-4 w-4 text-green-500" />
                                                            <div>
                                                                <p className="font-medium text-sm">{location.name}</p>
                                                                <p className="text-xs text-muted-foreground">/{location.slug}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {location.serviceLinks} services
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="homepage" className="space-y-4 mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Homepage Section Structure</CardTitle>
                                            <CardDescription>
                                                SERP-derived section order optimized for conversion
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {siteStructure.sections.map((section) => (
                                                    <div key={section.order} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-700 dark:text-blue-400 shrink-0">
                                                            {section.order}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="font-medium">{section.name}</p>
                                                                {section.required && (
                                                                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">
                                                                        Required
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">{section.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="utility" className="space-y-4 mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Utility Pages ({siteStructure.utilityPages.length})</CardTitle>
                                            <CardDescription>
                                                Template-driven pages required for site completeness
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {siteStructure.utilityPages.map((page, idx) => (
                                                    <div key={idx} className="p-4 rounded-lg border bg-card">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <FileText className="h-5 w-5 text-blue-500" />
                                                            <div>
                                                                <p className="font-semibold text-lg">{page.name}</p>
                                                                <p className="text-xs text-muted-foreground">Template-driven • Not entity-optimized</p>
                                                            </div>
                                                        </div>
                                                        <div className="ml-8 space-y-2">
                                                            <p className="text-sm font-medium text-muted-foreground">Required Sections:</p>
                                                            {page.sections.map((section, sIdx) => (
                                                                <div key={sIdx} className="flex items-start gap-2 p-2 rounded bg-muted/50 text-sm">
                                                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                                                    <div className="flex-1">
                                                                        <p className="font-medium">{section.name}</p>
                                                                        <p className="text-xs text-muted-foreground">Slots: {section.slots.join(", ")}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-3 p-3 border border-orange-500/20 rounded-lg bg-orange-500/10 text-sm mt-4">
                                                <Info className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
                                                <p className="text-orange-900 dark:text-orange-200">
                                                    Utility pages use <strong>template-defined sections</strong> from the selected template config. Content is minimal and focused on business information rather than SEO entities.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="linking" className="space-y-4 mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Internal Linking Strategy</CardTitle>
                                            <CardDescription>
                                                Entity silo structure with {siteStructure.internalLinks} total links
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Interactive D3 Force Graph */}
                                            <LinkGraph
                                                servicePages={siteStructure.servicePages}
                                                locationPages={siteStructure.locationPages}
                                                blogPosts={siteStructure.blogPosts}
                                            />

                                            {/* Link Stats */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                <div className="p-3 rounded-lg border bg-card text-center">
                                                    <p className="text-2xl font-bold text-orange-500">{siteStructure.servicePages + siteStructure.locationPages}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">From Homepage</p>
                                                </div>
                                                <div className="p-3 rounded-lg border bg-card text-center">
                                                    <p className="text-2xl font-bold text-slate-500">{siteStructure.servicePages * 3}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">From Services</p>
                                                </div>
                                                <div className="p-3 rounded-lg border bg-card text-center">
                                                    <p className="text-2xl font-bold text-slate-500">{siteStructure.locationPages * 2}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">From Locations</p>
                                                </div>
                                                <div className="p-3 rounded-lg border bg-card text-center">
                                                    <p className="text-2xl font-bold text-foreground">{siteStructure.internalLinks}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Total Links</p>
                                                </div>
                                            </div>

                                            {/* Utility Pages Linking */}
                                            <div className="mt-6 p-4 rounded-lg border bg-blue-500/5">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <FileText className="h-5 w-5 text-blue-500" />
                                                    <h4 className="font-semibold">Utility Pages</h4>
                                                </div>
                                                <div className="space-y-2 ml-7">
                                                    {siteStructure.utilityPages.map((page, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            <span className="font-medium">{page.name}</span>
                                                            <span className="text-muted-foreground">→ Linked from footer navigation</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-3 ml-7">
                                                    Utility pages are accessible site-wide via footer links. Not part of entity silo structure.
                                                </p>
                                            </div>

                                            <div className="flex gap-3 p-4 border border-foreground/10 rounded-lg bg-orange-300/10 text-foreground/70 text-sm mt-4">
                                                <Info className="h-4 w-4 shrink-0 text-foreground/70" />
                                                <p>
                                                    All internal link anchors are <strong>entity-driven</strong> and vary naturally. No repetitive exact-match anchors.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </SidebarInset>

            {/* Adjust Structure Dialog */}
            <AdjustStructureDialog
                open={adjustDialogOpen}
                onOpenChange={setAdjustDialogOpen}
                siteStructure={siteStructure}
                onSave={(updated) => {
                    setSiteStructure(updated)
                    setAdjustDialogOpen(false)
                }}
            />
        </SidebarProvider>
    )
}

// Adjust Structure Dialog Component
function AdjustStructureDialog({
    open,
    onOpenChange,
    siteStructure,
    onSave
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    siteStructure: any
    onSave: (updated: any) => void
}) {
    const [servicePages, setServicePages] = useState(siteStructure.servicePages)
    const [locationPages, setLocationPages] = useState(siteStructure.locationPages)
    const [blogPosts, setBlogPosts] = useState(siteStructure.blogPosts)

    const handleSave = () => {
        const updated = {
            ...siteStructure,
            servicePages,
            locationPages,
            blogPosts,
            totalPages: 1 + servicePages + locationPages + blogPosts, // 1 for homepage
        }
        onSave(updated)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-primary text-lg">
                        <Edit className="h-5 w-5 text-orange-500" />
                        Adjust Site Structure
                    </DialogTitle>
                    <DialogDescription>
                        Manually override the AI-generated page recommendations based on your specific needs.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4 px-6 pb-2">
                    {/* Info Banner */}
                    <div className="flex gap-3 p-3 border border-orange-500/20 rounded-lg bg-orange-500/10 text-sm">
                        <Info className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
                        <p className="text-orange-900 dark:text-orange-200">
                            These recommendations are based on <strong>Page Math</strong> analysis of your SERP competitors. Adjust carefully to maintain entity coverage.
                        </p>
                    </div>

                    {/* Service Pages */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-purple-500" />
                                    Service Pages
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Dedicated pages for core service entities
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={() => setServicePages(Math.max(0, servicePages - 1))}
                                    disabled={servicePages <= 0}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    value={servicePages}
                                    onChange={(e) => setServicePages(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-20 text-center"
                                />
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={() => setServicePages(Math.min(50, servicePages + 1))}
                                    disabled={servicePages >= 50}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground pl-0">
                            Recommended: <strong>8-15 pages</strong> based on distinct service entities in SERP
                        </p>
                    </div>

                    {/* Location Pages */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-green-500" />
                                    Location Pages
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Geographic coverage for service areas
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={() => setLocationPages(Math.max(0, locationPages - 1))}
                                    disabled={locationPages <= 0}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    value={locationPages}
                                    onChange={(e) => setLocationPages(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-20 text-center"
                                />
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={() => setLocationPages(Math.min(100, locationPages + 1))}
                                    disabled={locationPages >= 100}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground pl-0">
                            Recommended: <strong>5-100 pages</strong> if strong geo spread detected in SERP
                        </p>
                    </div>

                    {/* Blog Posts */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-orange-500" />
                                    Blog Posts
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Informational content for entity clusters
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={() => setBlogPosts(Math.max(0, blogPosts - 1))}
                                    disabled={blogPosts <= 0}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    value={blogPosts}
                                    onChange={(e) => setBlogPosts(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-20 text-center"
                                />
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={() => setBlogPosts(Math.min(25, blogPosts + 1))}
                                    disabled={blogPosts >= 25}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground pl-0">
                            Recommended: <strong>0-25 posts</strong> only if informational intent detected in SERP
                        </p>
                    </div>

                    {/* Total Pages Summary */}
                    <div className="p-4 rounded-lg border bg-muted/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Total Pages</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {1 + servicePages + locationPages + blogPosts}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            1 Homepage + {servicePages} Services + {locationPages} Locations + {blogPosts} Blogs
                        </p>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 pb-5">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 cursor-pointer">
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
