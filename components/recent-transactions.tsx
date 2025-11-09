"use client"

import { useState } from "react"
import { MoreVertical, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  description: string
  category: string
  amount: number
  date: string
  type: "income" | "expense"
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  onDeleteTransaction: (id: string) => void
}

export default function RecentTransactions({ transactions, onDeleteTransaction }: RecentTransactionsProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleDelete = (id: string, description: string) => {
    if (confirm(`Tem certeza que deseja deletar "${description}"?`)) {
      onDeleteTransaction(id)
      setOpenMenu(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Histórico das últimas operações ({transactions.length} transações)</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma transação registrada ainda.</p>
            <p className="text-sm text-muted-foreground mt-1">Clique em "Nova Transação" para começar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Descrição</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Data</th>
                  <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Valor</th>
                  <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="py-3 px-4 text-sm">{transaction.description}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.category}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td
                      className={`py-3 px-4 text-sm font-semibold text-right ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"} R${" "}
                      {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setOpenMenu(openMenu === transaction.id ? null : transaction.id)}
                        >
                          <MoreVertical size={16} />
                        </Button>
                        {openMenu === transaction.id && (
                          <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 gap-2 h-8"
                              onClick={() => handleDelete(transaction.id, transaction.description)}
                            >
                              <Trash2 size={14} />
                              Deletar
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
