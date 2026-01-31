import { Metadata } from "next"
import { SitePlanView } from "./site-plan-view"

export const metadata: Metadata = {
    title: "Site Structure | MSSCenter Research",
    description: "Entity-driven site architecture and internal linking strategy",
}

export default function SitePlanPage({ params }: { params: { projectId: string } }) {
    return <SitePlanView params={params} />
}
