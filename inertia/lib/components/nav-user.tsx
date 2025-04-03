"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "~/stores/auth"
import { useEffect, useState } from "react"

export function NavUser({
  user,
}: {
  user: {
    fullName: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { me, user: authUser, isReady, logout } = useAuth()
  const [userData, setUserData] = useState<{ fullName: string, email: string }>({ fullName: '', email: '' })
  const [isLoading, setIsLoading] = useState(false)

  // Efeito para atualizar os dados do usuário do contexto de autenticação
  useEffect(() => {
    if (authUser) {
      setUserData({ fullName: authUser.fullName, email: authUser.email })
    }
  }, [authUser])

  // Efeito separado para buscar dados quando necessário
  useEffect(() => {
    // Se já temos dados ou não estamos prontos para buscar, não faça nada
    if (!isReady || isLoading || userData.fullName) {
      return
    }
    
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const data = await me()
        setUserData({ fullName: data.fullName, email: data.email })
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
  }, [isReady, isLoading, me, userData.fullName])

  const handleLogout = () => {
    logout().catch(error => {
      console.error("Erro ao fazer logout:", error)
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={userData.fullName || 'Usuário'} />
                <AvatarFallback className="rounded-lg">
                  {userData.fullName 
                    ? userData.fullName.split(' ').map(name => name[0]).join('').toUpperCase() 
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userData.fullName || 'Carregando...'}</span>
                <span className="truncate text-xs">{userData.email || ''}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={userData.fullName || 'Usuário'} />
                  <AvatarFallback className="rounded-lg">
                    {userData.fullName 
                      ? userData.fullName.split(' ').map(name => name[0]).join('').toUpperCase() 
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userData.fullName || 'Carregando...'}</span>
                  <span className="truncate text-xs">{userData.email || ''}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Conta
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notificações
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
