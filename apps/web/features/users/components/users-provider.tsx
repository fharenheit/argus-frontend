"use client"

import React, { useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import { type User } from "../data/schema"

type UsersDialogType = "add" | "edit" | "delete"

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
  statusFilter: string | null
  setStatusFilter: React.Dispatch<React.SetStateAction<string | null>>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  return (
    <UsersContext value={{ open, setOpen, currentRow, setCurrentRow, statusFilter, setStatusFilter }}>
      {children}
    </UsersContext>
  )
}

export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error("useUsers has to be used within <UsersProvider>")
  }

  return usersContext
}
