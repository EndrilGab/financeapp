"use client"

import { useState, useEffect } from "react"

export interface Transaction {
  id: string
  description: string
  category: string
  amount: number
  date: string
  type: "income" | "expense"
}

const STORAGE_KEY = "finance_transactions"

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "1", description: "Salário", category: "Receita", amount: 5000, date: "2025-01-05", type: "income" },
  { id: "2", description: "Supermercado", category: "Alimentação", amount: -450, date: "2025-01-04", type: "expense" },
  { id: "3", description: "Netflix", category: "Entretenimento", amount: -50, date: "2025-01-03", type: "expense" },
  { id: "4", description: "Freelance", category: "Receita", amount: 1200, date: "2025-01-02", type: "income" },
  { id: "5", description: "Aluguel", category: "Habitação", amount: -1500, date: "2025-01-01", type: "expense" },
  { id: "6", description: "Academia", category: "Saúde", amount: -80, date: "2024-12-31", type: "expense" },
]

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTransactions(JSON.parse(stored))
      } catch {
        setTransactions(DEFAULT_TRANSACTIONS)
      }
    } else {
      setTransactions(DEFAULT_TRANSACTIONS)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    }
  }, [transactions, isLoaded])

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
    }
    setTransactions([...transactions, newTransaction])
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const clearAllTransactions = () => {
    setTransactions([])
  }

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    isLoaded,
  }
}
