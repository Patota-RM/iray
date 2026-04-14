import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { Home, Briefcase, MessageCircle, User, LogOut } from 'lucide-react'
import { AppContext } from '../App'

export default function Navbar() {
  const { user, logout, messages } = useContext(AppContext)
  const navigate = useNavigate()
  const unread = messages.filter(m => m.toId === user?.id && !m.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-green-600 h-14">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-600 via-white to-red-500 flex items-center justify-center border border-green-700 overflow-hidden">
            <svg viewBox="0 0 32 32" className="w-7 h-7">
              <rect fill="#FC3D32" x="1" y="12" width="30" height="8"/>
              <rect fill="#007A3E" x="1" y="1" width="30" height="10"/>
              <rect fill="#007A3E" x="1" y="21" width="30" height="10"/>
              <circle fill="#FC3D32" cx="16" cy="16" r="6"/>
              <circle fill="#007A3E" cx="16" cy="16" r="4"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900 hidden sm:block bg-gradient-to-r from-green-700 to-red-500 bg-clip-text text-transparent">IRAY</span>
        </NavLink>
        
        <div className="flex items-center gap-1">
          <NavLink to="/" className={({isActive}) => `p-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-green-100 text-green-700 scale-105' : 'text-gray-600 hover:bg-green-50'}`}>
            <Home className="w-5 h-5" />
          </NavLink>
          <NavLink to="/jobs" className={({isActive}) => `p-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-green-100 text-green-700 scale-105' : 'text-gray-600 hover:bg-green-50'}`}>
            <Briefcase className="w-5 h-5" />
          </NavLink>
          <NavLink to="/messages" className={({isActive}) => `p-2 rounded-lg transition-all duration-200 relative ${isActive ? 'bg-green-100 text-green-700 scale-105' : 'text-gray-600 hover:bg-green-50'}`}>
            <MessageCircle className="w-5 h-5" />
            {unread > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">{unread}</span>}
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => `p-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-green-100 text-green-700 scale-105' : 'text-gray-600 hover:bg-green-50'}`}>
            <User className="w-5 h-5" />
          </NavLink>
        </div>
        
        <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  )
}