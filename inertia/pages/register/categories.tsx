import React, { useState, useEffect } from "react";
import DashLayout from '~/layouts/DashLayout';
import HeaderBreadcrump from '~/lib/components/header-breadcrump';
import { Button } from '@/components/ui/button';
import { CirclePlus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TableRegisterCategories } from "@/components/tables/table-register-categories";
import CategoryForm from "@/components/forms/category-form";
import { useCategoryService, Category } from "@/services/categories-service";
import { useAuth } from "~/stores/auth";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const categoryService = useCategoryService();
  const { activeWorkspace, user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setError("Não foi possível carregar as categorias. Tente novamente mais tarde.");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    // Primeiro limpa e depois define os valores para evitar problemas de renderização
    setIsEditing(false);
    setCurrentCategory(null);
    
    // Pequeno timeout para garantir que o estado foi limpo antes de definir novos valores
    setTimeout(() => {
      setCurrentCategory(category);
      setIsEditing(true);
      setIsDialogOpen(true);
    }, 10);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (isEditing && currentCategory?.id) {
        // Atualização de categoria existente
        const dataWithIds = {
          ...formData,
          workspaceId: activeWorkspace?.id,
        };
        await categoryService.update(currentCategory.id, dataWithIds);
      } else {
        // Criação de nova categoria
        const dataWithIds = {
          ...formData,
          userId: user?.id,
          workspaceId: activeWorkspace?.id,
        };
        await categoryService.create(dataWithIds);
      }

      // Atualiza a lista e fecha o formulário
      await fetchCategories();
      setIsDialogOpen(false);
      setIsEditing(false);
      setCurrentCategory(null);
    } catch (error) {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} categoria:`, error);
      setError(`Erro ao ${isEditing ? 'atualizar' : 'criar'} categoria. Verifique os dados e tente novamente.`);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (!category.id) return;
    
    try {
      await categoryService.delete(category.id);
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setError("Não foi possível excluir a categoria. Tente novamente mais tarde.");
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-40 border border-dashed border-gray-300 rounded-md p-6 bg-gray-50">
      <AlertCircle className="size-8 text-gray-400 mb-2" />
      <p className="text-gray-500 text-center">
        Nenhuma categoria registrada.
      </p>
      <p className="text-gray-500 text-center">
        Clique em "Adicionar" para criar uma nova.
      </p>
    </div>
  );

  return (
    <>
      <HeaderBreadcrump crumbLink="Cadastro" crumbPage="Categorias" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between w-full mb-4">
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

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Carregando...</p>
          </div>
        ) : categories.length > 0 ? (
          <TableRegisterCategories
            data={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={fetchCategories}
          />
        ) : (
          renderEmptyState()
        )}
      </div>

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            // Limpa os estados quando o dialog for fechado
            setTimeout(() => {
              setIsEditing(false);
              setCurrentCategory(null);
            }, 300); // Aguarda a animação de fechamento terminar
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Categoria" : "Adicionar Categoria"}
            </DialogTitle>
          </DialogHeader>
          {isDialogOpen && (
            <CategoryForm
              key={currentCategory ? `edit-${currentCategory.id}` : "new-category"}
              onSubmit={handleFormSubmit}
              initialData={currentCategory}
              isEditing={isEditing}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

Categories.layout = DashLayout;

export default Categories;
