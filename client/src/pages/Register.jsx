import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, AlertCircle, Check, User, MapPin, Briefcase, X } from 'lucide-react'
import { AppContext } from '../App'
import { CATEGORIES, CITIES, formatPhoneDisplay } from '../data/store'

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const OTPPopup = ({ code, onClose }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(onClose, 800)
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="text-4xl mb-2">🎁</div>
        <h3 className="text-xl font-bold text-green-700 mb-2">Code Demo</h3>
        <p className="text-gray-600 mb-4">Cliquez pour copier:</p>
        <button onClick={handleCopy} className="text-4xl font-mono font-bold text-green-700 bg-green-50 py-4 rounded-xl mb-4 w-full">
          {copied ? '✓ Copie!' : code}
        </button>
      </div>
    </div>
  )
}

const PLATFORM_PURPOSE = `IRAY a ete cree pour apporter le developpement economique et social de Madagascar.

Notre mission:
- Connecter les Malgaches entre eux
- Faciliter la recherche d'emplois et de stages
- Promouvoir les services et produits locaux
- Partager les opportunites d'affaires
- Former les jeunes aux metiers`

const RULES = [
  { icon: '✅', text: 'Poster des contenus utiles et constructifs' },
  { icon: '✅', text: 'Respecter les autres utilisateurs' },
  { icon: '❌', text: 'Pas de fraude, arnaque ou escroquerie' },
  { icon: '❌', text: 'Pas de grossieretes ou insults' },
  { icon: '❌', text: 'Pas de spam ou publicite excessive' },
]

export default function Register() {
  const { register } = useContext(AppContext)
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [formData, setFormData] = useState({ name: '', location: '', category: '', bio: '' })
  const [error, setError] = useState('')
  const [showOTPPopup, setShowOTPPopup] = useState(false)

  const handleSendOTP = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 9) {
      setError('Numero invalide (9 chiffres)')
      return
    }
    const formatted = '+261' + digits
    const code = generateOTP()
    setGeneratedOtp(code)
    setShowOTPPopup(true)
  }

  const handleOTPShown = () => {
    setShowOTPPopup(false)
    setStep(2)
    localStorage.setItem('iray_otp_shown', 'true')
  }

  const handleVerifyOTP = () => {
    if (otp === generatedOtp) {
      setStep(3)
    } else {
      setError('Code invalide. Demo: ' + generatedOtp)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreed) {
      setError('Vous devez accepter les conditions')
      return
    }
    
    const digits = phone.replace(/\D/g, '')
    const phoneNum = '+261' + digits
    const result = register({
      name: formData.name,
      email: phoneNum + '@phone.mg',
      password: otp,
      phone: phoneNum,
      location: formData.location,
      category: formData.category,
      bio: formData.bio,
      skills: [],
      role: 'USER'
    })
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-green-50 via-white to-red-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-200 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {showOTPPopup && <OTPPopup code={generatedOtp} onClose={handleOTPShown} />}
        <div className="text-center mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-600 via-white to-red-500 flex items-center justify-center mx-auto mb-2 border-2 border-green-600 overflow-hidden shadow-lg">
            <svg viewBox="0 0 32 32" className="w-12 h-12">
              <rect fill="#FC3D32" x="1" y="12" width="30" height="8"/>
              <rect fill="#007A3E" x="1" y="1" width="30" height="10"/>
              <rect fill="#007A3E" x="1" y="21" width="30" height="10"/>
              <circle fill="#FC3D32" cx="16" cy="16" r="6"/>
              <circle fill="#007A3E" cx="16" cy="16" r="4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Creer un compte</h1>
          <p className="text-sm text-gray-500">IRAY - Developper Madagascar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-white to-red-500" />

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-medium text-blue-900 text-sm mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Notre mission
                </h3>
                <p className="text-xs text-blue-700">{PLATFORM_PURPOSE}</p>
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
                  onChange={e => { setPhone(e.target.value); setError('') }}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 text-left"
                  placeholder="32 12 345 67"
                />
                </div>
              </div>
              
              {error && <p className="text-red-600 text-sm">{error}</p>}
              
              <button
                onClick={handleSendOTP}
                className="w-full py-3 bg-green-700 text-white rounded-xl font-medium"
              >
               Continuer
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center">
                <p className="text-sm text-gray-600">Code envoye (+261 {formatPhoneDisplay(phone)})</p>
              </div>
              
              {showOTPPopup && <OTPPopup code={generatedOtp} onClose={handleOTPShown} />}
              
              <p className="text-xs text-center text-gray-500">Collez le code demo</p>
              
              <input
                type="text"
                value={otp}
                onChange={e => { setOtp(e.target.value); setError('') }}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
              />
              
              {error && <p className="text-red-600 text-sm">{error}</p>}
              
              <button onClick={handleVerifyOTP} className="w-full py-3 bg-green-700 text-white rounded-xl font-medium">Verifier</button>
              <button onClick={() => { setStep(1); setOtp('') }} className="w-full py-2 text-gray-500 text-sm">Changer de numero</button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="font-medium text-red-900 text-sm mb-2">⚠️ Regles obligatoires</h3>
                <ul className="text-xs text-red-700 space-y-1">
                  {RULES.map((rule, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span>{rule.icon}</span>
                      <span>{rule.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <label className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
                <span className="text-xs text-green-700">Je m'engage a respecter ces regles et la mission de IRAY.</span>
              </label>

              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Votre nom" required />
              <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" required>
                <option value="">Ville</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Categorie</p>
                <div className="grid grid-cols-6 gap-1">
                  {CATEGORIES.slice(0, 6).map(cat => (
                    <button type="button" key={cat.id} onClick={() => setFormData({...formData, category: cat.id})}
                      title={cat.desc}
                      className={`p-2 rounded-lg text-lg relative group ${formData.category === cat.id ? 'bg-green-700 text-white' : 'bg-gray-100'}`}>
                      {cat.icon}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{cat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Presentation (optionnel)" rows={2} />
              
              {error && <p className="text-red-600 text-sm">{error}</p>}
              
              <button type="submit" disabled={!agreed} className="w-full py-3 bg-green-700 text-white rounded-xl font-medium disabled:opacity-50">
               Creer mon compte
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-4 text-gray-500 text-sm">
          Deja inscrit ? <Link to="/login" className="text-green-700 font-medium">Connexion</Link>
        </p>
      </div>
    </div>
  )
}