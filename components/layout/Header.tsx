"use client"

import Link from "next/link"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { ThemeToggle } from "./ThemeToggle"
import { usePathname } from "next/navigation"

const links = [
  { href: "/words", label: "Words" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/quiz", label: "Quiz" },
  { href: "/daily", label: "Daily Practice" },
  { href: "/statistics", label: "Statistics" },
  { href: "/journal", label: "My Journal" },
]

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <nav className="fixed top-0 w-full border-b border-border/40 bg-white dark:bg-gray-900 backdrop-blur-xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            English Learning
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-accent/50 transition-colors"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40">
          <div className="px-4 py-3 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
} 