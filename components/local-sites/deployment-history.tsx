"use client"

import { useState } from "react"
import {
    CheckCircle2,
    XCircle,
    Clock,
    Rocket,
    ExternalLink,
    RotateCcw,
    AlertCircle,
    Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export type DeploymentStatus = "success" | "failed" | "building" | "queued"

export interface Deployment {
    id: string
    status: DeploymentStatus
    environment: "production" | "preview"
    commitMessage: string
    timestamp: string
    duration: string
    deployer: string
    url?: string
}

const MOCK_DEPLOYMENTS: Deployment[] = [
    {
        id: "deploy_8x9s7d6",
        status: "success",
        environment: "production",
        commitMessage: "Initial site generation",
        timestamp: "2 mins ago",
        duration: "45s",
        deployer: "System",
        url: "https://plumber-chicago-v1.netlify.app"
    },
    {
        id: "deploy_2k3j4h5",
        status: "building",
        environment: "preview",
        commitMessage: "Content update: Services page",
        timestamp: "In progress",
        duration: "12s...",
        deployer: "User",
    },
    {
        id: "deploy_9l0k1j2",
        status: "failed",
        environment: "production",
        commitMessage: "Config change: API keys",
        timestamp: "5 hours ago",
        duration: "22s",
        deployer: "User"
    },
    {
        id: "deploy_5h6g7f8",
        status: "success",
        environment: "production",
        commitMessage: "Template switch: Plumber V1",
        timestamp: "2 days ago",
        duration: "58s",
        deployer: "System",
        url: "https://plumber-chicago-v1.netlify.app"
    }
]

export function DeploymentHistory() {
    const [deployments, setDeployments] = useState<Deployment[]>(MOCK_DEPLOYMENTS)
    const [isRollbackOpen, setIsRollbackOpen] = useState<string | null>(null)

    const handleRollback = (id: string) => {
        // Mock rollback logic
        console.log(`Rolling back to deployment ${id}`)
        setIsRollbackOpen(null)
        // Add new deployment to top simulating rollback
        const rollbackDeploy: Deployment = {
            id: `deploy_${Math.random().toString(36).substr(2, 7)}`,
            status: "queued",
            environment: "production",
            commitMessage: `Rollback to ${id}`,
            timestamp: "Just now",
            duration: "-",
            deployer: "User"
        }
        setDeployments([rollbackDeploy, ...deployments])
    }

    const getStatusBadge = (status: DeploymentStatus) => {
        switch (status) {
            case "success":
                return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> Ready</Badge>
            case "failed":
                return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>
            case "building":
                return <Badge variant="secondary" className="animate-pulse"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Building</Badge>
            case "queued":
                return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> Queued</Badge>
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Rocket className="h-5 w-5" />
                        Deployment History
                    </CardTitle>
                    <CardDescription>
                        View recent builds and deployments for this site
                    </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="cursor-pointer">
                    View Logs
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Environment</TableHead>
                            <TableHead>Commit / Message</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deployments.map((deploy) => (
                            <TableRow key={deploy.id}>
                                <TableCell>{getStatusBadge(deploy.status)}</TableCell>
                                <TableCell>
                                    <span className="capitalize text-sm font-medium">{deploy.environment}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{deploy.commitMessage}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{deploy.id} • by {deploy.deployer}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm">{deploy.timestamp}</span>
                                        <span className="text-xs text-muted-foreground">{deploy.duration}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        {deploy.url && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => window.open(deploy.url, "_blank")}
                                                title="Visit URL"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {deploy.status === "success" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                onClick={() => handleRollback(deploy.id)}
                                                title="Rollback to this version"
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {deploy.status === "failed" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                                title="View Error"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
