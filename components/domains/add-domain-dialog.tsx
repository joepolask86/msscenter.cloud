"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api-client"
import type { Server } from "@/lib/types"

interface AddDomainDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdded?: () => void
}

export function AddDomainDialog({ open, onOpenChange, onAdded }: AddDomainDialogProps) {
    const [servers, setServers] = useState<Server[]>([])
    const [formData, setFormData] = useState({
        domainName: "",
        serverId: "",
        domainQuality: "",
        domainType: "",
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchServers = async () => {
            try {
                const res = await api.get<{ servers: Server[] }>("/servers/active")
                setServers(res.servers)
            } catch (error) {
                console.error("Failed to fetch servers:", error)
            }
        }

        if (open) {
            fetchServers()
            setFormData({
                domainName: "",
                serverId: "",
                domainQuality: "",
                domainType: "",
            })
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSubmitting(true)

            await api.post("/domains", {
                domain_name: formData.domainName,
                server_id: Number(formData.serverId),
                domain_quality: formData.domainQuality ? Number(formData.domainQuality) : undefined,
                domain_type: formData.domainType ? Number(formData.domainType) : undefined,
            })

            if (onAdded) {
                onAdded()
            }

            onOpenChange(false)
            setFormData({
                domainName: "",
                serverId: "",
                domainQuality: "",
                domainType: "",
            })
        } catch (error) {
            console.error("Failed to add domain:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    {/* Orange title as per image */}
                    <DialogTitle className="text-primary text-lg">Add New Domain</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="domainName">Domain Name</Label>
                        <Input
                            id="domainName"
                            placeholder="yourdomain.com"
                            value={formData.domainName}
                            onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="server">Server</Label>
                        <Select
                            value={formData.serverId}
                            onValueChange={(value) => setFormData({ ...formData, serverId: value })}
                        >
                            <SelectTrigger id="server">
                                <SelectValue placeholder="Select a server" />
                            </SelectTrigger>
                            <SelectContent>
                                {servers.map((server) => (
                                    <SelectItem key={server.id} value={String(server.id)}>
                                        {server.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Domain Status</Label>
                        <Select
                            value={formData.domainQuality}
                            onValueChange={(value) => setFormData({ ...formData, domainQuality: value })}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Yes</SelectItem>
                                <SelectItem value="2">No</SelectItem>
                                <SelectItem value="3">Spam</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quality">Domain Quality</Label>
                        <Select
                            value={formData.domainType}
                            onValueChange={(value) => setFormData({ ...formData, domainType: value })}
                        >
                            <SelectTrigger id="quality">
                                <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Normal</SelectItem>
                                <SelectItem value="2">Freenom</SelectItem>
                                <SelectItem value="3">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 cursor-pointer"
                            disabled={submitting}
                        >
                            {submitting ? "Adding Domain..." : "Add Domain"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
