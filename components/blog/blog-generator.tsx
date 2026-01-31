"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    FileText,
    Plus,
    Sparkles,
    Trash2,
    Edit,
    Eye,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
} from "lucide-react"

type BlogPost = {
    id: string
    title: string
    slug: string
    excerpt: string
    blogType: "Guide" | "Cost Guide" | "Comparison" | "How-To"
    primaryEntity: string
    targetIntent: "informational" | "cost_guide" | "comparison" | "how_to"
    status: "draft" | "brief_generated" | "content_generated" | "optimized" | "published"
    wordCount?: number
    content?: string // Full HTML content
}

type BlogGeneratorProps = {
    siteId: string
    researchProjectId?: string
}

export function BlogGenerator({ siteId, researchProjectId }: BlogGeneratorProps) {
    const [blogs, setBlogs] = useState<BlogPost[]>([
        {
            id: "1",
            title: "How Much Does Emergency Plumbing Cost in Chicago?",
            slug: "emergency-plumbing-cost-chicago",
            excerpt: "Understanding the factors that influence emergency plumbing rates in Chicago and what you can expect to pay.",
            blogType: "Cost Guide",
            primaryEntity: "Emergency Plumbing",
            targetIntent: "cost_guide",
            status: "content_generated",
            wordCount: 1850,
            content: `<h2>Understanding Emergency Plumbing Costs</h2>
<p>When a pipe bursts at 2 AM or your water heater fails on a holiday weekend, you need emergency plumbing services fast. But what should you expect to pay for emergency plumbing in Chicago?</p>

<h3>Average Emergency Plumbing Rates</h3>
<p>In Chicago, emergency plumbing services typically cost between $150-$450 per hour, with most homeowners paying around $300 for after-hours service. This is significantly higher than standard rates of $75-$150 per hour during regular business hours.</p>

<h3>Factors That Affect Emergency Plumbing Costs</h3>
<ul>
<li><strong>Time of Day:</strong> After-hours, weekend, and holiday rates are 1.5-3x higher</li>
<li><strong>Severity of Issue:</strong> Simple fixes vs. major repairs</li>
<li><strong>Parts Required:</strong> Replacement parts and materials</li>
<li><strong>Location:</strong> Downtown vs. suburban areas</li>
</ul>

<h3>Common Emergency Plumbing Issues and Costs</h3>
<p>Here are typical costs for common emergency plumbing problems in Chicago:</p>
<ul>
<li>Burst pipe repair: $400-$1,500</li>
<li>Water heater emergency: $300-$1,200</li>
<li>Severe drain clog: $200-$600</li>
<li>Toilet overflow: $150-$400</li>
</ul>

<h3>How to Save on Emergency Plumbing</h3>
<p>While emergencies can't always be avoided, you can minimize costs by:</p>
<ul>
<li>Knowing where your main water shut-off valve is located</li>
<li>Having a trusted plumber's number saved before an emergency</li>
<li>Maintaining your plumbing system with regular inspections</li>
<li>Addressing small issues before they become emergencies</li>
</ul>`
        },
        {
            id: "2",
            title: "Signs You Need Water Heater Replacement",
            slug: "signs-water-heater-replacement",
            excerpt: "Learn the warning signs that indicate it's time to replace your water heater before it fails.",
            blogType: "Guide",
            primaryEntity: "Water Heater Replacement",
            targetIntent: "informational",
            status: "optimized",
            wordCount: 1420,
            content: `<h2>Is Your Water Heater Failing?</h2>
<p>Your water heater is one of the hardest-working appliances in your home. Knowing when to replace it can save you from unexpected cold showers and potential water damage.</p>

<h3>Top Warning Signs</h3>
<ol>
<li><strong>Age:</strong> Most water heaters last 8-12 years. Check the serial number to determine age.</li>
<li><strong>Rusty Water:</strong> Brown or rusty hot water indicates corrosion inside the tank.</li>
<li><strong>Strange Noises:</strong> Rumbling or banging sounds mean sediment buildup.</li>
<li><strong>Leaking:</strong> Any moisture around the base is a red flag.</li>
<li><strong>Inconsistent Temperature:</strong> If your water isn't staying hot, the heating element may be failing.</li>
</ol>

<h3>Don't Wait Until It's Too Late</h3>
<p>Replacing your water heater before it fails completely can prevent water damage and give you time to choose the best replacement option for your needs.</p>`
        },
        {
            id: "3",
            title: "DIY vs Professional Drain Cleaning: What You Need to Know",
            slug: "diy-vs-professional-drain-cleaning",
            excerpt: "Compare the pros and cons of DIY drain cleaning versus hiring a professional plumber.",
            blogType: "Comparison",
            primaryEntity: "Drain Cleaning",
            targetIntent: "comparison",
            status: "draft",
        },
    ])

    const [isGeneratingBriefs, setIsGeneratingBriefs] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)
    const [newBlogData, setNewBlogData] = useState({
        title: "",
        blogType: "Guide" as BlogPost["blogType"],
        primaryEntity: "",
        targetIntent: "informational" as BlogPost["targetIntent"],
    })

    const handleGenerateBriefs = async () => {
        setIsGeneratingBriefs(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsGeneratingBriefs(false)
    }

    const handleGenerateContent = async (blogId: string) => {
        // Simulate content generation
        setBlogs(prev => prev.map(blog =>
            blog.id === blogId
                ? { ...blog, status: "content_generated" as const, wordCount: Math.floor(Math.random() * 1000) + 1000 }
                : blog
        ))
    }

    const handleOptimize = async (blogId: string) => {
        setBlogs(prev => prev.map(blog =>
            blog.id === blogId ? { ...blog, status: "optimized" as const } : blog
        ))
    }

    const handleAddBlog = () => {
        const slug = newBlogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        const newBlog: BlogPost = {
            id: Date.now().toString(),
            title: newBlogData.title,
            slug,
            excerpt: "",
            blogType: newBlogData.blogType,
            primaryEntity: newBlogData.primaryEntity,
            targetIntent: newBlogData.targetIntent,
            status: "draft",
        }
        setBlogs(prev => [...prev, newBlog])
        setIsAddDialogOpen(false)
        setNewBlogData({
            title: "",
            blogType: "Guide",
            primaryEntity: "",
            targetIntent: "informational",
        })
    }

    const handlePreview = (blog: BlogPost) => {
        setSelectedBlog(blog)
        setIsPreviewDialogOpen(true)
    }

    const handleEdit = (blog: BlogPost) => {
        setSelectedBlog(blog)
        setIsEditDialogOpen(true)
    }

    const handleDeleteClick = (blog: BlogPost) => {
        setSelectedBlog(blog)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (selectedBlog) {
            setBlogs(prev => prev.filter(blog => blog.id !== selectedBlog.id))
            setIsDeleteDialogOpen(false)
            setSelectedBlog(null)
        }
    }

    const getStatusBadge = (status: BlogPost["status"]) => {
        const statusConfig = {
            draft: { label: "Draft", className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20" },
            brief_generated: { label: "Brief Ready", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
            content_generated: { label: "Content Generated", className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" },
            optimized: { label: "Optimized", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
            published: { label: "Published", className: "bg-green-500 text-white" },
        }
        const config = statusConfig[status]
        return <Badge className={config.className}>{config.label}</Badge>
    }

    const getStatusIcon = (status: BlogPost["status"]) => {
        switch (status) {
            case "draft":
                return <Clock className="h-4 w-4 text-gray-500" />
            case "brief_generated":
                return <FileText className="h-4 w-4 text-blue-500" />
            case "content_generated":
                return <Sparkles className="h-4 w-4 text-purple-500" />
            case "optimized":
            case "published":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-end gap-2 -mt-16">
                <Button
                    variant="outline"
                    onClick={handleGenerateBriefs}
                    disabled={isGeneratingBriefs || blogs.length === 0}
                    className="cursor-pointer"
                >
                    {isGeneratingBriefs ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating Briefs...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" />
                            Auto-Generate Briefs
                        </>
                    )}
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default" className="text-white cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Blog Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                            <DialogTitle>Add New Blog Post</DialogTitle>
                            <DialogDescription>
                                Create a new blog post manually or let the system generate briefs from entity research.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Blog Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., How Much Does Emergency Plumbing Cost?"
                                    value={newBlogData.title}
                                    onChange={(e) => setNewBlogData({ ...newBlogData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="blogType">Blog Type</Label>
                                    <Select
                                        value={newBlogData.blogType}
                                        onValueChange={(value: BlogPost["blogType"]) =>
                                            setNewBlogData({ ...newBlogData, blogType: value })
                                        }
                                    >
                                        <SelectTrigger id="blogType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Guide">Guide</SelectItem>
                                            <SelectItem value="Cost Guide">Cost Guide</SelectItem>
                                            <SelectItem value="Comparison">Comparison</SelectItem>
                                            <SelectItem value="How-To">How-To</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="targetIntent">Target Intent</Label>
                                    <Select
                                        value={newBlogData.targetIntent}
                                        onValueChange={(value: BlogPost["targetIntent"]) =>
                                            setNewBlogData({ ...newBlogData, targetIntent: value })
                                        }
                                    >
                                        <SelectTrigger id="targetIntent">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="informational">Informational</SelectItem>
                                            <SelectItem value="cost_guide">Cost Guide</SelectItem>
                                            <SelectItem value="comparison">Comparison</SelectItem>
                                            <SelectItem value="how_to">How-To</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="primaryEntity">Primary Entity</Label>
                                <Input
                                    id="primaryEntity"
                                    placeholder="e.g., Emergency Plumbing"
                                    value={newBlogData.primaryEntity}
                                    onChange={(e) => setNewBlogData({ ...newBlogData, primaryEntity: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddBlog}
                                disabled={!newBlogData.title || !newBlogData.primaryEntity}
                            >
                                Add Blog Post
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Blog Posts List */}
            <div className="space-y-3">
                {blogs.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground text-center">
                                No blog posts yet. Click "Add Blog Post" or "Auto-Generate Briefs" to get started.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    blogs.map((blog) => (
                        <Card key={blog.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="py-2 px-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 shrink-0">
                                            {getStatusIcon(blog.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-base">{blog.title}</h3>
                                                {getStatusBadge(blog.status)}
                                                <Badge variant="outline" className="text-xs">
                                                    {blog.blogType}
                                                </Badge>
                                            </div>
                                            {blog.excerpt && (
                                                <p className="text-sm text-muted-foreground mb-2">{blog.excerpt}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>Entity: <strong>{blog.primaryEntity}</strong></span>
                                                <span>•</span>
                                                <span>Slug: /{blog.slug}</span>
                                                {blog.wordCount && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{blog.wordCount} words</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {blog.status === "draft" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleGenerateContent(blog.id)}
                                                className="cursor-pointer"
                                            >
                                                <Sparkles className="h-3 w-3 mr-1" />
                                                Generate Content
                                            </Button>
                                        )}
                                        {blog.status === "content_generated" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOptimize(blog.id)}
                                                className="cursor-pointer"
                                            >
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Optimize
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => handlePreview(blog)}
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            Preview
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => handleEdit(blog)}
                                        >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDeleteClick(blog)}
                                            className="cursor-pointer"
                                        >
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Stats */}
            {blogs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Blog Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center p-3 rounded-lg border bg-muted/30">
                                <p className="text-2xl font-bold text-orange-600">{blogs.length}</p>
                                <p className="text-xs text-muted-foreground mt-1">Total Posts</p>
                            </div>
                            <div className="text-center p-3 rounded-lg border bg-muted/30">
                                <p className="text-2xl font-bold text-gray-600">
                                    {blogs.filter(b => b.status === "draft").length}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Drafts</p>
                            </div>
                            <div className="text-center p-3 rounded-lg border bg-muted/30">
                                <p className="text-2xl font-bold text-purple-600">
                                    {blogs.filter(b => b.status === "content_generated").length}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Generated</p>
                            </div>
                            <div className="text-center p-3 rounded-lg border bg-muted/30">
                                <p className="text-2xl font-bold text-green-600">
                                    {blogs.filter(b => b.status === "optimized").length}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Optimized</p>
                            </div>
                            <div className="text-center p-3 rounded-lg border bg-muted/30">
                                <p className="text-2xl font-bold text-blue-600">
                                    {blogs.reduce((sum, b) => sum + (b.wordCount || 0), 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Total Words</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Preview Dialog */}
            <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle>Preview: {selectedBlog?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedBlog?.content
                                ? "Full blog post preview"
                                : "Blog post details (content not yet generated)"}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBlog?.content ? (
                        // Show full content if available
                        <div className="flex-1 overflow-y-auto">
                            <div className="prose prose-sm max-w-none dark:prose-invert p-6 bg-muted/30 rounded-lg">
                                <h1 className="text-2xl font-bold mb-4">{selectedBlog.title}</h1>
                                {selectedBlog.excerpt && (
                                    <p className="text-lg text-muted-foreground italic mb-6">{selectedBlog.excerpt}</p>
                                )}
                                <div
                                    className="blog-content"
                                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                                />
                            </div>
                        </div>
                    ) : (
                        // Show metadata if content not available
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <p className="text-sm font-semibold">{selectedBlog?.title}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <p className="text-sm font-mono text-muted-foreground">/{selectedBlog?.slug}</p>
                            </div>
                            {selectedBlog?.excerpt && (
                                <div className="space-y-2">
                                    <Label>Excerpt</Label>
                                    <p className="text-sm text-muted-foreground">{selectedBlog.excerpt}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Blog Type</Label>
                                    <p className="text-sm">{selectedBlog?.blogType}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Primary Entity</Label>
                                    <p className="text-sm">{selectedBlog?.primaryEntity}</p>
                                </div>
                            </div>
                            {selectedBlog?.wordCount && (
                                <div className="space-y-2">
                                    <Label>Word Count</Label>
                                    <p className="text-sm">{selectedBlog.wordCount} words</p>
                                </div>
                            )}
                            <div className="p-4 rounded-lg border bg-yellow-500/10 border-yellow-500/20">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    ⚠️ Content has not been generated yet. Click "Generate Content" to create the full blog post.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="shrink-0">
                        <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)} className="cursor-pointer">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Edit Blog Post</DialogTitle>
                        <DialogDescription>
                            Update the blog post details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Blog Title</Label>
                            <Input
                                id="edit-title"
                                value={selectedBlog?.title || ""}
                                onChange={(e) => {
                                    if (selectedBlog) {
                                        setSelectedBlog({ ...selectedBlog, title: e.target.value })
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-excerpt">Excerpt</Label>
                            <Textarea
                                id="edit-excerpt"
                                value={selectedBlog?.excerpt || ""}
                                onChange={(e) => {
                                    if (selectedBlog) {
                                        setSelectedBlog({ ...selectedBlog, excerpt: e.target.value })
                                    }
                                }}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-blogType">Blog Type</Label>
                                <Select
                                    value={selectedBlog?.blogType}
                                    onValueChange={(value: BlogPost["blogType"]) => {
                                        if (selectedBlog) {
                                            setSelectedBlog({ ...selectedBlog, blogType: value })
                                        }
                                    }}
                                >
                                    <SelectTrigger id="edit-blogType">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Guide">Guide</SelectItem>
                                        <SelectItem value="Cost Guide">Cost Guide</SelectItem>
                                        <SelectItem value="Comparison">Comparison</SelectItem>
                                        <SelectItem value="How-To">How-To</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-primaryEntity">Primary Entity</Label>
                                <Input
                                    id="edit-primaryEntity"
                                    value={selectedBlog?.primaryEntity || ""}
                                    onChange={(e) => {
                                        if (selectedBlog) {
                                            setSelectedBlog({ ...selectedBlog, primaryEntity: e.target.value })
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (selectedBlog) {
                                    setBlogs(prev => prev.map(blog =>
                                        blog.id === selectedBlog.id ? selectedBlog : blog
                                    ))
                                    setIsEditDialogOpen(false)
                                }
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the blog post "{selectedBlog?.title}".
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
