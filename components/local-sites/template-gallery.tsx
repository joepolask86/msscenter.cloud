"use client"

import { useState } from "react"
import { Check, Search, Filter, Settings, Palette } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

export type Template = {
    id: string
    name: string
    description: string
    category: "plumbing" | "electrical" | "roofing" | "hvac" | "pest-control" | "general" | "other"
    thumbnail: string
    features: string[]
}

const MOCK_TEMPLATES: Template[] = [
    {
        id: "plumber-v1",
        name: "Plumber V1",
        description: "Professional design optimized for emergency and residential plumbing services. High-conversion hero section and trust signals.",
        category: "plumbing",
        thumbnail: "/api/templates/plumber-v1/assets/screenshot.png",
        features: ["Custom", "Service Area Map", "Sticky Header"]
    },
    {
        id: "pest-control-v1",
        name: "Pest Control V1",
        description: "Specialized template for pest control services with emphasis on emergency response and service guarantees.",
        category: "pest-control",
        thumbnail: "/api/templates/pest-control-v1/screenshot.png",
        features: ["Custom", "Service Area Map", "Sticky Header"]
    },
    {
        id: "electrical-v1",
        name: "Electrical V1",
        description: "Clean, modern template for electrical contractors. Focuses on safety certifications and service variety.",
        category: "electrical",
        thumbnail: "/api/templates/electrical-v1/screenshot.png",
        features: ["Custom", "Service Area Map", "Sticky Header"]
    },
    {
        id: "hvac-service-v1",
        name: "HVAC Service V1",
        description: "Seasonal-focused design for heating and cooling experts. Easy scheduling and maintenance plan promotion.",
        category: "hvac",
        thumbnail: "/api/templates/hvac-service-v1/screenshot.png",
        features: ["Custom", "Service Area Map", "Sticky Header"]
    },
    {
        id: "roofing-v1",
        name: "Roofing V1",
        description: "Visual-heavy template designed to showcase roofing projects and materials. Verification and testimonials prominent.",
        category: "roofing",
        thumbnail: "/api/templates/roofing-v1/screenshot.png",
        features: ["Custom", "Service Area Map", "Sticky Header"]
    },
]

interface TemplateGalleryProps {
    selectedTemplateId: string
    onSelect: (templateId: string) => void
    onCustomize?: (templateId: string) => void
}

export function TemplateGallery({ selectedTemplateId, onSelect, onCustomize }: TemplateGalleryProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState<string>("all")

    const filteredTemplates = MOCK_TEMPLATES.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === "all" || template.category === activeCategory
        return matchesSearch && matchesCategory
    })

    const categories = [
        { id: "all", label: "All Templates" },
        { id: "plumbing", label: "Plumbing" },
        { id: "pest-control", label: "Pest Control" },
        { id: "electrical", label: "Electrical" },
        { id: "hvac", label: "HVAC" },
        { id: "roofing", label: "Roofing" },
    ]

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
                    {/* <ScrollArea className="w-full pb-2 sm:pb-0"></ScrollArea> */}
                    <TabsList className="mb-0">
                        {categories.map(cat => (
                            <TabsTrigger key={cat.id} value={cat.id}>{cat.label}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => (
                    <Card
                        key={template.id}
                        className={`group cursor-pointer gap-2 transition-all border-2 ${selectedTemplateId === template.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:shadow-sm"
                            }`}
                        onClick={() => onSelect(template.id)}
                    >
                        <CardHeader className="p-4 pt-0 pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-base mb-1">{template.name}</CardTitle>
                                    <Badge variant="secondary" className="text-xs font-normal">
                                        {categories.find(c => c.id === template.category)?.label}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    {onCustomize && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onCustomize(template.id)
                                            }}
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {selectedTemplateId === template.id && (
                                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                            <Check className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 pb-2">
                            {/* Template Screenshot */}
                            <div className="w-full h-32 bg-muted rounded-md mb-3 overflow-hidden relative flex items-center justify-center">
                                {/* Placeholder until API route is created */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                    <div className="text-center">
                                        <Palette className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                                        <p className="text-xs text-muted-foreground/70">{template.name}</p>
                                    </div>
                                </div>
                                {/* Uncomment when API route is ready
                                <Image
                                    src={template.thumbnail}
                                    alt={`${template.name} screenshot`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                />
                                */}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {template.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {template.features.slice(0, 3).map((feature, i) => (
                                    <Badge key={i} variant="outline" className="text-[10px] px-1 py-0 h-5">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredTemplates.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        <p>No templates found matching your criteria.</p>
                        <Button variant="link" onClick={() => { setSearchQuery(""); setActiveCategory("all") }}>
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
