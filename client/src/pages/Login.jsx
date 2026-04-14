import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, AlertCircle } from 'lucide-react'
import { AppContext } from '../App'

export default function Login() {
  const { login, users } = useContext(AppContext)
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 9) {
      setError('Numero invalide (9 chiffres)')
      return
    }

    const formatted = '+261' + digits
    const user = users?.find(u => u.phone === formatted)

    if (!user) {
      setError('Ce numero n\'existe pas. Creez un compte.')
      return
    }

    login(user)

    // Save to sessions for quick switching (shared across tabs)
    const sessions = JSON.parse(localStorage.getItem('madahub_sessions') || '[]')
    if (!sessions.find(s => s.id === user.id)) {
      sessions.push({ id: user.id, name: user.name })
      localStorage.setItem('madahub_sessions', JSON.stringify(sessions))
    }

    // Save current user in THIS TAB ONLY (sessionStorage is per-tab)
    sessionStorage.setItem('iray_current_user', JSON.stringify(user))

    navigate(`/profile/${user.id}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-green-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-200 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-600 via-white to-red-500 flex items-center justify-center mx-auto mb-3 border-2 border-green-600 overflow-hidden shadow-lg">
            <svg viewBox="0 0 32 32" className="w-14 h-14">
              <rect fill="#FC3D32" x="1" y="12" width="30" height="8"/>
              <rect fill="#007A3E" x="1" y="1" width="30" height="10"/>
              <rect fill="#007A3E" x="1" y="21" width="30" height="10"/>
              <circle fill="#FC3D32" cx="16" cy="16" r="6"/>
              <circle fill="#007A3E" cx="16" cy="16" r="4"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-red-500 bg-clip-text text-transparent">IRAY</h1>
          <p className="text-sm text-gray-500 mt-1">La plateforme pour developper Madagascar</p>
        </div>

<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-white to-red-500" />
          
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Connexion</h2>
              <p className="text-sm text-gray-500">Entrez votre numero</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numero</label>
              <div className="flex">
                <div className="flex items-center gap-1 px-3 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl">
                  <span className="text-lg">🇲🇬</span>
                  <span className="text-sm font-medium text-gray-700">+261</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError('') }}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 text-left text-lg"
                  placeholder="32 12 345 67"
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-500 transition-all shadow-md hover:shadow-lg"
            >
              Connexion
            </button>

            <div className="flex justify-center items-center gap-2 p-3 bg-green-50 rounded-xl text-xs text-green-700">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>Vos donnees sont securisees et protegees</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-4 text-gray-500 text-sm">
          Pas de compte ? <Link to="/register" className="text-green-700 font-medium hover:underline">Creer un compte</Link>
        </p>
      </div>
    </div>
  )
}