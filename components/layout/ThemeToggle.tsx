'use client'
import { useTheme } from 'next-themes'
import { HiSun, HiMoon } from 'react-icons/hi'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 
        hover:bg-gray-100 dark:hover:bg-gray-800 
        transition-colors duration-200"
    >
      {theme === 'light' ? (
        <HiSun className="w-5 h-5" />
      ) : (
        <HiMoon className="w-5 h-5" />
      )}
    </button>
  )
} 