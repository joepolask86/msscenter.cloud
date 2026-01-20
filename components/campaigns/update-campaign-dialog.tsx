"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Campaign, Niche, Network, Server } from "@/lib/types"
import { api } from "@/lib/api-client"

interface UpdateCampaignDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    campaign?: Campaign
}

export function UpdateCampaignDialog({ open, onOpenChange, campaign }: UpdateCampaignDialogProps) {
    const [loading, setLoading] = useState(false)
    const [niches, setNiches] = useState<Niche[]>([])
    const [networks, setNetworks] = useState<Network[]>([])
    const [servers, setServers] = useState<Server[]>([])

    // Form states
    const [formData, setFormData] = useState<Partial<Campaign>>({})

    useEffect(() => {
        if (open) {
            fetchOptions()
            if (campaign) {
                setFormData(campaign)
            }
        }
    }, [open, campaign])

    const fetchOptions = async () => {
        try {
            const [nichesRes, networksRes, serversRes] = await Promise.all([
                api.get<{ niches: Niche[] }>('/niches?limit=1000&status=true'),
                api.get<{ networks: Network[] }>('/networks/active'),
                api.get<{ servers: Server[] }>('/servers/active')
            ])
            setNiches(nichesRes.niches)
            setNetworks(networksRes.networks)
            setServers(serversRes.servers)
        } catch (error) {
            console.error("Failed to fetch options:", error)
        }
    }

    const handleChange = (field: keyof Campaign, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!campaign) return

        try {
            setLoading(true)
            // Prepare payload - only send what API expects or needs
            const payload = {
                ...formData,
                // Ensure IDs are numbers
                cniche_id: Number(formData.nicheId),
                cnetwork_id: Number(formData.networkId),
                cserver_id: Number(formData.serverId),
                // Map boolean strings to booleans if coming from Select? 
                // shadcn Select returns string values usually. 
                // We need to be careful with types.
                indexer: formData.indexer,
                rating: formData.rating,
                msstype: Number(formData.mssType),
                searchconsole: formData.searchConsole,
                bing: formData.bing,
                bulidinfo: formData.buildInfo,

                campaign_url: formData.url,
                website_fullurl: formData.fullUrl,
                country: formData.country,
                tracknumber: formData.trackNumber,
                atraffic_id: formData.atrafficId
            }

            await api.put(`/campaigns/${campaign.id}`, payload)
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update campaign:", error)
        } finally {
            setLoading(false)
        }
    }

    if (!campaign) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl top-[5%] !translate-y-0 max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-primary text-lg">Update Campaign</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-y-auto flex-1 px-6">
                        <div className="grid grid-cols-2 gap-4 py-4">
                            {/* Campaign Name (ReadOnly usually?) */}
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="campaign-name">Campaign Name</Label>
                                <Input
                                    id="campaign-name"
                                    value={formData.name || ""}
                                    disabled
                                />
                            </div>

                            {/* Website URL */}
                            <div className="grid gap-2">
                                <Label htmlFor="website-url">Website URL</Label>
                                <Input
                                    id="website-url"
                                    value={formData.url || ""}
                                    onChange={(e) => handleChange('url', e.target.value)}
                                />
                            </div>

                            {/* Website Full URL */}
                            <div className="grid gap-2">
                                <Label htmlFor="website-full-url">Website Full URL</Label>
                                <Input
                                    id="website-full-url"
                                    value={formData.fullUrl || ""}
                                    onChange={(e) => handleChange('fullUrl', e.target.value)}
                                />
                            </div>

                            {/* Affiliate Network */}
                            <div className="grid gap-2">
                                <Label htmlFor="affiliate-network">Affiliate Network</Label>
                                <Select
                                    value={String(formData.networkId)}
                                    onValueChange={(val) => handleChange('networkId', Number(val))}
                                >
                                    <SelectTrigger id="affiliate-network">
                                        <SelectValue placeholder="Select affiliate network" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {networks.map(n => (
                                            <SelectItem key={n.id} value={String(n.id)}>{n.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Niche */}
                            <div className="grid gap-2">
                                <Label htmlFor="niche">Niche</Label>
                                <Select
                                    value={String(formData.nicheId)}
                                    onValueChange={(val) => handleChange('nicheId', Number(val))}
                                >
                                    <SelectTrigger id="niche">
                                        <SelectValue placeholder="Select niche" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {niches.map(n => (
                                            <SelectItem key={n.id} value={String(n.id)}>{n.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Target Country */}
                            <div className="grid gap-2">
                                <Label htmlFor="target-country">Target Country</Label>
                                <Select
                                    value={formData.country || "US"}
                                    onValueChange={(val) => handleChange('country', val)}
                                >
                                    <SelectTrigger id="target-country">
                                        <SelectValue placeholder="Select target country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="US">United States</SelectItem>
                                        <SelectItem value="CA">Canada</SelectItem>
                                        <SelectItem value="UK">United Kingdom</SelectItem>
                                        <SelectItem value="AU">Australia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Server */}
                            <div className="grid gap-2">
                                <Label htmlFor="server">Server</Label>
                                <Select
                                    value={String(formData.serverId)}
                                    onValueChange={(val) => handleChange('serverId', Number(val))}
                                >
                                    <SelectTrigger id="server">
                                        <SelectValue placeholder="Select domain server" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {servers.map(s => (
                                            <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Indexer Submit */}
                            <div className="grid gap-2">
                                <Label htmlFor="indexer-submit">Indexer Submit</Label>
                                <Select
                                    value={formData.indexer ? "yes" : "no"}
                                    onValueChange={(val) => handleChange('indexer', val === "yes")}
                                >
                                    <SelectTrigger id="indexer-submit">
                                        <SelectValue placeholder="Index Submission" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Ratings */}
                            <div className="grid gap-2">
                                <Label htmlFor="ratings">Ratings</Label>
                                <Select
                                    value={formData.rating ? "yes" : "no"}
                                    onValueChange={(val) => handleChange('rating', val === "yes")}
                                >
                                    <SelectTrigger id="ratings">
                                        <SelectValue placeholder="Ratings" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* MassPage Type */}
                            <div className="grid gap-2">
                                <Label htmlFor="masspage-type">MassPage Type</Label>
                                <Select
                                    value={String(formData.mssType || 1)}
                                    onValueChange={(val) => handleChange('mssType', Number(val))}
                                >
                                    <SelectTrigger id="masspage-type">
                                        <SelectValue placeholder="Masspage Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Page Generator Pro</SelectItem>
                                        <SelectItem value="2">Manually</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Traffic ID */}
                            <div className="grid gap-2">
                                <Label htmlFor="traffic-id">Traffic ID</Label>
                                <Input
                                    id="traffic-id"
                                    value={formData.atrafficId || ""}
                                    onChange={(e) => handleChange('atrafficId', Number(e.target.value))}
                                />
                            </div>

                            {/* Tracking Number */}
                            <div className="grid gap-2">
                                <Label htmlFor="tracking-number">Tracking Number</Label>
                                <Input
                                    id="tracking-number"
                                    value={formData.trackNumber || ""}
                                    onChange={(e) => handleChange('trackNumber', e.target.value)}
                                    placeholder="(495) 323-4343"
                                />
                            </div>

                            {/* Google Search Console */}
                            <div className="grid gap-2">
                                <Label htmlFor="google-console">Google Search Console</Label>
                                <Select
                                    value={formData.searchConsole ? "yes" : "no"}
                                    onValueChange={(val) => handleChange('searchConsole', val === "yes")}
                                >
                                    <SelectTrigger id="google-console">
                                        <SelectValue placeholder="Search Submission" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Bing Webmaster */}
                            <div className="grid gap-2">
                                <Label htmlFor="bing-webmaster">Bing Webmaster</Label>
                                <Select
                                    value={formData.bing ? "yes" : "no"}
                                    onValueChange={(val) => handleChange('bing', val === "yes")}
                                >
                                    <SelectTrigger id="bing-webmaster">
                                        <SelectValue placeholder="Search Submission" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Build Information */}
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="build-info">Build Information</Label>
                                <Textarea
                                    id="build-info"
                                    value={formData.buildInfo || ""}
                                    onChange={(e) => handleChange('buildInfo', e.target.value)}
                                    placeholder="Enter build information..."
                                    className="h-[200px]"
                                    style={{ whiteSpace: 'pre-wrap' }}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="py-4 px-6 border-t shrink-0">
                        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                            {loading ? "Updating..." : "Update Campaign"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
