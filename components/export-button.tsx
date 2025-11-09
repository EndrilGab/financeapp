"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/hooks/use-transactions"

interface ExportButtonProps {
  transactions: Transaction[]
  onExportSuccess?: () => void
}

export default function ExportButton({ transactions, onExportSuccess }: ExportButtonProps) {
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert("Nenhuma transação para exportar")
      return
    }

    const headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor"]
    const rows = transactions.map((t) => [
      t.date,
      t.description,
      t.category,
      t.type === "income" ? "Receita" : "Despesa",
      t.amount.toFixed(2),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `transacoes_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    onExportSuccess?.()
  }

  const handleExportJSON = () => {
    if (transactions.length === 0) {
      alert("Nenhuma transação para exportar")
      return
    }

    const json = JSON.stringify(transactions, null, 2)
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `transacoes_${new Date().toISOString().split("T")[0]}.json`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    onExportSuccess?.()
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleExportCSV} variant="outline" className="gap-2 bg-transparent">
        <Download size={18} />
        Exportar CSV
      </Button>
      <Button onClick={handleExportJSON} variant="outline" className="gap-2 bg-transparent">
        <Download size={18} />
        Exportar JSON
      </Button>
    </div>
  )
}
