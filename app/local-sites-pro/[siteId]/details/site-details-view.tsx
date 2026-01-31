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
    Eye,
    Download,
    Rocket,
    Settings,
    Globe,
    FileText,
    Palette,
    ExternalLink,
    CheckCircle2,
    Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DeploymentHistory } from "@/components/local-sites/deployment-history"

export function SiteDetailsView({ params }: { params: { siteId: string } }) {
    const [selectedPlatform, setSelectedPlatform] = useState("netlify")
    const [isDeploying, setIsDeploying] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [websiteSlug, setWebsiteSlug] = useState("")

    // FTP Settings State
    const [ftpDomain, setFtpDomain] = useState("")
    const [ftpUsername, setFtpUsername] = useState("")
    const [ftpPassword, setFtpPassword] = useState("")
    const [ftpHomeDirectory, setFtpHomeDirectory] = useState("/public_html")
    const [ftpSettingsSaved, setFtpSettingsSaved] = useState(false)

    // Mock site data
    const siteData = {
        id: params.siteId,
        name: "Chicago Emergency Plumber",
        domain: "emergency-plumber-chicago.com",
        status: "built",
        template: "Plumber V1",
        totalPages: 24,
        servicePages: 8,
        locationPages: 12,
        blogPosts: 3,
        homepageSections: 8,
        lastDeployed: "2 days ago",
        createdAt: "Jan 20, 2026",
        websiteName: "Chicago Emergency Plumber",
        companyName: "ABC Plumbing",
        phoneNumber: "(312) 555-0123",
        city: "Chicago",
        state: "IL",
        country: "United States",
        keyword: "Emergency Plumber",
        location: "Chicago",
    }

    // Auto-generate slug from keyword + city
    const generateSlug = (keyword: string, city: string) => {
        return `${keyword.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}`
    }

    // Initialize slug on mount
    useState(() => {
        const autoSlug = generateSlug(siteData.keyword, siteData.city)
        setWebsiteSlug(autoSlug)
    })

    // Get platform URL based on selection
    const getPlatformURL = () => {
        if (selectedPlatform === "ftp") {
            return ftpDomain || "your-custom-domain.com"
        }
        const slug = websiteSlug || generateSlug(siteData.keyword, siteData.city)
        switch (selectedPlatform) {
            case "netlify":
                return `https://${slug}.netlify.app`
            case "vercel":
                return `https://${slug}.vercel.app`
            case "github":
                return `https://${slug}.github.io`
            case "cloudflare":
                return `https://${slug}.pages.dev`
            default:
                return ""
        }
    }

    const handleSaveFtpSettings = () => {
        // TODO: Save FTP settings to backend
        console.log("Saving FTP settings:", { ftpDomain, ftpUsername, ftpHomeDirectory })
        setFtpSettingsSaved(true)
        setTimeout(() => setFtpSettingsSaved(false), 3000)
    }

    const handleDeploy = async () => {
        setIsDeploying(true)
        // TODO: Implement deployment logic
        console.log("Deploying to:", selectedPlatform, "with slug:", websiteSlug)
        setTimeout(() => setIsDeploying(false), 2000)
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        // TODO: Implement download logic
        console.log("Downloading site as ZIP")
        setTimeout(() => setIsDownloading(false), 2000)
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
                                    <span className="text-foreground font-medium">{siteData.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/local-sites-pro/${params.siteId}/build-settings`}>
                                        <Button variant="outline" size="sm" className="cursor-pointer">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Edit Site Details
                                        </Button>
                                    </Link>
                                    <Link href={`/local-sites-pro/${params.siteId}/builder`}>
                                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white cursor-pointer">
                                            <Rocket className="h-4 w-4 mr-2" />
                                            Start Site Build
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header with Status */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold tracking-tight">{siteData.name}</h1>
                                        <Badge className="bg-green-700 hover:bg-green-600">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            {siteData.status === "built" ? "Built" : "Draft"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        {siteData.domain}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card className="border-2 hover:border-blue-500 transition-colors cursor-pointer">
                                    <CardContent className="p-6 py-2">
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Preview Site</h3>
                                                <p className="text-xs text-muted-foreground">View your site before deploying</p>
                                            </div>
                                            <Link href={`/local-sites-pro/${params.siteId}/preview`} className="w-full">
                                                <Button className="w-full" variant="outline">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Open Preview
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 hover:border-orange-500 transition-colors cursor-pointer">
                                    <CardContent className="p-6 py-2">
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Blog Content</h3>
                                                <p className="text-xs text-muted-foreground">Generate SEO blog posts</p>
                                            </div>
                                            <Link href={`/local-sites-pro/${params.siteId}/blog-content`} className="w-full">
                                                <Button className="w-full" variant="outline">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Manage Blogs
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 hover:border-green-500 transition-colors cursor-pointer">
                                    <CardContent className="p-6 py-2">
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                                                <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Download ZIP</h3>
                                                <p className="text-xs text-muted-foreground">Get static files for manual hosting</p>
                                            </div>
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                                onClick={handleDownload}
                                                disabled={isDownloading}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                {isDownloading ? "Preparing..." : "Download"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 hover:border-purple-500 transition-colors cursor-pointer">
                                    <CardContent className="p-6 py-2">
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                                                <Rocket className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Deploy Site</h3>
                                                <p className="text-xs text-muted-foreground">Push to cloud platform</p>
                                            </div>
                                            <Button
                                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                                onClick={handleDeploy}
                                                disabled={isDeploying}
                                            >
                                                <Rocket className="h-4 w-4 mr-2" />
                                                {isDeploying ? "Deploying..." : "Deploy Now"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="deployment">Deployment</TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="space-y-4 mt-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Site Statistics */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5" />
                                                    Site Statistics
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Total Pages</span>
                                                        <span className="font-semibold">{siteData.totalPages}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Service Pages</span>
                                                        <span className="font-semibold">{siteData.servicePages}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Location Pages</span>
                                                        <span className="font-semibold">{siteData.locationPages}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Blog Posts</span>
                                                        <span className="font-semibold">{siteData.blogPosts}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Homepage Sections</span>
                                                        <span className="font-semibold">{siteData.homepageSections}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Business Information */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Globe className="h-5 w-5" />
                                                    Business Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Company Name</p>
                                                        <p className="text-sm font-medium">{siteData.companyName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Phone</p>
                                                        <p className="text-sm font-medium">{siteData.phoneNumber}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Location</p>
                                                        <p className="text-sm font-medium">
                                                            {siteData.city}, {siteData.state}, {siteData.country}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Created</p>
                                                        <p className="text-sm font-medium flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {siteData.createdAt}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* Deployment Tab */}
                                <TabsContent value="deployment" className="space-y-4 mt-4">
                                    <CardContent className="space-y-6 px-0">

                                        <div className="flex gap-4">
                                            {/* Platform-specific settings */}
                                            {selectedPlatform !== "manual" && (
                                                <div className="w-1/2 space-y-6 p-4 rounded-lg border bg-muted/30">
                                                    <div>
                                                        <h2 className="text-lg font-semibold mb-4">Deployment Settings</h2>
                                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                            <Rocket className="h-4 w-4" />
                                                            {selectedPlatform === "netlify" ? "Netlify" :
                                                                selectedPlatform === "vercel" ? "Vercel" :
                                                                    selectedPlatform === "github" ? "GitHub Pages" :
                                                                        "Cloudflare Pages"} Configuration
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground mb-4">
                                                            Your site will be automatically deployed to {selectedPlatform === "netlify" ? "Netlify" :
                                                                selectedPlatform === "vercel" ? "Vercel" :
                                                                    selectedPlatform === "github" ? "GitHub Pages" :
                                                                        "Cloudflare Pages"}.
                                                            Make sure you have connected your account in Settings.
                                                        </p>
                                                    </div>

                                                    {/* Platform Selection */}
                                                    <div className="space-y-2">
                                                        <Label>Hosting Provider *</Label>
                                                        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select platform" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="netlify">Netlify</SelectItem>
                                                                <SelectItem value="vercel">Vercel</SelectItem>
                                                                <SelectItem value="github">GitHub Pages</SelectItem>
                                                                <SelectItem value="cloudflare">Cloudflare Pages</SelectItem>
                                                                <SelectItem value="ftp">Custom (FTP)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <p className="text-xs text-muted-foreground">
                                                            Select your preferred hosting platform
                                                        </p>
                                                    </div>

                                                    {/* FTP Configuration (only shown when FTP is selected) */}
                                                    {selectedPlatform === "ftp" && (
                                                        <div className="space-y-4 pt-4 border-t">
                                                            <h4 className="font-semibold text-sm">FTP Configuration</h4>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="ftp-domain">Domain *</Label>
                                                                <Input
                                                                    id="ftp-domain"
                                                                    value={ftpDomain}
                                                                    onChange={(e) => setFtpDomain(e.target.value)}
                                                                    placeholder="e.g., yourdomain.com"
                                                                />
                                                                <p className="text-xs text-muted-foreground">
                                                                    Your custom domain name
                                                                </p>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="ftp-username">FTP Username *</Label>
                                                                    <Input
                                                                        id="ftp-username"
                                                                        value={ftpUsername}
                                                                        onChange={(e) => setFtpUsername(e.target.value)}
                                                                        placeholder="e.g., user@yourdomain.com"
                                                                        className="w-full"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor="ftp-password">FTP Password *</Label>
                                                                    <Input
                                                                        id="ftp-password"
                                                                        type="password"
                                                                        value={ftpPassword}
                                                                        onChange={(e) => setFtpPassword(e.target.value)}
                                                                        placeholder="••••••••"
                                                                        className="w-full"
                                                                    />
                                                                </div>

                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="ftp-home-dir">Home Directory *</Label>
                                                                <Input
                                                                    id="ftp-home-dir"
                                                                    value={ftpHomeDirectory}
                                                                    onChange={(e) => setFtpHomeDirectory(e.target.value)}
                                                                    placeholder="e.g., /public_html"
                                                                />
                                                                <p className="text-xs text-muted-foreground">
                                                                    The directory where files will be uploaded
                                                                </p>
                                                            </div>

                                                            <Button
                                                                onClick={handleSaveFtpSettings}
                                                                variant="default"
                                                                className="cursor-pointer"
                                                                disabled={!ftpDomain || !ftpUsername || !ftpPassword || !ftpHomeDirectory}
                                                            >
                                                                <Settings className="h-4 w-4 mr-2" />
                                                                {ftpSettingsSaved ? "Settings Saved!" : "Save FTP Settings"}
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {selectedPlatform !== "ftp" && (
                                                        <>
                                                            {/* Website Slug */}
                                                            <div className="space-y-2">
                                                                <Label htmlFor="website-slug">Website Slug *</Label>
                                                                <Input
                                                                    id="website-slug"
                                                                    value={websiteSlug}
                                                                    onChange={(e) => setWebsiteSlug(e.target.value)}
                                                                    placeholder="e.g., emergency-plumber-chicago"
                                                                />
                                                                <p className="text-xs text-muted-foreground">
                                                                    Auto-fills based on your keyword + city
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* URL Preview */}
                                                    <div className="space-y-2">
                                                        <Label>Website URL Preview</Label>
                                                        <div className="p-3 rounded-md bg-muted/50 border">
                                                            <p className="text-sm font-mono text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                                                <Globe className="h-4 w-4" />
                                                                {getPlatformURL()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        onClick={handleDeploy}
                                                        disabled={isDeploying || (selectedPlatform === "ftp" ? !ftpDomain : !websiteSlug)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Rocket className="h-4 w-4 mr-2" />
                                                        {isDeploying ? "Deploying..." : `Deploy to ${selectedPlatform === "ftp" ? "Custom Domain" : selectedPlatform === "netlify" ? "Netlify" :
                                                            selectedPlatform === "vercel" ? "Vercel" :
                                                                selectedPlatform === "github" ? "GitHub Pages" :
                                                                    "Cloudflare Pages"}`}
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Deployment History */}
                                            <div className="w-2/3 space-y-4">
                                                <DeploymentHistory />
                                            </div>
                                        </div>

                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
