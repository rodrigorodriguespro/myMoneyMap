import * as React from "react"
import { ChevronsUpDown, Plus, GalleryVerticalEnd } from "lucide-react"
import { useAuth } from "~/stores/auth"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const iconComponents = {
  GalleryVerticalEnd,
  ChevronsUpDown,
  Plus,
} as const;

type IconName = keyof typeof iconComponents;

export function TeamSwitcher() {
  const { user, activeWorkspace, setActiveWorkspace } = useAuth()
  const { isMobile } = useSidebar()

  if (!user || !user.workspaces) {
    return null
  }

  const ActiveWorkspaceIcon = activeWorkspace?.icon

  const DynamicIcon = ({ name, ...props }: { name: IconName } & React.SVGProps<SVGSVGElement>) => {
    const IconComponent = iconComponents[name];
    return IconComponent ? <IconComponent {...props} /> : null;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeWorkspace?.icon && (
                  <DynamicIcon
                    name={activeWorkspace.icon as IconName}
                    className="size-4"
                  />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace?.name}
                </span>
                <span className="truncate text-xs">Pessoal</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Carteiras
            </DropdownMenuLabel>
            {user.workspaces.map((workspace, index) => {
              return (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => setActiveWorkspace(workspace)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {workspace.icon && (
                      <DynamicIcon
                        name={workspace.icon as IconName}
                        className="size-4 shrink-0"
                      />
                    )}
                  </div>
                  {workspace.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Novo Workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
