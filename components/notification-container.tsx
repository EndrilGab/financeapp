"use client"

import { X } from "lucide-react"
import type { Notification } from "@/hooks/use-notification"

interface NotificationContainerProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export default function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white animate-in slide-in-from-top-2 duration-300 ${
            notification.type === "success"
              ? "bg-emerald-500"
              : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          }`}
        >
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => onRemove(notification.id)} className="hover:opacity-80 transition">
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}
