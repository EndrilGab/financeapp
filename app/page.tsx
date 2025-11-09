"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTransactions } from "@/hooks/use-transactions"
import { useCategories } from "@/hooks/use-categories"
import { useAuth } from "@/hooks/use-auth"
import { useNotification } from "@/hooks/use-notification"
import LoginPage from "@/components/login-page"
import NotificationContainer from "@/components/notification-container"
import DashboardHeader from "@/components/dashboard-header"
import BalanceSummary from "@/components/balance-summary"
import TransactionChart from "@/components/transaction-chart"
import CategoryBreakdown from "@/components/category-breakdown"
import RecentTransactions from "@/components/recent-transactions"
import AddTransactionModal from "@/components/add-transaction-modal"
import ExportButton from "@/components/export-button"

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user, isLoggedIn, isLoaded: authLoaded, login, logout } = useAuth()
  const { notifications, addNotification, removeNotification } = useNotification()
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    clearAllTransactions,
    isLoaded: transLoaded,
  } = useTransactions()
  const { categories, addCategory, updateCategory, deleteCategory, isLoaded: catLoaded } = useCategories()

  const isLoaded = transLoaded && catLoaded && authLoaded

  const handleAddTransaction = (transaction: any) => {
    addTransaction(transaction)
    addNotification(`Transação adicionada: ${transaction.description}`, "success")
  }

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id)
    addNotification("Transação deletada com sucesso", "success")
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

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          user={user}
          onLogout={() => {
            logout()
            addNotification("Desconectado com sucesso", "info")
          }}
          categories={categories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
          onClearAllData={clearAllTransactions}
        />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Minhas Finanças</h1>
          <div className="flex gap-4 items-center">
            <ExportButton
              transactions={transactions}
              onExportSuccess={() => addNotification("Transações exportadas com sucesso!", "success")}
            />
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus size={18} />
              Nova Transação
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BalanceSummary transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TransactionChart transactions={transactions} />
          </div>
          <CategoryBreakdown transactions={transactions} />
        </div>

        <RecentTransactions transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </main>
  )
}
