import { Metadata } from "next"
import { ContentBriefsView } from "./content-briefs-view"

export const metadata: Metadata = {
    title: "Content Briefs | MSSCenter Research",
    description: "Entity-optimized content briefs for each page",
}

export default function ContentBriefsPage({ params }: { params: { projectId: string } }) {
    return <ContentBriefsView params={params} />
}
