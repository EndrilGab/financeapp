"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Lock, Mail, User } from "lucide-react"

interface LoginPageProps {
  onLoginSuccess: (email: string, password: string, name: string) => void
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.includes("@")) {
      setError("Por favor, insira um e-mail válido")
      return
    }

    if (password.length < 3) {
      setError("A senha deve ter pelo menos 3 caracteres")
      return
    }

    if (isSignUp && !name.trim()) {
      setError("Por favor, insira seu nome")
      return
    }

    onLoginSuccess(email, password, name)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
            {isSignUp ? "Criar Conta" : "Bem-vindo"}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {isSignUp ? "Crie sua conta para começar" : "Faça login em sua conta"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Mínimo 3 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              {isSignUp ? "Criar Conta" : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError("")
                }}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                {isSignUp ? "Fazer Login" : "Criar Conta"}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
