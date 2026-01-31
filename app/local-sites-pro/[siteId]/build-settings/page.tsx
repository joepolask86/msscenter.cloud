import { Metadata } from "next"
import { SiteBuildSettingsView } from "./site-build-settings-view"

export const metadata: Metadata = {
    title: "Site Build Settings | MSSCenter",
    description: "Configure your site build settings",
}

export default function SiteBuildSettingsPage({ params }: { params: { siteId: string } }) {
    return <SiteBuildSettingsView params={params} />
}
