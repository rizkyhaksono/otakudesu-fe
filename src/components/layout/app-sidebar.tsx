"use client";

import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react"
import { usePathname } from 'next/navigation'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const isUrlActive = (url: string, pathname: string) => {
  const cleanUrl = url.replace(/#.*$/, '')
  const cleanPathname = pathname.replace(/#.*$/, '')
  return cleanUrl === cleanPathname
}

const data = {
  navMain: [
    {
      title: "Anime",
      url: "#",
      items: [
        {
          title: "Home",
          url: "/",
        },
        {
          title: "Search Anime",
          url: "/anime",
        },
        {
          title: "Genres List",
          url: "/genres",
        },
        {
          title: "Schedules List",
          url: "/schedules",
        },
      ],
    },
    {
      title: "Comic",
      url: "#",
      items: [
        {
          title: "Home",
          url: "/comic",
        },
      ],
    },
    {
      title: "Movie",
      url: "#",
      items: [
        {
          title: "Home",
          url: "/movie",
        },
        {
          title: "SEarch Movie",
          url: "/movie/search",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const hasActiveChild = (items: Array<{ url: string }>) => {
    return items.some(item => isUrlActive(item.url, pathname))
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Otakudesu Natee</span>
                  <span className="">v2.0.0</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                // Open by default if this section contains the active item
                defaultOpen={item.items && hasActiveChild(item.items)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isUrlActive(item.url, pathname)}
                            >
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
