import { useContext, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, MessageCircle, Edit, Share2, Check, Camera, X, Copy, Users, MessageSquare, ExternalLink } from 'lucide-react'
import { AppContext } from '../App'
import { CATEGORIES, CITIES } from '../data/store'

const SharePopup = ({ onClose }) => {
  const [copied, setCopied] = useState(false)
  const link = 'https://madahub.mg'
  const shareText = 'Misaotra indrindra tompoko amin\'ny fiaraha-mientana hampandroso ny firenena'
  
  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + link)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
  }

  const shareOptions = [
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-500', url: shareLinks.whatsapp },
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600', url: shareLinks.facebook }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <button onClick={onClose} className="absolute top-4 right-4 p-1"><X className="w-5 h-5" /></button>
        <div className="text-center">
          <div className="text-4xl mb-3">🇲🇬</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Partager IRAY</h3>
          <p className="text-sm text-gray-600 mb-4">Invitez vos proches malgaches a rejoindre la plateforme!</p>
          
          <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2 mb-4">
            <span className="flex-1 text-gray-700 font-mono text-sm truncate">{link}</span>
            <button onClick={handleCopy} className="p-2 bg-green-600 text-white rounded-lg">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {shareOptions.map(opt => (
              <a key={opt.name} href={opt.url} target="_blank" rel="noopener noreferrer"
                className={`py-3 ${opt.color} text-white rounded-xl font-medium flex items-center justify-center gap-2`}>
                <span>{opt.icon}</span> {opt.name}
              </a>
            ))}
          </div>
          
          <div className="bg-green-50 p-3 rounded-xl mb-4">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <Users className="w-4 h-4" /> {shareText}
            </p>
          </div>
          
          <button onClick={onClose} className="w-full py-3 bg-green-600 text-white rounded-xl font-medium">Fermer</button>
        </div>
      </div>
    </div>
  )
}

function getCategoryInfo(id) {
  return CATEGORIES.find(c => c.id === id) || { icon: '👤', label: id, desc: '' }
}

export default function Profile() {
  const { id } = useParams()
  const { user, users, getUserStats, updateUser } = useContext(AppContext)
  const profileUser = id ? users.find(u => u.id === id) : user
  const isOwn = !id || id === user.id
  const stats = getUserStats(profileUser?.id)
  const [editing, setEditing] = useState(false)
  const [sharePopup, setSharePopup] = useState(false)
  const [form, setForm] = useState({ name: profileUser?.name, bio: profileUser?.bio, location: profileUser?.location, category: profileUser?.category, phone: profileUser?.phone, avatar: profileUser?.avatar })
  const avatarRef = useRef(null)

  const handleSave = () => { updateUser(form); setEditing(false) }
  const handleShare = () => setSharePopup(true)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => { setForm({...form, avatar: reader.result}) }
      reader.readAsDataURL(file)
    }
  }

  if (!profileUser) return <div className="p-4 text-center">Utilisateur non trouve</div>

  const cat = getCategoryInfo(profileUser.category)

  return (
    <div className="container-app px-4 py-6">
      {sharePopup && <SharePopup onClose={() => setSharePopup(false)} />}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-green-700 via-white to-red-500"></div>
        <div className="px-4 pb-4">
          <div className="-mt-12 mb-3 relative">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center mx-auto border-4 border-white overflow-hidden">
              {(editing ? form.avatar : profileUser.avatar) ? (
                <img src={editing ? form.avatar : profileUser.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-3xl">{profileUser.name?.charAt(0)}</span>
              )}
            </div>
            {isOwn && editing && (
              <button onClick={() => avatarRef.current?.click()} className="absolute -bottom-1 -right-1 bg-green-600 p-1.5 rounded-full border-2 border-white">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
            <input type="file" ref={avatarRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
          </div>
          
          {editing ? (
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded-lg text-center" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-2 border rounded-lg text-center" placeholder="Telephone" />
              <select value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-2 border rounded-lg text-center">
                <option value="">Ville</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full p-2 border rounded-lg" rows={2} placeholder="Bio" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Categorie</p>
                <div className="grid grid-cols-6 gap-1">
                  {CATEGORIES.slice(0, 6).map(cat => (
                    <button key={cat.id} type="button" onClick={() => setForm({...form, category: cat.id})}
                      className={`p-2 rounded-lg text-lg relative group ${form.category === cat.id ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
                      {cat.icon}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{cat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSave} className="w-full py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />Enregistrer
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold text-center">{profileUser.name}</h1>
              <p className="text-center text-sm text-gray-500" title={cat.desc}>{cat.icon} {cat.label}</p>
              {profileUser.location && <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-1 mt-2"><MapPin className="w-3 h-3" />{profileUser.location}</p>}
              {profileUser.phone && <p className="text-center text-sm text-gray-500 mt-1">{profileUser.phone}</p>}
              {profileUser.bio && <p className="text-sm text-gray-600 mt-3 text-center">{profileUser.bio}</p>}
            </div>
          )}
          
          <div className="grid grid-cols-4 gap-2 mt-4 py-3 border-t border-b border-gray-100 text-center">
            <Link to="/" className="hover:bg-gray-50 -m-2 p-2"><p className="font-bold text-green-700">{stats.posts}</p><p className="text-xs text-gray-500">Posts</p></Link>
            <Link to="/jobs" className="hover:bg-gray-50 -m-2 p-2"><p className="font-bold text-green-700">{stats.jobs}</p><p className="text-xs text-gray-500">Emplois</p></Link>
            <div className="-m-2 p-2"><p className="font-bold text-green-700">{stats.applications}</p><p className="text-xs text-gray-500">Candidats</p></div>
            <div className="-m-2 p-2"><p className="font-bold text-green-700">{stats.likes}</p><p className="text-xs text-gray-500">Likes</p></div>
          </div>
          
          {isOwn ? (
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditing(!editing)} className="flex-1 py-2 bg-gray-100 rounded-lg flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" />Modifier
              </button>
              <button onClick={handleShare} className="flex-1 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />Partager
              </button>
            </div>
          ) : (
            <Link to={`/messages/${profileUser.id}`} className="flex items-center justify-center gap-2 mt-4 py-2 bg-green-600 text-white rounded-lg">
              <MessageCircle className="w-4 h-4" />Envoyer un message
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}