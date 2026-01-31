import { Metadata } from "next"
import { EntitiesView } from "./entities-view"

export const metadata: Metadata = {
    title: "Entity Map | MSSCenter Research",
    description: "Explore extracted entities and semantic relationships",
}

export default function EntitiesPage({ params }: { params: { projectId: string } }) {
    return <EntitiesView params={params} />
}