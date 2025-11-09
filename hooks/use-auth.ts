"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoaded: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoaded: false,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isLoggedIn: true,
        isLoaded: true,
      })
    } else {
      setAuthState((prev) => ({ ...prev, isLoaded: true }))
    }
  }, [])

  const login = useCallback((email: string, password: string, name: string) => {
    // Validação simples
    if (!email.includes("@") || password.length < 3) {
      return false
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || email.split("@")[0],
    }

    localStorage.setItem("currentUser", JSON.stringify(user))
    setAuthState({
      user,
      isLoggedIn: true,
      isLoaded: true,
    })
    return true
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("currentUser")
    setAuthState({
      user: null,
      isLoggedIn: false,
      isLoaded: true,
    })
  }, [])

  return {
    ...authState,
    login,
    logout,
  }
}
