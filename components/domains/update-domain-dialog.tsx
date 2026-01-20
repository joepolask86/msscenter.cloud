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

interface Domain {
    id: number
    name: string
    serverId: number
    registrar: string
    expiringDate: string | null
    build: number
    quality: number
}

interface UpdateDomainDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    domain?: Domain
    onUpdated?: () => void
}

export function UpdateDomainDialog({ open, onOpenChange, domain, onUpdated }: UpdateDomainDialogProps) {
    const [servers, setServers] = useState<Server[]>([])
    const [formData, setFormData] = useState({
        name: "",
        serverId: "",
        quality: "",
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
        }
    }, [open])

    useEffect(() => {
        if (domain) {
            setFormData({
                name: domain.name,
                serverId: String(domain.serverId),
                quality: String(domain.quality),
            })
        }
    }, [domain])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!domain) return

        try {
            setSubmitting(true)
            await api.put(`/domains/${domain.id}`, {
                domain_name: formData.name,
                server_id: Number(formData.serverId),
                domain_quality: formData.quality ? Number(formData.quality) : undefined,
            })

            if (onUpdated) {
                onUpdated()
            }

            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update domain:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-primary text-lg">Update Domain</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="update-domainName">Domain Name</Label>
                        <Input
                            id="update-domainName"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="update-server">Server</Label>
                        <Select
                            value={formData.serverId}
                            onValueChange={(value) => setFormData({ ...formData, serverId: value })}
                        >
                            <SelectTrigger id="update-server">
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
                        <Label htmlFor="update-quality">Domain Quality</Label>
                        <Select
                            value={formData.quality}
                            onValueChange={(value) => setFormData({ ...formData, quality: value })}
                        >
                            <SelectTrigger id="update-quality">
                                <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent>
                                    <SelectItem value="1">Yes</SelectItem>
                                    <SelectItem value="2">No</SelectItem>
                                    <SelectItem value="3">Spam</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 cursor-pointer"
                            disabled={submitting}
                        >
                            {submitting ? "Updating Domain..." : "Update Domain"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
