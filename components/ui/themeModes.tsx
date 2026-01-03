"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Wait until mounted to avoid showing both icons on page load
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Button variant="outline" size="icon" className="bg-transparent border-0" />

  return (
    <Button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="outline" 
      size="icon" 
      className="bg-transparent border-0 relative h-10 w-10 flex items-center justify-center"
    >
      {/* If theme is light, ONLY render Sun. If dark, ONLY render Moon */}
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 
