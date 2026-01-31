"use client"

import * as React from "react"
import * as d3 from "d3"

interface Node {
    id: string
    label: string
    type: "homepage" | "service" | "location" | "blog" | "utility" | "child"
    count?: number
    parent?: string
}

interface Link {
    source: string
    target: string
    type: "primary" | "cross" | "child" | "footer"
}

interface LinkGraphProps {
    servicePages: number
    locationPages: number
    blogPosts: number
}

export function LinkGraph({ servicePages, locationPages, blogPosts }: LinkGraphProps) {
    const svgRef = React.useRef<SVGSVGElement>(null)
    const [hoveredNode, setHoveredNode] = React.useState<string | null>(null)
    const [expandedNode, setExpandedNode] = React.useState<string | null>(null)
    const [dimensions] = React.useState({ width: 800, height: 500 })

    React.useEffect(() => {
        if (!svgRef.current) return

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove()

        const width = dimensions.width
        const height = dimensions.height

        // Create base nodes
        const nodes: Node[] = [
            { id: "homepage", label: "Homepage", type: "homepage" },
            { id: "services", label: `Services (${servicePages})`, type: "service", count: servicePages },
            { id: "locations", label: `Locations (${locationPages})`, type: "location", count: locationPages },
        ]

        if (blogPosts > 0) {
            nodes.push({ id: "blog", label: `Blog (${blogPosts})`, type: "blog", count: blogPosts })
        }

        // Add utility pages (always present)
        nodes.push(
            { id: "about", label: "About Us", type: "utility" },
            { id: "contact", label: "Contact", type: "utility" },
            { id: "privacy", label: "Privacy Policy", type: "utility" },
            { id: "terms", label: "Terms of Service", type: "utility" }
        )

        // Add child nodes if expanded
        if (expandedNode === "services") {
            for (let i = 0; i < servicePages; i++) {
                nodes.push({
                    id: `service-${i}`,
                    label: `Service ${i + 1}`,
                    type: "child",
                    parent: "services"
                })
            }
        }

        if (expandedNode === "locations") {
            for (let i = 0; i < locationPages; i++) {
                nodes.push({
                    id: `location-${i}`,
                    label: `Location ${i + 1}`,
                    type: "child",
                    parent: "locations"
                })
            }
        }

        if (expandedNode === "blog" && blogPosts > 0) {
            for (let i = 0; i < blogPosts; i++) {
                nodes.push({
                    id: `blog-${i}`,
                    label: `Blog Post ${i + 1}`,
                    type: "child",
                    parent: "blog"
                })
            }
        }

        // Create links
        const links: Link[] = [
            { source: "homepage", target: "services", type: "primary" },
            { source: "homepage", target: "locations", type: "primary" },
            { source: "services", target: "locations", type: "cross" },
        ]

        if (blogPosts > 0) {
            links.push({ source: "homepage", target: "blog", type: "primary" })
        }

        // Add utility page links (footer navigation)
        links.push(
            { source: "homepage", target: "about", type: "footer" },
            { source: "homepage", target: "contact", type: "footer" },
            { source: "homepage", target: "privacy", type: "footer" },
            { source: "homepage", target: "terms", type: "footer" }
        )

        // Add child links
        nodes.filter(n => n.type === "child").forEach(child => {
            if (child.parent) {
                links.push({ source: child.parent, target: child.id, type: "child" })
            }
        })

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])

        // Create force simulation
        const simulation = d3.forceSimulation(nodes as any)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance((d: any) => d.type === "child" ? 80 : 180))
            .force("charge", d3.forceManyBody().strength((d: any) => d.type === "child" ? -100 : -400))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius((d: any) => d.type === "child" ? 15 : 30))

        // Create links
        const link = svg.append("g")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke", (d) => {
                if (d.type === "child") return "#e2e8f0"
                if (d.type === "footer") return "#3b82f6"
                return d.type === "primary" ? "#64748b" : "#cbd5e1"
            })
            .attr("stroke-width", (d) => d.type === "child" ? 1 : (d.type === "primary" ? 2 : 1))
            .attr("stroke-dasharray", (d) => (d.type === "cross" || d.type === "footer") ? "5,5" : "0")
            .attr("stroke-opacity", (d) => d.type === "child" ? 0.4 : (d.type === "footer" ? 0.5 : 0.6))

        // Create node groups
        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(d3.drag<any, any>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended) as any)

        // Add circles
        node.append("circle")
            .attr("r", (d) => {
                if (d.type === "child") return 8
                return d.type === "homepage" ? 20 : 15
            })
            .attr("fill", (d) => {
                if (d.type === "homepage") return "#f7721a"
                if (d.type === "utility") return "#3b82f6"
                return "#7a889c"
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .style("cursor", (d) => d.type !== "child" ? "pointer" : "default")
            .on("mouseenter", function (event, d: any) {
                setHoveredNode(d.id)
                if (d.type !== "child") {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", d.type === "homepage" ? 24 : 18)
                }
            })
            .on("mouseleave", function (event, d: any) {
                setHoveredNode(null)
                if (d.type !== "child") {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", d.type === "homepage" ? 20 : 15)
                }
            })
            .on("click", function (event, d: any) {
                if (d.type === "service" || d.type === "location" || d.type === "blog") {
                    setExpandedNode(expandedNode === d.id ? null : d.id)
                }
            })

        // Update positions on tick
        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y)

            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
        })

        // Drag functions
        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            event.subject.fx = event.subject.x
            event.subject.fy = event.subject.y
        }

        function dragged(event: any) {
            event.subject.fx = event.x
            event.subject.fy = event.y
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0)
            event.subject.fx = null
            event.subject.fy = null
        }

        return () => {
            simulation.stop()
        }
    }, [servicePages, locationPages, blogPosts, dimensions, expandedNode])

    const getNodeLabel = (nodeId: string) => {
        if (nodeId === "homepage") return "Homepage"
        if (nodeId === "services") return `Services (${servicePages})`
        if (nodeId === "locations") return `Locations (${locationPages})`
        if (nodeId === "blog") return `Blog (${blogPosts})`

        // Child nodes
        if (nodeId.startsWith("service-")) {
            const num = parseInt(nodeId.split("-")[1]) + 1
            return `Service Page ${num}`
        }
        if (nodeId.startsWith("location-")) {
            const num = parseInt(nodeId.split("-")[1]) + 1
            return `Location Page ${num}`
        }
        if (nodeId.startsWith("blog-")) {
            const num = parseInt(nodeId.split("-")[1]) + 1
            return `Blog Post ${num}`
        }
        if (nodeId === "about") return "About Us (Utility)"
        if (nodeId === "contact") return "Contact (Utility)"
        if (nodeId === "privacy") return "Privacy Policy (Legal)"
        if (nodeId === "terms") return "Terms of Service (Legal)"
        return nodeId
    }

    return (
        <div className="w-full relative">
            <svg ref={svgRef} className="w-full h-[500px] border rounded-lg bg-background" />

            {/* Floating label on hover */}
            {hoveredNode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border rounded-lg px-4 py-2 shadow-lg z-10">
                    <p className="text-sm font-semibold">
                        {getNodeLabel(hoveredNode)}
                    </p>
                </div>
            )}

            {/* Expanded node indicator */}
            {expandedNode && (
                <div className="absolute top-4 right-4 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 text-xs">
                    <p className="text-orange-700 dark:text-orange-400 font-medium">
                        Showing: {expandedNode === "services" ? `${servicePages} Services` : expandedNode === "locations" ? `${locationPages} Locations` : `${blogPosts} Blog Posts`}
                    </p>
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
                    <span className="text-muted-foreground">Homepage</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-400 border-2 border-white"></div>
                    <span className="text-muted-foreground">Entity Pages</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                    <span className="text-muted-foreground">Utility Pages</span>
                </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-3">
                💡 Hover to see labels • Click Services/Locations/Blog to expand • Drag to rearrange
            </p>
        </div>
    )
}
