"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, MoreVertical } from "lucide-react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface NicheBuildStats {
    id: number;
    name: string;
    campaignCount: number;
}

export function TopNicheBuilds() {
    const [niches, setNiches] = useState<NicheBuildStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTopNiches = async () => {
        try {
            setLoading(true);
            const data = await api.get<NicheBuildStats[]>('/dashboard/top-niche-builds');
            setNiches(data);
            setError(null);
        } catch (err) {
            console.error('Top Niches error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load top niches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopNiches();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Menu className="h-5 w-5" />
                        <CardTitle>Top Niche Builds</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Niche Name</TableHead>
                                <TableHead className="text-right">No of Builds</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
                                    <TableCell className="text-right flex justify-end"><Skeleton className="h-5 w-8 rounded-full" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Menu className="h-5 w-5" />
                        <CardTitle>Top Niche Builds</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-40 gap-4">
                        <p className="text-destructive">Failed to load top niches</p>
                        <Button onClick={fetchTopNiches} variant="outline" size="sm">Retry</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Menu className="h-5 w-5" />
                    <CardTitle>Top Niche Builds</CardTitle>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href="/niches">
                            <DropdownMenuItem>View All</DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Niche Name</TableHead>
                            <TableHead className="text-right">No of Builds</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {niches.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                    No niche data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            niches.map((niche) => (
                                <TableRow key={niche.id}>
                                    <TableCell className="font-medium">{niche.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="secondary">{niche.campaignCount}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
