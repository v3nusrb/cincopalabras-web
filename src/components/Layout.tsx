import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-blue-600">
              CincoPalabras
            </Link>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Меню
              </Link>
              <Link
                to="/learned"
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/learned'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Изученные
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {children}
      </main>

    </div>
  )
}

