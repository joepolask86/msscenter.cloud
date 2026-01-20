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
import { SquareArrowOutUpRight, Menu, MoreVertical } from "lucide-react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Campaign {
    id: number;
    name: string;
    nicheName?: string;
    type?: string;
    status: number; // 1=Built, other values ignored in this widget
    createdAt: string;
    // ... other fields
}

const getStatusBadge = (status: number) => {
    switch (status) {
        case 1:
            return <Badge className="bg-green-700 hover:bg-green-600">Built</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
};

export function LatestCampaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const data = await api.get<Campaign[]>('/dashboard/latest-campaigns');
            const builtCampaigns = data.filter(campaign => campaign.status === 1);
            setCampaigns(builtCampaigns);
            setError(null);
        } catch (err) {
            console.error('Latest Campaigns error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Menu className="h-5 w-5" />
                        <CardTitle>Latest Campaigns</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Campaign Name</TableHead>
                                <TableHead>Niche</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created Date</TableHead>
                                <TableHead className="text-center">View</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-[80px] rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><div className="flex justify-center"><Skeleton className="h-8 w-8 rounded-md" /></div></TableCell>
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
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Menu className="h-5 w-5" />
                        <CardTitle>Latest Campaigns</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-40 gap-4">
                        <p className="text-destructive">Failed to load campaigns</p>
                        <Button onClick={fetchCampaigns} variant="outline" size="sm">Retry</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Menu className="h-5 w-5" />
                    <CardTitle>Latest Campaigns</CardTitle>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href="/campaigns">
                            <DropdownMenuItem>View All</DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted">
                            <TableHead>Campaign Name</TableHead>
                            <TableHead>Niche</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead className="text-center">View</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {campaigns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No campaigns found
                                </TableCell>
                            </TableRow>
                        ) : (
                            campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">{campaign.name}</TableCell>
                                    <TableCell>{campaign.nicheName || 'Unknown'}</TableCell>
                                    <TableCell>
                                        {getStatusBadge(campaign.status)}
                                    </TableCell>
                                    <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                                    <TableCell className="text-center">
                                        <Link href={`/campaigns/${campaign.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <SquareArrowOutUpRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
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
