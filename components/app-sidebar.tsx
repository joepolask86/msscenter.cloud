"use client"

import * as React from "react"
import {
  PhoneCall,
  BarChart3,
  LayoutDashboard,
  Database,
  Trello,
  FileType,
  Server,
  DollarSign,
  House,
  ListTodo,
  FileBarChart,
  Codesandbox,
  Settings,
  Users,
  Atom,
  DollarSignIcon,
  ToolCase,
  Bot,
  Rocket,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/contexts/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/assets/joe.jpg",
  },
  // General section
  general: [
    {
      title: "Dashboard",
      url: "/",
      icon: House,
    },
    {
      title: "Campaigns",
      url: "/campaigns",
      icon: LayoutDashboard,
    },
    {
      title: "Niches",
      url: "/niches",
      icon: Trello,
    },
  ],
  // Call Activities section
  callactivities: [
    {
      title: "eLocal Calls",
      url: "#",
      icon: PhoneCall,
      items: [
        {
          title: "Overview",
          url: "/elocal",
        },
        {
          title: "Reports",
          url: "/elocal-reports",
        },
        {
          title: "Categories",
          url: "/elocal-category",
        },
        {
          title: "Price Lists (RevShare)",
          url: "/price-lists",
        },
      ],
    },
  ],
  // Incom section
  earnings: [
    {
      title: "Income",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "Earnings",
          url: "/earnings",
        },
        {
          title: "Transactions",
          url: "/transactions",
        },
      ],
    },
  ],
  // Cloud section
  cloud: [
    {
      title: "Hosting Server",
      url: "#",
      icon: Server,
      items: [
        {
          title: "Servers",
          url: "/server",
        },
        {
          title: "Domains",
          url: "/domains",
        },
      ],
    },
  ],
  // Rank and Rent section
  rankandrent: [
    {
      title: "Project Planner",
      url: "/project-planner",
      icon: Atom,
      matchPaths: ["/research"], // Also match /research routes
    },
    {
      title: "Local Site Builder",
      url: "/local-sites-pro",
      icon: Rocket,
    },
  ],
  // Tools section
  tools: [
    {
      title: "Toolbox",
      url: "#",
      icon: ToolCase,
      items: [
        {
          title: "Sitemap Scraper",
          url: "/sitemap-scraper",
        },
        {
          title: "Brand Backlink Finder",
          url: "/brand-finder",
        },
      ],
    },
  ],
}

import Link from "next/link"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: "/assets/joe.jpg", // Default avatar for now
  } : data.user

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Codesandbox className="!size-6 text-orange-600" />
                <span className="text-base font-bold">MSSCenter</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="md:text-md">
        <NavMain title="" items={data.general} />
        <NavMain title="Call Activities" items={data.callactivities} className="text-sm text-gray-400" />
        <NavMain title="Earnings" items={data.earnings} className="text-sm text-gray-400" />
        <NavMain title="Cloud" items={data.cloud} className="text-sm text-gray-400" />
        <NavMain title="Rank & Rent" items={data.rankandrent} className="text-sm text-gray-400" />
        <NavMain title="Tools" items={data.tools} className="text-sm text-gray-400" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
