"use client"

import { useState, useEffect } from "react"
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
import { Server as BaseServer } from "@/lib/types"

interface ApiServer extends BaseServer {
    registrationDate?: string
    expiringDate?: string
    cost: number
    duration: string
    note?: string
    createdAt?: string
    updatedAt?: string
}

interface UpdateServerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    server?: ApiServer
    onUpdated?: () => void
}

export function UpdateServerDialog({ open, onOpenChange, server, onUpdated }: UpdateServerDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        ip: "",
        registeredDate: "",
        expiringDate: "",
        cost: "",
        duration: "",
        description: "",
        status: "",
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (server) {
            setFormData({
                name: server.name,
                ip: server.ip,
                registeredDate: formatDateForInput(server.registrationDate),
                expiringDate: formatDateForInput(server.expiringDate),
                cost: server.cost != null ? String(server.cost) : "",
                duration: server.duration,
                description: server.note || "",
                status: server.status ? "Active" : "Cancelled",
            })
        }
    }, [server])

    const formatDateForInput = (dateStr?: string) => {
        if (!dateStr) return ""
        if (dateStr.includes("T")) {
            return dateStr.split("T")[0]
        }
        if (dateStr.includes("-")) {
            const parts = dateStr.split("-")
            if (parts[0].length === 4) return dateStr
            return `${parts[2]}-${parts[1]}-${parts[0]}`
        }
        return dateStr
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!server) return

        try {
            setSubmitting(true)
            const costValue = parseFloat(formData.cost || "0")

            await api.put(`/servers/${server.id}`, {
                servername: formData.name,
                serverip: formData.ip,
                registrationdate: formData.registeredDate || undefined,
                expiringdate: formData.expiringDate || undefined,
                cost: isNaN(costValue) ? 0 : costValue,
                duration: formData.duration,
                note: formData.description || undefined,
                status: formData.status === "Active",
            })

            if (onUpdated) {
                onUpdated()
            }

            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update server:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-primary text-xl">Update Server</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4  p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="update-name">Server Name</Label>
                            <Input
                                id="update-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="update-ip">Server IP</Label>
                            <Input
                                id="update-ip"
                                value={formData.ip}
                                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="update-registeredDate">Registered Date</Label>
                            <Input
                                id="update-registeredDate"
                                type="date"
                                value={formData.registeredDate}
                                onChange={(e) => setFormData({ ...formData, registeredDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="update-expiringDate">Expiring Date</Label>
                            <Input
                                id="update-expiringDate"
                                type="date"
                                value={formData.expiringDate}
                                onChange={(e) => setFormData({ ...formData, expiringDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="update-cost">Cost $</Label>
                            <Input
                                id="update-cost"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="update-duration">Duration</Label>
                            <Select
                                value={formData.duration}
                                onValueChange={(value) => setFormData({ ...formData, duration: value })}
                            >
                                <SelectTrigger id="update-duration" className="w-full">
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
                        <Label htmlFor="update-description">Description</Label>
                        <Textarea
                            id="update-description"
                            className="max-h-[180px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 w-36">
                        <Label htmlFor="update-status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger id="update-status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 cursor-pointer"
                            disabled={submitting || !server}
                        >
                            {submitting ? "Updating Server..." : "Update Server"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
