import DashLayout from '~/layouts/DashLayout'
import HeaderBreadcrump from '~/lib/components/header-breadcrump'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2, Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { CirclePlus } from "lucide-react";


const mockData = [
  {
    id: 1,
    categoria: '💸 Receita',
    descricao: 'Receita',
    tipoCategoria: 'Entrada',
    tipoGasto: 'Essencial',
    orcado: 'R$ 50,00',
  },
  {
    id: 2,
    categoria: '💸 Despesa',
    descricao: 'Despesa',
    tipoCategoria: 'Saída',
    tipoGasto: 'Não Essencial',
    orcado: 'R$ 100,00',
  },
  {
    id: 3,
    categoria: '💸 Investimento',
    descricao: 'Investimento',
    tipoCategoria: 'Entrada',
    tipoGasto: 'Essencial',
    orcado: 'R$ 200,00',
  },
]

function Categories() {
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formData, setFormData] = useState(mockData)

  const handleEdit = (index: number, field: string, value: string) => {
    const updatedData = formData.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    setFormData(updatedData)
    // Disparar função para atualizar o backend
    console.log(`Editando linha ${index}, campo ${field}, novo valor: ${value}`)
  }

  const addNewCategory = () => {
    const newCategory = {
      id: formData.length + 1,
      categoria: '💸 Nova Categoria',
      descricao: 'Descrição',
      tipoCategoria: 'Entrada',
      tipoGasto: 'Essencial',
      orcado: 'R$ 0,00',
    }
    setFormData([...formData, newCategory])
  }

  return (
    <>
      <HeaderBreadcrump crumbLink="Cadastro" crumbPage="Categorias" />
      <div className="flex items-center justify-between w-full mb-4">
        <Button
          variant="outline"
          className="ml-4 flex items-center gap-1 px-3 py-1 text-sm font-medium rounded"
        >
          <CirclePlus className="size-4" />
          Adicionar
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Categoria</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo de Categoria</TableHead>
              <TableHead className="text-right">Tipo de Gasto</TableHead>
              <TableHead className="text-right">Orçado</TableHead>
              <TableHead className="text-right">...</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  {editingRow === index && editingField === 'categoria' ? (
                    <input
                      type="text"
                      value={row.categoria}
                      onChange={(e) => handleEdit(index, 'categoria', e.target.value)}
                      onBlur={() => setEditingRow(null)}
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingRow(index)
                        setEditingField('categoria')
                      }}
                    >
                      {row.categoria}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingRow === index && editingField === 'descricao' ? (
                    <input
                      type="text"
                      value={row.descricao}
                      onChange={(e) => handleEdit(index, 'descricao', e.target.value)}
                      onBlur={() => setEditingRow(null)}
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingRow(index)
                        setEditingField('descricao')
                      }}
                    >
                      {row.descricao}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingRow === index && editingField === 'tipoCategoria' ? (
                    <select
                      value={row.tipoCategoria}
                      onChange={(e) => handleEdit(index, 'tipoCategoria', e.target.value)}
                      onBlur={() => setEditingRow(null)}
                    >
                      <option value="Entrada">Entrada</option>
                      <option value="Saída">Saída</option>
                    </select>
                  ) : (
                    <span
                      onClick={() => {
                        setEditingRow(index)
                        setEditingField('tipoCategoria')
                      }}
                    >
                      {row.tipoCategoria}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingRow === index && editingField === 'tipoGasto' ? (
                    <select
                      value={row.tipoGasto}
                      onChange={(e) => handleEdit(index, 'tipoGasto', e.target.value)}
                      onBlur={() => setEditingRow(null)}
                    >
                      <option value="Essencial">Essencial</option>
                      <option value="Não Essencial">Não Essencial</option>
                    </select>
                  ) : (
                    <span
                      onClick={() => {
                        setEditingRow(index)
                        setEditingField('tipoGasto')
                      }}
                    >
                      {row.tipoGasto}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingRow === index && editingField === 'orcado' ? (
                    <input
                      type="text"
                      value={row.orcado}
                      onChange={(e) => handleEdit(index, 'orcado', e.target.value)}
                      onBlur={() => setEditingRow(null)}
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingRow(index)
                        setEditingField('orcado')
                      }}
                    >
                      {row.orcado}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon">
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">
                {formData.reduce((total, row) => {
                  const value = parseFloat(row.orcado.replace('R$', '').replace(',', '.'))
                  return total + (isNaN(value) ? 0 : value)
                }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6}>
                <div
                  className="flex items-center justify-center p-2 border border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={addNewCategory}
                >
                  <Plus />
                  Nova Categoria
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  )
}

Categories.layout = DashLayout

export default Categories
