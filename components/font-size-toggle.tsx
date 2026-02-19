"use client"

import * as React from "react"
import { Type, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function FontSizeToggle() {
  const [fontSize, setFontSize] = React.useState("normal")

  React.useEffect(() => {
    const root = document.documentElement
    switch (fontSize) {
      case "small":
        root.style.fontSize = "14px"
        break
      case "large":
        root.style.fontSize = "18px"
        break
      case "xl":
        root.style.fontSize = "20px"
        break
      default:
        root.style.fontSize = "16px"
    }
  }, [fontSize])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Type className="h-4 w-4" />
          <span className="sr-only">تغيير حجم الخط</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setFontSize("small")}>
          <Minus className="mr-2 h-4 w-4" />
          صغير
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFontSize("normal")}>
          <Type className="mr-2 h-4 w-4" />
          عادي
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFontSize("large")}>
          <Plus className="mr-2 h-4 w-4" />
          كبير
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFontSize("xl")}>
          <Plus className="mr-2 h-4 w-4" />
          كبير جداً
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
