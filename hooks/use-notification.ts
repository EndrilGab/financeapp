"use client"

import { useState, useCallback, useRef } from "react"

export interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const addNotification = useCallback(
    (message: string, type: "success" | "error" | "info" = "info", duration = 3000) => {
      const id = Math.random().toString(36).substr(2, 9)
      const notification: Notification = { id, message, type, duration }

      setNotifications((prev) => [...prev, notification])

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, duration)

      return id
    },
    [],
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return {
    notifications,
    addNotification,
    removeNotification,
  }
}
