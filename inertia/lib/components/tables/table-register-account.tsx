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

export function TableRegisterAccountBank() {
  return (
      <>
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">Descrição</TableHead>
            <TableHead>Saldo Inicial</TableHead>
            <TableHead>Data Saldo Inicial</TableHead>
            <TableHead className="text-right">Saldo Hoje</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            <TableRow>
            <TableCell className="font-medium">Itaú</TableCell>
            <TableCell>R$ 8.422,03</TableCell>
            <TableCell>26/03/2025</TableCell>
            <TableCell className="text-right">R$ 8.173,89</TableCell>
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