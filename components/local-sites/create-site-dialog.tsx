"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
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
import { Building2, MapPin, Phone, Globe, Search } from "lucide-react"

interface CreateSiteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    researchData?: {
        keyword: string
        location: string
        projectId: string
    }
    onSubmit?: (data: any) => void
}

// Mock available research projects (Normally fetched from API)
const MOCK_RESEARCH_PROJECTS = [
    { id: "101", keyword: "Emergency Plumber", location: "Chicago, IL" },
    { id: "102", keyword: "Roof Repair", location: "Miami, FL" },
    { id: "103", keyword: "Electrician", location: "Austin, TX" },
]

export function CreateSiteDialog({ open, onOpenChange, researchData, onSubmit }: CreateSiteDialogProps) {
    const [selectedProjectId, setSelectedProjectId] = useState<string>(researchData?.projectId || "")
    const [formData, setFormData] = useState({
        websiteName: researchData ? `${researchData.keyword} ${researchData.location}` : "",
        companyName: "",
        phoneNumber: "",
        city: researchData?.location || "",
        state: "",
        country: "United States",
        address: "",
        description: "",
        template: "plumber-v1",
    })
    const [submitting, setSubmitting] = useState(false)

    // Update form when researchData prop changes or project is selected from dropdown
    useEffect(() => {
        if (researchData) {
            setFormData(prev => ({
                ...prev,
                websiteName: `${researchData.keyword} ${researchData.location}`,
                city: researchData.location,
            }))
            setSelectedProjectId(researchData.projectId)
        }
    }, [researchData])

    const handleProjectSelect = (projectId: string) => {
        setSelectedProjectId(projectId)
        const project = MOCK_RESEARCH_PROJECTS.find(p => p.id === projectId)
        if (project) {
            setFormData(prev => ({
                ...prev,
                websiteName: `${project.keyword} ${project.location}`,
                city: project.location,
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setSubmitting(true)

            console.log("Creating site with data:", {
                ...formData,
                researchProjectId: selectedProjectId,
            })

            if (onSubmit) {
                onSubmit({
                    ...formData,
                    researchProjectId: selectedProjectId,
                })
            }

            onOpenChange(false)
        } catch (error) {
            console.error("Failed to create site:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 gap-0 flex flex-col">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-primary text-lg">Create New Site</DialogTitle>
                    <DialogDescription>
                        Enter your business information to generate your site
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* Website & Company Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
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
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
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
                                </div>
                            </div>

                            {/* Location Info */}
                            <div className="space-y-4">

                                <div className="grid grid-cols-2 gap-4">
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
                                        <Select>
                                            <SelectTrigger id="country" className="w-full">
                                                <SelectValue placeholder="Select a country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="us">United States</SelectItem>
                                                <SelectItem value="ca">Canada</SelectItem>
                                                <SelectItem value="uk">United Kingdom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 p-6 py-4 border-t shrink-0 bg-muted/20">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 cursor-pointer text-white"
                            disabled={submitting}
                        >
                            {submitting ? "Creating Site..." : "Create Site"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
