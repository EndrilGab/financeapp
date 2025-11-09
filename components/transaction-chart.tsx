"use client"

import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransactionChart({ transactions }: { transactions: any[] }) {
  const data = transactions
    .reduce((acc: any[], t) => {
      const existingDay = acc.find((d) => d.date === t.date)
      if (existingDay) {
        if (t.type === "income") {
          existingDay.receitas += t.amount
        } else {
          existingDay.despesas += Math.abs(t.amount)
        }
      } else {
        acc.push({
          date: t.date,
          receitas: t.type === "income" ? t.amount : 0,
          despesas: t.type === "expense" ? Math.abs(t.amount) : 0,
        })
      }
      return acc
    }, [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Caixa</CardTitle>
        <CardDescription>Receitas vs Despesas</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              formatter={(value: any) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            />
            <Legend />
            <Bar dataKey="receitas" fill="var(--color-chart-1)" name="Receitas" radius={[8, 8, 0, 0]} />
            <Bar dataKey="despesas" fill="var(--color-chart-2)" name="Despesas" radius={[8, 8, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
