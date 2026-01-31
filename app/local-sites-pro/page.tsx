import { Metadata } from "next"
import { LocalSitesView } from "./local-sites-view"

export const metadata: Metadata = {
    title: "Local Sites Pro | MSSCenter Research",
    description: "Manage and deploy your local lead-gen sites",
}

export default function LocalSitesProPage() {
    return <LocalSitesView />
}
