"use client"

import * as React from "react"
import { Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api-client"

interface SitemapResult {
    urls: string[]
    count: number
    sitemap_url: string
}

export function SitemapScraperTool() {
    const [sitemapUrl, setSitemapUrl] = React.useState("")
    const [result, setResult] = React.useState<SitemapResult | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const handleSubmit = async () => {
        if (!sitemapUrl || loading) return
        try {
            setLoading(true)
            setError(null)
            const data = await api.post<SitemapResult>("/tools/sitemap-scraper", {
                url: sitemapUrl,
                max_depth: 2,
            })
            setResult(data)
        } catch (err) {
            setResult(null)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to scrape sitemap")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async () => {
        if (!result || !result.urls.length) return
        try {
            await navigator.clipboard.writeText(result.urls.join("\n"))
        } catch {
        }
    }

    return (
        <>
            <div className="flex w-xl items-center space-x-2">
                <Input
                    type="url"
                    placeholder="https://example.com/sitemap.xml"
                    className="flex-1 h-10"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                />
                <Button
                    type="button"
                    className="bg-primary hover:bg-primary/90 cursor-pointer"
                    onClick={handleSubmit}
                    disabled={loading || !sitemapUrl}
                >
                    {loading ? "Scraping Sitemap..." : "Submit URL"}
                </Button>
            </div>

            <div className="rounded-md border bg-muted/30 p-4 pr-2 relative">
                <button
                    className="absolute top-5 right-6 cursor-pointer z-10 disabled:opacity-40"
                    onClick={handleCopy}
                    disabled={!result || !result.urls.length}
                >
                    <Copy className="h-4 w-4 text-foreground/40 hover:text-foreground/60 transition-colors" />
                </button>
                <ScrollArea className="h-[500px] w-full pr-4">
                    <div className="flex flex-col gap-1 text-sm text-foreground/80 font-mono">
                        {loading && (
                            <div className="py-1 text-foreground/60">Loading sitemap URLs...</div>
                        )}
                        {!loading && result && result.urls.map((url) => (
                            <div key={url} className="py-1">
                                {url}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}
            {!error && result && (
                <p className="text-sm text-muted-foreground">
                    {result.count} URLs found from {result.sitemap_url}
                </p>
            )}
        </>
    )
}

