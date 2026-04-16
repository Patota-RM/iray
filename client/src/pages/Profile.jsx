import { useContext, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, MessageCircle, Edit, Share2, Check, Camera, X, Copy, Users, Heart } from 'lucide-react' // Ajout de Heart pour les likes
import { AppContext } from '../App'
import { CATEGORIES, CITIES, POST_TYPES } from '../data/store' // Ajout de POST_TYPES

// ✅ AJOUT 1 : Fonction pour calculer le temps (2h, 3j, etc.)
function getTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Maintenant'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return `${days}j`
}

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
  // ✅ AJOUT 2 : J'ai extrait "posts" du Context
  const { user, users, posts, getUserStats, updateUser } = useContext(AppContext) || {}
  const profileUser = id ? users?.find(u => u.id === id) : user
  const isOwn = !id || (user && id === user.id)
  const stats = getUserStats(profileUser?.id)
  const [editing, setEditing] = useState(false)
  const [sharePopup, setSharePopup] = useState(false)
  const [form, setForm] = useState({ name: profileUser?.name, bio: profileUser?.bio, location: profileUser?.location, category: profileUser?.category, phone: profileUser?.phone, avatar: profileUser?.avatar })
  const avatarRef = useRef(null)

  // ✅ AJOUT 3 : Filtrage des posts de cet utilisateur précis
  const userPosts = posts?.filter(p => p.authorId === profileUser?.id) || []

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

  if (!users || !profileUser) return <div className="p-4 text-center">Chargement...</div>

  const cat = getCategoryInfo(profileUser.category)
  
  // Petite variable pour les couleurs des types de posts (identique à Feed)
  const typeColors = { OPPORTUNITY: 'bg-green-100 text-green-700', JOB: 'bg-blue-100 text-blue-700', SERVICE: 'bg-purple-100 text-purple-700', FORMATION: 'bg-pink-100 text-pink-700', PRODUCT: 'bg-orange-100 text-orange-700', NEWS: 'bg-cyan-100 text-cyan-700' }

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

      {/* ✅ AJOUT 4 : La section qui affiche les publications de l'utilisateur */}
      <div className="mt-6">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
           Publications ({userPosts.length})
        </h2>
        
        {userPosts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-gray-500 text-sm">
            Aucune publication pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {userPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${typeColors[post.type] || 'bg-gray-100'}`}>
                    {POST_TYPES.find(t => t.id === post.type)?.label}
                  </span>
                  <span className="text-[10px] text-gray-400">{getTimeAgo(post.createdAt)}</span>
                </div>
                
                <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>
                
                {post.media && (
                  <div className="mt-3 rounded-xl overflow-hidden">
                    {post.media.type === 'image' && <img src={post.media.url} alt="Media" className="w-full max-h-60 object-cover" />}
                    {post.media.type === 'video' && <video src={post.media.url} controls className="w-full max-h-60" />}
                  </div>
                )}
                
                <div className="mt-3 pt-2 border-t border-gray-50 flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes?.length || 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}