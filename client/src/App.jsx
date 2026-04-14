import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useCallback } from 'react'
import Navbar from './components/Navbar'
import Feed from './pages/Feed'
import Jobs from './pages/Jobs'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Login from './pages/Login'
import Register from './pages/Register'
import { loadStore, saveStore, generateId } from './data/store'

export const AppContext = createContext(null)

export default function App() {
  const [store, setStore] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = loadStore()
    setStore(data)

    // Load current user session from THIS TAB (sessionStorage)
    const savedUser = sessionStorage.getItem('iray_current_user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const foundUser = data.users.find(u => u.id === userData.id)
      setUser(foundUser || null)
    }

    setLoading(false)
  }, [])

  const updateStore = useCallback((updates) => {
    setStore(prev => {
      const newStore = { ...prev, ...updates }
      saveStore(newStore)
      return newStore
    })
  }, [])

  // ✅ FIX ICI (login avec user direct)
  const login = useCallback((user) => {
    sessionStorage.setItem('iray_current_user', JSON.stringify(user))
    setUser(user)
    return { success: true }
  }, [])

  const register = useCallback((userData) => {
    const exists = store.users.find(u => u.email === userData.email)
    if (exists) {
      return { success: false, error: 'Ce numéro est déjà utilisé' }
    }

    const newUser = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString()
    }

    updateStore({ users: [...store.users, newUser] })
    localStorage.setItem('madahub_user', JSON.stringify(newUser))
    setUser(newUser)

    return { success: true }
  }, [store, updateStore])

  const logout = useCallback(() => {
    // Remove current session but keep other sessions
    const sessions = JSON.parse(localStorage.getItem('madahub_sessions') || '[]')
    const currentSessions = sessions.filter(s => s.id !== user?.id)
    localStorage.setItem('madahub_sessions', JSON.stringify(currentSessions))
    localStorage.removeItem('madahub_user')
    
    // Switch to another session if available
    if (currentSessions.length > 0) {
      const nextUser = store.users.find(u => u.id === currentSessions[0].id)
      if (nextUser) {
        localStorage.setItem('madahub_user', JSON.stringify(nextUser))
        setUser(nextUser)
        return
      }
    }
    setUser(null)
  }, [store, user])

  const refreshUser = useCallback(() => {
    const currentUser = store.users.find(u => u.id === user?.id)
    if (currentUser) {
      setUser(currentUser)
      localStorage.setItem('madahub_user', JSON.stringify(currentUser))
    }
  }, [store, user])

  const switchUser = useCallback((newUser) => {
    // Save current user to sessions first if logged in
    if (user) {
      const sessions = JSON.parse(localStorage.getItem('madahub_sessions') || '[]')
      if (!sessions.find(s => s.id === user.id)) {
        sessions.push({ id: user.id, name: user.name })
        localStorage.setItem('madahub_sessions', JSON.stringify(sessions))
      }
    }
    // Switch to new user
    localStorage.setItem('madahub_user', JSON.stringify(newUser))
    setUser(newUser)
  }, [user])

  const createPost = useCallback((content, type, media = null) => {
    const newPost = {
      id: generateId(),
      authorId: user.id,
      content,
      type,
      media,
      location: user.location,
      likes: [],
      createdAt: new Date().toISOString(),
      comments: []
    }

    updateStore({ posts: [newPost, ...store.posts] })
    return newPost
  }, [store, user, updateStore])

  const likePost = useCallback((postId) => {
    const posts = store.posts.map(p => {
      if (p.id === postId) {
        const likes = p.likes.includes(user.id)
          ? p.likes.filter(id => id !== user.id)
          : [...p.likes, user.id]
        return { ...p, likes }
      }
      return p
    })

    updateStore({ posts })
  }, [store, user, updateStore])

  const commentPost = useCallback((postId, content) => {
    const posts = store.posts.map(p => {
      if (p.id === postId) {
        const comment = {
          id: generateId(),
          authorId: user.id,
          content,
          createdAt: new Date().toISOString()
        }
        return { ...p, comments: [...(p.comments || []), comment] }
      }
      return p
    })

    updateStore({ posts })
  }, [store, user, updateStore])

  const deletePost = useCallback((postId) => {
    const posts = store.posts.filter(p => p.id !== postId)
    updateStore({ posts })
  }, [store, updateStore])

  const updatePost = useCallback((postId, updates) => {
    const posts = store.posts.map(p => {
      if (p.id === postId) {
        return { ...p, ...updates }
      }
      return p
    })

    updateStore({ posts })
  }, [store, updateStore])

  const updateUser = useCallback((updates) => {
    const users = store.users.map(u => {
      if (u.id === user.id) {
        return { ...u, ...updates }
      }
      return u
    })

    updateStore({ users })
    setUser({ ...user, ...updates })
    localStorage.setItem('madahub_user', JSON.stringify({ ...user, ...updates }))
  }, [store, user, updateStore])

  const createJob = useCallback((jobData) => {
    const newJob = {
      id: generateId(),
      recruiterId: user.id,
      applicants: [],
      featured: false,
      createdAt: new Date().toISOString(),
      ...jobData
    }

    updateStore({ jobs: [newJob, ...store.jobs] })
    return newJob
  }, [store, user, updateStore])

  const applyToJob = useCallback((jobId) => {
    const jobs = store.jobs.map(j => {
      if (j.id === jobId && !j.applicants.includes(user.id)) {
        return { ...j, applicants: [...j.applicants, user.id] }
      }
      return j
    })

    updateStore({ jobs })
  }, [store, user, updateStore])

  const sendMessage = useCallback((toId, content, attachment = null) => {
    const msg = {
      id: generateId(),
      fromId: user.id,
      toId,
      content,
      attachment,
      read: false,
      createdAt: new Date().toISOString()
    }

    updateStore({ messages: [...store.messages, msg] })
    return msg
  }, [store, user, updateStore])

  const getConversation = useCallback((otherUserId) => {
    return store.messages
      .filter(m =>
        (m.fromId === user.id && m.toId === otherUserId) ||
        (m.fromId === otherUserId && m.toId === user.id)
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }, [store, user])

  const getUnreadCount = useCallback((otherUserId) => {
    return store.messages.filter(m =>
      m.fromId === otherUserId &&
      m.toId === user.id &&
      !m.read
    ).length
  }, [store, user])

  const markMessagesRead = useCallback((otherUserId) => {
    const messages = store.messages.map(m => {
      if (m.fromId === otherUserId && m.toId === user.id) {
        return { ...m, read: true }
      }
      return m
    })

    updateStore({ messages })
  }, [store, user, updateStore])

  const getUserStats = useCallback((userId) => {
    const userPosts = store.posts.filter(p => p.authorId === userId)
    const userJobs = store.jobs.filter(j => j.recruiterId === userId)
    const userApplications = store.jobs.filter(j => j.applicants.includes(userId))

    return {
      posts: userPosts.length,
      jobs: userJobs.length,
      applications: userApplications.length,
      likes: userPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)
    }
  }, [store])

  const contextValue = {
    store,
    user,
    login,
    register,
    logout,
    refreshUser,
    createPost,
    likePost,
    commentPost,
    deletePost,
    updatePost,
    updateUser,
    createJob,
    applyToJob,
    sendMessage,
    getConversation,
    getUnreadCount,
    markMessagesRead,
    getUserStats,
    switchUser,
    users: store?.users || [],
    posts: store?.posts || [],
    jobs: store?.jobs || [],
    messages: store?.messages || []
  }

  if (loading || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-700 to-red-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <div className="w-8 h-8 border-2 border-green-700 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        <main className={user ? 'pt-16' : ''}>
          <Routes>
            <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />} />
            <Route path="/jobs" element={user ? <Jobs /> : <Navigate to="/login" />} />
            <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
            <Route path="/messages/:userId" element={user ? <Messages /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </AppContext.Provider>
  )
}