import { Metadata } from "next"
import { SiteDetailsView } from "./site-details-view"

export const metadata: Metadata = {
    title: "Site Details | MSSCenter",
    description: "Manage your site settings and deployment",
}

export default function SiteDetailsPage({ params }: { params: { siteId: string } }) {
    return <SiteDetailsView params={params} />
}
