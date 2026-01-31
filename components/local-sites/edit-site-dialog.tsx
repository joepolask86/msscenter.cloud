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
import { Building2, MapPin, Phone, Globe } from "lucide-react"

interface EditSiteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    site: any // Replace with proper type
    onUpdated?: (data: any) => void
}

export function EditSiteDialog({ open, onOpenChange, site, onUpdated }: EditSiteDialogProps) {
    const [formData, setFormData] = useState({
        websiteName: "",
        companyName: "",
        phoneNumber: "",
        city: "",
        state: "",
        country: "United States",
        address: "",
        description: "",
    })
    const [submitting, setSubmitting] = useState(false)

    // Load site data when dialog opens or site changes
    useEffect(() => {
        if (site) {
            setFormData({
                websiteName: site.websiteName || site.name || "",
                companyName: site.companyName || "",
                phoneNumber: site.phoneNumber || "",
                city: site.city || "",
                state: site.state || "",
                country: site.country || "United States",
                address: site.address || "",
                description: site.description || "",
            })
        }
    }, [site, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setSubmitting(true)

            console.log("Updating site with data:", {
                siteId: site.id,
                ...formData,
            })

            // TODO: API call to update site

            if (onUpdated) {
                onUpdated({
                    id: site.id,
                    ...formData,
                })
            }

            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update site:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 gap-0 flex flex-col">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-primary text-lg">Edit Site Information</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">

                            {/* Website & Company Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-websiteName">
                                            Website Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="edit-websiteName"
                                            placeholder="e.g., Chicago Emergency Plumber"
                                            value={formData.websiteName}
                                            onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-companyName">
                                            Company Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="edit-companyName"
                                            placeholder="e.g., ABC Plumbing Services"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info & Location */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-phoneNumber">
                                            Phone Number <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="edit-phoneNumber"
                                            type="tel"
                                            placeholder="e.g., (312) 555-0123"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-city">
                                            City <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="edit-city"
                                            placeholder="e.g., Chicago"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* More Location Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-state">
                                            State/Province <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="edit-state"
                                            placeholder="e.g., IL"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-country">
                                            Country <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.country === "United States" ? "us" : formData.country === "Canada" ? "ca" : "mx"}
                                            onValueChange={(val) => setFormData({ ...formData, country: val === "us" ? "United States" : val === "ca" ? "Canada" : "Mexico" })}
                                        >
                                            <SelectTrigger id="edit-country" className="w-full">
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
                            {submitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
