import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { formatCurrency } from "../../lib/utils";
import { useAccountCreditBankService } from "../../services/account-credit-bank-service";

interface AccountCreditBank {
  id?: number;
  userId: number;
  workspaceId: number;
  icon?: string | null;
  name: string;
  closing: number;
  maturity: number;
  totalLimit: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TableRegisterAccountCreditBankProps {
  data: AccountCreditBank[];
  onEdit?: (account: AccountCreditBank) => void;
  onRefresh?: () => void;
}

export function TableRegisterAccountCreditBank({ 
  data = [], 
  onEdit,
  onRefresh
}: TableRegisterAccountCreditBankProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<AccountCreditBank | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const accountCreditBankService = useAccountCreditBankService();

  // Função auxiliar para garantir que um valor seja convertido para número
  const parseNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    
    // Se for string, tenta converter para número
    if (typeof value === 'string') {
      // Remove caracteres não numéricos, exceto ponto decimal
      const cleaned = value.replace(/[^\d.-]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    
    // Se já for número, retorna diretamente
    if (typeof value === 'number') return value;
    
    // Para outros tipos, tenta converter ou retorna 0
    return 0;
  };

  // Calcula o limite total usando um loop tradicional para mais controle
  let totalLimit = 0;
  for (let i = 0; i < data.length; i++) {
    totalLimit += parseNumber(data[i].totalLimit);
  }

  const handleEditClick = (account: AccountCreditBank) => {
    if (onEdit) {
      onEdit(account);
    }
  };

  const handleDeleteClick = (account: AccountCreditBank) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (accountToDelete?.id) {
      try {
        setIsDeleting(true);
        await accountCreditBankService.delete(accountToDelete.id);
        
        // Atualizar a lista após a exclusão
        if (onRefresh) {
          onRefresh();
        }
        
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Erro ao excluir conta de crédito:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <Table>
        <TableCaption>Lista de contas de crédito</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Descrição</TableHead>
            <TableHead>Dia de Fechamento</TableHead>
            <TableHead>Dia de Vencimento</TableHead>
            <TableHead className="text-right">Limite Total</TableHead>
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
                <TableCell>{account.closing}</TableCell>
                <TableCell>{account.maturity}</TableCell>
                <TableCell className="text-right">{formatCurrency(account.totalLimit)}</TableCell>
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
              <TableCell colSpan={5} className="text-center">Nenhuma conta de crédito encontrada</TableCell>
            </TableRow>
          )}
        </TableBody>
        {data.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{formatCurrency(totalLimit)}</TableCell>
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
              Você está prestes a excluir a conta de crédito "{accountToDelete?.name}".
              Esta ação excluirá todos os registros vinculados a esta conta e é irreversível.
              Tem certeza que deseja continuar?
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