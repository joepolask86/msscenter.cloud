"use client"

import { useState, useEffect } from "react"
import {
  LogOut,
  Bell,
  UserCircle,
  ChevronsUpDown,
  Settings,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NotificationDrawer } from "@/components/notification-drawer"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import Link from "next/link"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const { logout, user: authUser } = useAuth()
  const [newName, setNewName] = useState(authUser?.name ?? user.name)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (authUser?.name) {
      setNewName(authUser.name)
    }
  }, [authUser?.name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if ((newPassword && !confirmPassword) || (!newPassword && confirmPassword)) {
      setError("Both password fields are required to change password.")
      return
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setIsSubmitting(true)
    try {
      const payload: { name?: string; newPassword?: string; confirmPassword?: string } = {}

      if (newName !== (authUser?.name ?? user.name)) {
        payload.name = newName
      }

      if (newPassword && confirmPassword) {
        payload.newPassword = newPassword
        payload.confirmPassword = confirmPassword
      }

      await api.put<{ success: boolean }>("/auth/change-password", {
        ...payload,
      })
      setSuccess("Account details updated successfully.")
      setNewPassword("")
      setConfirmPassword("")
      if (payload.name) {
        setNewName(payload.name)
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update account details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <NotificationDrawer
            open={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
            trigger={<span className="hidden" />}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setIsAccountOpen(true)}>
                  <UserCircle />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsNotificationsOpen(true)}>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
        <DialogContent className="p-0 gap-0">
          <DialogHeader className="py-4 px-6 border-b shrink-0">
            <DialogTitle className="text-orange-500 text-lg">Account Details</DialogTitle>
          </DialogHeader>
          <form className="space-y-4 p-6" onSubmit={handleSubmit}>
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            {success && (
              <p className="text-xs text-green-600">{success}</p>
            )}
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={authUser?.username ?? user.name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <DialogFooter className="mt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating details..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
