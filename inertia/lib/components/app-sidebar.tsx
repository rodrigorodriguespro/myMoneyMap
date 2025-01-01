import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  PieChart,
  ListCheck,
  NotebookText,
  BadgeCheck,
  CircleFadingPlus
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Controle",
      url: "#",
      icon: PieChart,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Dashboard",
          url: "#",
        },
        {
          title: "Balanço",
          url: "#",
        },
        {
          title: "Calendário",
          url: "#",
        },
      ],
    },
    {
      title: "Lançamentos",
      url: "#",
      icon: ListCheck,
      items: [
        {
          title: "Receber",
          url: "#",
        },
        {
          title: "Pagar",
          url: "#",
        },
        {
          title: "Crédito",
          url: "#",
        },
        {
          title: "Fixas",
          url: "#",
        },
      ],
    },
    {
      title: "Planejamento",
      url: "#",
      icon: NotebookText,
      items: [
        {
          title: "Objetivos",
          url: "#",
        },
        {
          title: "Desejos",
          url: "#",
        }
      ],
    },
    {
      title: "Compromissos",
      url: "#",
      icon: BadgeCheck,
      items: [
        {
          title: "Pendências",
          url: "#",
        },
        {
          title: "Reservas",
          url: "#",
        }
      ],
    },
    {
      title: "Cadastros",
      url: "#",
      icon: CircleFadingPlus,
      items: [
        {
          title: "Categorias",
          url: "#",
        },
        {
          title: "Contas",
          url: "#",
        }
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
