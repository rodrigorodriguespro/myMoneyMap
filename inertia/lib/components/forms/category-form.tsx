import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category } from "@/services/categories-service";
import { Smile } from "lucide-react";


// Estrutura para mapear valores do frontend para o backend
interface CategoryTypeOption {
  label: string;
  value: string;
}

// Lista de emojis comuns para categorias financeiras
const commonEmojis = [
  "💰", "💵", "💸", "💳", "🏦", "🏠", "🚗", "✈️", "🍔", "🛒", 
  "🎓", "💊", "🎭", "🎮", "📱", "👕", "💼", "🎁", "💝", "🧾",
  "🔋", "📺", "🏥", "⛽", "🍽️", "🏋️", "💇", "🧹", "🧸", "📚"
];

const CATEGORY_TYPES: CategoryTypeOption[] = [
  { label: "Entrada", value: "income" },
  { label: "Saída", value: "expense" }
];

const EXPENSE_TYPES: CategoryTypeOption[] = [
  { label: "Essencial", value: "essential" },
  { label: "Não Essencial", value: "non-essential" }
];

// Schema de validação
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  icon: z.string().optional(),
  categoryType: z.string().min(1, "Tipo de categoria é obrigatório"),
  expenseType: z.string().optional(),
  budget: z.string().optional().transform(val => val ? parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.')) : undefined),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: Category | null;
  isEditing?: boolean;
  onSubmit: (data: any) => void;
}

export default function CategoryForm({ 
  initialData = null, 
  isEditing = false, 
  onSubmit 
}: CategoryFormProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "",
      categoryType: initialData?.categoryType || "expense",
      expenseType: initialData?.expenseType || "non-essential",
      budget: initialData?.budget 
        ? Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          }).format(initialData.budget)
        : "",
    },
  });

  const categoryType = form.watch("categoryType");

  const handleEmojiSelect = (emoji: string) => {
    form.setValue("icon", emoji);
    setShowEmojiPicker(false);
  };

  const handleFormSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error("Erro ao submeter o formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji</FormLabel>
                <div className="flex items-center gap-2">
                  <div className="border rounded-md p-2 w-12 h-12 flex items-center justify-center text-2xl">
                    {field.value || <Smile className="h-6 w-6" />}
                  </div>
                  <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline">
                        Selecionar Emoji
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" side="right" align="start">
                      <div className="grid grid-cols-5 gap-2">
                        {commonEmojis.map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            className="h-10 w-10 p-0 text-xl"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da categoria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição da categoria" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {categoryType === "expense" && (
            <FormField
              control={form.control}
              name="expenseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Gasto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de gasto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPENSE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orçamento</FormLabel>
              <FormControl>
                <Input 
                  placeholder="R$ 0,00" 
                  {...field} 
                  onChange={(e) => {
                    // Formata para moeda conforme o usuário digita
                    const value = e.target.value.replace(/\D/g, '');
                    const formattedValue = value 
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(Number(value) / 100)
                      : '';
                    field.onChange(formattedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting 
              ? "Salvando..." 
              : isEditing 
                ? "Atualizar Categoria" 
                : "Criar Categoria"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
