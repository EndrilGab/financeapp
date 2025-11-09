"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTransaction: (transaction: any) => void
}

export default function AddTransactionModal({ isOpen, onClose, onAddTransaction }: AddTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Alimentação")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")

  const categories = {
    income: ["Salário", "Freelance", "Investimento", "Bônus", "Outros"],
    expense: ["Alimentação", "Habitação", "Transporte", "Entretenimento", "Saúde", "Educação", "Utilities", "Outros"],
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!description.trim()) {
      setError("Descrição é obrigatória")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Valor deve ser maior que zero")
      return
    }

    onAddTransaction({
      description: description.trim(),
      category,
      amount: type === "income" ? Number.parseFloat(amount) : -Number.parseFloat(amount),
      type,
    })

    setDescription("")
    setAmount("")
    setCategory(type === "income" ? "Salário" : "Alimentação")
    onClose()
  }

  const handleTypeChange = (newType: "income" | "expense") => {
    setType(newType)
    setCategory(newType === "income" ? "Salário" : "Alimentação")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Nova Transação</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              variant={type === "expense" ? "default" : "outline"}
              onClick={() => handleTypeChange("expense")}
              className="flex-1"
            >
              Despesa
            </Button>
            <Button
              variant={type === "income" ? "default" : "outline"}
              onClick={() => handleTypeChange("income")}
              className="flex-1"
            >
              Receita
            </Button>
          </div>

          {error && <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Supermercado, Salário"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Adicionar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
