"use client"

import { useState, useEffect } from "react"

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color: string
}

const CATEGORIES_STORAGE_KEY = "finance_categories"

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Receita", type: "income", color: "#10b981" },
  { id: "2", name: "Bônus", type: "income", color: "#06b6d4" },
  { id: "3", name: "Alimentação", type: "expense", color: "#f59e0b" },
  { id: "4", name: "Transporte", type: "expense", color: "#8b5cf6" },
  { id: "5", name: "Entretenimento", type: "expense", color: "#ec4899" },
  { id: "6", name: "Habitação", type: "expense", color: "#6366f1" },
  { id: "7", name: "Saúde", type: "expense", color: "#14b8a6" },
  { id: "8", name: "Educação", type: "expense", color: "#3b82f6" },
  { id: "9", name: "Utilities", type: "expense", color: "#6b7280" },
]

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (stored) {
      try {
        setCategories(JSON.parse(stored))
      } catch {
        setCategories(DEFAULT_CATEGORIES)
      }
    } else {
      setCategories(DEFAULT_CATEGORIES)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    }
  }, [categories, isLoaded])

  const addCategory = (name: string, type: "income" | "expense", color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      type,
      color,
    }
    setCategories([...categories, newCategory])
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  const getCategories = (type?: "income" | "expense") => {
    if (type) {
      return categories.filter((c) => c.type === type)
    }
    return categories
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    isLoaded,
  }
}
