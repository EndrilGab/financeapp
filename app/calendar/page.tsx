"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTransactions } from "@/hooks/use-transactions"
import { useAuth } from "@/hooks/use-auth"
import LoginPage from "@/components/login-page"
import { useNotification } from "@/hooks/use-notification"
import NotificationContainer from "@/components/notification-container"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const { user, isLoggedIn, isLoaded: authLoaded, login, logout } = useAuth()
  const { transactions, isLoaded: transLoaded } = useTransactions()
  const { notifications, addNotification, removeNotification } = useNotification()

  const isLoaded = authLoaded && transLoaded

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }, [currentDate])

  const transactionsByDate = useMemo(() => {
    const map: Record<string, typeof transactions> = {}
    transactions.forEach((t) => {
      if (!map[t.date]) map[t.date] = []
      map[t.date].push(t)
    })
    return map
  }, [transactions])

  const getDayTotal = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayTransactions = transactionsByDate[dateStr] || []
    return dayTransactions.reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginPage
          onLoginSuccess={(email, password, name) => {
            if (login(email, password, name)) {
              addNotification(`Bem-vindo, ${name}!`, "success")
            } else {
              addNotification("Erro ao fazer login. Verifique seus dados.", "error")
            }
          }}
        />
        <NotificationContainer notifications={notifications} onRemove={removeNotification} />
      </>
    )
  }

  const days = []
  const { daysInMonth, startingDayOfWeek } = monthDays

  // Empty cells before the first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const monthName = currentDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Calendário de Transações</h1>
          <Button variant="outline" onClick={() => logout()}>
            Sair
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold capitalize text-foreground">{monthName}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft size={20} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
              <div key={day} className="text-center font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const dayTotal = day ? getDayTotal(day) : 0
              const hasTransactions =
                day &&
                transactionsByDate[
                  `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                ]

              return (
                <div
                  key={idx}
                  className={`aspect-square p-2 rounded-lg border-2 flex flex-col items-center justify-center ${
                    day
                      ? `${
                          dayTotal > 0
                            ? "bg-emerald-50 border-emerald-200"
                            : dayTotal < 0
                              ? "bg-red-50 border-red-200"
                              : "bg-muted border-border"
                        }`
                      : "bg-muted/50 border-transparent"
                  }`}
                >
                  {day && (
                    <>
                      <span className="font-semibold text-foreground">{day}</span>
                      {hasTransactions && (
                        <span className={`text-xs font-semibold ${dayTotal > 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {dayTotal > 0 ? "+" : ""}
                          {dayTotal.toFixed(0)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </main>
  )
}
