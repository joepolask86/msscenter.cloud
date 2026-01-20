"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { api } from "@/lib/api-client"

interface ElocalCallForEdit {
    id: number
    callerNumber: string
    payout: number
    sold: boolean
}

interface UpdateCallDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    call?: ElocalCallForEdit | null
    onUpdated?: () => void
}

export function UpdateCallDialog({ open, onOpenChange, call, onUpdated }: UpdateCallDialogProps) {
    const [payout, setPayout] = useState<string>("")
    const [sold, setSold] = useState<string>("false")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open && call) {
            setError(null)
            setPayout(call.payout.toFixed(2))
            setSold(call.sold ? "true" : "false")
        }
    }, [open, call])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!call) return

        const parsedPayout = parseFloat(payout)
        if (Number.isNaN(parsedPayout) || parsedPayout < 0) {
            setError("Payout must be a non-negative number.")
            return
        }

        try {
            setSubmitting(true)
            setError(null)

            await api.put(`/elocal/calls/${call.id}`, {
                payout: parsedPayout,
                sold: sold === "true",
            })

            if (onUpdated) {
                onUpdated()
            }

            onOpenChange(false)
        } catch (err) {
            console.error("Failed to update call:", err)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to update call.")
            }
        } finally {
            setSubmitting(false)
        }
    }

    const callerLabel = call?.callerNumber ? call.callerNumber : "-"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-orange-500 text-lg">Edit Call Log</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-sm">Caller</Label>
                        <div className="text-sm font-medium text-primary w-[140px]">{callerLabel}</div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="payout">Payout</Label>
                        <Input
                            id="payout"
                            type="number"
                            min="0"
                            step="0.01"
                            value={payout}
                            onChange={(e) => setPayout(e.target.value)}
                            placeholder="0.00"
                            className="w-[120px]"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Call Sold</Label>
                        <Select value={sold} onValueChange={setSold}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Sold</SelectItem>
                                <SelectItem value="false">Unsold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Updating Call..." : "Update Call"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

