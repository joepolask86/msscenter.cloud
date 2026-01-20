import { Metadata } from "next"
import { ElocalDashboard } from "./elocal-dashboard"

export const metadata: Metadata = {
    title: "eLocal Overview | MSSCenter.Cloud",
    description: "Calls overview about total, answered, valid and value of calls.",
}

export default function ElocalPage() {
    return <ElocalDashboard />
}
