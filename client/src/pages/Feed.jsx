import { useState, useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Send, MapPin, Image, Video, X, Trash2, Edit, Check, Copy, Users } from 'lucide-react'
import { AppContext } from '../App'
import { POST_TYPES, CITIES } from '../data/store'

function getTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return `${days}d`
}

function colorizeLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[\w.-]+\.[a-z]{2,}(?:\.[a-z]{2,})+|[\w.-]+@[\w.-]+\.[a-z]{2,})/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return <a key={i} href={part.startsWith('http') ? part : `https://${part}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{part}</a>
    }
    return part
  })
}

// ✅ AJOUT 1 : Composant MediaPreview avec le mode Plein Écran
function MediaPreview({ media }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!media) return null
  
  if (media.type === 'image') {
    return (
      <>
        {/* L'image miniature qui devient cliquable */}
        <div 
          className="mt-3 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" 
          onClick={() => setIsLightboxOpen(true)}
        >
          <img src={media.url} alt="Media" className="w-full max-h-80 object-cover" />
        </div>

        {/* Le fond noir et l'image en grand */}
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer" 
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            {/* e.stopPropagation() empêche de fermer si on clique sur l'image elle-même */}
            <img 
              src={media.url} 
              alt="Media Grand" 
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        )}
      </>
    )
  }
  
  if (media.type === 'video') {
    return <div className="mt-3 rounded-xl overflow-hidden"><video src={media.url} controls className="w-full max-h-80" /></div>
  }
  return null
}

const SharePopup = ({ onClose, postLink, postContent }) => {
  const [copied, setCopied] = useState(false)
  const shareText = postContent ? postContent.substring(0, 100) + '...' : 'Découvre cette publication sur IRAY !'
  
  const handleCopy = () => {
    navigator.clipboard.writeText(postLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postLink)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`
  }

  const shareOptions = [
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-500', url: shareLinks.whatsapp },
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600', url: shareLinks.facebook }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        <div className="text-center">
          <div className="text-4xl mb-3">🇲🇬</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Partager la publication</h3>
          
          <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2 mb-4">
            <span className="flex-1 text-gray-700 font-mono text-xs truncate">{postLink}</span>
            <button onClick={handleCopy} className="p-2 bg-green-600 text-white rounded-lg flex-shrink-0">
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
          
          <button onClick={onClose} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Fermer</button>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post, users, onLike, onComment, onDelete, onUpdate }) {
  const { user } = useContext(AppContext) || {}
  const author = users?.find(u => u.id === post.authorId)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [editType, setEditType] = useState(post.type)
  const [showShare, setShowShare] = useState(false)
  
  const isLiked = post.likes?.includes(user?.id)
  const isOwner = user?.id === post.authorId
  const comments = post.comments || []

  const handleComment = (e) => { e.preventDefault(); if (newComment.trim()) { onComment(post.id, newComment); setNewComment('') } }
  const handleSaveEdit = () => { onUpdate(post.id, { content: editContent, type: editType }); setEditing(false) }

  const postLink = `https://madahub.mg/post/${post.id}`

  const typeColors = { OPPORTUNITY: 'bg-green-100 text-green-700', JOB: 'bg-blue-100 text-blue-700', SERVICE: 'bg-purple-100 text-purple-700', FORMATION: 'bg-pink-100 text-pink-700', PRODUCT: 'bg-orange-100 text-orange-700', NEWS: 'bg-cyan-100 text-cyan-700' }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 hover:shadow-md transition-all">
      {showShare && <SharePopup onClose={() => setShowShare(false)} postLink={postLink} postContent={post.content} />}

      <div className="flex gap-3">
        <Link to={`/profile/${author?.id}`}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">{author?.name?.charAt(0)}</span>
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link to={`/profile/${author?.id}`} className="font-semibold text-gray-900">{author?.name}</Link>
              <span className="text-xs text-gray-500">{getTimeAgo(post.createdAt)}</span>
            </div>
            {isOwner && (
              <div className="flex gap-1">
                <button onClick={() => setEditing(true)} className="p-1 text-gray-400 hover:text-green-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(post.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
          {author?.location && <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {author.location}</p>}
        </div>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <select value={editType} onChange={e => setEditType(e.target.value)} className="w-full p-1 border rounded-lg text-xs">
            {POST_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full p-1 border rounded-lg text-xs" rows={2} />
          <div className="flex gap-1">
            <button onClick={handleSaveEdit} className="px-2 py-0.5 bg-green-600 text-white rounded-lg text-xs">Enregistrer</button>
            <button onClick={() => setEditing(false)} className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs">Annuler</button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-gray-800 whitespace-pre-wrap">{colorizeLinks(post.content)}</p>
      )}

      <MediaPreview media={post.media} />

      <div className="flex items-center gap-1 mt-3">
        <span className={`px-2 py-0.5 rounded-full text-xs ${typeColors[post.type] || 'bg-gray-100'}`}>{POST_TYPES.find(t => t.id === post.type)?.label}</span>
        <span className="text-xs text-gray-500">{post.likes?.length || 0} - {comments.length}</span>
      </div>

      <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
        <button onClick={() => onLike(post.id)} className={`flex items-center gap-1 text-xs ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
          <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />Like
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-xs text-gray-500">
          <MessageCircle className="w-3 h-3" />Comment
        </button>
        <button onClick={() => setShowShare(true)} className="flex items-center gap-1 text-xs text-gray-500">
          <Send className="w-3 h-3" />Share
        </button>
      </div>

      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {comments.map(c => {
            const cAuthor = users.find(u => u.id === c.authorId)
            return <div key={c.id} className="text-xs"><span className="font-medium">{cAuthor?.name}: </span><span className="text-gray-600">{c.content}</span></div>
          })}
          <form onSubmit={handleComment} className="flex gap-1 mt-2">
            <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Comment..." className="flex-1 px-2 py-1 bg-gray-50 rounded-lg text-xs" />
            <button type="submit" disabled={!newComment.trim()} className="p-1 bg-green-600 text-white rounded-lg"><Send className="w-3 h-3" /></button>
          </form>
        </div>
      )}
    </div>
  )
}

function MediaUploader({ media, onChange }) {
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  
  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { onChange({ type, url: reader.result, name: file.name }) }
    reader.readAsDataURL(file)
  }

  if (media) {
    return (
      <div className="mt-3 relative rounded-xl overflow-hidden bg-gray-900">
        {media.type === 'image' && <img src={media.url} alt="Preview" className="w-full max-h-40 object-cover" />}
        {media.type === 'video' && <video src={media.url} className="w-full max-h-40" />}
        <button onClick={() => onChange(null)} className="absolute top-1 right-2 p-1 bg-black/50 text-white rounded-full"><X className="w-4 h-4" /></button>
      </div>
    )
  }

  return (
    <div className="flex gap-1 mt-3 justify-center">
      <input type="file" ref={imageInputRef} onChange={(e) => handleFileChange(e, 'image')} accept="image/*" className="hidden" />
      <input type="file" ref={videoInputRef} onChange={(e) => handleFileChange(e, 'video')} accept="video/*" className="hidden" />
      <button type="button" onClick={() => imageInputRef.current?.click()} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs hover:bg-gray-200">
        <Image className="w-3 h-3" />Photo
      </button>
      <button type="button" onClick={() => videoInputRef.current?.click()} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs hover:bg-gray-200">
        <Video className="w-3 h-3" />Video
      </button>
    </div>
  )
}

export default function Feed() {
  const context = useContext(AppContext)
  const posts = context?.posts || []
  const users = context?.users || []
  const user = context?.user
  const createPost = context?.createPost
  const likePost = context?.likePost
  const commentPost = context?.commentPost
  const deletePost = context?.deletePost
  const updatePost = context?.updatePost
  
  const [content, setContent] = useState('')
  const [type, setType] = useState('OPPORTUNITY')
  const [media, setMedia] = useState(null)
  const [filter, setFilter] = useState('TOUS')
  const [locationFilter, setLocationFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  if (!createPost) return <div className="p-4 text-center">Chargement...</div>

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim() || media) { createPost(content, type, media); setContent(''); setMedia(null) }
  }

  const filteredPosts = posts.filter(p => {
    const typeMatch = filter === 'TOUS' || p.type === filter
    const locationMatch = !locationFilter || p.location === locationFilter
    const searchMatch = !searchQuery || p.content.toLowerCase().includes(searchQuery.toLowerCase())
    return typeMatch && locationMatch && searchMatch
  })

  return (
    <div className="container-app px-4 py-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-4">
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Quoi de neuf?" className="w-full resize-none focus:outline-none" rows={2} />
        <MediaUploader media={media} onChange={setMedia} />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex gap-1 overflow-x-auto justify-center flex-1">
            {POST_TYPES.map(t => (
              <button type="button" key={t.id} onClick={() => setType(t.id)} className={`px-1.5 py-0.5 rounded-full text-[10px] whitespace-nowrap ${type === t.id ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>{t.label}</button>
            ))}
          </div>
          <button type="submit" disabled={!content.trim() && !media} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium disabled:opacity-50 ml-2">Poster</button>
        </div>
      </form>

      <div className="mb-3">
        <input 
          type="text" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Rechercher une publication..." 
          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
      </div>

      <div className="flex gap-1 mb-2 overflow-x-auto justify-center sticky top-14 z-10 bg-white py-1">
        <button onClick={() => setFilter('TOUS')} className={`px-1 py-0.5 rounded-full text-[10px] text-center ${filter === 'TOUS' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200'}`}>Tous</button>
        {POST_TYPES.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)} className={`px-1 py-0.5 rounded-full text-[10px] text-center ${filter === t.id ? 'bg-green-600 text-white' : 'bg-white border border-gray-200'}`}>{t.label}</button>
        ))}
      </div>
      
      <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full mb-4 p-1 border rounded-lg text-xs">
        <option value="">Toutes les villes</option>
        {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
      </select>

      <div className="space-y-3">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} users={users} onLike={likePost} onComment={commentPost} onDelete={deletePost} onUpdate={updatePost} />
        ))}
      </div>
    </div>
  )
}