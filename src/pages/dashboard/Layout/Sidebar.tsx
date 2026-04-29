import { Link, useLocation } from 'react-router-dom'
import {
  MdDashboard,
  MdAssignment,
  MdChatBubbleOutline,
  MdClose
} from 'react-icons/md'
import type { IconType } from 'react-icons'
import { cn } from '../../../utils'
import Logo from '../../../assets/logo.png'

interface NavItem {
  title: string
  href: string
  icon: IconType
}

const sidebarNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: MdDashboard },
  { title: "Order", href: "/orders", icon: MdAssignment },
  { title: "Chat", href: "/chat", icon: MdChatBubbleOutline },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden",
          open ? 'block' : 'hidden'
        )}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-50 transform shadow-lg bg-white border-r border-gray-200",
          "lg:translate-x-0 lg:static lg:inset-0",
          open ? 'translate-x-0' : '-translate-x-full',
          "transition-transform duration-200 ease-in-out"
        )}
      >
        {/* Logo + close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="logo-wrap">
            <img src={Logo} alt="logo_sample" />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <MdClose className="h-6 w-6" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="mt-8 px-4 space-y-2" aria-label="Main navigation">
          {sidebarNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-3  text-sm font-medium transition-all duration-200",
                  "focus:ring-blue-500 focus:ring-inset",
                  isActive
                    ? "text-blue-700 border-r-2 "
                    : "hover:text-blue-700"
                )}
                onClick={onClose}
              >
                <Icon className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}