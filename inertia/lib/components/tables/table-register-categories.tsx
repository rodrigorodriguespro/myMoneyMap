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
import { Category } from "@/services/categories-service";

interface TableRegisterCategoriesProps {
  data: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onRefresh?: () => void;
}

export function TableRegisterCategories({ 
  data = [], 
  onEdit, 
  onDelete, 
  onRefresh 
}: TableRegisterCategoriesProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (category: Category) => {
    if (onEdit) {
      onEdit(category);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete && onDelete) {
      try {
        setIsDeleting(true);
        await onDelete(categoryToDelete);

        // Atualizar a lista após a exclusão
        if (onRefresh) {
          onRefresh();
        }

        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <Table>
        <TableCaption>Lista de categorias</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Categoria</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo de Categoria</TableHead>
            <TableHead>Tipo de Gasto</TableHead>
            <TableHead className="text-right">Orçado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  {category.icon && (
                    <span className="mr-2 text-lg inline-block align-middle">{category.icon}</span>
                  )}
                  {category.name}
                </TableCell>
                <TableCell>{category.description || "-"}</TableCell>
                <TableCell>{category.type || "-"}</TableCell>
                <TableCell>{category.expenseType || "-"}</TableCell>
                <TableCell className="text-right">{category.budget ? formatCurrency(category.budget) : "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(category)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(category)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Nenhuma categoria encontrada</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você está prestes a excluir a categoria "{categoryToDelete?.name}".
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
