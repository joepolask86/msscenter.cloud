"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task } from "@/lib/types"
import { api } from "@/lib/api-client"

interface TaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    task: Task | null
    onSave: () => void
}

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        task_details: "",
        price: 0,
        status: "no"
    })

    useEffect(() => {
        if (task) {
            setFormData({
                task_details: task.task_details || task.gigtitle || "",
                price: task.price || 0,
                status: task.status || "no"
            })
        }
    }, [task, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (task) {
                // Update
                await api.put(`/campaigns/tasks/${task.id}`, formData)
                onSave()
                onOpenChange(false)
            }
        } catch (error) {
            console.error("Failed to save task:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 gap-0">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-orange-500 text-lg">{task ? "Edit Task" : "Task Details"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <div className="space-y-3">
                        <Label htmlFor="task_details">Task Name</Label>
                        <Input
                            id="task_details"
                            value={formData.task_details}
                            onChange={(e) => setFormData(prev => ({ ...prev, task_details: e.target.value }))}
                            placeholder="Data scraping, Content writing..."
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="price">Service Price</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="status">Task Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no">Pending</SelectItem>
                                <SelectItem value="yes">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving Changes..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
