"use client"

import { UserPlus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { useUsers } from "./users-provider"

export function UsersPrimaryButtons() {
  const { setOpen, statusFilter, setStatusFilter } = useUsers()

  const handleStatusFilter = (value: string) => {
    setStatusFilter(statusFilter === value ? null : value)
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={statusFilter === "active" ? "default" : "outline"}
        onClick={() => handleStatusFilter("active")}
      >
        Active
      </Button>
      <Button
        variant={statusFilter === "inactive" ? "default" : "outline"}
        onClick={() => handleStatusFilter("inactive")}
      >
        Inactive
      </Button>
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add User</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
