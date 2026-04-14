import { useState, useContext } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, MapPin, Plus, Send, X } from 'lucide-react'
import { AppContext } from '../App'
import { JOB_TYPES, CITIES } from '../data/store'

function JobCard({ job, users, onApply }) {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const recruiter = users.find(u => u.id === job.recruiterId)
  const hasApplied = job.applicants?.includes(user.id)
  const [showDesc, setShowDesc] = useState(false)

  const typeColors = { CDI: 'bg-green-100 text-green-700', CDD: 'bg-blue-100 text-blue-700', STAGE: 'bg-purple-100 text-purple-700', FREELANCE: 'bg-amber-100 text-amber-700', INTERIM: 'bg-red-100 text-red-700' }

  const handleApply = () => {
    if (!hasApplied) {
      onApply(job.id)
      const jobInfo = `Bonjour ${recruiter?.name},\n\nJe postule pour le poste de ${job.title} chez ${job.enterprise}.\n\nType: ${job.type}\nLieu: ${job.location}${job.salary ? '\nSalaire: ' + job.salary : ''}\n\nMerci de votre consideration.`
      navigate(`/messages/${job.recruiterId}?msg=${encodeURIComponent(jobInfo)}`)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.enterprise}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${typeColors[job.type] || 'bg-gray-100'}`}>{job.type}</span>
      </div>

      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
        {job.salary && <span className="text-green-700 font-medium">{job.salary}</span>}
      </div>

      <button onClick={() => setShowDesc(!showDesc)} className="text-xs text-gray-500 mt-2">{showDesc ? 'Masquer' : 'Voir description'}</button>
      {showDesc && <p className="text-sm text-gray-600 mt-2">{job.description}</p>}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <Link to={`/profile/${recruiter?.id}`} className="text-xs text-gray-500">{recruiter?.name}</Link>
        {hasApplied ? (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">Candidature envoyee</span>
        ) : (
          <button onClick={handleApply} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm flex items-center gap-1">
            <Send className="w-3 h-3" />Postuler
          </button>
        )}
      </div>
    </div>
  )
}

function CreateJobModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', enterprise: '', description: '', type: 'CDI', location: '', salary: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Nouvelle offre</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
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
        </div>
        <button onClick={handleSubmit} className="w-full mt-4 py-2 bg-green-700 text-white rounded-lg">Publier</button>
      </div>
    </div>
  )
}

export default function Jobs() {
  const context = useContext(AppContext) || {}
  const { jobs = [], users = [], user, createJob, applyToJob } = context
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('TOUS')
  const [locationFilter, setLocationFilter] = useState('')
  const [showModal, setShowModal] = useState(false)

  if (!jobs.length && !users.length) return null

  const filteredJobs = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.enterprise.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'TOUS' || j.type === typeFilter
    const matchLocation = !locationFilter || j.location === locationFilter
    return matchSearch && matchType && matchLocation
  })

  return (
    <div className="container-app px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Emplois</h1>
        <button onClick={() => setShowModal(true)} className="p-2 bg-green-700 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 p-2 border rounded-lg" />
      </div>

      <div className="flex gap-2 mb-2 overflow-x-auto">
        <button onClick={() => setTypeFilter('TOUS')} className={`px-3 py-1 rounded-full text-xs ${typeFilter === 'TOUS' ? 'bg-green-700 text-white' : 'bg-gray-100'}`}>Tous</button>
        {JOB_TYPES.map(t => (
          <button key={t.id} onClick={() => setTypeFilter(t.id)} className={`px-3 py-1 rounded-full text-xs ${typeFilter === t.id ? 'bg-green-700 text-white' : 'bg-gray-100'}`}>{t.label}</button>
        ))}
      </div>
      
      <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full mb-4 p-2 border rounded-lg text-sm">
        <option value="">Toutes les villes</option>
        {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
      </select>

      <div className="space-y-3">
        {filteredJobs.map(job => (
          <JobCard key={job.id} job={job} users={users} onApply={applyToJob} />
        ))}
      </div>

      {showModal && <CreateJobModal onClose={() => setShowModal(false)} onSubmit={createJob} />}
    </div>
  )
}