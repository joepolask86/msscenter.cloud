"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, CloudBackup, Bot, BrainCircuit, Cloud, ShieldBan } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { CalendarDatePicker } from "@/components/earnings/date-range-picker"
import { api } from "@/lib/api-client"

export function SettingsDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { from: monthStart, to: monthEnd }
  })
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [totalSynced, setTotalSynced] = useState(0)
  const [skippedCalls, setSkippedCalls] = useState(0)
  const [syncError, setSyncError] = useState<string | null>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current)
        progressTimer.current = null
      }
    }
  }, [])

  const handleSyncNow = async () => {
    if (isSyncing) return
    if (!dateRange.from || !dateRange.to) return

    setIsSyncing(true)
    setSyncError(null)
    setSyncProgress(5)
    setTotalSynced(0)
    setSkippedCalls(0)

    if (progressTimer.current) {
      clearInterval(progressTimer.current)
    }

    progressTimer.current = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 90) return prev
        const next = prev + Math.random() * 10
        return next > 90 ? 90 : next
      })
    }, 400)

    const startDate = dateRange.from.toISOString().slice(0, 10)
    const endDate = dateRange.to.toISOString().slice(0, 10)

    try {
      const result = await api.post<{
        new_calls?: number
        updated_calls?: number
        errors?: number
        skipped?: number
        skipped_existing?: number
        total_processed?: number
      }>("/elocal/sync", {
        startDate,
        endDate,
      })

      const synced = typeof result.new_calls === "number"
        ? result.new_calls
        : typeof result.total_processed === "number"
          ? result.total_processed
          : 0

      setTotalSynced(synced)
      setSkippedCalls(
        typeof result.skipped_existing === "number"
          ? result.skipped_existing
          : 0
      )
      setSyncProgress(100)
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to sync eLocal calls."
      setSyncError(message)
      setSyncProgress(0)
    } finally {
      setIsSyncing(false)
      if (progressTimer.current) {
        clearInterval(progressTimer.current)
        progressTimer.current = null
      }
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="px-4 py-3 lg:px-6">
              <div className="flex items-center gap-2 text-sm text-gray-600/80">
                <Link href="/" className="hover:text-gray-700 transition-colors">
                  Dashboard
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-400">Settings</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 py-4 md:pt-0 md:gap-6 md:py-6 px-4 lg:px-6">
              <p className="text-muted-foreground">
                Manage MSSCenter tools, integrations, and data sync preferences from this page.
              </p>

              <div className="columns-1 gap-4 md:columns-2 [&>*]:break-inside-avoid [&>*]:mb-4">
                <Card className="pt-0">
                  <CardHeader className="flex flex-row items-center justify-between border-b !py-4">
                    <div className="flex items-center gap-2">
                      <CloudBackup className="text-primary" />
                      <CardTitle className="text-primary">Sync eLocal Old Calls</CardTitle>
                    </div>
                    <Button
                      className="bg-primary hover:bg-primary/90 cursor-pointer"
                      type="button"
                      disabled={isSyncing}
                      onClick={handleSyncNow}
                    >
                      {isSyncing ? "Syncing..." : "Sync Now"}
                    </Button>
                  </CardHeader>
                  <CardContent className="py-0 px-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Synchronizes historical eLocal call records with the latest data from the eLocal platform, ensuring previously collected call information is refreshed with up-to-date pricing, category details, competition levels, and regional metadata.
                    </p>

                    <div className="flex flex-col gap-4 pb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Sync Date Range (6 months max)
                        </p>
                        <CalendarDatePicker
                          date={dateRange}
                          numberOfMonths={2}
                          onDateSelect={setDateRange}
                          closeOnSelect
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Sync Progress
                        </p>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-2 bg-primary transition-[width] duration-300 ease-out"
                            style={{ width: `${syncProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isSyncing
                            ? `Syncing... ${Math.round(syncProgress)}%`
                            : syncProgress === 100
                              ? "Sync complete."
                              : "Idle"}
                        </p>

                        <p className="text-sm font-medium text-muted-foreground pt-2">
                          Total Synced Calls:{" "}
                          <span className="text-primary">{totalSynced}</span>
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                          Skipped Calls:{" "}
                          <span className="text-primary">{skippedCalls}</span>
                        </p>

                        {syncError && (
                          <p className="text-xs text-red-500 pt-1">
                            {syncError}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* LLM Settings Card */}
                <Card className="pt-0">
                  <CardHeader className="flex flex-row items-center justify-between border-b !py-4">
                    <div className="flex items-center gap-2">
                      <Bot className="text-primary" />
                      <CardTitle className="text-primary">LLM (AI Tools)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="py-1 px-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="openrouter-key" className="mb-4">OpenRouter API Key</Label>
                      <Input id="openrouter-key" type="password" placeholder="sk-or-..." />
                      <p className="text-xs text-muted-foreground">Required for AI content generation when building websites.</p>
                      <p className="text-sm">Remaining OpenRouter Credits: <span className="text-primary">$18.69</span></p>
                    </div>
                    <Button className="w-full md:w-auto cursor-pointer">Save API Key</Button>
                  </CardContent>
                </Card>

                {/* NLP Settings Card */}
                <Card className="pt-0">
                  <CardHeader className="flex flex-row items-center justify-between border-b !py-4">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="text-primary" />
                      <CardTitle className="text-primary">NLP (Entity Extraction)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4 px-6 pt-0 space-y-4">
                    <p className="text-sm text-muted-foreground">Uses this to detects people, places, brands, and events in text and enriches them with useful entities and topics.</p>
                    <div className="space-y-2">
                      <Label htmlFor="textrazor-key" className="mb-4">TextRazor API Key</Label>
                      <Input id="textrazor-key" type="password" placeholder="TextRazor API Key" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dandelion-key" className="mb-4">Dandelion API Key</Label>
                      <Input id="dandelion-key" type="password" placeholder="Dandelion API Key" />
                    </div>
                    <Button className="w-full md:w-auto cursor-pointer">Save API Key</Button>
                  </CardContent>
                </Card>

                {/* Cloud Settings Card */}
                <Card className="pt-0">
                  <CardHeader className="flex flex-row items-center justify-between border-b !py-4">
                    <div className="flex items-center gap-2">
                      <Cloud className="text-primary" />
                      <CardTitle className="text-primary">Cloud Deployment</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="py-0 px-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="netlify-token" className="mb-4">Netlify Access Token</Label>
                      <Input id="netlify-token" type="password" placeholder="Netlify Access Token" />
                      <p className="text-sm text-muted-foreground">Create a token in Netlify User Settings → Applications → Personal access tokens.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github-token" className="mb-4">GitHub Token</Label>
                      <Input id="github-token" type="password" placeholder="GitHub Token" />
                      <p className="text-sm text-muted-foreground">Create a token in GitHub Settings → Developer settings → Personal access tokens.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cloudflare-token" className="mb-4">Cloudflare Token</Label>
                      <Input id="cloudflare-token" type="password" placeholder="Cloudflare Token" />
                      <p className="text-sm text-muted-foreground">Create a token in Cloudflare API Tokens.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vercel-token" className="mb-4">Vercel Access Token</Label>
                      <Input id="vercel-token" type="password" placeholder="Vercel Access Token" />
                    </div>
                    <Button className="w-full md:w-auto cursor-pointer">Save Access Keys</Button>
                  </CardContent>
                </Card>

                {/* Blocked Sites Card */}
                <Card className="pt-0">
                  <CardHeader className="flex flex-row items-center justify-between border-b !py-4">
                    <div className="flex items-center gap-2">
                      <ShieldBan className="text-primary" />
                      <CardTitle className="text-primary">Blocked Sites (SERP Exclusion)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="py-1 px-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="blocked-sites" className="mb-4">Domains to Ignore (one per line)</Label>
                      <Textarea
                        id="blocked-sites"
                        placeholder={"yelp.com\nyoutube.com\nfacebook.com etc.."}
                        className="min-h-[150px] font-mono"
                      />
                      <p className="text-sm text-muted-foreground">These domains will be skipped during SERP analysis and competitor research.</p>
                    </div>
                    <Button className="w-full md:w-auto cursor-pointer">Save Block List</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
