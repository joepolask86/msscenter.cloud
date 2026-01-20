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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api-client"

interface AddServerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
}

export function AddServerDialog({ open, onOpenChange, onCreated }: AddServerDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        ip: "",
        registeredDate: "",
        expiringDate: "",
        cost: "",
        duration: "monthly",
        description: "",
        status: true,
    })
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            const costValue = parseFloat(formData.cost || "0")

            await api.post("/servers", {
                servername: formData.name,
                serverip: formData.ip,
                registrationdate: formData.registeredDate || undefined,
                expiringdate: formData.expiringDate || undefined,
                cost: isNaN(costValue) ? 0 : costValue,
                duration: formData.duration,
                note: formData.description || undefined,
                status: formData.status,
            })

            if (onCreated) {
                onCreated()
            }

            onOpenChange(false)
            setFormData({
                name: "",
                ip: "",
                registeredDate: "",
                expiringDate: "",
                cost: "",
                duration: "monthly",
                description: "",
                status: true,
            })
        } catch (error) {
            console.error("Failed to add server:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-primary text-lg font-semibold">Add New Server</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Server Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                placeholder="Enter server name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ip">Server IP <span className="text-red-500">*</span></Label>
                            <Input
                                id="ip"
                                placeholder="123.456.789.012"
                                value={formData.ip}
                                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="registeredDate">Registered Date <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    id="registeredDate"
                                    type="date"
                                    value={formData.registeredDate}
                                    onChange={(e) => setFormData({ ...formData, registeredDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expiringDate">Expiring Date <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    id="expiringDate"
                                    type="date"
                                    value={formData.expiringDate}
                                    onChange={(e) => setFormData({ ...formData, expiringDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cost">Cost $</Label>
                            <Input
                                id="cost"
                                placeholder="0.00"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.duration}
                                onValueChange={(value) => setFormData({ ...formData, duration: value })}
                            >
                                <SelectTrigger id="duration" className="w-full">
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="semi-annually">Semi Annually</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            className="min-h-[150px] max-h-[180px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 w-36">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status ? "active" : "cancelled"}
                            onValueChange={(value) => setFormData({ ...formData, status: value === "active" })}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 cursor-pointer"
                            disabled={submitting}
                        >
                            {submitting ? "Adding Server..." : "Add Server"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
