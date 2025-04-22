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
import { usePage } from "@inertiajs/react"

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
          url: "/overview",
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
          url: "/entry/receive",
        },
        {
          title: "Pagar",
          url: "/entry/pay",
        },
        {
          title: "Crédito",
          url: "/entry/credit",
        },
        {
          title: "Fixas",
          url: "/entry/fixed",
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
          url: "/register/categories",
        },
        {
          title: "Contas",
          url: "/register/accounts",
        }
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Obtém a página atual do Inertia
  const { url } = usePage();
  
  // Limpa a URL para comparação
  const currentPath = url.startsWith('/') ? url : `/${url}`;
  
  // Prepara os dados do menu com verificação de itens ativos
  const prepareMenuItems = () => {
    return data.navMain.map(group => {
      // Copia o grupo para não mutar o original
      const newGroup = { ...group };
      
      // Verifica se o próprio grupo está ativo
      newGroup.isActive = currentPath === group.url;
      
      // Prepara os subitens com verificação de atividade
      if (newGroup.items) {
        newGroup.items = group.items.map(item => ({
          ...item,
          isActive: currentPath === item.url
        }));
        
        // Um grupo também está ativo se qualquer de seus subitens estiver ativo
        if (!newGroup.isActive) {
          newGroup.isActive = newGroup.items.some(item => item.isActive);
        }
      }
      
      return newGroup;
    });
  };

  const activeMenuItems = prepareMenuItems();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={activeMenuItems} currentPath={currentPath} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
