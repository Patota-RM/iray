import { useState, useContext } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, MapPin, Plus, Send, X, Star, Zap, ChevronRight, Phone, CheckCircle, Edit2, Trash2, Bolt } from 'lucide-react'
import { AppContext } from '../App'
import { JOB_TYPES, CITIES } from '../data/store'

const PLATFORM_ACCOUNT = '+261 34 123 45 67'
const BOOST_PRICE = 25350
const CV_BOOST_PRICE = 1850

// Code promo pour démonstration
const DEMO_CODE = "IRAY2024"

const MobileMoneyModal = ({ amount, jobTitle, onClose, onSuccess, actionType = 'boost' }) => {
  const [step, setStep] = useState('select')
  const [operator, setOperator] = useState('')
  const [phone, setPhone] = useState('')
  const [processing, setProcessing] = useState(false)
  const [showDemoPopup, setShowDemoPopup] = useState(false)
  const [copied, setCopied] = useState(false)

  const operators = [
    { id: 'telma', name: 'Telma', color: 'bg-red-600', code: '*123*' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500', code: '*123*' },
    { id: 'airtel', name: 'Airtel', color: 'bg-red-700', code: '*123*' }
  ]

  const handlePay = () => {
    if (!operator || phone.length < 9) return
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      // Pour la démo, afficher le popup au lieu de faire un vrai paiement
      setShowDemoPopup(true)
    }, 2000)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DEMO_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCloseDemoPopup = () => {
    setShowDemoPopup(false)
    setStep('success')
    setTimeout(() => onSuccess(), 1500)
  }

  const getActionText = () => {
    if (actionType === 'cv_boost') return "boost de CV"
    if (actionType === 'boost') return "promotion d'annonce"
    return "paiement"
  }

  const getSuccessMessage = () => {
    if (actionType === 'cv_boost') {
      return "Votre CV a ete booste avec succes! Le recruteur recevra votre candidature en priorite."
    }
    if (actionType === 'boost') {
      return "Votre annonce sera promue pendant 7 jours"
    }
    return "Paiement reussi!"
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
        <div className="bg-white rounded-xl w-full max-w-sm p-4">
          {step === 'select' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Paiement Mobile Money</h2>
                <button onClick={onClose}><X className="w-5 h-5" /></button>
              </div>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Montant a payer pour votre {getActionText()}</p>
                <p className="text-2xl font-bold text-amber-600">{amount.toLocaleString()} Ar</p>
              </div>
              <p className="text-sm text-gray-600 mb-3">Choisir votre operateur:</p>
              <div className="space-y-2 mb-4">
                {operators.map(op => (
                  <button key={op.id} onClick={() => setOperator(op.id)} className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 ${operator === op.id ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <div className={`w-10 h-10 ${op.color} rounded-full flex items-center justify-center text-white font-bold`}>{op.name[0]}</div>
                    <span className="font-medium">{op.name}</span>
                    {operator === op.id && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                  </button>
                ))}
              </div>
              {operator && (
                <button onClick={() => setStep('payment')} className="w-full py-3 bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                  CONTINUER <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {step === 'payment' && (
            <>
              <button onClick={() => setStep('select')} className="text-sm text-gray-500 mb-2">&larr; Retour</button>
              <h2 className="font-semibold mb-4">Confirmer le paiement</h2>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Montant:</span>
                  <span className="font-medium">{amount.toLocaleString()} Ar</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Vers:</span>
                  <span className="font-medium">{PLATFORM_ACCOUNT}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Votre numero {operator === 'telma' ? 'Telma' : operator === 'orange' ? 'Orange' : 'Airtel'}:</p>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="32 12 345 67" className="w-full p-3 border rounded-lg mb-4" />
              <button onClick={handlePay} disabled={processing || phone.length < 9} className="w-full py-3 bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {processing ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Traitement...</> : <><Phone className="w-4 h-4" /> CONFIRMER</>}
              </button>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="font-semibold text-xl mb-2">Paiement reussi!</h2>
              <p className="text-gray-500">{getSuccessMessage()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Popup Style Cadeau pour la démo */}
      {showDemoPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-2">🎁</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">Code Demo</h3>
            <p className="text-gray-600 mb-4">Cliquez pour copier:</p>
            <button 
              onClick={handleCopyCode} 
              className="text-4xl font-mono font-bold text-green-700 bg-green-50 py-4 rounded-xl mb-4 w-full transition-all hover:bg-green-100"
            >
              {copied ? '✓ Copié!' : DEMO_CODE}
            </button>
            <button 
              onClick={handleCloseDemoPopup}
              className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function JobCard({ job, users, onApply, onDelete, onUpdate, onBoostCV }) {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const recruiter = users.find(u => u.id === job.recruiterId)
  const hasApplied = job.applicants?.includes(user?.id)
  const [showDesc, setShowDesc] = useState(false)
  const [showCvBoostModal, setShowCvBoostModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const typeColors = { CDI: 'bg-green-100 text-green-700', CDD: 'bg-blue-100 text-blue-700', STAGE: 'bg-purple-100 text-purple-700', FREELANCE: 'bg-amber-100 text-amber-700', INTERIM: 'bg-red-100 text-red-700' }

  const isOwner = user?.id === job.recruiterId
  const isBoosted = job.boosted && new Date(job.boostedUntil) > new Date()
  
  const hasBoostedCV = job.boostedCVs?.includes(user?.id)

  const handleApply = () => {
    if (!hasApplied && user) {
      onApply(job.id, false)
      const jobInfo = `Bonjour ${recruiter?.name},\n\nJe postule pour le poste de ${job.title} chez ${job.enterprise}.\n\nType: ${job.type}\nLieu: ${job.location}${job.salary ? '\nSalaire: ' + job.salary : ''}\n\nMerci de votre consideration.`
      navigate(`/messages/${job.recruiterId}?msg=${encodeURIComponent(jobInfo)}`)
    } else if (!user) {
      navigate('/login')
    }
  }

  const handleBoostCV = () => {
    if (!hasBoostedCV && hasApplied) {
      setShowCvBoostModal(true)
    }
  }

  const handleCvBoostSuccess = () => {
    setShowCvBoostModal(false)
    onBoostCV(job.id)
  }

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border p-4 ${isBoosted ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-100'}`}>
        <div className="flex justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              {isBoosted && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-500" />Sponsorise</span>}
            </div>
            <p className="text-sm text-gray-500">{job.enterprise}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${typeColors[job.type] || 'bg-gray-100'}`}>{job.type}</span>
            {isOwner && (
              <div className="flex gap-1">
                <button onClick={() => setShowEditModal(true)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(job.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
          {job.salary && <span className="text-green-700 font-medium">{job.salary}</span>}
          {isBoosted && <span className="text-amber-600 flex items-center gap-1"><Zap className="w-3 h-3" />{Math.ceil((new Date(job.boostedUntil) - new Date()) / (1000 * 60 * 60 * 24))} jours restants</span>}
        </div>

        <button onClick={() => setShowDesc(!showDesc)} className="text-xs text-gray-500 mt-2">{showDesc ? 'Masquer' : 'Voir description'}</button>
        {showDesc && <p className="text-sm text-gray-600 mt-2">{job.description}</p>}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <Link to={`/profile/${recruiter?.id}`} className="text-xs text-gray-500">{recruiter?.name}</Link>
          
          {!isOwner && (
            <div className="flex gap-2">
              {hasApplied ? (
                <>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                    Candidature envoyee
                  </span>
                  {!hasBoostedCV && (
                    <button 
                      onClick={handleBoostCV} 
                      className="px-3 py-1 bg-amber-500 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-amber-600 transition"
                    >
                      <Bolt className="w-3 h-3" /> Booster ({CV_BOOST_PRICE.toLocaleString()} Ar)
                    </button>
                  )}
                  {hasBoostedCV && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500" /> CV Boosté
                    </span>
                  )}
                </>
              ) : (
                <button 
                  onClick={handleApply} 
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-green-700 transition"
                >
                  <Send className="w-3 h-3" /> Postuler (Gratuit)
                </button>
              )}
            </div>
          )}
        </div>

        {hasApplied && !hasBoostedCV && !isOwner && (
          <div className="mt-2 pt-2 text-xs text-gray-400 border-t border-gray-50">
            <p className="flex items-center gap-1">
              <Bolt className="w-3 h-3 text-amber-500" />
              <span>Boostez votre CV pour {CV_BOOST_PRICE.toLocaleString()} Ar et soyez mis en avant auprès du recruteur avec un badge "Candidat Premium"</span>
            </p>
          </div>
        )}
      </div>

      {showCvBoostModal && (
        <MobileMoneyModal 
          amount={CV_BOOST_PRICE} 
          jobTitle={job.title} 
          onClose={() => setShowCvBoostModal(false)} 
          onSuccess={handleCvBoostSuccess}
          actionType="cv_boost"
        />
      )}

      {showEditModal && (
        <EditJobModal 
          job={job} 
          onClose={() => setShowEditModal(false)} 
          onUpdate={onUpdate} 
        />
      )}
    </>
  )
}

function EditJobModal({ job, onClose, onUpdate }) {
  const [form, setForm] = useState({
    title: job.title,
    enterprise: job.enterprise,
    description: job.description,
    type: job.type,
    location: job.location,
    salary: job.salary || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(job.id, form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Modifier l'offre</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <input 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              placeholder="Titre du poste" 
              className="w-full p-2 border rounded-lg" 
              required 
            />
            <input 
              value={form.enterprise} 
              onChange={e => setForm({...form, enterprise: e.target.value})} 
              placeholder="Entreprise" 
              className="w-full p-2 border rounded-lg" 
              required 
            />
            <div className="flex gap-2">
              <select 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value})} 
                className="flex-1 p-2 border rounded-lg"
              >
                {JOB_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <select 
                value={form.location} 
                onChange={e => setForm({...form, location: e.target.value})} 
                className="flex-1 p-2 border rounded-lg" 
                required
              >
                <option value="">Ville</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <input 
              value={form.salary} 
              onChange={e => setForm({...form, salary: e.target.value})} 
              placeholder="Salaire" 
              className="w-full p-2 border rounded-lg" 
            />
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              placeholder="Description" 
              rows={3} 
              className="w-full p-2 border rounded-lg" 
              required 
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg">Annuler</button>
            <button type="submit" className="flex-1 py-2 bg-green-700 text-white rounded-lg">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CreateJobModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', enterprise: '', description: '', type: 'CDI', location: '', salary: '' })
  const [boosted, setBoosted] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [pendingJob, setPendingJob] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (boosted) {
      setPendingJob(form)
      setShowPayment(true)
    } else {
      onSubmit({ ...form, boosted: null })
      onClose()
    }
  }

  const handlePaymentSuccess = () => {
    onSubmit({ ...pendingJob, boosted: true })
    setShowPayment(false)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl w-full max-w-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Nouvelle offre</h2>
            <button onClick={onClose}><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Titre du poste" className="w-full p-2 border rounded-lg" required />
              <input value={form.enterprise} onChange={e => setForm({...form, enterprise: e.target.value})} placeholder="Entreprise" className="w-full p-2 border rounded-lg" required />
              <div className="flex gap-2">
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="flex-1 p-2 border rounded-lg">
                  {JOB_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <select value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="flex-1 p-2 border rounded-lg" required>
                  <option value="">Ville</option>
                  {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <input value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="Salaire" className="w-full p-2 border rounded-lg" />
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" rows={3} className="w-full p-2 border rounded-lg" required />
              
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={boosted} onChange={e => setBoosted(e.target.checked)} className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="flex items-center gap-1 font-medium text-amber-700"><Star className="w-4 h-4 fill-amber-500" />Mettre en avant ({BOOST_PRICE.toLocaleString()} Ar)</span>
                    <p className="text-xs text-amber-600">Annonce placee en haut de la page pendant 7 jours</p>
                  </div>
                </label>
              </div>
            </div>
            <button type="submit" className="w-full mt-4 py-2 bg-green-700 text-white rounded-lg">Publier</button>
          </form>
        </div>
      </div>
      {showPayment && (
        <MobileMoneyModal 
          amount={BOOST_PRICE} 
          jobTitle={pendingJob?.title} 
          onClose={() => setShowPayment(false)} 
          onSuccess={handlePaymentSuccess}
          actionType="boost"
        />
      )}
    </>
  )
}

export default function Jobs() {
  const context = useContext(AppContext) || {}
  const { jobs = [], users = [], user, createJob, applyToJob, deleteJob, updateJob, boostCV } = context
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('TOUS')
  const [locationFilter, setLocationFilter] = useState('')
  const [showModal, setShowModal] = useState(false)

  if (!jobs.length && !users.length) return null

  const filteredJobs = jobs
    .filter(j => {
      const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.enterprise.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'TOUS' || j.type === typeFilter
      const matchLocation = !locationFilter || j.location === locationFilter
      return matchSearch && matchType && matchLocation
    })
    .sort((a, b) => {
      const aBoosted = a.boosted && new Date(a.boostedUntil) > new Date()
      const bBoosted = b.boosted && new Date(b.boostedUntil) > new Date()
      if (aBoosted && !bBoosted) return -1
      if (!aBoosted && bBoosted) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <div className="container-app px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Emplois</h1>
        {user && (
          <button onClick={() => setShowModal(true)} className="p-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition">
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un emploi..." className="w-full pl-10 p-2 border rounded-lg" />
      </div>

      <div className="flex gap-2 mb-2 overflow-x-auto">
        <button onClick={() => setTypeFilter('TOUS')} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${typeFilter === 'TOUS' ? 'bg-green-700 text-white' : 'bg-gray-100'}`}>Tous</button>
        {JOB_TYPES.map(t => (
          <button key={t.id} onClick={() => setTypeFilter(t.id)} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${typeFilter === t.id ? 'bg-green-700 text-white' : 'bg-gray-100'}`}>{t.label}</button>
        ))}
      </div>
      
      <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full mb-4 p-2 border rounded-lg text-sm">
        <option value="">Toutes les villes</option>
        {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
      </select>

      <div className="space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              users={users} 
              onApply={applyToJob}
              onDelete={deleteJob}
              onUpdate={updateJob}
              onBoostCV={boostCV}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune offre d'emploi trouvée</p>
          </div>
        )}
      </div>

      {showModal && <CreateJobModal onClose={() => setShowModal(false)} onSubmit={createJob} />}
    </div>
  )
}