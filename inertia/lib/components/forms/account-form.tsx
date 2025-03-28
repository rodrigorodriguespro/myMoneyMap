import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "~/stores/auth";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Lista de ícones de bancos disponíveis
const bankIcons = [
  { class: "ibb-sicredi", name: "Sicredi" },
  { class: "ibb-sicoob", name: "Sicoob" },
  { class: "ibb-santander", name: "Santander" },
  { class: "ibb-safra", name: "Safra" },
  { class: "ibb-original", name: "Original" },
  { class: "ibb-nubank", name: "Nubank" },
  { class: "ibb-itau", name: "Itaú" },
  { class: "ibb-inter", name: "Inter" },
  { class: "ibb-hsbc", name: "HSBC" },
  { class: "ibb-citi-bank", name: "Citi Bank" },
  { class: "ibb-caixa", name: "Caixa" },
  { class: "ibb-bradesco-alt", name: "Bradesco (Alt)" },
  { class: "ibb-bradesco", name: "Bradesco" },
  { class: "ibb-banrisul", name: "Banrisul" },
  { class: "ibb-bank-boston", name: "Bank Boston" },
  { class: "ibb-banestes", name: "Banestes" },
  { class: "ibb-banco-real", name: "Banco Real" },
  { class: "ibb-banco-nordeste", name: "Banco do Nordeste" },
  { class: "ibb-banco-brasilia", name: "Banco de Brasília" },
  { class: "ibb-banco-brasil", name: "Banco do Brasil" },
  { class: "ibb-banco-amazonia", name: "Banco da Amazônia" }
];

interface AccountFormProps {
  onSubmit: (data: any) => void;
  type: 'account' | 'credit';
  initialData?: any;
  isEditing?: boolean;
}

const AccountForm = ({ onSubmit, type, initialData, isEditing = false }: AccountFormProps) => {
  const { user, activeWorkspace } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    ...(type === "account" 
      ? { initialBalance: "", initialBalanceDate: new Date().toISOString().split('T')[0] } 
      : { closing: "", maturity: "", totalLimit: "" }),
  });

  // Preenche o formulário com dados iniciais quando estiver editando
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        name: initialData.name || "",
        icon: initialData.icon || "",
        ...(type === "account" 
          ? { 
              initialBalance: initialData.initialBalance?.toString() || "",
              initialBalanceDate: initialData.initialBalanceDate 
                ? new Date(initialData.initialBalanceDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
            } 
          : { 
              closing: initialData.closing?.toString() || "",
              maturity: initialData.maturity?.toString() || "",
              totalLimit: initialData.totalLimit?.toString() || ""
            }),
      });
    }
  }, [initialData, isEditing, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (value) => {
    setFormData((prev) => ({ ...prev, icon: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Converte valores numéricos
    const processedData = {
      ...formData,
      ...(type === "account" 
        ? { 
            initialBalance: parseFloat(formData.initialBalance) || 0,
          } 
        : { 
            closing: parseInt(formData.closing) || 1,
            maturity: parseInt(formData.maturity) || 10,
            totalLimit: parseFloat(formData.totalLimit) || 0,
          }),
    };
    
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name"
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Ex: Nubank, Itaú, etc." 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="icon">Ícone</Label>
        <Select 
          value={formData.icon} 
          onValueChange={handleIconSelect}
        >
          <SelectTrigger id="icon" className="w-full">
            <SelectValue placeholder="Selecione um ícone" />
          </SelectTrigger>
          <SelectContent>
            {bankIcons.map((icon) => (
              <SelectItem key={icon.class} value={icon.class}>
                <div className="flex items-center">
                  <span className={`${icon.class} mr-2 text-xl`}></span>
                  <span>{icon.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {type === "account" ? (
        <>
          <div>
            <Label htmlFor="initialBalance">Saldo Inicial</Label>
            <Input 
              id="initialBalance"
              name="initialBalance" 
              type="number"
              step="0.01"
              value={formData.initialBalance} 
              onChange={handleChange} 
              placeholder="0.00" 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="initialBalanceDate">Data do Saldo Inicial</Label>
            <Input 
              id="initialBalanceDate"
              name="initialBalanceDate" 
              type="date" 
              value={formData.initialBalanceDate} 
              onChange={handleChange} 
              required 
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="closing">Dia de Fechamento</Label>
            <Input 
              id="closing"
              name="closing" 
              type="number"
              min="1"
              max="31"
              value={formData.closing} 
              onChange={handleChange} 
              placeholder="Ex: 15" 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="maturity">Dia de Vencimento</Label>
            <Input 
              id="maturity"
              name="maturity" 
              type="number"
              min="1"
              max="31"
              value={formData.maturity} 
              onChange={handleChange} 
              placeholder="Ex: 22" 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="totalLimit">Limite Total</Label>
            <Input 
              id="totalLimit"
              name="totalLimit" 
              type="number"
              step="0.01"
              value={formData.totalLimit} 
              onChange={handleChange} 
              placeholder="0.00" 
              required 
            />
          </div>
        </>
      )}
      
      <Button type="submit" className="w-full">
        {isEditing ? "Atualizar" : "Adicionar"}
      </Button>
    </form>
  );
};

export default AccountForm;