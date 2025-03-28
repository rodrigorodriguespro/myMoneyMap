import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
  } from "@/components/ui/table" 

export function TableRegisterAccountCreditBank() {
  return (
      <>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">Descrição</TableHead>
            <TableHead>Fechamento</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Limite Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
            <TableCell className="font-medium">Itaú</TableCell>
            <TableCell>29</TableCell>
            <TableCell>6</TableCell>
            <TableCell className="text-right">R$ 7.800,00</TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="font-medium">NU</TableCell>
            <TableCell>15</TableCell>
            <TableCell>20</TableCell>
            <TableCell className="text-right">R$ 3.000,00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </>
  )
}