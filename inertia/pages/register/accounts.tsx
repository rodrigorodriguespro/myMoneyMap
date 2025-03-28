import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableRegisterAccountBank } from "@/components/tables/table-register-account"
import { TableRegisterAccountCreditBank } from "@/components/tables/table-register-account-credit"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DashLayout from "~/layouts/DashLayout"
import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"


function Overview() {
  return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Cadastros
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Contas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center gap-4 p-4 pt-0 mt-5">
            <Tabs defaultValue="account" className="w-[80%]">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="account">Conta</TabsTrigger>
                  <TabsTrigger value="credit">Crédito</TabsTrigger>
                </TabsList>
                <Button variant="outline" className="ml-4 flex items-center gap-1 px-3 py-1 text-sm font-medium rounded">
                  <CirclePlus className="size-4" />
                  Adicionar
                </Button>
              </div>
              <TabsContent value="account">
                <TableRegisterAccountBank />
              </TabsContent>
              <TabsContent value="credit">
                <TableRegisterAccountCreditBank />
              </TabsContent>
            </Tabs>
        </div>
      </>
  )
}

Overview.layout = DashLayout

export default Overview
