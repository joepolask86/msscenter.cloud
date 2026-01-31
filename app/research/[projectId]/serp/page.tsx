import { Metadata } from "next"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    ChevronRight,
    Globe,
    ExternalLink,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    Filter,
    Download,
    RefreshCw,
    Eye,
    FileText,
    BarChart3,
    TrendingUp,
    Layers,
    CheckCheck,
    ArrowRight,
    Info
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: "SERP Analysis | MSSCenter Research",
    description: "Analyze top-ranking competitors and select sites for entity extraction",
}

export default function SerpAnalysisPage({ params }: { params: { projectId: string } }) {
    // Mock SERP data - will be replaced with real API calls
    const serpData = {
        keyword: "emergency plumber",
        location: "Chicago, IL",
        searchEngine: "google.com",
        scrapedAt: "2024-01-15 10:30 AM",
        totalResults: 10,
        selectedCount: 7,
        results: [
            {
                id: 1,
                position: 1,
                url: "https://www.emergencyplumberchicago.com",
                domain: "emergencyplumberchicago.com",
                title: "24/7 Emergency Plumber Chicago | Fast Response Time",
                metaDescription: "Need an emergency plumber in Chicago? We're available 24/7 with fast response times. Licensed, insured, and experienced plumbers ready to help.",
                wordCount: 2450,
                pageType: "Homepage",
                status: "recommended",
                selected: true,
                entities: 45,
                hasSchema: true,
                loadTime: "1.2s",
                mobileOptimized: true
            },
            {
                id: 2,
                position: 2,
                url: "https://www.chicagoplumbingpros.com/emergency-services",
                domain: "chicagoplumbingpros.com",
                title: "Emergency Plumbing Services in Chicago - Available Now",
                metaDescription: "Chicago's trusted emergency plumbing service. Water heater repair, drain cleaning, pipe repair. Call now for immediate assistance.",
                wordCount: 1890,
                pageType: "Service Page",
                status: "recommended",
                selected: true,
                entities: 38,
                hasSchema: true,
                loadTime: "0.9s",
                mobileOptimized: true
            },
            {
                id: 3,
                position: 3,
                url: "https://www.yelp.com/search?find_desc=emergency+plumber&find_loc=Chicago",
                domain: "yelp.com",
                title: "TOP 10 BEST Emergency Plumber in Chicago, IL - Yelp",
                metaDescription: "Best Emergency Plumber in Chicago, IL - Reviews, photos, and more. Find the best local plumbers near you.",
                wordCount: 850,
                pageType: "Directory",
                status: "not_recommended",
                selected: false,
                entities: 12,
                hasSchema: false,
                loadTime: "2.1s",
                mobileOptimized: true
            },
            {
                id: 4,
                position: 4,
                url: "https://www.rapidplumbingchicago.com",
                domain: "rapidplumbingchicago.com",
                title: "Rapid Emergency Plumbing | Chicago's Fastest Service",
                metaDescription: "Emergency plumbing repair in Chicago. Same-day service, licensed plumbers, upfront pricing. Water heaters, drains, pipes, and more.",
                wordCount: 2100,
                pageType: "Homepage",
                status: "recommended",
                selected: true,
                entities: 42,
                hasSchema: true,
                loadTime: "1.0s",
                mobileOptimized: true
            },
            {
                id: 5,
                position: 5,
                url: "https://www.angieslist.com/companylist/us/il/chicago/plumber",
                domain: "angieslist.com",
                title: "Best Plumbers in Chicago, IL - Angi",
                metaDescription: "Find top-rated plumbers in Chicago. Read reviews, compare prices, and hire the best professional for your plumbing needs.",
                wordCount: 920,
                pageType: "Directory",
                status: "not_recommended",
                selected: false,
                entities: 15,
                hasSchema: false,
                loadTime: "1.8s",
                mobileOptimized: true
            },
            {
                id: 6,
                position: 6,
                url: "https://www.chicagoemergencyplumbing.net",
                domain: "chicagoemergencyplumbing.net",
                title: "Chicago Emergency Plumbing - 24 Hour Service",
                metaDescription: "Professional emergency plumbing services throughout Chicago. Burst pipes, clogged drains, water heater failures. Call now!",
                wordCount: 1750,
                pageType: "Homepage",
                status: "neutral",
                selected: true,
                entities: 32,
                hasSchema: true,
                loadTime: "1.3s",
                mobileOptimized: true
            },
            {
                id: 7,
                position: 7,
                url: "https://www.homeadvisor.com/c.Plumbers.Chicago.IL",
                domain: "homeadvisor.com",
                title: "Best Plumbers in Chicago, IL - HomeAdvisor",
                metaDescription: "Hire the best plumbers in Chicago, IL. Compare ratings, reviews, and prices. Get free quotes from local professionals.",
                wordCount: 780,
                pageType: "Directory",
                status: "not_recommended",
                selected: false,
                entities: 10,
                hasSchema: false,
                loadTime: "2.3s",
                mobileOptimized: false
            },
            {
                id: 8,
                position: 8,
                url: "https://www.windycityplumbing.com/emergency",
                domain: "windycityplumbing.com",
                title: "Emergency Plumbing Repair Chicago | Windy City Plumbing",
                metaDescription: "Emergency plumbing services in Chicago and suburbs. Licensed, bonded, insured. Water heater installation, drain cleaning, pipe repair.",
                wordCount: 2200,
                pageType: "Service Page",
                status: "recommended",
                selected: true,
                entities: 40,
                hasSchema: true,
                loadTime: "1.1s",
                mobileOptimized: true
            },
            {
                id: 9,
                position: 9,
                url: "https://www.chicagoplumber247.com",
                domain: "chicagoplumber247.com",
                title: "24/7 Plumber Chicago - Emergency Service Available",
                metaDescription: "Round-the-clock emergency plumbing in Chicago. Fast response, fair pricing, quality workmanship. Residential and commercial services.",
                wordCount: 1650,
                pageType: "Homepage",
                status: "neutral",
                selected: true,
                entities: 35,
                hasSchema: false,
                loadTime: "1.4s",
                mobileOptimized: true
            },
            {
                id: 10,
                position: 10,
                url: "https://www.chicagotribune.com/best-plumbers-chicago",
                domain: "chicagotribune.com",
                title: "Best Emergency Plumbers in Chicago 2024 - Chicago Tribune",
                metaDescription: "Our picks for the best emergency plumbers in Chicago. Expert reviews, pricing guides, and what to look for when hiring a plumber.",
                wordCount: 1200,
                pageType: "Blog/Editorial",
                status: "not_recommended",
                selected: false,
                entities: 18,
                hasSchema: false,
                loadTime: "1.6s",
                mobileOptimized: true
            }
        ],
        serpFeatures: {
            localPack: true,
            featuredSnippet: false,
            peopleAlsoAsk: true,
            relatedSearches: true,
            knowledgePanel: false
        },
        stats: {
            avgWordCount: 1579,
            avgEntities: 32,
            withSchema: 6,
            recommended: 4,
            notRecommended: 4,
            neutral: 2
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "recommended":
                return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">RECOMMENDED</Badge>
            case "not_recommended":
                return <Badge variant="destructive" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">NOT RECOMMENDED</Badge>
            case "neutral":
                return <Badge variant="secondary" className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20">NEUTRAL</Badge>
            default:
                return null
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "recommended":
                return <CheckCircle2 className="h-4 w-4 text-blue-500" />
            case "not_recommended":
                return <XCircle className="h-4 w-4 text-red-500" />
            case "neutral":
                return <AlertCircle className="h-4 w-4 text-gray-500" />
            default:
                return null
        }
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
                                    <Link href="/projects" className="hover:text-foreground transition-colors">
                                        Projects
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <Link href={`/research/${params.projectId}/overview`} className="hover:text-foreground transition-colors">
                                        Project #{params.projectId}
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-foreground font-medium">SERP Analysis</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Re-scrape SERP
                                    </Button>
                                    <Button variant="default" size="sm" className="cursor-pointer">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Data
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header Section */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-2">SERP Analysis</h1>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Search className="h-4 w-4" />
                                            <span className="font-medium">{serpData.keyword}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            <span>{serpData.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4" />
                                            <span>Scraped {serpData.scrapedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Banner */}
                            <div className="flex gap-3 p-4 border border-foreground/10 rounded-lg bg-orange-300/10 text-foreground/70 text-sm">
                                <Info className="h-4 w-4 shrink-0 text-foreground/70" />
                                <p>
                                    Select the top-ranking competitors below. We'll analyze their content to extract entities, identify content patterns, and build your optimal site structure based on what's actually ranking. <strong>Recommended sites</strong> are real businesses (not directories). <strong>Not Recommended</strong> sites are aggregators like Yelp, Angi, etc.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Selected</CardTitle>
                                        <CheckCheck className="h-6 w-6 text-green-500 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{serpData.selectedCount}/{serpData.totalResults}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Competitors for analysis
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Avg Word Count</CardTitle>
                                        <FileText className="h-6 w-6 text-blue-500 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{serpData.stats.avgWordCount}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Target: 1500-2200 words
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">With Schema</CardTitle>
                                        <Layers className="h-6 w-6 text-purple-500 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{serpData.stats.withSchema}/10</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Using structured data
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Avg Entities</CardTitle>
                                        <Layers className="h-6 w-6 text-green-500 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{serpData.stats.avgEntities}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Per competitor site
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                        <CheckCheck className="h-4 w-4 mr-2" />
                                        Select All Recommended
                                    </Button>
                                    <div className="text-sm text-muted-foreground">
                                        {serpData.selectedCount} of {serpData.totalResults} selected
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="list" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 group-data-horizontal/tabs:h-10">
                                    <TabsTrigger value="list" className="text-md data-[state=active]:text-slate-700 shadow-none">List View</TabsTrigger>
                                    <TabsTrigger value="table" className="text-md data-[state=active]:text-slate-700 shadow-none">Table View</TabsTrigger>
                                    <TabsTrigger value="features" className="text-md data-[state=active]:text-slate-700 shadow-none">Recommendations</TabsTrigger>
                                </TabsList>

                                <TabsContent value="list" className="space-y-4 mt-4">
                                    {serpData.results.map((result) => (
                                        <Card key={result.id} className={cn(
                                            "transition-all",
                                            result.selected && "border-primary/50 bg-primary/5",
                                            result.status === "not_recommended" && "border-muted-foreground/20 opacity-60"
                                        )}>
                                            <CardContent className="py-0 px-4">
                                                <div className="flex items-start gap-4">
                                                    <Checkbox
                                                        checked={result.selected}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-3">
                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold shrink-0">
                                                                    {result.position}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        {getStatusIcon(result.status)}
                                                                        {getStatusBadge(result.status)}
                                                                    </div>
                                                                    <h3 className={cn(
                                                                        "font-semibold text-lg hover:underline cursor-pointer mb-1",
                                                                        result.status === "not_recommended"
                                                                            ? "text-muted-foreground/50"
                                                                            : "text-blue-600 dark:text-blue-400"
                                                                    )}>
                                                                        {result.title}
                                                                    </h3>
                                                                    <p className={cn(
                                                                        "text-sm truncate mb-2",
                                                                        result.status === "not_recommended"
                                                                            ? "text-muted-foreground/50"
                                                                            : "text-muted-foreground"
                                                                    )}>
                                                                        {result.url}
                                                                    </p>
                                                                    <p className={cn(
                                                                        "text-sm line-clamp-2",
                                                                        result.status === "not_recommended"
                                                                            ? "text-muted-foreground/50"
                                                                            : "text-foreground/80"
                                                                    )}>
                                                                        {result.metaDescription}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <a href={result.url} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        </div>

                                                        <div className="pt-3 border-t">
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-2/3">
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Word Count</p>
                                                                    <p className={cn(
                                                                        "text-sm font-medium",
                                                                        result.status === "not_recommended" && "text-muted-foreground/50"
                                                                    )}>{result.wordCount}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Page Type</p>
                                                                    <p className={cn(
                                                                        "text-sm font-medium",
                                                                        result.status === "not_recommended" && "text-muted-foreground/50"
                                                                    )}>{result.pageType}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Entities</p>
                                                                    <p className={cn(
                                                                        "text-sm font-medium",
                                                                        result.status === "not_recommended" && "text-muted-foreground/50"
                                                                    )}>{result.entities}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Schema</p>
                                                                    <p className={cn(
                                                                        "text-sm font-medium",
                                                                        result.status === "not_recommended" && "text-muted-foreground/50"
                                                                    )}>{result.hasSchema ? "✓ Yes" : "✗ No"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </TabsContent>

                                <TabsContent value="table" className="mt-4">
                                    <Card>
                                        <CardContent className="p-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-12"></TableHead>
                                                        <TableHead className="w-12">#</TableHead>
                                                        <TableHead>Title & URL</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Words</TableHead>
                                                        <TableHead className="text-right">Entities</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead className="text-center">Schema</TableHead>
                                                        <TableHead className="w-12"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {serpData.results.map((result) => (
                                                        <TableRow key={result.id} className={cn(
                                                            result.selected && "bg-primary/5"
                                                        )}>
                                                            <TableCell>
                                                                <Checkbox checked={result.selected} />
                                                            </TableCell>
                                                            <TableCell className="font-medium">{result.position}</TableCell>
                                                            <TableCell>
                                                                <div className="max-w-md">
                                                                    <p className="font-medium text-sm truncate">{result.title}</p>
                                                                    <p className="text-xs text-muted-foreground truncate">{result.domain}</p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{getStatusBadge(result.status)}</TableCell>
                                                            <TableCell className="text-right">{result.wordCount}</TableCell>
                                                            <TableCell className="text-right">{result.entities}</TableCell>
                                                            <TableCell className="text-sm">{result.pageType}</TableCell>
                                                            <TableCell className="text-center">
                                                                {result.hasSchema ? (
                                                                    <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                                                                ) : (
                                                                    <XCircle className="h-4 w-4 text-gray-400 mx-auto" />
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button variant="ghost" size="sm" asChild>
                                                                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </a>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="features" className="space-y-4 mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Insights & Recommendations</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">Local Intent Detected</p>
                                                    <p className="text-xs text-muted-foreground">Local Pack present - optimize for local SEO with NAP consistency and local schema</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">FAQ Opportunity</p>
                                                    <p className="text-xs text-muted-foreground">People Also Ask present - create FAQ section with schema markup</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">Target Word Count: 1500-2200</p>
                                                    <p className="text-xs text-muted-foreground">Top competitors average {serpData.stats.avgWordCount} words - aim for comprehensive content</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
