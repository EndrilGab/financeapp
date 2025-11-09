"use client"

import { useState } from "react"
import { UserIcon, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import SettingsModal from "@/components/settings-modal"
import type { Category } from "@/hooks/use-categories"
import { useRouter } from "next/navigation"
import type { User } from "@/types/user"

interface DashboardHeaderProps {
  user?: User
  onLogout?: () => void
  categories: Category[]
  onAddCategory: (name: string, type: "income" | "expense", color: string) => void
  onUpdateCategory: (id: string, updates: Partial<Category>) => void
  onDeleteCategory: (id: string) => void
  onClearAllData: () => void
}

export default function DashboardHeader({
  user,
  onLogout,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onClearAllData,
}: DashboardHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-sm text-muted-foreground">Bem-vindo de volta</h2>
          <p className="text-lg font-semibold text-foreground mt-1">{user?.name || "João Silva"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onLogout?.()
              router.push("/")
            }}
          >
            <UserIcon size={20} />
          </Button>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        categories={categories}
        onAddCategory={onAddCategory}
        onUpdateCategory={onUpdateCategory}
        onDeleteCategory={onDeleteCategory}
        onClearAllData={onClearAllData}
      />
    </>
  )
}
