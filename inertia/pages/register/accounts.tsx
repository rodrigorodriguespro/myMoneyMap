import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableRegisterAccountBank } from "@/components/tables/table-register-account";
import { TableRegisterAccountCreditBank } from "@/components/tables/table-register-account-credit";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DashLayout from "~/layouts/DashLayout";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AccountForm from "@/components/forms/account-form";

function Overview() {
  const [activeTab, setActiveTab] = useState("account");
  const [accounts, setAccounts] = useState([]);
  const [creditAccounts, setCreditAccounts] = useState([]);

  useEffect(() => {
    // Fetch accounts and credit accounts on load
    fetchAccounts();
    fetchCreditAccounts();
  }, []);

  const fetchAccounts = async () => {
    const response = await fetch("/api/register/account_banks");
    const data = await response.json();
    setAccounts(data);
  };

  const fetchCreditAccounts = async () => {
    const response = await fetch("/api/register/account_credit_banks");
    const data = await response.json();
    setCreditAccounts(data);
  };

  const handleFormSubmit = async (formData) => {
    const endpoint = activeTab === "account" ? "/api/register/account_banks" : "/api/account_credit_banks";
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // Refresh the respective table
    if (activeTab === "account") {
      fetchAccounts();
    } else {
      fetchCreditAccounts();
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Cadastros</BreadcrumbLink>
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
        <Tabs defaultValue="account" className="w-[80%]" onValueChange={setActiveTab}>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="account">Conta</TabsTrigger>
              <TabsTrigger value="credit">Crédito</TabsTrigger>
            </TabsList>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-4 flex items-center gap-1 px-3 py-1 text-sm font-medium rounded"
                >
                  <CirclePlus className="size-4" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === "account" ? "Adicionar Conta" : "Adicionar Conta de Crédito"}
                  </DialogTitle>
                </DialogHeader>
                <AccountForm
                  onSubmit={handleFormSubmit}
                  type={activeTab}
                />
              </DialogContent>
            </Dialog>
          </div>
          <TabsContent value="account">
            {accounts.length > 0 ? (
              <TableRegisterAccountBank data={accounts} />
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <CirclePlus className="size-6 text-gray-400" />
                <p className="text-gray-500">Nenhuma conta registrada. Clique em Adicionar para criar uma.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="credit">
            {creditAccounts.length > 0 ? (
              <TableRegisterAccountCreditBank data={creditAccounts} />
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <CirclePlus className="size-6 text-gray-400" />
                <p className="text-gray-500">Nenhuma conta de crédito registrada. Clique em Adicionar para criar uma.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

Overview.layout = DashLayout;

export default Overview;
