"use client"

import { useState } from "react"
import { Trash2, Plus, Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Category } from "@/hooks/use-categories"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onAddCategory: (name: string, type: "income" | "expense", color: string) => void
  onUpdateCategory: (id: string, updates: Partial<Category>) => void
  onDeleteCategory: (id: string) => void
  onClearAllData: () => void
}

const COLOR_PALETTE = [
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#3b82f6", // Blue
  "#6b7280", // Gray
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
]

export default function SettingsModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onClearAllData,
}: SettingsModalProps) {
  const [tab, setTab] = useState<"categories" | "preferences">("categories")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryType, setNewCategoryType] = useState<"income" | "expense">("expense")
  const [newCategoryColor, setNewCategoryColor] = useState(COLOR_PALETTE[0])
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      if (editingId) {
        onUpdateCategory(editingId, {
          name: newCategoryName,
          type: newCategoryType,
          color: newCategoryColor,
        })
        setEditingId(null)
      } else {
        onAddCategory(newCategoryName, newCategoryType, newCategoryColor)
      }
      setNewCategoryName("")
      setNewCategoryType("expense")
      setNewCategoryColor(COLOR_PALETTE[0])
      setIsAddingCategory(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id)
    setNewCategoryName(category.name)
    setNewCategoryType(category.type)
    setNewCategoryColor(category.color)
    setIsAddingCategory(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>Gerencie suas categorias e preferências</DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setTab("categories")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tab === "categories"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => setTab("preferences")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tab === "preferences"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Preferências
          </button>
        </div>

        {/* Categories Tab */}
        {tab === "categories" && (
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Minhas Categorias</h3>
              {!isAddingCategory && (
                <Button
                  size="sm"
                  onClick={() => {
                    setIsAddingCategory(true)
                    setEditingId(null)
                  }}
                  className="gap-2"
                >
                  <Plus size={16} />
                  Nova Categoria
                </Button>
              )}
            </div>

            {/* Add/Edit Category Form */}
            {isAddingCategory && (
              <Card className="p-4 bg-muted">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Nome da Categoria</Label>
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Ex: Supermercado"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Tipo</Label>
                      <Select value={newCategoryType} onValueChange={(value: any) => setNewCategoryType(value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Receita</SelectItem>
                          <SelectItem value="expense">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Cor</Label>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {COLOR_PALETTE.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewCategoryColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                              newCategoryColor === color ? "border-foreground scale-110" : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAddingCategory(false)
                        setEditingId(null)
                        setNewCategoryName("")
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleAddCategory}>
                      {editingId ? "Atualizar" : "Adicionar"}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Categories List */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.type === "income" ? "Receita" : "Despesa"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                      className="h-8 w-8"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirmId(category.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {tab === "preferences" && (
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Informações da Conta</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Nome</Label>
                    <p className="text-sm">João Silva</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm">joao@example.com</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Dados</h4>
                <p className="text-sm text-muted-foreground mb-3">Você tem {categories.length} categorias criadas</p>
                <Button
                  variant="outline"
                  className="w-full gap-2 text-destructive hover:text-destructive bg-transparent"
                  onClick={() => setShowClearConfirm(true)}
                >
                  <Trash2 size={16} />
                  Limpar Todos os Dados
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Sobre</h4>
                <p className="text-sm text-muted-foreground">Finance Dashboard v1.0</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Delete Category Confirmation */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todas as transações com esta categoria serão mantidas, mas a categoria
              será removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  onDeleteCategory(deleteConfirmId)
                  setDeleteConfirmId(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Data Confirmation */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar Todos os Dados?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso vai deletar todos os seus dados de transações e categorias. Esta ação não pode ser desfeita!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClearAllData()
                setShowClearConfirm(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Limpar Tudo
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
