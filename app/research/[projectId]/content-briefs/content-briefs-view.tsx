"use client"

import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    ChevronRight,
    FileText,
    Target,
    Layers,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Download,
    Sparkles,
    Eye,
    Edit3,
    Info,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditBriefDialog } from "@/components/research/edit-brief-dialog"
import { useState } from "react"

export function ContentBriefsView({ params }: { params: { projectId: string } }) {
    const [selectedBrief, setSelectedBrief] = useState<string | null>(null)

    // Mock data - will be replaced with real API calls
    const briefs = {
        homepage: {
            id: "homepage",
            title: "Homepage",
            type: "Landing Page",
            status: "ready",
            primaryEntity: "Chicago Plumber",
            targetIntent: "Commercial + Local",
            wordCount: { min: 800, max: 1200, recommended: 1000 },
            supportingEntities: [
                "Emergency Plumbing",
                "Water Heater Repair",
                "Drain Cleaning",
                "Licensed Plumber",
                "24/7 Service",
                "Chicago IL"
            ],
            sections: [
                { order: 1, name: "Hero Section", required: true, notes: "Primary CTA + trust signals" },
                { order: 2, name: "Trust Signals", required: true, notes: "Years in business" },
                { order: 3, name: "Core Services", required: true, notes: "Top 8 services with entity coverage" },
                { order: 4, name: "Why Choose Us", required: true, notes: "SERP-based differentiators" },
                { order: 5, name: "Service Areas", required: true, notes: "12 location links" },
                { order: 6, name: "Process", required: false, notes: "4-step how it works" },
                { order: 7, name: "FAQs", required: false, notes: "5-7 entity-driven questions" },
                { order: 8, name: "Final CTA", required: true, notes: "Conversion-focused" },
            ],
            faqs: [
                "What plumbing services do you offer in Chicago?",
                "Do you provide emergency plumbing services?",
                "Are you licensed and insured?",
                "What areas of Chicago do you serve?",
                "How quickly can you respond to emergencies?"
            ]
        },
        services: [
            {
                id: "service-1",
                title: "Emergency Plumbing",
                type: "Service Page",
                status: "ready",
                primaryEntity: "Emergency Plumbing",
                targetIntent: "Transactional",
                wordCount: { min: 600, max: 900, recommended: 750 },
                supportingEntities: [
                    "24/7 Plumber",
                    "Emergency Repair",
                    "Fast Response",
                    "Licensed Plumber",
                    "Chicago"
                ],
                sections: [
                    { order: 1, name: "Service Overview", required: true },
                    { order: 2, name: "Common Emergency Issues", required: true },
                    { order: 3, name: "Our Emergency Process", required: true },
                    { order: 4, name: "Service Areas", required: true },
                    { order: 5, name: "Why Choose Us", required: true },
                    { order: 6, name: "FAQs", required: false },
                ],
                faqs: [
                    "What qualifies as a plumbing emergency?",
                    "How fast can you respond?",
                    "Do you charge extra for emergency calls?"
                ]
            },
            {
                id: "service-2",
                title: "Water Heater Repair",
                type: "Service Page",
                status: "ready",
                primaryEntity: "Water Heater Repair",
                targetIntent: "Transactional",
                wordCount: { min: 600, max: 900, recommended: 750 },
                supportingEntities: [
                    "Water Heater Installation",
                    "Tankless Water Heater",
                    "Water Heater Replacement",
                    "Licensed Plumber"
                ],
                sections: [
                    { order: 1, name: "Service Overview", required: true },
                    { order: 2, name: "Common Water Heater Problems", required: true },
                    { order: 3, name: "Repair vs Replacement", required: true },
                    { order: 4, name: "Service Areas", required: true },
                    { order: 5, name: "Why Choose Us", required: true },
                ],
                faqs: [
                    "How long does a water heater repair take?",
                    "Should I repair or replace my water heater?",
                    "What are signs my water heater needs repair?"
                ]
            },
        ],
        locations: [
            {
                id: "location-1",
                title: "Plumber in Lincoln Park",
                type: "Location Page",
                status: "ready",
                primaryEntity: "Plumber Lincoln Park",
                targetIntent: "Local Commercial",
                wordCount: { min: 500, max: 700, recommended: 600 },
                supportingEntities: [
                    "Lincoln Park Plumbing",
                    "Emergency Plumber",
                    "Water Heater Repair",
                    "Chicago IL"
                ],
                sections: [
                    { order: 1, name: "Location Overview", required: true },
                    { order: 2, name: "Services in Lincoln Park", required: true },
                    { order: 3, name: "Why Choose Us", required: true },
                    { order: 4, name: "Service Area Map", required: false },
                ],
                faqs: [
                    "Do you serve Lincoln Park Chicago?",
                    "What plumbing services do you offer in Lincoln Park?"
                ]
            },
        ],
        blogs: [
            {
                id: "blog-1",
                title: "How Much Does Emergency Plumbing Cost in Chicago?",
                type: "Blog Post",
                status: "ready",
                primaryEntity: "Emergency Plumbing Cost",
                targetIntent: "Informational",
                wordCount: { min: 1200, max: 1800, recommended: 1500 },
                supportingEntities: [
                    "Plumbing Repair Cost",
                    "Emergency Service Fee",
                    "Chicago Plumber Rates",
                    "After Hours Plumbing"
                ],
                sections: [
                    { order: 1, name: "Introduction", required: true },
                    { order: 2, name: "Average Cost Breakdown", required: true },
                    { order: 3, name: "Factors Affecting Cost", required: true },
                    { order: 4, name: "How to Save Money", required: true },
                    { order: 5, name: "When to Call Emergency Plumber", required: true },
                    { order: 6, name: "Conclusion + CTA", required: true },
                ],
                faqs: [
                    "What is the average cost of emergency plumbing?",
                    "Do emergency plumbers charge more?",
                    "Is emergency plumbing covered by insurance?"
                ]
            },
        ],
        utility: [
            {
                id: "utility-about",
                title: "About Us",
                type: "Utility Page",
                status: "ready",
                primaryEntity: "N/A - Template Driven",
                targetIntent: "Informational",
                wordCount: { min: 300, max: 500, recommended: 400 },
                supportingEntities: [],
                sections: [
                    { order: 1, name: "About Hero", required: true, notes: "headline + description" },
                    { order: 2, name: "About Content", required: true, notes: "subheadline + company_story" },
                    { order: 3, name: "Why Choose Us", required: true, notes: "Reused from homepage component" },
                ],
                faqs: []
            },
            {
                id: "utility-contact",
                title: "Contact Us",
                type: "Utility Page",
                status: "ready",
                primaryEntity: "N/A - Template Driven",
                targetIntent: "Transactional",
                wordCount: { min: 40, max: 80, recommended: 60 },
                supportingEntities: [],
                sections: [
                    { order: 1, name: "Contact Hero", required: true, notes: "headline + description" },
                    { order: 2, name: "Contact Form", required: true, notes: "Template-driven form" },
                ],
                faqs: []
            },
            {
                id: "utility-privacy",
                title: "Privacy Policy",
                type: "Legal Page",
                status: "ready",
                primaryEntity: "N/A - Boilerplate",
                targetIntent: "Informational",
                wordCount: { min: 0, max: 0, recommended: 0 },
                supportingEntities: [],
                sections: [
                    { order: 1, name: "Meta Description Only", required: true, notes: "SEO meta description (150-160 chars)" },
                ],
                faqs: [],
                note: "Content is boilerplate from template"
            },
            {
                id: "utility-terms",
                title: "Terms of Service",
                type: "Legal Page",
                status: "ready",
                primaryEntity: "N/A - Boilerplate",
                targetIntent: "Informational",
                wordCount: { min: 0, max: 0, recommended: 0 },
                supportingEntities: [],
                sections: [
                    { order: 1, name: "Meta Description Only", required: true, notes: "SEO meta description (150-160 chars)" },
                ],
                faqs: [],
                note: "Content is boilerplate from template"
            },
        ]
    }

    const allBriefs = [
        briefs.homepage,
        ...briefs.services,
        ...briefs.locations,
        ...briefs.blogs,
        ...briefs.utility
    ]

    const totalBriefs = allBriefs.length
    const readyBriefs = allBriefs.filter(b => b.status === "ready").length

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
                                    <span className="text-foreground font-medium">Content Briefs</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="default" size="sm" className="cursor-pointer">
                                        <Download className="h-4 w-4" />
                                        Export All
                                    </Button>
                                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-8 cursor-pointer">
                                        <Sparkles className="h-4 w-4" />
                                        Generate Content Briefs
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2">Content Briefs</h1>
                                <p className="text-sm text-muted-foreground">
                                    Entity-optimized content briefs for {totalBriefs} pages
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid gap-4 md:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Total Briefs</CardTitle>
                                        <FileText className="h-6 w-6 text-blue-500 absolute right-2 top-0" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{totalBriefs}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            All page types
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Ready</CardTitle>
                                        <CheckCircle2 className="h-6 w-6 text-green-500 absolute right-2 top-0" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{readyBriefs}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Ready for content
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Avg Word Count</CardTitle>
                                        <Target className="h-6 w-6 text-purple-500 absolute right-2 top-0" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">850</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Recommended
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Entities</CardTitle>
                                        <Layers className="h-6 w-6 text-orange-500 absolute right-2 top-0" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">42</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Total coverage
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="all">All ({totalBriefs})</TabsTrigger>
                                    <TabsTrigger value="homepage">Homepage (1)</TabsTrigger>
                                    <TabsTrigger value="services">Services ({briefs.services.length})</TabsTrigger>
                                    <TabsTrigger value="locations">Locations ({briefs.locations.length})</TabsTrigger>
                                    <TabsTrigger value="blogs">Blog ({briefs.blogs.length})</TabsTrigger>
                                    <TabsTrigger value="utility">Utility ({briefs.utility.length})</TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="space-y-4 mt-4">
                                    <div className="grid gap-4">
                                        {allBriefs.map((brief) => (
                                            <BriefCard key={brief.id} brief={brief} onSelect={setSelectedBrief} />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="homepage" className="space-y-4 mt-4">
                                    <BriefCard brief={briefs.homepage} onSelect={setSelectedBrief} />
                                </TabsContent>

                                <TabsContent value="services" className="space-y-4 mt-4">
                                    <div className="grid gap-4">
                                        {briefs.services.map((brief) => (
                                            <BriefCard key={brief.id} brief={brief} onSelect={setSelectedBrief} />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="locations" className="space-y-4 mt-4">
                                    <div className="grid gap-4">
                                        {briefs.locations.map((brief) => (
                                            <BriefCard key={brief.id} brief={brief} onSelect={setSelectedBrief} />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="blogs" className="space-y-4 mt-4">
                                    <div className="grid gap-4">
                                        {briefs.blogs.map((brief) => (
                                            <BriefCard key={brief.id} brief={brief} onSelect={setSelectedBrief} />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="utility" className="space-y-4 mt-4">
                                    <div className="flex gap-3 p-4 border border-blue-500/20 rounded-lg bg-blue-500/10 text-sm mb-4">
                                        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                                        <p className="text-blue-900 dark:text-blue-200">
                                            Utility pages use <strong>template-defined sections</strong> and are not entity-optimized. Content is minimal and focused on business information.
                                        </p>
                                    </div>
                                    <div className="grid gap-4">
                                        {briefs.utility.map((brief) => (
                                            <BriefCard key={brief.id} brief={brief} onSelect={setSelectedBrief} />
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

function BriefCard({ brief, onSelect }: { brief: any; onSelect: (id: string) => void }) {
    const [expanded, setExpanded] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg">{brief.title}</CardTitle>
                                <Badge variant="outline" className="text-xs">
                                    {brief.type}
                                </Badge>
                                {brief.status === "ready" && (
                                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Ready
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {brief.targetIntent}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {brief.wordCount.recommended} words
                                </span>
                                <span className="flex items-center gap-1">
                                    <Layers className="h-3 w-3" />
                                    {brief.supportingEntities.length} entities
                                </span>
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
                                <Eye className="h-4 w-4" />
                                {expanded ? "Hide" : "View"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
                                <Edit3 className="h-4 w-4" />
                                Edit
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {expanded && (
                    <CardContent className="space-y-4 pt-0">
                        {/* Primary Entity */}
                        <div>
                            <p className="text-sm font-semibold mb-2">Primary Entity</p>
                            <Badge className="bg-orange-500/10 text-orange-700 hover:text-white dark:text-orange-400 border-orange-500/20">
                                {brief.primaryEntity}
                            </Badge>
                        </div>

                        {/* Supporting Entities */}
                        <div>
                            <p className="text-sm font-semibold mb-2">Supporting Entities ({brief.supportingEntities.length})</p>
                            <div className="flex flex-wrap gap-2">
                                {brief.supportingEntities.map((entity: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                        {entity}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Sections */}
                        <div>
                            <p className="text-sm font-semibold mb-2">Content Sections ({brief.sections.length})</p>
                            <div className="space-y-2">
                                {brief.sections.map((section: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500/10 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                                            {section.order}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">{section.name}</p>
                                                {section.required && (
                                                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">
                                                        Required
                                                    </Badge>
                                                )}
                                            </div>
                                            {section.notes && (
                                                <p className="text-xs text-muted-foreground mt-1">{section.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQs */}
                        {brief.faqs && brief.faqs.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold mb-2">Recommended FAQs ({brief.faqs.length})</p>
                                <div className="space-y-2">
                                    {brief.faqs.map((faq: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm">
                                            <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                                            <p className="text-muted-foreground">{faq}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Word Count */}
                        <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Target Word Count</p>
                                <p className="text-sm font-semibold">{brief.wordCount.min} - {brief.wordCount.max} words</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Recommended</p>
                                <p className="text-lg font-bold text-blue-600">{brief.wordCount.recommended}</p>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            <EditBriefDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                brief={brief}
                onUpdated={() => {
                    // Refresh briefs list
                    console.log("Brief updated")
                }}
            />
        </>
    )
}
