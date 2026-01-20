"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, DollarSign } from "lucide-react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface ElocalStats {
    totalCalls: number;
    validCalls: number;
    soldCalls: number;
    totalPayout: number;
}

export function ElocalOverview() {
    const [stats, setStats] = useState<ElocalStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await api.get<ElocalStats>('/dashboard/elocal-overview');
            setStats(data);
            setError(null);
        } catch (err) {
            console.error('Elocal Overview error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-orange-500">eLocal Overview <span className="text-sm text-muted-foreground">(all campaigns, all numbers)</span></h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-orange-500">eLocal Overview</h2>
                </div>
                <Card className="p-6">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-destructive">Failed to load eLocal stats</p>
                        <Button onClick={fetchStats} variant="outline" size="sm">Retry</Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (!stats) return null;

    const missedCalls = stats.totalCalls - stats.validCalls;

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-orange-500">eLocal Overview <span className="text-sm text-muted-foreground">(all campaigns, all numbers)</span></h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                {/* Total Calls */}
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl font-bold">{stats.totalCalls}</p>
                            <Phone className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">Total Calls</p>
                    </CardContent>
                </Card>

                {/* Answered Calls (Using validCalls for now) */}
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl font-bold text-green-500">{stats.validCalls}</p>
                            <Phone className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">Answered Calls</p>
                    </CardContent>
                </Card>

                {/* Missed Calls */}
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl font-bold text-red-500">{missedCalls}</p>
                            <Phone className="h-6 w-6 text-red-500" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">Missed Calls</p>
                    </CardContent>
                </Card>

                {/* Unique/Sold Calls */}
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl font-bold text-green-500">{stats.validCalls} / {stats.soldCalls}</p>
                            <Phone className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">Unique/Sold Calls</p>
                    </CardContent>
                </Card>

                {/* Total Call Value */}
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-3xl font-bold text-green-500">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalPayout)}
                            </p>
                            <DollarSign className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-8">Total Call Value</p>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
