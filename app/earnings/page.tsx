import { Metadata } from "next"
import { EarningsDashboard } from "./earnings-dashboard"

export const metadata: Metadata = {
    title: "Earnings | MSSCenter.Cloud",
    description: "Overview of daily, weekly, monthly and annual earnings.",
}

export default function EarningsPage() {
    return <EarningsDashboard />
}
