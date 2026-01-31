"use client"

import { useState, useEffect, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import "quill/dist/quill.snow.css"

interface EditBriefDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    brief: any
    onUpdated?: () => void
}

export function EditBriefDialog({ open, onOpenChange, brief, onUpdated }: EditBriefDialogProps) {
    const [submitting, setSubmitting] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)
    const quillInstance = useRef<any>(null)
    const briefIdRef = useRef<string | null>(null)

    // Initialize Quill when dialog opens
    useEffect(() => {
        if (!open) {
            // Cleanup when dialog closes
            if (quillInstance.current) {
                quillInstance.current = null
                briefIdRef.current = null
            }
            return
        }

        if (quillInstance.current) return

        const initQuill = async () => {
            // Wait for the DOM to be ready
            await new Promise(resolve => setTimeout(resolve, 100))

            try {
                if (!editorRef.current) {
                    console.log("Editor ref not available after timeout")
                    return
                }

                const Quill = (await import("quill")).default

                quillInstance.current = new Quill(editorRef.current, {
                    theme: "snow",
                    modules: {
                        toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["blockquote", "code-block"],
                            [{ color: [] }, { background: [] }],
                            ["link"],
                            ["clean"],
                        ],
                    },
                    placeholder: "Write your content brief here...",
                })


                // Load initial content if brief is available
                if (brief) {
                    const content = generateBriefContent(brief)
                    quillInstance.current.root.innerHTML = content
                    briefIdRef.current = brief.id
                    console.log("Content loaded into editor")
                }
            } catch (error) {
                console.error("Failed to initialize Quill:", error)
            }
        }

        initQuill()
    }, [open, brief])

    // Update content when brief changes
    useEffect(() => {
        if (open && brief && quillInstance.current && brief.id !== briefIdRef.current) {
            const content = generateBriefContent(brief)
            quillInstance.current.root.innerHTML = content
            briefIdRef.current = brief.id
            console.log("Content updated in editor")
        }
    }, [brief, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setSubmitting(true)
            const content = quillInstance.current?.root.innerHTML || ""

            // TODO: Save the edited content to backend
            console.log("Saving brief content:", content)

            if (onUpdated) {
                onUpdated()
            }

            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update brief:", error)
        } finally {
            setSubmitting(false)
        }
    }

    if (!brief) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 gap-0 flex flex-col">
                <DialogHeader className="py-4 px-6 border-b shrink-0">
                    <DialogTitle className="text-primary text-lg">
                        Edit Content Brief: {brief.title}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-0">
                        <div className="space-y-4">
                            {/* Rich Text Editor */}
                            <div className="space-y-2">
                                <div className="border: 0; overflow-hidden min-h-[500px]">
                                    <div
                                        ref={editorRef}
                                        style={{ height: '500px', border: 'none' }}
                                    />
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
                            className="bg-primary hover:bg-primary/90 cursor-pointer"
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : "Save Brief"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// Helper function to generate initial content from brief structure
function generateBriefContent(brief: any): string {
    let html = `<h1>${brief.title}</h1>`
    html += `<p><strong>Primary Entity:</strong> ${brief.primaryEntity}</p>`
    html += `<p><strong>Target Intent:</strong> ${brief.targetIntent}</p>`
    html += `<p><strong>Target Word Count:</strong> ${brief.wordCount.recommended} words</p>`
    html += `<br/>`

    html += `<h2>Supporting Entities</h2>`
    html += `<ul>`
    brief.supportingEntities.forEach((entity: string) => {
        html += `<li>${entity}</li>`
    })
    html += `</ul><br/>`

    html += `<h2>Content Structure</h2>`
    brief.sections.forEach((section: any) => {
        html += `<h3>${section.order}. ${section.name}</h3>`
        if (section.notes) {
            html += `<p><em>${section.notes}</em></p>`
        }
        html += `<p>[Write content for this section here...]</p><br/>`
    })

    if (brief.faqs && brief.faqs.length > 0) {
        html += `<h2>FAQs</h2>`
        brief.faqs.forEach((faq: string) => {
            html += `<h4>${faq}</h4>`
            html += `<p>[Answer here...]</p><br/>`
        })
    }

    return html
}
