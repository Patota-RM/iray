import { useState, useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Send, MapPin, Image, Video, X, Trash2, Edit } from 'lucide-react'
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

function MediaPreview({ media }) {
  if (!media) return null
  if (media.type === 'image') {
    return <div className="mt-3 rounded-xl overflow-hidden"><img src={media.url} alt="Media" className="w-full max-h-80 object-cover" /></div>
  }
  if (media.type === 'video') {
    return <div className="mt-3 rounded-xl overflow-hidden"><video src={media.url} controls className="w-full max-h-80" /></div>
  }
  return null
}

function PostCard({ post, users, onLike, onComment, onDelete, onUpdate }) {
  const { user } = useContext(AppContext)
  const author = users.find(u => u.id === post.authorId)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const isLiked = post.likes?.includes(user?.id)
  const isOwner = user?.id === post.authorId
  const comments = post.comments || []

  const handleComment = (e) => { e.preventDefault(); if (newComment.trim()) { onComment(post.id, newComment); setNewComment('') } }
  const handleSaveEdit = () => { onUpdate(post.id, { content: editContent }); setEditing(false) }

  const typeColors = { OPPORTUNITY: 'bg-green-100 text-green-700', JOB: 'bg-blue-100 text-blue-700', SERVICE: 'bg-purple-100 text-purple-700', FORMATION: 'bg-pink-100 text-pink-700', PRODUCT: 'bg-orange-100 text-orange-700', NEWS: 'bg-cyan-100 text-cyan-700' }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 hover:shadow-md transition-all">
      <div className="flex gap-3">
        <Link to={`/profile/${author?.id}`}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">{author?.name?.charAt(0)}</span>
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
          <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full p-2 border rounded-lg text-sm" rows={3} />
          <div className="flex gap-2">
            <button onClick={handleSaveEdit} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">Enregistrer</button>
            <button onClick={() => setEditing(false)} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Annuler</button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-gray-800 whitespace-pre-wrap">{colorizeLinks(post.content)}</p>
      )}

      {post.media && <MediaPreview media={post.media} />}

      <div className="flex items-center gap-2 mt-3">
        <span className={`px-2 py-0.5 rounded-full text-xs ${typeColors[post.type] || 'bg-gray-100'}`}>{POST_TYPES.find(t => t.id === post.type)?.label}</span>
        <span className="text-xs text-gray-500">{post.likes?.length || 0} - {comments.length}</span>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button onClick={() => onLike(post.id)} className={`flex items-center gap-1 text-xs ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
          <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />Like
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-xs text-gray-500">
          <MessageCircle className="w-3 h-3" />Comment
        </button>
        <button onClick={() => navigator.clipboard.writeText(`https://madahub.mg/post/${post.id}`)} className="flex items-center gap-1 text-xs text-gray-500">
          <Send className="w-3 h-3" />Share
        </button>
      </div>

      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {comments.map(c => {
            const cAuthor = users.find(u => u.id === c.authorId)
            return <div key={c.id} className="text-sm"><span className="font-medium">{cAuthor?.name}: </span><span className="text-gray-600">{c.content}</span></div>
          })}
          <form onSubmit={handleComment} className="flex gap-2 mt-2">
            <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Comment..." className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm" />
            <button type="submit" disabled={!newComment.trim()} className="p-2 bg-green-600 text-white rounded-lg"><Send className="w-4 h-4" /></button>
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
        <button onClick={() => onChange(null)} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"><X className="w-4 h-4" /></button>
      </div>
    )
  }

  return (
    <div className="flex gap-2 mt-3 justify-center">
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
  const { posts, users, user, createPost, likePost, commentPost, deletePost, updatePost } = useContext(AppContext)
  const [content, setContent] = useState('')
  const [type, setType] = useState('OPPORTUNITY')
  const [media, setMedia] = useState(null)
  const [filter, setFilter] = useState('TOUS')
  const [locationFilter, setLocationFilter] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim() || media) { createPost(content, type, media); setContent(''); setMedia(null) }
  }

  const filteredPosts = posts.filter(p => {
    const typeMatch = filter === 'TOUS' || p.type === filter
    const locationMatch = !locationFilter || p.location === locationFilter
    return typeMatch && locationMatch
  })

  return (
    <div className="container-app px-4 py-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-4">
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Quoi de neuf?" className="w-full resize-none focus:outline-none" rows={2} />
        <MediaUploader media={media} onChange={setMedia} />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex gap-1 overflow-x-auto justify-center flex-1">
            {POST_TYPES.map(t => (
              <button type="button" key={t.id} onClick={() => setType(t.id)} className={`px-1.5 py-0.5 rounded-full text-xs whitespace-nowrap ${type === t.id ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>{t.label}</button>
            ))}
          </div>
          <button type="submit" disabled={!content.trim() && !media} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium disabled:opacity-50 ml-2">Poster</button>
        </div>
      </form>

      <div className="flex gap-1 mb-2 overflow-x-auto justify-center sticky top-14 z-10 bg-white py-1">
        <button onClick={() => setFilter('TOUS')} className={`px-1.5 py-0.5 rounded-full text-xs ${filter === 'TOUS' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200'}`}>Tous</button>
        {POST_TYPES.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)} className={`px-1.5 py-0.5 rounded-full text-xs ${filter === t.id ? 'bg-green-600 text-white' : 'bg-white border border-gray-200'}`}>{t.label}</button>
        ))}
      </div>
      
      <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full mb-4 p-2 border rounded-lg text-sm">
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