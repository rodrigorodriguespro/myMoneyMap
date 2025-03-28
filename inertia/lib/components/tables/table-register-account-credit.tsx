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
}

export function TableRegisterAccountCreditBank({ data = [] }: TableRegisterAccountCreditBankProps) {
  // Calcular o limite total
  const totalLimit = data.reduce((total, account) => total + account.totalLimit, 0);

  return (
    <>
      <Table>
        <TableCaption>Lista de contas de crédito</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Descrição</TableHead>
            <TableHead>Fechamento</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Limite Total</TableHead>
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Nenhuma conta de crédito encontrada</TableCell>
            </TableRow>
          )}
        </TableBody>
        {data.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{formatCurrency(totalLimit)}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
}