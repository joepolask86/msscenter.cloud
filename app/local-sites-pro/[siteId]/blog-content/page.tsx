import { BlogContentView } from "./blog-content-view"

export default function Page({ params }: { params: { siteId: string } }) {
    return <BlogContentView params={params} />
}
