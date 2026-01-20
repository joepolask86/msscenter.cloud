import { Metadata } from "next"
import { TransactionsDashboard } from "./transactions-dashboard"

export const metadata: Metadata = {
    title: "Transactions | MSSCenter.Cloud",
    description: "Overview of monthly, annual and lifetime transaction from leadgen sites.",
}

export default function TransactionsPage() {
    return <TransactionsDashboard />
}
