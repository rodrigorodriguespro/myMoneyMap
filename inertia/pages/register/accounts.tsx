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
import { CirclePlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AccountForm from "@/components/forms/account-form";
import { useAccountBankService } from "@/services/account-bank-service";
import { useAccountCreditBankService } from "@/services/account-credit-bank-service";
import { useAuth } from "~/stores/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Overview() {
  const [activeTab, setActiveTab] = useState("account");
  const [accounts, setAccounts] = useState([]);
  const [creditAccounts, setCreditAccounts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const accountBankService = useAccountBankService();
  const accountCreditBankService = useAccountCreditBankService();
  const { activeWorkspace, user } = useAuth();

  useEffect(() => {
    if (activeTab === "account") {
      fetchAccounts();
    } else {
      fetchCreditAccounts();
    }
  }, [activeTab]);

  const fetchAccounts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await accountBankService.getAll();
      setAccounts(data);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
      setError("Não foi possível carregar as contas. Tente novamente mais tarde.");
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreditAccounts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await accountCreditBankService.getAll();
      setCreditAccounts(data);
    } catch (error) {
      console.error("Erro ao buscar contas de crédito:", error);
      setError("Não foi possível carregar as contas de crédito. Tente novamente mais tarde.");
      setCreditAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (account) => {
    setCurrentAccount(account);
    setIsEditing(true);
    setIsDialogOpen(false); // Fecha o diálogo antes de reabrir para garantir re-renderização
    setTimeout(() => setIsDialogOpen(true), 0); // Reabre o diálogo após um pequeno atraso
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing && currentAccount) {
        // Atualização de conta existente
        if (activeTab === "account") {
          await accountBankService.update(currentAccount.id, formData);
          await fetchAccounts();
        } else {
          await accountCreditBankService.update(currentAccount.id, formData);
          await fetchCreditAccounts();
        }
      } else {
        // Criação de nova conta
        const dataWithIds = {
          ...formData,
          userId: user?.id,
          workspaceId: activeWorkspace?.id,
        };

        if (activeTab === "account") {
          await accountBankService.create(dataWithIds);
          await fetchAccounts();
        } else {
          await accountCreditBankService.create(dataWithIds);
          await fetchCreditAccounts();
        }
      }

      // Fecha o diálogo e reseta o estado de edição
      setIsDialogOpen(false);
      setIsEditing(false);
      setCurrentAccount(null);
    } catch (error) {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} ${activeTab === "account" ? "conta" : "conta de crédito"}:`, error);
      setError(`Erro ao ${isEditing ? 'atualizar' : 'criar'} ${activeTab === "account" ? "conta" : "conta de crédito"}. Verifique os dados e tente novamente.`);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "account") {
      fetchAccounts();
    } else {
      fetchCreditAccounts();
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentAccount(null);
    setIsDialogOpen(true);
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-40 border border-dashed border-gray-300 rounded-md p-6 bg-gray-50">
      <AlertCircle className="size-8 text-gray-400 mb-2" />
      <p className="text-gray-500 text-center">
        Nenhuma {activeTab === "account" ? "conta" : "conta de crédito"} registrada.
      </p>
      <p className="text-gray-500 text-center">
        Clique em "Adicionar" para criar uma nova.
      </p>
    </div>
  );

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
        <Tabs defaultValue="account" className="w-[90%]" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between w-full mb-4">
            <TabsList>
              <TabsTrigger value="account">Conta</TabsTrigger>
              <TabsTrigger value="credit">Crédito</TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              className="ml-4 flex items-center gap-1 px-3 py-1 text-sm font-medium rounded"
              onClick={handleAddClick}
            >
              <CirclePlus className="size-4" />
              Adicionar
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <TabsContent value="account" className="w-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Carregando...</p>
              </div>
            ) : accounts.length > 0 ? (
              <TableRegisterAccountBank 
                data={accounts} 
                onEdit={handleEdit} 
                onDelete={async (account) => {
                  try {
                    await accountBankService.delete(account.id);
                    handleRefresh();
                  } catch (error) {
                    console.error("Erro ao excluir conta:", error);
                    setError("Erro ao excluir conta. Tente novamente mais tarde.");
                  }
                }} 
                onRefresh={handleRefresh} 
              />
            ) : (
              renderEmptyState()
            )}
          </TabsContent>
          <TabsContent value="credit" className="w-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Carregando...</p>
              </div>
            ) : creditAccounts.length > 0 ? (
              <TableRegisterAccountCreditBank 
                data={creditAccounts} 
                onEdit={handleEdit} 
                onRefresh={handleRefresh} 
              />
            ) : (
              renderEmptyState()
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing 
                ? activeTab === "account" ? "Editar Conta" : "Editar Conta de Crédito"
                : activeTab === "account" ? "Adicionar Conta" : "Adicionar Conta de Crédito"
              }
            </DialogTitle>
          </DialogHeader>
          <AccountForm
            onSubmit={handleFormSubmit}
            type={activeTab}
            initialData={currentAccount}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

Overview.layout = DashLayout;

export default Overview;
