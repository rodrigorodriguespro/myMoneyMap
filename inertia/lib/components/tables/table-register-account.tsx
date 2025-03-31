import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AccountBank {
  id?: number;
  userId: number;
  workspaceId: number;
  icon?: string | null;
  name: string;
  initialBalance: number;
  initialBalanceDate: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TableRegisterAccountBankProps {
  data: AccountBank[];
  onEdit?: (account: AccountBank) => void;
  onDelete?: (account: AccountBank) => void;
  onRefresh?: () => void;
}

export function TableRegisterAccountBank({ data = [], onEdit, onDelete, onRefresh }: TableRegisterAccountBankProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<AccountBank | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalInitialBalance = data.reduce((total, account) => total + account.initialBalance, 0);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  const handleEditClick = (account: AccountBank) => {
    if (onEdit) {
      onEdit(account);
    }
  };

  const handleDeleteClick = (account: AccountBank) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (accountToDelete && onDelete) {
      try {
        setIsDeleting(true);
        await onDelete(accountToDelete);

        // Atualizar a lista após a exclusão
        if (onRefresh) {
          onRefresh();
        }

        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <Table>
        <TableCaption>Lista de contas bancárias</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Descrição</TableHead>
            <TableHead>Saldo Inicial</TableHead>
            <TableHead>Data Saldo Inicial</TableHead>
            <TableHead className="text-right">Saldo Atual</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  {account.icon && (
                    <span className={`${account.icon} mr-2 text-lg inline-block align-middle`}></span>
                  )}
                  {account.name}
                </TableCell>
                <TableCell>{formatCurrency(account.initialBalance)}</TableCell>
                <TableCell>{formatDate(account.initialBalanceDate)}</TableCell>
                <TableCell className="text-right">{formatCurrency(account.initialBalance)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(account)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(account)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Nenhuma conta encontrada</TableCell>
            </TableRow>
          )}
        </TableBody>
        {data.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{formatCurrency(totalInitialBalance)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você está prestes a excluir a conta "{accountToDelete?.name}".
              Esta ação é irreversível. Tem certeza que deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}