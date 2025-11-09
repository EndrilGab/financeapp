import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function BalanceSummary({ transactions }: { transactions: any[] }) {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))

  const balance = totalIncome - totalExpense

  return (
    <>
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
        <CardContent className="p-6">
          <p className="text-sm font-medium opacity-90">Saldo Total</p>
          <p className="text-4xl font-bold mt-2 text-balance">
            R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs mt-4 opacity-75">Atualizado em tempo real</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <p className="text-sm text-muted-foreground">Receitas</p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-50 dark:bg-red-950 rounded-lg">
              <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <p className="text-sm text-muted-foreground">Despesas</p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>
    </>
  )
}
