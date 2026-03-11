"use client"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { type User } from "../data/schema"

type UsersStatusDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUsers: User[]
  type: "activate" | "deactivate"
}

export function UsersStatusDialog({
  open,
  onOpenChange,
  selectedUsers,
  type,
}: UsersStatusDialogProps) {
  const isActivate = type === "activate"

  const handleConfirm = () => {
    // TODO: API 연동 시 여기서 사용자 상태 변경 API를 호출하세요.
    // 예: await updateUsersStatus(selectedUsers.map(u => u.id), isActivate ? "active" : "inactive")
    console.log(`${isActivate ? "Activate" : "Deactivate"} users:`, selectedUsers)
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      title={isActivate ? "Active User" : "Inactive User"}
      desc={
        <p>
          {isActivate
            ? "선택한 사용자를 활성 사용자로 전환하시겠습니까?"
            : "선택한 사용자를 비활성 사용자로 전환하시겠습니까?"}
        </p>
      }
      cancelBtnText="아니오"
      confirmText="예"
    />
  )
}
