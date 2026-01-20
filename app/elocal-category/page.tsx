import { Metadata } from "next"
import { ElocalCategoryDashboard } from "./elocal-category-dashboard"

export const metadata: Metadata = {
    title: "eLocal Categories | MSSCenter.Cloud",
    description: "Manage eLocal service categories.",
}

export default function ElocalCategoryPage() {
    return <ElocalCategoryDashboard />
}
