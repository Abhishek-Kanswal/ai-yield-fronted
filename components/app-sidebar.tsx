"use client"

import * as React from "react"
import {
  MessageSquare,
  Home,
  LifeBuoy,
  Send,
  Settings,
  Sun,
} from "lucide-react"

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { Toggle } from '@/components/ui/toggle'
import {
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar'

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Setting",
      url: "#",
      icon: Settings,
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <div className="p-2 pt-0">
          <Toggle
            variant="outline"
            pressed
            disabled
            aria-label="Theme is fixed to light"
            className="w-full justify-start gap-2"
          >
            <Sun className="size-4" />
            <span>Light mode</span>
          </Toggle>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
