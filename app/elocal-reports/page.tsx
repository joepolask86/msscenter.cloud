import { Metadata } from "next"
import { ElocalReportsDashboard } from "./elocal-reports-dashboard"

export const metadata: Metadata = {
    title: "eLocal Reports | MSSCenter.Cloud",
    description: "Detailed call logs and reports.",
}

export default function ElocalReportsPage() {
    return <ElocalReportsDashboard />
}
