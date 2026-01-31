"use client"

import * as React from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    ChevronRight,
    Brain,
    TrendingUp,
    Filter,
    Download,
    RefreshCw,
    Search,
    Layers,
    Tag,
    BarChart3,
    Zap,
    CheckCircle2,
    ArrowRight,
    Info,
    Plus,
    X
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function EntitiesView({ params }: { params: { projectId: string } }) {
    const [customEntities, setCustomEntities] = React.useState<string[]>([])
    const [newEntity, setNewEntity] = React.useState("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)

    const handleAddEntity = () => {
        if (newEntity.trim()) {
            setCustomEntities([...customEntities, newEntity.trim()])
            setNewEntity("")
        }
    }

    const handleSaveEntities = () => {
        // TODO: Save custom entities to backend
        console.log("Saving custom entities:", customEntities)
        setIsDialogOpen(false)
        setCustomEntities([])
        setNewEntity("")
    }

    const handleRemoveEntity = (index: number) => {
        setCustomEntities(customEntities.filter((_, i) => i !== index))
    }

    // Mock entity data - will be replaced with real API calls
    const entityData = {
        totalEntities: 142,
        coreEntities: 28,
        supportingEntities: 86,
        lowValueEntities: 28,
        topicClusters: 6,
        avgRelevance: 0.78,
        clusters: [
            {
                id: 1,
                name: "Emergency Services",
                entityCount: 24,
                avgRelevance: 0.92,
                color: "blue",
                entities: [
                    { text: "Emergency Plumbing", type: "Service", frequency: 89, relevance: 0.95, confidence: 0.98 },
                    { text: "24/7 Service", type: "Feature", frequency: 67, relevance: 0.88, confidence: 0.95 },
                    { text: "Same Day Service", type: "Feature", frequency: 54, relevance: 0.82, confidence: 0.92 },
                    { text: "Emergency Response", type: "Service", frequency: 48, relevance: 0.79, confidence: 0.90 },
                ]
            },
            {
                id: 2,
                name: "Water Heater Services",
                entityCount: 18,
                avgRelevance: 0.85,
                color: "purple",
                entities: [
                    { text: "Water Heater Repair", type: "Service", frequency: 72, relevance: 0.90, confidence: 0.96 },
                    { text: "Water Heater Installation", type: "Service", frequency: 58, relevance: 0.84, confidence: 0.93 },
                    { text: "Tankless Water Heater", type: "Product", frequency: 45, relevance: 0.78, confidence: 0.89 },
                    { text: "Water Heater Replacement", type: "Service", frequency: 38, relevance: 0.75, confidence: 0.87 },
                ]
            },
            {
                id: 3,
                name: "Drain Services",
                entityCount: 22,
                avgRelevance: 0.81,
                color: "green",
                entities: [
                    { text: "Drain Cleaning", type: "Service", frequency: 65, relevance: 0.87, confidence: 0.94 },
                    { text: "Clogged Drain", type: "Problem", frequency: 52, relevance: 0.82, confidence: 0.91 },
                    { text: "Drain Repair", type: "Service", frequency: 44, relevance: 0.76, confidence: 0.88 },
                    { text: "Sewer Line", type: "Component", frequency: 39, relevance: 0.73, confidence: 0.85 },
                ]
            },
            {
                id: 4,
                name: "Pipe Services",
                entityCount: 20,
                avgRelevance: 0.77,
                color: "orange",
                entities: [
                    { text: "Pipe Repair", type: "Service", frequency: 61, relevance: 0.85, confidence: 0.92 },
                    { text: "Burst Pipe", type: "Problem", frequency: 49, relevance: 0.80, confidence: 0.89 },
                    { text: "Pipe Replacement", type: "Service", frequency: 42, relevance: 0.74, confidence: 0.86 },
                    { text: "Frozen Pipes", type: "Problem", frequency: 35, relevance: 0.70, confidence: 0.83 },
                ]
            },
            {
                id: 5,
                name: "Fixture Services",
                entityCount: 16,
                avgRelevance: 0.72,
                color: "pink",
                entities: [
                    { text: "Faucet Repair", type: "Service", frequency: 48, relevance: 0.78, confidence: 0.88 },
                    { text: "Toilet Repair", type: "Service", frequency: 46, relevance: 0.76, confidence: 0.87 },
                    { text: "Sink Installation", type: "Service", frequency: 38, relevance: 0.70, confidence: 0.84 },
                    { text: "Shower Repair", type: "Service", frequency: 32, relevance: 0.65, confidence: 0.80 },
                ]
            },
            {
                id: 6,
                name: "Trust Signals",
                entityCount: 14,
                avgRelevance: 0.68,
                color: "yellow",
                entities: [
                    { text: "Licensed Plumber", type: "Credential", frequency: 55, relevance: 0.82, confidence: 0.90 },
                    { text: "Insured", type: "Credential", frequency: 48, relevance: 0.75, confidence: 0.86 },
                    { text: "Experienced", type: "Attribute", frequency: 42, relevance: 0.68, confidence: 0.82 },
                    { text: "Free Estimate", type: "Offer", frequency: 36, relevance: 0.62, confidence: 0.78 },
                ]
            }
        ],
        allEntities: [
            { text: "Emergency Plumbing", type: "Service", frequency: 89, relevance: 0.95, confidence: 0.98, cluster: "Emergency Services" },
            { text: "Water Heater Repair", type: "Service", frequency: 72, relevance: 0.90, confidence: 0.96, cluster: "Water Heater Services" },
            { text: "24/7 Service", type: "Feature", frequency: 67, relevance: 0.88, confidence: 0.95, cluster: "Emergency Services" },
            { text: "Drain Cleaning", type: "Service", frequency: 65, relevance: 0.87, confidence: 0.94, cluster: "Drain Services" },
            { text: "Pipe Repair", type: "Service", frequency: 61, relevance: 0.85, confidence: 0.92, cluster: "Pipe Services" },
            { text: "Water Heater Installation", type: "Service", frequency: 58, relevance: 0.84, confidence: 0.93, cluster: "Water Heater Services" },
            { text: "Licensed Plumber", type: "Credential", frequency: 55, relevance: 0.82, confidence: 0.90, cluster: "Trust Signals" },
            { text: "Same Day Service", type: "Feature", frequency: 54, relevance: 0.82, confidence: 0.92, cluster: "Emergency Services" },
            { text: "Clogged Drain", type: "Problem", frequency: 52, relevance: 0.82, confidence: 0.91, cluster: "Drain Services" },
            { text: "Burst Pipe", type: "Problem", frequency: 49, relevance: 0.80, confidence: 0.89, cluster: "Pipe Services" },
        ],
        entityTypes: [
            { type: "Service", count: 68, percentage: 48 },
            { type: "Feature", count: 24, percentage: 17 },
            { type: "Problem", count: 18, percentage: 13 },
            { type: "Credential", count: 14, percentage: 10 },
            { type: "Product", count: 10, percentage: 7 },
            { type: "Component", count: 8, percentage: 5 },
        ]
    }

    const getClusterColor = (color: string) => {
        const colors: Record<string, string> = {
            blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
            purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
            green: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
            orange: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
            pink: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
            yellow: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
        }
        return colors[color] || colors.blue
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
                                    <span className="text-foreground font-medium">Entity Map</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="cursor-pointer">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Entity
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                                            <DialogHeader className="py-4 px-6 border-b shrink-0">
                                                <DialogTitle className="text-primary text-lg">Add Custom Entities</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 p-6">
                                                <p className="text-sm text-muted-foreground font-medium">Add brand-specific terms, unique services, or location-specific entities to supplement the extracted data.</p>
                                                {/* Custom Entities List */}
                                                {customEntities.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium mb-2">Added Entities ({customEntities.length})</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {customEntities.map((entity, idx) => (
                                                                <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                                                                    {entity}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-4 w-4 p-0 hover:bg-transparent"
                                                                        onClick={() => handleRemoveEntity(idx)}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Input Form */}
                                                <div className="space-y-4">
                                                    <label htmlFor="entity-input" className="text-sm font-medium">
                                                        Entity Name
                                                    </label>
                                                    <Textarea
                                                        id="entity-input"
                                                        placeholder={`Chicago Plumbing Experts\nSame-Day Emergency Service\nLicensed & Bonded`}
                                                        value={newEntity}
                                                        onChange={(e) => setNewEntity(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault()
                                                                handleAddEntity()
                                                            }
                                                        }}
                                                        className="min-h-[150px] mt-2"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 px-6 py-4 pt-0 shrink-0">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsDialogOpen(false)
                                                        setCustomEntities([])
                                                        setNewEntity("")
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleSaveEntities}
                                                    disabled={customEntities.length === 0}
                                                    className="bg-primary"
                                                >
                                                    Save {customEntities.length > 0 && `(${customEntities.length})`}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="default" size="sm" className="cursor-pointer">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header Section */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-2">Entity Map</h1>
                                    <p className="text-sm text-muted-foreground">
                                        Extracted entities from {entityData.topicClusters} topic clusters across top-ranking competitors
                                    </p>
                                </div>
                            </div>

                            {/* Info Banner */}
                            <div className="flex gap-3 p-4 border border-foreground/10 rounded-lg bg-orange-300/10 text-foreground/70 text-sm">
                                <Info className="h-4 w-4 shrink-0 text-foreground/70" />
                                <p>
                                    Entities are the semantic building blocks of your content. <strong>Core entities</strong> should appear on every page. <strong>Supporting entities</strong> define specific services/topics. Use these to structure your site and create entity-optimized content.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
                                        <Brain className="h-6 w-6 text-blue-500 absolute top-0 right-4" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{entityData.totalEntities}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Extracted from competitors
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Core Entities</CardTitle>
                                        <Zap className="h-6 w-6 text-orange-500 absolute top-0 right-4" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{entityData.coreEntities}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            High relevance (≥80%)
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Topic Clusters</CardTitle>
                                        <Layers className="h-6 w-6 text-purple-500 absolute top-0 right-4" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{entityData.topicClusters}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Semantic groups
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 relative">
                                        <CardTitle className="text-sm font-medium">Avg Relevance</CardTitle>
                                        <TrendingUp className="h-6 w-6 text-green-500 absolute top-0 right-4" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{Math.round(entityData.avgRelevance * 100)}%</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Overall quality score
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Search & Filter Bar */}
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search entities..."
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="clusters" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 group-data-horizontal/tabs:h-10">
                                    <TabsTrigger value="clusters" className="text-md data-[state=active]:text-slate-700 shadow-none">Topic Clusters</TabsTrigger>
                                    <TabsTrigger value="all" className="text-md data-[state=active]:text-slate-700 shadow-none">All Entities</TabsTrigger>
                                    <TabsTrigger value="types" className="text-md data-[state=active]:text-slate-700 shadow-none">By Type</TabsTrigger>
                                </TabsList>

                                <TabsContent value="clusters" className="space-y-4 mt-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {entityData.clusters.map((cluster) => (
                                            <Card key={cluster.id} className="hover:border-primary/50 transition-colors">
                                                <CardHeader>
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-lg flex items-center gap-2">
                                                            <Layers className="h-5 w-5" />
                                                            {cluster.name}
                                                        </CardTitle>
                                                        <Badge className={getClusterColor(cluster.color)}>
                                                            {cluster.entityCount} entities
                                                        </Badge>
                                                    </div>
                                                    <CardDescription>
                                                        Avg relevance: {Math.round(cluster.avgRelevance * 100)}%
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        {cluster.entities.map((entity, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <p className="font-medium text-sm">{entity.text}</p>
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {entity.type}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {entity.frequency} mentions • {Math.round(entity.confidence * 100)}% confidence
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="text-right">
                                                                        <p className="text-sm font-medium">{Math.round(entity.relevance * 100)}%</p>
                                                                        <p className="text-xs text-muted-foreground">Relevance</p>
                                                                    </div>
                                                                    <Progress value={entity.relevance * 100} className="w-20" />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button variant="ghost" size="sm" className="mt-3">
                                                            View All {cluster.entityCount} Entities <ArrowRight className="h-4 w-4 ml-2" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="all" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>All Extracted Entities</CardTitle>
                                            <CardDescription>
                                                Complete list of {entityData.totalEntities} entities sorted by relevance
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="pl-6">Entity</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead>Cluster</TableHead>
                                                        <TableHead className="text-right">Frequency</TableHead>
                                                        <TableHead className="text-right">Relevance</TableHead>
                                                        <TableHead className="text-right">Confidence</TableHead>
                                                        <TableHead className="w-12"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {entityData.allEntities.map((entity, idx) => (
                                                        <TableRow key={idx}>
                                                            <TableCell className="font-medium pl-6">{entity.text}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {entity.type}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-muted-foreground">
                                                                {entity.cluster}
                                                            </TableCell>
                                                            <TableCell className="text-right">{entity.frequency}</TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <span className="text-sm font-medium">
                                                                        {Math.round(entity.relevance * 100)}%
                                                                    </span>
                                                                    <Progress value={entity.relevance * 100} className="w-16" />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                                {Math.round(entity.confidence * 100)}%
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button variant="ghost" size="sm">
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="types" className="space-y-4 mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Entity Distribution by Type</CardTitle>
                                            <CardDescription>
                                                Breakdown of {entityData.totalEntities} entities across semantic categories
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {entityData.entityTypes.map((type, idx) => (
                                                    <div key={idx} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Tag className="h-4 w-4 text-muted-foreground" />
                                                                <span className="font-medium">{type.type}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm text-muted-foreground">
                                                                    {type.count} entities
                                                                </span>
                                                                <span className="text-sm font-medium">
                                                                    {type.percentage}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Progress value={type.percentage} className="h-2" />
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Entity Type Insights</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">Service-Heavy Content</p>
                                                    <p className="text-xs text-muted-foreground">48% of entities are services - focus on service pages and detailed descriptions</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">Feature Differentiation</p>
                                                    <p className="text-xs text-muted-foreground">17% features (24/7, same-day) - highlight these in CTAs and trust sections</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">Problem-Solution Content</p>
                                                    <p className="text-xs text-muted-foreground">13% problems (burst pipe, clogged drain) - create FAQ and troubleshooting content</p>
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
