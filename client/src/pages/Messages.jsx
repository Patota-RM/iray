import { useState, useContext, useEffect, useRef } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Send, ArrowLeft, Paperclip, File, FileText, X, Download, Image, Star } from 'lucide-react'
import { AppContext } from '../App'

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function AttachmentPreview({ attachment, isOwn }) {
  if (!attachment) return null
  
  if (attachment.type.startsWith('image/')) {
    return (
      <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block mt-2 rounded-lg overflow-hidden">
        <img src={attachment.url} alt={attachment.name} className="max-w-[200px] max-h-40 object-cover" />
      </a>
    )
  }
  
  return (
    <a href={attachment.url} download={attachment.name} className={`flex items-center gap-2 mt-2 p-3 rounded-lg ${isOwn ? 'bg-green-700' : 'bg-gray-100'}`}>
      <FileText className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-green-700'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-gray-900'}`}>{attachment.name}</p>
        <p className={`text-xs ${isOwn ? 'text-green-200' : 'text-gray-500'}`}>{formatFileSize(attachment.size)}</p>
      </div>
      <Download className={`w-4 h-4 ${isOwn ? 'text-white' : 'text-gray-500'}`} />
    </a>
  )
}

export default function Messages() {
  const { user, users, messages, markMessagesRead } = useContext(AppContext)
  const { userId } = useParams()
  const [searchParams] = useSearchParams()
  const otherUser = userId ? users.find(u => u.id === userId) : null
  const initialMessage = searchParams.get('msg') ? decodeURIComponent(searchParams.get('msg')) : null

  const getConversation = (otherId) => {
    if (!user) return []
    return messages.filter(m => 
      (m.fromId === user.id && m.toId === otherId) || 
      (m.fromId === otherId && m.toId === user.id)
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const getUnread = (otherId) => {
    if (!user) return 0
    return messages.filter(m => m.fromId === otherId && m.toId === user.id && !m.read).length
  }

  const otherUsers = user ? users.filter(u => u.id !== user.id).sort((a, b) => {
  const convA = getConversation(a.id)
  const convB = getConversation(b.id)
  const dateA = convA[0]?.createdAt || '1970-01-01'
  const dateB = convB[0]?.createdAt || '1970-01-01'
  return new Date(dateB) - new Date(dateA)
}) : []
  const conversation = otherUser ? getConversation(otherUser.id) : []

  useEffect(() => {
    if (otherUser) markMessagesRead(otherUser.id)
  }, [otherUser])

  return (
    <div className="container-app h-[calc(100vh-4rem)]">
      <div className="h-full bg-white border-x border-gray-100">
        {otherUser ? (
          <ChatWindow otherUser={otherUser} conversation={conversation} initialMessage={initialMessage} />
        ) : (
          <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-gray-900">Messages</h1>
            <div className="space-y-2">
              {otherUsers.map(u => {
                const conv = getConversation(u.id)
                const lastMsg = conv[0]
                const unread = getUnread(u.id)
                return (
                  <Link key={u.id} to={`/messages/${u.id}`} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center">
                      <span className="text-white font-bold">{u.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-sm text-gray-500 truncate">{lastMsg?.content || 'No messages'}</p>
                    </div>
                    {unread > 0 && <span className="w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">{unread}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ChatWindow({ otherUser, conversation, initialMessage }) {
  const context = useContext(AppContext)
  const user = context?.user
  const sendMessage = context?.sendMessage
  
  // ✅ CORRECTION 1 : J'ai monté tes Hooks AVANT le return pour éviter le crash
  const [msg, setMsg] = useState('')
  const [attachment, setAttachment] = useState(null)
  const fileInputRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    if (initialMessage && user && otherUser) {
      sendMessage(otherUser.id, initialMessage)
    }
  }, [initialMessage, user, otherUser, sendMessage])

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [conversation])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        size: file.size,
        url: reader.result
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (msg.trim() || attachment) {
      sendMessage(otherUser.id, msg, attachment)
      setMsg('')
      setAttachment(null)
    }
  }

  const removeAttachment = () => setAttachment(null)

  // J'ai remis ton return conditionnel à sa place d'origine
  if (!sendMessage) return <div className="p-4 text-center">Chargement...</div>

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-green-100 flex items-center gap-3 bg-green-50">
        <Link to="/messages" className="p-1 hover:bg-green-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-green-700" />
        </Link>
        <Link to={`/profile/${otherUser.id}`} className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{otherUser.name.charAt(0)}</span>
          </div>
          <span className="font-medium text-gray-900">{otherUser.name}</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {conversation.map(m => {
          const isOwn = m.fromId === user.id
          
          // ✅ CORRECTION 3 : Détection intelligente pour différencier les deux
          const isBoosted = m.isCVBoost || m.content?.startsWith('CV Boosté')
          const isNormalApplication = !isBoosted && m.content?.startsWith('Candidature')

          return (
            <div key={m.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isOwn ? '' : ''}`}>
                
                {/* Ton code pour le badge, inchangé, mais il s'affichera bien maintenant */}
                {(isBoosted || isNormalApplication) && (
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mb-1 ${isBoosted ? 'bg-amber-100 text-amber-700 border border-amber-300 font-bold' : 'bg-gray-100 text-gray-600'}`}>
                    <Star className={`w-3 h-3 ${isBoosted ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`} />
                    {isBoosted ? 'CV Boosté - Premium' : 'Candidature'}
                  </div>
                )}
                
                {/* ✅ CORRECTION 2 : whitespace-pre-line pour éviter le texte géant + bordure dorée si Boost */}
                <div className={`px-3 py-2 rounded-2xl whitespace-pre-line ${isOwn ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' : 'bg-white border border-gray-200'} ${isBoosted ? 'ring-2 ring-amber-400 shadow-amber-100 shadow-lg' : ''}`}>
                  <p>{m.content}</p>
                </div>
                {m.attachment && <AttachmentPreview attachment={m.attachment} isOwn={isOwn} />}
                <p className={`text-xs mt-1 ${isOwn ? 'text-right text-gray-500' : 'text-gray-500'}`}>
                  {new Date(m.createdAt).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {attachment && (
        <div className="px-3 py-2 bg-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-700" />
          <span className="flex-1 text-sm truncate">{attachment.name}</span>
          <button onClick={removeAttachment} className="p-1 hover:bg-gray-200 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="p-3 border-t border-green-100 flex gap-2 bg-white">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,image/*" className="hidden" />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
          <Paperclip className="w-5 h-5" />
        </button>
        <input 
          type="text" 
          value={msg} 
          onChange={e => setMsg(e.target.value)} 
          placeholder="Type a message..." 
          className="flex-1 p-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20" 
        />
        <button type="submit" disabled={!msg.trim() && !attachment} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}