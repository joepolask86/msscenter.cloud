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
    BarChart,
    FileText,
    Globe,
    Layers,
    Search,
    TrendingUp,
    Target,
    Zap,
    CheckCircle2,
    AlertCircle,
    Clock,
    ExternalLink,
    Download,
    RefreshCw,
    Brain,
    Network,
    FileCode,
    Sparkles,
    ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
    title: "Project Overview | MSSCenter Research",
    description: "Entity-first SEO research and site planning dashboard",
}

export default function ResearchOverviewPage({ params }: { params: { projectId: string } }) {
    // Mock data - will be replaced with real API calls
    const projectData = {
        name: "Emergency Plumber Chicago",
        keyword: "emergency plumber",
        location: "Chicago, IL",
        status: "completed",
        createdAt: "2024-01-15",
        completedAt: "2024-01-15",
        progress: 100,
        stats: {
            entitiesFound: 142,
            competitorsAnalyzed: 10,
            pagesPlanned: 24,
            contentBriefs: 8,
            avgWordCount: 1850,
            topicClusters: 6
        },
        competitors: [
            { url: "https://www.example1.com", title: "Best Plumbing Services", status: "recommended", entities: 45 },
            { url: "https://www.example2.com", title: "24/7 Emergency Plumber", status: "recommended", entities: 38 },
            { url: "https://www.example3.com", title: "Plumbing Repair Chicago", status: "neutral", entities: 32 },
        ],
        topEntities: [
            { text: "Emergency Plumbing", type: "Service", frequency: 89, relevance: 0.95 },
            { text: "Water Heater Repair", type: "Service", frequency: 67, relevance: 0.88 },
            { text: "Drain Cleaning", type: "Service", frequency: 54, relevance: 0.82 },
            { text: "Pipe Repair", type: "Service", frequency: 48, relevance: 0.79 },
            { text: "24/7 Service", type: "Feature", frequency: 42, relevance: 0.76 },
            { text: "Emergency Plumbing", type: "Service", frequency: 89, relevance: 0.95 },
            { text: "Water Heater Repair", type: "Service", frequency: 67, relevance: 0.88 },
            { text: "Drain Cleaning", type: "Service", frequency: 54, relevance: 0.82 },
            { text: "Pipe Repair", type: "Service", frequency: 48, relevance: 0.79 },
            { text: "24/7 Service", type: "Feature", frequency: 42, relevance: 0.76 },
        ],
        recentActivity: [
            { action: "Entity extraction completed", timestamp: "2 hours ago", type: "success" },
            { action: "SERP data analyzed", timestamp: "3 hours ago", type: "success" },
            { action: "10 competitors scraped", timestamp: "4 hours ago", type: "success" },
            { action: "Project created", timestamp: "5 hours ago", type: "info" },
        ]
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
                                    <span className="text-foreground font-medium">{projectData.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={projectData.status === "completed" ? "default" : "secondary"} className="bg-green-500/10 hover:!bg-transparent text-green-700 dark:text-green-400 border-green-500/20 py-1.5 px-4">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        {projectData.status === "completed" ? "Analysis Complete" : "In Progress"}
                                    </Badge>
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Re-analyze
                                    </Button>
                                    <Button size="sm" className="bg-primary cursor-pointer">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Report
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header Section */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-2">{projectData.name}</h1>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Search className="h-4 w-4" />
                                            <span className="font-medium">{projectData.keyword}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4" />
                                            <span>{projectData.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>Created {projectData.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-semibold">Entities Extracted</CardTitle>
                                        <Layers className="h-6 w-6 text-primary absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{projectData.stats.entitiesFound}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            From {projectData.stats.competitorsAnalyzed} competitors
                                        </p>
                                        <Progress value={100} className="mt-2 h-1" />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-semibold">Site Structure</CardTitle>
                                        <Network className="h-6 w-6 text-green-600 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{projectData.stats.pagesPlanned}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Pages planned • {projectData.stats.topicClusters} clusters
                                        </p>
                                        <Progress value={85} className="mt-2 h-1" />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Content Briefs</CardTitle>
                                        <FileText className="h-6 w-6 text-purple-600 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{projectData.stats.contentBriefs}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Avg {projectData.stats.avgWordCount} words
                                        </p>
                                        <Progress value={33} className="mt-2 h-1" />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
                                        <TrendingUp className="h-6 w-6 text-orange-600 absolute top-0 right-5" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">92/100</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Entity coverage excellent
                                        </p>
                                        <Progress value={92} className="mt-2 h-1" />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Content Tabs */}
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 group-data-horizontal/tabs:h-10">
                                    <TabsTrigger value="overview" className="text-md data-[state=active]:text-slate-700 shadow-none">Overview</TabsTrigger>
                                    <TabsTrigger value="entities" className="text-md data-[state=active]:text-slate-700 shadow-none">Top Entities</TabsTrigger>
                                    <TabsTrigger value="competitors" className="text-md data-[state=active]:text-slate-700 shadow-none">Competitors</TabsTrigger>
                                    <TabsTrigger value="activity" className="text-md data-[state=active]:text-slate-700 shadow-none">Activity</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-4 mt-4">
                                    {/* Quick Actions */}
                                    <Card className="bg-transparent rounded-none gap-3 ring-0 p-0 md:p-0 mb-4">
                                        <CardHeader className="md:px-0">
                                            <CardTitle className="flex items-center gap-2">
                                                <Zap className="h-5 w-5 text-orange-500" />
                                                Quick Actions
                                            </CardTitle>
                                            <CardDescription>
                                                Navigate to key research and planning tools
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 px-0 pb-4">
                                            <Link href={`/research/${params.projectId}/serp`}>
                                                <Card className="hover:bg-accent/50 transition-all cursor-pointer h-full border-2 hover:border-primary">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-base">
                                                            <Globe className="h-5 w-5 text-blue-500" />
                                                            SERP Analysis
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground mb-3">
                                                            View competitor rankings, meta data, and SERP features
                                                        </p>
                                                        <Button variant="ghost" size="sm" className="w-full">
                                                            View Analysis <ArrowRight className="h-4 w-4 ml-2" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={`/research/${params.projectId}/entities`}>
                                                <Card className="hover:bg-accent/50 transition-all cursor-pointer h-full border-2 hover:border-primary">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-base">
                                                            <Brain className="h-5 w-5 text-purple-500" />
                                                            Entity Map
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground mb-3">
                                                            Explore extracted entities, clusters, and relationships
                                                        </p>
                                                        <Button variant="ghost" size="sm" className="w-full">
                                                            Explore Entities <ArrowRight className="h-4 w-4 ml-2" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={`/research/${params.projectId}/site-plan`}>
                                                <Card className="hover:bg-accent/50 transition-all cursor-pointer h-full border-2 hover:border-primary">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-base">
                                                            <Network className="h-5 w-5 text-green-500" />
                                                            Site Structure
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground mb-3">
                                                            Build optimal page hierarchy and internal linking
                                                        </p>
                                                        <Button variant="ghost" size="sm" className="w-full">
                                                            Plan Structure <ArrowRight className="h-4 w-4 ml-2" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={`/research/${params.projectId}/content-briefs`}>
                                                <Card className="hover:bg-accent/50 transition-all cursor-pointer h-full border-2 hover:border-primary">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-base">
                                                            <FileCode className="h-5 w-5 text-orange-500" />
                                                            Content Briefs
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground mb-3">
                                                            AI-generated content outlines with entity targeting
                                                        </p>
                                                        <Button variant="ghost" size="sm" className="w-full">
                                                            View Briefs <ArrowRight className="h-4 w-4 ml-2" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Link>

                                            <Link href={`/local-sites-pro`}>
                                                <Card className="hover:bg-accent/50 transition-all cursor-pointer h-full border-2 hover:border-primary bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-base">
                                                            <Sparkles className="h-5 w-5 text-yellow-500" />
                                                            Generate Site
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground mb-3">
                                                            Auto-generate complete site with entity-optimized content
                                                        </p>
                                                        <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                                            Start Generation <Sparkles className="h-4 w-4 ml-2" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </CardContent>
                                    </Card>

                                    {/* Research Insights */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Research Summary</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-sm">Entity-First Analysis Complete</p>
                                                        <p className="text-xs text-muted-foreground">142 entities extracted and clustered from top 10 competitors</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-sm">Content Patterns Identified</p>
                                                        <p className="text-xs text-muted-foreground">6 topic clusters with optimal word counts (1500-2200)</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-sm">Site Structure Optimized</p>
                                                        <p className="text-xs text-muted-foreground">24-page hierarchy with strategic internal linking</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-sm">Schema Markup Ready</p>
                                                        <p className="text-xs text-muted-foreground">LocalBusiness + Service schemas configured</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Next Steps</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</div>
                                                    <div>
                                                        <p className="font-medium text-sm">Review Entity Map</p>
                                                        <p className="text-xs text-muted-foreground">Verify entity relevance and add custom entities</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</div>
                                                    <div>
                                                        <p className="font-medium text-sm">Finalize Site Structure</p>
                                                        <p className="text-xs text-muted-foreground">Adjust page hierarchy and internal linking strategy</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</div>
                                                    <div>
                                                        <p className="font-medium text-sm">Generate Content Briefs</p>
                                                        <p className="text-xs text-muted-foreground">Create AI-powered outlines for each page</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold">4</div>
                                                    <div>
                                                        <p className="font-medium text-sm">Build & Deploy Site</p>
                                                        <p className="text-xs text-muted-foreground">Generate static site and deploy to hosting</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                <TabsContent value="entities" className="space-y-4 mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Top Performing Entities</CardTitle>
                                            <CardDescription>
                                                Most relevant entities extracted from competitor analysis
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {projectData.topEntities.map((entity, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div>
                                                                <p className="font-medium">{entity.text}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {entity.type} • {entity.frequency} mentions
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="text-right ">
                                                                <p className="text-sm font-medium">{Math.round(entity.relevance * 100)}%</p>
                                                                <p className="text-xs text-muted-foreground">Relevance</p>
                                                            </div>
                                                            <Progress value={entity.relevance * 100} className="w-24" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <Button variant="default" asChild>
                                                    <Link href={`/research/${params.projectId}/entities`}>
                                                        View All {projectData.stats.entitiesFound} Entities <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="competitors" className="space-y-4 mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Analyzed Competitors</CardTitle>
                                            <CardDescription>
                                                Top-ranking sites used for entity extraction
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {projectData.competitors.map((competitor, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                                                                {idx + 1}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <p className="font-medium truncate">{competitor.title}</p>
                                                                    {competitor.status === "recommended" && (
                                                                        <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs">
                                                                            Recommended
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground truncate">{competitor.url}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium">{competitor.entities}</p>
                                                                <p className="text-xs text-muted-foreground">Entities</p>
                                                            </div>
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-end mt-4">
                                                <Button variant="default" asChild>
                                                    <Link href={`/research/${params.projectId}/serp`}>
                                                        View Full SERP Analysis <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="activity" className="space-y-4 mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Recent Activity</CardTitle>
                                            <CardDescription>
                                                Project timeline and processing history
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {projectData.recentActivity.map((activity, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activity.type === "success" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                                                            }`}>
                                                            {activity.type === "success" ? (
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            ) : (
                                                                <Clock className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{activity.action}</p>
                                                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                                        </div>
                                                    </div>
                                                ))}
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
