"use client"

import { useState, useEffect } from "react"
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
    CheckCircle2,
    Loader2,
    Sparkles,
    Network,
    Code,
    Eye,
    Download,
    Rocket,
    AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type GenerationStep = {
    id: string
    name: string
    description: string
    status: "pending" | "running" | "completed" | "error"
    progress: number
    icon: any
}

export function SiteBuilderView({ params }: { params: { siteId: string } }) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [overallProgress, setOverallProgress] = useState(0)
    const [isGenerating, setIsGenerating] = useState(false)

    // Generation steps based on Entity OS workflow
    const [steps, setSteps] = useState<GenerationStep[]>([
        {
            id: "content-generation",
            name: "Content Generation",
            description: "Generating entity-optimized content from briefs",
            status: "pending",
            progress: 0,
            icon: FileText,
        },
        {
            id: "optimization",
            name: "Content Optimization",
            description: "Validating entity coverage and intent match",
            status: "pending",
            progress: 0,
            icon: Sparkles,
        },
        {
            id: "schema",
            name: "Schema Generation",
            description: "Creating JSON-LD schema for each page type",
            status: "pending",
            progress: 0,
            icon: Code,
        },
        {
            id: "internal-links",
            name: "Internal Linking",
            description: "Building entity silo structure",
            status: "pending",
            progress: 0,
            icon: Network,
        },
        {
            id: "site-render",
            name: "Site Rendering",
            description: "Generating static site with template",
            status: "pending",
            progress: 0,
            icon: Eye,
        },
    ])

    // Mock site data - Blog posts are NOT included in initial generation
    const siteData = {
        id: params.siteId,
        name: "Chicago Emergency Plumber",
        template: "Plumber V1",
        homepagePages: 1,
        servicePages: 8,
        locationPages: 12,
    }

    const totalPages = siteData.homepagePages + siteData.servicePages + siteData.locationPages

    // Simulate generation process
    const startGeneration = async () => {
        setIsGenerating(true)

        for (let i = 0; i < steps.length; i++) {
            // Update current step to running
            setCurrentStep(i)
            setSteps(prev => prev.map((step, idx) =>
                idx === i ? { ...step, status: "running" as const } : step
            ))

            // Simulate progress
            for (let progress = 0; progress <= 100; progress += 10) {
                await new Promise(resolve => setTimeout(resolve, 200))
                setSteps(prev => prev.map((step, idx) =>
                    idx === i ? { ...step, progress } : step
                ))
                setOverallProgress(((i * 100 + progress) / steps.length))
            }

            // Mark as completed
            setSteps(prev => prev.map((step, idx) =>
                idx === i ? { ...step, status: "completed" as const, progress: 100 } : step
            ))
        }

        setIsGenerating(false)
        setOverallProgress(100)
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
                                    <Link href="/local-sites-pro" className="hover:text-foreground transition-colors">
                                        Local Sites Pro
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <Link href={`/local-sites-pro/${params.siteId}`} className="hover:text-foreground transition-colors">
                                        {siteData.name}
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-foreground font-medium">Site Builder</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2">Site Builder</h1>
                                <p className="text-sm text-muted-foreground">
                                    Generating {totalPages} pages (Homepage + Services + Locations)
                                </p>
                            </div>

                            {/* Overall Progress */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Generation Progress</CardTitle>
                                            <CardDescription>
                                                {isGenerating ? "Building your site..." : overallProgress === 100 ? "Site generation complete!" : "Ready to start"}
                                            </CardDescription>
                                        </div>
                                        {!isGenerating && overallProgress === 0 && (
                                            <Button
                                                onClick={startGeneration}
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white cursor-pointer"
                                            >
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Start Generation
                                            </Button>
                                        )}
                                        {overallProgress === 100 && (
                                            <Badge className="bg-green-600 hover:bg-green-700">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Complete
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Overall Progress</span>
                                            <span className="font-semibold">{Math.round(overallProgress)}%</span>
                                        </div>
                                        <Progress value={overallProgress} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Generation Steps */}
                            <div className="grid gap-4">
                                {steps.map((step, index) => {
                                    const Icon = step.icon
                                    return (
                                        <Card
                                            key={step.id}
                                            className={
                                                step.status === "running"
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                                                    : step.status === "completed"
                                                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                                        : ""
                                            }
                                        >
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                                                            flex h-10 w-10 items-center justify-center rounded-full
                                                            ${step.status === "completed" ? "bg-green-600 text-white" : ""}
                                                            ${step.status === "running" ? "bg-blue-500 text-white" : ""}
                                                            ${step.status === "pending" ? "bg-muted text-muted-foreground" : ""}
                                                        `}>
                                                            {step.status === "completed" ? (
                                                                <CheckCircle2 className="h-5 w-5" />
                                                            ) : step.status === "running" ? (
                                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                            ) : (
                                                                <Icon className="h-5 w-5" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-base">{step.name}</CardTitle>
                                                            <CardDescription className="text-xs">
                                                                {step.description}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                    <Badge variant={
                                                        step.status === "completed" ? "default" :
                                                            step.status === "running" ? "default" :
                                                                "secondary"
                                                    } className={
                                                        step.status === "completed" ? "bg-green-600 hover:bg-green-700" :
                                                            step.status === "running" ? "bg-blue-500 hover:bg-blue-600" :
                                                                ""
                                                    }>
                                                        {step.status === "completed" ? "Complete" :
                                                            step.status === "running" ? "Running" :
                                                                "Pending"}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            {step.status === "running" && (
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-muted-foreground">Progress</span>
                                                            <span className="font-semibold">{step.progress}%</span>
                                                        </div>
                                                        <Progress value={step.progress} className="h-1" />
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* Actions - Show when complete */}
                            {overallProgress === 100 && (
                                <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-500/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            Site Generated Successfully!
                                        </CardTitle>
                                        <CardDescription>
                                            Your site is ready to preview and deploy
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/local-sites-pro/${params.siteId}/preview`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1"
                                            >
                                                <Button variant="outline" className="w-full cursor-pointer">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Preview Site
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="default"
                                                className="flex-1 cursor-pointer"
                                                onClick={() => {
                                                    // TODO: Implement ZIP download functionality
                                                    // console.log('Download ZIP clicked')
                                                }}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download ZIP
                                            </Button>
                                            <Link
                                                href={`/local-sites-pro/${params.siteId}/details`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1"
                                            >
                                                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white cursor-pointer">
                                                    <Rocket className="h-4 w-4 mr-2" />
                                                    Deploy Site
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Site Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Site Information</CardTitle>
                                    <CardDescription>
                                        Initial site structure (Blog posts generated separately)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                        <div className="text-center p-3 rounded-lg border bg-muted/30">
                                            <p className="text-2xl font-bold text-blue-600">{totalPages}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Total Pages</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border bg-muted/30">
                                            <p className="text-2xl font-bold text-purple-600">{siteData.servicePages}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Service Pages</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border bg-muted/30">
                                            <p className="text-2xl font-bold text-green-600">{siteData.locationPages}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Location Pages</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
