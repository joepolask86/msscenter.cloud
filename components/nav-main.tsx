"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  title,
  items,
  className,
}: {
  title?: string
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  className?: string
}) {
  const pathname = usePathname()

  // Helper function to check if a menu item should be active
  const isItemActive = (itemUrl: string) => {
    // Exact match
    if (pathname === itemUrl) return true

    // Check if current path is a child of this item's URL
    // e.g., /campaigns/1 should make /campaigns active
    if (pathname.startsWith(itemUrl + "/")) return true

    return false
  }

  // Helper function to check if a collapsible parent should be active
  const isParentActive = (item: typeof items[0]) => {
    // Check if main item is active
    if (isItemActive(item.url)) return true

    // Check if any sub-item is active
    if (item.items) {
      return item.items.some(subItem => pathname === subItem.url)
    }

    return false
  }

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel className={className}>{title}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) =>
            item.items ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive || isParentActive(item)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={isParentActive(item)}>
                      {item.icon && <item.icon className={isParentActive(item) ? "text-primary" : ""} />}
                      <span className={isParentActive(item) ? "text-primary" : ""}>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isItemActive(item.url)}>
                  <Link href={item.url}>
                    {item.icon && <item.icon className={isItemActive(item.url) ? "text-primary" : ""} />}
                    <span className={isItemActive(item.url) ? "text-primary" : ""}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
