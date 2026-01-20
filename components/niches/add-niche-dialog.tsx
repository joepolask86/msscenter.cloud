 "use client"

 import { useState } from "react"
 import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
 } from "@/components/ui/dialog"
 import { Button } from "@/components/ui/button"
 import { Input } from "@/components/ui/input"
 import { Label } from "@/components/ui/label"
 import { Textarea } from "@/components/ui/textarea"
 import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
 import { api } from "@/lib/api-client"

 interface AddNicheDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     onCreated?: () => void
 }

 export function AddNicheDialog({ open, onOpenChange, onCreated }: AddNicheDialogProps) {
     const [formData, setFormData] = useState({
         name: "",
         elocalName: "",
         phoneNumber: "",
         categoryId: "",
         description: "",
         enabled: "yes",
     })
     const [submitting, setSubmitting] = useState(false)

     const handleSubmit = async (e: React.FormEvent) => {
         e.preventDefault()
         try {
             setSubmitting(true)
             await api.post("/niches", {
                 niche_name: formData.name,
                 elocal_name: formData.elocalName,
                 phone_number: formData.phoneNumber,
                 category_id: formData.categoryId ? Number(formData.categoryId) : undefined,
                 niche_description: formData.description,
                 status: formData.enabled === "yes",
             })
             if (onCreated) {
                 onCreated()
             }
             onOpenChange(false)
             setFormData({
                 name: "",
                 elocalName: "",
                 phoneNumber: "",
                 categoryId: "",
                 description: "",
                 enabled: "yes",
             })
         } catch (error) {
             console.error("Failed to add niche:", error)
         } finally {
             setSubmitting(false)
         }
     }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-primary text-lg">Add New Niche</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Niche Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            placeholder="Enter niche name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="elocalName">eLocal Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="elocalName"
                            placeholder="Enter eLocal name"
                            value={formData.elocalName}
                            onChange={(e) => setFormData({ ...formData, elocalName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-wrap justify-between gap-2">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                placeholder="Enter phone number"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Category ID (Optional)</Label>
                            <Input
                                id="categoryId"
                                placeholder="Enter category ID"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                type="number"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter niche description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Enabled</Label>
                        <RadioGroup
                            value={formData.enabled}
                            onValueChange={(value: string) => setFormData({ ...formData, enabled: value })}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="yes" />
                                <Label htmlFor="yes" className="font-normal cursor-pointer">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="no" />
                                <Label htmlFor="no" className="font-normal cursor-pointer">No</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90"
                            disabled={submitting}
                        >
                            {submitting ? "Adding Niche..." : "Add Niche"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
