import React from "react";
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
}

export function TableRegisterAccountBank({ data = [] }: TableRegisterAccountBankProps) {
  // Calcular o total do saldo inicial
  const totalInitialBalance = data.reduce((total, account) => total + account.initialBalance, 0);

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Nenhuma conta encontrada</TableCell>
            </TableRow>
          )}
        </TableBody>
        {data.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{formatCurrency(totalInitialBalance)}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
}