"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { api } from "@/lib/api-client"
import { Niche, Campaign } from "@/lib/types"

interface Transaction {
    id: string
    amount: string
    category: string
    callerTag: string
    description: string
    date: Date | string
    nicheId?: number
    campaignId?: number | null
}

interface UpdateTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction?: Transaction | null
    onSuccess?: () => void
}

interface NichesResponse {
    niches: Niche[]
    total: number
}

interface CampaignsResponse {
    campaigns: Campaign[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

export function UpdateTransactionDialog({ open, onOpenChange, transaction, onSuccess }: UpdateTransactionDialogProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [formData, setFormData] = useState({
        amount: "",
        nicheId: "",
        campaignId: "",
        description: "",
    })
    const [niches, setNiches] = useState<Niche[]>([])
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(false)
    const [optionsLoading, setOptionsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchOptions = async () => {
        try {
            setOptionsLoading(true)
            const [nichesRes, campaignsRes] = await Promise.all([
                api.get<NichesResponse>("/niches?limit=1000&status=true"),
                api.get<CampaignsResponse>("/campaigns?limit=1000&status=1"),
            ])
            setNiches(nichesRes.niches)
            setCampaigns(campaignsRes.campaigns)
        } catch (err) {
            console.error("Failed to fetch transaction options:", err)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to load options.")
            }
        } finally {
            setOptionsLoading(false)
        }
    }

    useEffect(() => {
        if (open && transaction) {
            setError(null)
            setFormData({
                amount: transaction.amount,
                nicheId: transaction.nicheId != null ? String(transaction.nicheId) : "",
                campaignId: transaction.campaignId != null ? String(transaction.campaignId) : "",
                description: transaction.description,
            })

            if (transaction.date instanceof Date) {
                setDate(transaction.date)
            } else if (transaction.date) {
                setDate(new Date(transaction.date))
            } else {
                setDate(new Date())
            }

            fetchOptions()
        }
    }, [open, transaction])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!transaction) return
        setError(null)

        const errors: string[] = []
        const amountValue = parseFloat(formData.amount)

        if (!formData.amount.trim()) {
            errors.push("Amount is required.")
        } else if (isNaN(amountValue) || amountValue <= 0) {
            errors.push("Amount must be a positive number.")
        }

        if (!formData.nicheId) {
            errors.push("Category is required.")
        }

        if (errors.length > 0) {
            setError(errors.join(" "))
            return
        }

        if (!date) {
            setError("Date is required.")
            return
        }

        const payload: Record<string, unknown> = {
            description: formData.description.trim(),
            niche_id: Number(formData.nicheId),
            amount: amountValue,
            trans_date: format(date, "yyyy-MM-dd"),
        }

        if (formData.campaignId) {
            payload.campaign_tag_id = Number(formData.campaignId)
        }

        try {
            setLoading(true)
            await api.put(`/transactions/${transaction.id}`, payload)
            if (onSuccess) {
                onSuccess()
            }
            onOpenChange(false)
        } catch (err) {
            console.error("Failed to update transaction:", err)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to update transaction.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-orange-500 text-lg flex items-center gap-1">
                        Update Transaction
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 pt-2">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right text-gray-500 font-normal">
                                Amount: <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="amount"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="col-span-1"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right text-gray-500 font-normal">
                                Category: <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={formData.nicheId}
                                    onValueChange={(value) => setFormData({ ...formData, nicheId: value })}
                                    disabled={optionsLoading}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={optionsLoading ? "Loading..." : "Select Category"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {niches.map((niche) => (
                                            <SelectItem key={niche.id} value={String(niche.id)}>
                                                {niche.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="callerTag" className="text-right text-gray-500 font-normal">
                                Campaign:
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={formData.campaignId}
                                    onValueChange={(value) => setFormData({ ...formData, campaignId: value })}
                                    disabled={optionsLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={optionsLoading ? "Loading..." : "Select Campaign"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {campaigns.map((campaign) => (
                                            <SelectItem key={campaign.id} value={String(campaign.id)}>
                                                {campaign.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-500 font-normal">
                                Date: <span className="text-red-500">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild className="w-36">
                                    <Button
                                        type="button"
                                        variant={"outline"}
                                        className={cn(
                                            "col-span-3 justify-between text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
                                        <CalendarIcon className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right text-gray-500 font-normal">
                                Description:
                            </Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3"
                                placeholder="Enter transaction desc"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 cursor-pointer"
                            disabled={loading || optionsLoading}
                        >
                            {loading ? "Updating Transaction..." : "Update Transaction"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
