'use client';

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStats {
    liveWebsites: number;
    liveDomains: number;
    expiringDomains: number;
    lastSiteBuilt: {
        name: string;
        date: string;
        url: string;
    } | null;
}

export function DashboardStatsCards() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            // console.log('Fetching dashboard stats from:', '/dashboard/stats');
            const data = await api.get<DashboardStats>('/dashboard/stats');
            // console.log('Dashboard stats received:', data);
            setStats(data);
            setError(null);
        } catch (err) {
            console.error('Dashboard stats error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} DAYS AGO`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `ABOUT ${months} MONTH${months > 1 ? 'S' : ''} AGO`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `ABOUT ${years} YEAR${years > 1 ? 'S' : ''} AGO`;
        }
    };

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="gap-3">
                        <CardContent className="flex flex-col items-center justify-center pt-6">
                            <Skeleton className="h-16 w-16 mb-4 rounded-md" />
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-full">
                    <CardContent className="pt-6">
                        <p className="text-sm text-destructive font-medium">Failed to load dashboard stats</p>
                        <p className="text-xs text-muted-foreground mt-1">{error}</p>
                        {error.includes('401') || error.includes('Unauthorized') || error.includes('Not enough segments') ? (
                            <p className="text-xs text-muted-foreground mt-2">
                                Please try logging out and logging back in.
                            </p>
                        ) : null}
                        <Button onClick={fetchStats} variant="outline" size="sm" className="mt-3">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Live Websites Card */}
            <Link href="/campaigns">
                <Card className="gap-3">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-6xl font-bold text-primary text-center">
                            {stats.liveWebsites}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-lg font-semibold">Live Websites</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Number of websites online and built.
                        </p>
                    </CardContent>
                </Card>
            </Link>

            {/* Live Domains Card */}
            <Link href="/domains">
                <Card className="gap-3 cursor-pointer hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            LIVE DOMAINS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-6xl font-bold text-primary text-center mb-3">
                            {stats.liveDomains}
                        </div>
                        <div className="flex justify-center">
                            <Badge className="bg-green-700 hover:bg-green-600">DOMAINS</Badge>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            {/* Expiring Domains Card */}
            <Link href="/domains">
                <Card className="gap-3 cursor-pointer hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            EXPIRING DOMAINS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-6xl font-bold text-primary text-center mb-3">
                            {stats.expiringDomains}
                        </div>
                        <div className="flex justify-center">
                            <Badge variant="destructive" className="text-white">EXPIRING DOMAINS</Badge>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            {/* Last Site Built Card */}
            <Card className="gap-3">
                <CardHeader className="flex flex-row items-center justify-between pb-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        LAST SITE BUILT
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.lastSiteBuilt ? (
                        <>
                            <div className="text-3xl font-bold text-primary text-center mb-3">
                                {formatDate(stats.lastSiteBuilt.date)}
                            </div>
                            <div className="flex justify-center">
                                <Badge variant="secondary">
                                    {getTimeAgo(stats.lastSiteBuilt.date)}
                                </Badge>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No sites built yet
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
