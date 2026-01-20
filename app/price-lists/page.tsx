import { Metadata } from "next"
import { PriceListDashboard } from "./price-lists-dashboard"

export const metadata: Metadata = {
    title: "eLocal Coverage & Pricing | MSSCenter.Cloud",
    description: "eLocal RevShare coverage and pricing for live call campaigns.",
}

export default function PriceListPage() {
    return <PriceListDashboard />
}
