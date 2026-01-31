"use client"

import { useState } from "react"
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
    Building2,
    MapPin,
    Phone,
    Globe,
    Palette,
    Search,
    Rocket,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { TemplateGallery } from "@/components/local-sites/template-gallery"

// Mock available research projects
const MOCK_RESEARCH_PROJECTS = [
    { id: "101", keyword: "Emergency Plumber", location: "Chicago, IL" },
    { id: "102", keyword: "Roof Repair", location: "Miami, FL" },
    { id: "103", keyword: "Electrician", location: "Austin, TX" },
]

export function SiteBuildSettingsView({ params }: { params: { siteId: string } }) {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false)
    const [customizingTemplateId, setCustomizingTemplateId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        // Research & Template
        researchProjectId: "101",
        template: "plumber-v1",
        aiModel: "anthropic/claude-3.5-sonnet",

        // Business Information
        websiteName: "Chicago Emergency Plumber",
        companyName: "ABC Plumbing",
        phoneNumber: "(312) 555-0123",
        city: "Chicago",
        state: "IL",
        country: "United States",
        address: "",
        email: "",
        website: "",
        description: "",
        contactform: "",

        // Location Pages
        areaPageSlug: "service-area",

        // Theme Colors
        primaryColor: "#2563eb",
        secondaryColor: "#64748b",
        accentColor: "#f59e0b",
    })

    const handleCustomizeTheme = (templateId: string) => {
        setCustomizingTemplateId(templateId)
        setCustomizeDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            console.log("Starting site build with settings:", formData)
            // TODO: API call to save settings and start build

            // Navigate to builder page
            setTimeout(() => {
                router.push(`/local-sites-pro/${params.siteId}/builder`)
            }, 1000)
        } catch (error) {
            console.error("Failed to start site build:", error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleSaveSettings = async () => {
        setSubmitting(true)

        try {
            console.log("Saving site settings:", formData)
            // TODO: API call to save settings only

            // Show success message or navigate back
            setTimeout(() => {
                router.push(`/local-sites-pro/${params.siteId}/details`)
            }, 1000)
        } catch (error) {
            console.error("Failed to save settings:", error)
        } finally {
            setSubmitting(false)
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
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Link href="/local-sites-pro" className="hover:text-foreground transition-colors">
                                    Local Sites Pro
                                </Link>
                                <ChevronRight className="h-4 w-4" />
                                <Link href={`/local-sites-pro/${params.siteId}/details`} className="hover:text-foreground transition-colors">
                                    Site Details
                                </Link>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-foreground font-medium">Build Settings</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 py-6 pt-0 px-4 lg:px-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2">Site Build Settings</h1>
                                <p className="text-sm text-muted-foreground">
                                    Configure your site settings before starting the build process
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Business Information Section */}
                                <Card className="p-4 py-8">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5" />
                                            Business Information
                                        </CardTitle>
                                        <CardDescription>
                                            Enter your business details for the website
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Website & Company Name */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="websiteName">
                                                    Website Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="websiteName"
                                                    placeholder="e.g., Chicago Emergency Plumber"
                                                    value={formData.websiteName}
                                                    onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="companyName">
                                                    Company Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="companyName"
                                                    placeholder="e.g., ABC Plumbing Services"
                                                    value={formData.companyName}
                                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">
                                                    Phone Number <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="phoneNumber"
                                                    type="tel"
                                                    placeholder="e.g., (312) 555-0123"
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* City, State, & Country */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">
                                                    City <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="city"
                                                    placeholder="e.g., Chicago"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="state">
                                                    State/Province <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="state"
                                                    placeholder="e.g., IL"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="country">
                                                    Country <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.country === "United States" ? "us" : formData.country === "Canada" ? "ca" : "mx"}
                                                    onValueChange={(val) => setFormData({ ...formData, country: val === "us" ? "United States" : val === "ca" ? "Canada" : "Mexico" })}
                                                >
                                                    <SelectTrigger id="country" className="w-full">
                                                        <SelectValue placeholder="Select a country" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="us">United States</SelectItem>
                                                        <SelectItem value="ca">Canada</SelectItem>
                                                        <SelectItem value="mx">Mexico</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Address, Website, Email Address */}
                                        <div className="grid grid-cols-3 gap-4">

                                            {/* Address */}
                                            <div className="space-y-2">
                                                <Label htmlFor="address">Business Address</Label>
                                                <Input
                                                    id="address"
                                                    placeholder="e.g., 123 Main St, Suite 100"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>

                                            {/* Website */}
                                            <div className="space-y-2">
                                                <Label htmlFor="website">Website (Optional)</Label>
                                                <Input
                                                    id="website"
                                                    placeholder="e.g., https://www.example.com"
                                                    value={formData.website}
                                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                />
                                            </div>

                                            {/* Email Address */}
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    placeholder="e.g., info@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>

                                        </div>

                                        {/* Description/Contact Form */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Brief description of your business or services..."
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={5}
                                                    className="resize-none max-h-[180px] min-h-[120px]"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Optional: Helps us understand your business better
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="contactform">Contact Form Embed Code (Optional)</Label>
                                                <Textarea
                                                    id="contactform"
                                                    placeholder="<iframe src='' or <script>... (optional)"
                                                    value={formData.contactform}
                                                    onChange={(e) => setFormData({ ...formData, contactform: e.target.value })}
                                                    rows={5}
                                                    className="resize-none max-h-[180px] min-h-[120px]"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Embed code from services like Typeform, JotForm, or Google Forms
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Research & AI Modal and Location Pages Section */}
                                <div className="grid grid-cols-3 gap-4">
                                    <Card className="p-4 py-6">
                                        <CardContent className="space-y-4">
                                            {/* Research Project Selection */}
                                            <div className="space-y-2">
                                                <Label htmlFor="researchProject">
                                                    Research Project <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.researchProjectId}
                                                    onValueChange={(value) => setFormData({ ...formData, researchProjectId: value })}
                                                >
                                                    <SelectTrigger id="researchProject">
                                                        <SelectValue placeholder="Select a research project..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {MOCK_RESEARCH_PROJECTS.map((project) => (
                                                            <SelectItem key={project.id} value={project.id}>
                                                                {project.keyword} - {project.location} (#{project.id})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-muted-foreground">
                                                    The research data will determine your site structure and content
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="p-4 py-6">
                                        <CardContent className="space-y-4">
                                            {/* AI Model Selection */}
                                            <div className="space-y-2">
                                                <Label htmlFor="aiModel">
                                                    AI Model <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.aiModel}
                                                    onValueChange={(value) => setFormData({ ...formData, aiModel: value })}
                                                >
                                                    <SelectTrigger id="aiModel">
                                                        <SelectValue placeholder="Choose an AI model..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {/* Premium Models */}
                                                        <SelectItem value="anthropic/claude-3.5-sonnet">
                                                            Claude 3.5 Sonnet (Premium)
                                                        </SelectItem>
                                                        <SelectItem value="anthropic/claude-3-opus">
                                                            Claude 3 Opus (Premium)
                                                        </SelectItem>
                                                        <SelectItem value="openai/gpt-4o">
                                                            GPT-4o (Premium)
                                                        </SelectItem>
                                                        <SelectItem value="openai/gpt-4-turbo">
                                                            GPT-4 Turbo (Premium)
                                                        </SelectItem>
                                                        <SelectItem value="google/gemini-pro-1.5">
                                                            Gemini Pro 1.5 (Premium)
                                                        </SelectItem>
                                                        <SelectItem value="perplexity/llama-3.1-sonar-large-128k-online">
                                                            Perplexity Sonar Large (Premium)
                                                        </SelectItem>

                                                        {/* Mid-tier Models */}
                                                        <SelectItem value="anthropic/claude-3-haiku">
                                                            Claude 3 Haiku (Fast)
                                                        </SelectItem>
                                                        <SelectItem value="openai/gpt-3.5-turbo">
                                                            GPT-3.5 Turbo (Fast)
                                                        </SelectItem>
                                                        <SelectItem value="google/gemini-flash-1.5">
                                                            Gemini Flash 1.5 (Fast)
                                                        </SelectItem>

                                                        {/* Free Models */}
                                                        <SelectItem value="meta-llama/llama-3.1-8b-instruct:free">
                                                            Llama 3.1 8B (Free)
                                                        </SelectItem>
                                                        <SelectItem value="meta-llama/llama-3.1-70b-instruct:free">
                                                            Llama 3.1 70B (Free)
                                                        </SelectItem>
                                                        <SelectItem value="google/gemma-2-9b-it:free">
                                                            Gemma 2 9B (Free)
                                                        </SelectItem>
                                                        <SelectItem value="mistralai/mistral-7b-instruct:free">
                                                            Mistral 7B (Free)
                                                        </SelectItem>
                                                        <SelectItem value="microsoft/phi-3-mini-128k-instruct:free">
                                                            Phi-3 Mini (Free)
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-muted-foreground">
                                                    Select the AI model for content generation. Premium models produce higher quality content.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="p-4 py-6">
                                        <CardContent className="space-y-4">
                                            {/* AI Model Selection */}
                                            <div className="space-y-2">
                                                <Label htmlFor="areaPageSlug">
                                                    Area Page Slug
                                                </Label>
                                                <Input
                                                    id="areaPageSlug"
                                                    className="w-80"
                                                    placeholder="e.g., service-area, locations, areas-we-serve"
                                                    value={formData.areaPageSlug}
                                                    onChange={(e) => setFormData({ ...formData, areaPageSlug: e.target.value })}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    This slug will be used for location pages: <span className="font-mono text-blue-600">/service-area/chicago</span>
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Template Section */}
                                <Card className="p-4 py-8">
                                    <CardContent className="space-y-4">
                                        {/* Template Selection */}
                                        <div className="space-y-2">
                                            <Label className="text-lg font-semibold mb-4">
                                                Select Template <span className="text-red-500">*</span>
                                            </Label>
                                            <TemplateGallery
                                                selectedTemplateId={formData.template}
                                                onSelect={(templateId) => setFormData({ ...formData, template: templateId })}
                                                onCustomize={handleCustomizeTheme}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3">
                                    <Link href={`/local-sites-pro/${params.siteId}/details`}>
                                        <Button type="button" variant="outline" className="cursor-pointer">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="button"
                                        variant="default"
                                        onClick={handleSaveSettings}
                                        disabled={submitting}
                                        className="cursor-pointer"
                                    >
                                        {submitting ? "Saving..." : "Save Settings"}
                                    </Button>
                                </div>
                            </form>

                            {/* Theme Customization Dialog */}
                            <Dialog open={customizeDialogOpen} onOpenChange={setCustomizeDialogOpen}>
                                <DialogContent className="sm:max-w-[500px] p-0 gap-0">
                                    <DialogHeader className="py-4 px-6 border-b shrink-0">
                                        <DialogTitle className="flex items-center gap-2 text-primary text-lg">
                                            <Palette className="h-5 w-5" />
                                            Customize Theme Colors
                                        </DialogTitle>
                                        <DialogDescription>
                                            Customize the color scheme for your selected template
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4 px-6">
                                        {/* Primary Color */}
                                        <div className="space-y-2">
                                            <Label htmlFor="primaryColor">Primary Color</Label>
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    id="primaryColor"
                                                    type="color"
                                                    value={formData.primaryColor}
                                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                                    className="w-20 h-10 cursor-pointer p-0 border-none"
                                                />
                                                <Input
                                                    type="text"
                                                    value={formData.primaryColor}
                                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                                    className="flex-1 font-mono"
                                                    placeholder="#2563eb"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Main brand color used for buttons, links, and accents
                                            </p>
                                        </div>

                                        {/* Secondary Color */}
                                        <div className="space-y-2">
                                            <Label htmlFor="secondaryColor">Secondary Color</Label>
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    id="secondaryColor"
                                                    type="color"
                                                    value={formData.secondaryColor}
                                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                                    className="w-20 h-10 cursor-pointer p-0 border-none"
                                                />
                                                <Input
                                                    type="text"
                                                    value={formData.secondaryColor}
                                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                                    className="flex-1 font-mono"
                                                    placeholder="#64748b"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Supporting color for text, borders, and backgrounds
                                            </p>
                                        </div>

                                        {/* Accent Color */}
                                        <div className="space-y-2">
                                            <Label htmlFor="accentColor">Accent Color</Label>
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    id="accentColor"
                                                    type="color"
                                                    value={formData.accentColor}
                                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                                    className="w-20 h-10 cursor-pointer p-0 border-none"
                                                />
                                                <Input
                                                    type="text"
                                                    value={formData.accentColor}
                                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                                    className="flex-1 font-mono"
                                                    placeholder="#f59e0b"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Highlight color for CTAs, badges, and special elements
                                            </p>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setCustomizeDialogOpen(false)}
                                                className="cursor-pointer"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => setCustomizeDialogOpen(false)}
                                                className="cursor-pointer"
                                            >
                                                Apply Colors
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
