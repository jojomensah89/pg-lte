"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUsers } from "@/hooks/useUser"
import { toast } from "sonner"

export function WelcomeDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { users, createUser } = useUsers()

  // Check if users exist in the database
  useEffect(() => {
    // If users data is loaded and there are no users, show dialog
    if (users && users.rows.length === 0 && !localStorage.getItem("hasVisited")) {
      setOpen(true)
    }
  }, [users])

  const handleSubmit = async () => {
    if (!name || !email) return
    
    setIsLoading(true)
    
    try {
      // Create avatar URL from name
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
      
      // Use the createUser function from useUsers hook
      await createUser(name, email, avatarUrl)
      
      // Save to localStorage
      localStorage.setItem("hasVisited", "true")

      
      toast.success("Account created successfully!")
      setOpen(false)
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Welcome to TaskQuest</DialogTitle>
          <DialogDescription>Let&apos;s personalize your experience. You can change these settings later.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Your email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!name || !email || isLoading}>
            {isLoading ? "Creating..." : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

