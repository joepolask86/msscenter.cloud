import { Metadata } from "next"
import { SitePreviewView } from "./site-preview-view"

export const metadata: Metadata = {
    title: "Site Preview | MSSCenter",
    description: "Preview your generated site",
}

export default function SitePreviewPage({ params }: { params: { siteId: string } }) {
    return <SitePreviewView params={params} />
}
