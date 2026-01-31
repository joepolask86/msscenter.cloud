import { Metadata } from "next"
import { SiteBuilderView } from "./site-builder-view"

export const metadata: Metadata = {
    title: "Site Builder | MSSCenter",
    description: "Generate your entity-optimized site",
}

export default function SiteBuilderPage({ params }: { params: { siteId: string } }) {
    return <SiteBuilderView params={params} />
}
