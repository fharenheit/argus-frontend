"use client"

import { UserPlus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { useUsers } from "./users-provider"

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => setOpen("activate")}>
        Active User
      </Button>
      <Button variant="outline" onClick={() => setOpen("deactivate")}>
        Inactive User
      </Button>
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add User</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
