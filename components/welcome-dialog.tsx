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

export function WelcomeDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setOpen(true)
    }
  }, [])

  const handleSubmit = () => {
    if (name) {
      localStorage.setItem("hasVisited", "true")
      localStorage.setItem("userName", name)
      setOpen(false)
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
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!name}>
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

