const STORAGE_KEY = 'madahub_data'

const DEFAULT_DATA = {
  users: [
    { id: 'u1', name: 'Rasoa Jean', bio: 'Cultivateur de riz a Antananarivo.', phone: '+261321234567', location: 'Antananarivo', category: 'agriculture', avatar: null, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'u2', name: 'Marie RAZAF', bio: 'Directrice RH chez TechMada.', phone: '+261334567890', location: 'Antananarivo', category: 'entreprise', avatar: null, createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'u3', name: 'Paulin RATSARA', bio: 'Boulanger depuis 15 ans.', phone: '+261347890123', location: 'Fianarantsoa', category: 'artisan', avatar: null, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'u4', name: 'Solo RANDRIAMANITRA', bio: 'Developpeur web et mobile.', phone: '+261388637599', location: 'Toamasina', category: 'tech', avatar: null, createdAt: new Date().toISOString() }
  ],
  posts: [
    { id: 'p1', authorId: 'u1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Je recherche des partenaires pour cultiver du riz a Tana. Qui est interesse?', type: 'OPPORTUNITY', likes: ['u2'], comments: [], location: 'Antananarivo', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'p2', authorId: 'u2', content: 'Nous recrutons des developpeurs web chez TechMada. Postulez maintenant! Lorem ipsum dolor sit amet.', type: 'JOB', likes: ['u1', 'u4'], comments: [], location: 'Antananarivo', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'p3', authorId: 'u3', content: 'Boulangerie artisanale a Fianarantsoa. Pains et gateaux traditionnels. Commandez maintenant! Lorem ipsum dolor sit amet.', type: 'PRODUCT', likes: ['u1'], comments: [], location: 'Fianarantsoa', createdAt: new Date().toISOString() }
  ],
  jobs: [
    { id: 'j1', recruiterId: 'u2', title: 'Developpeur Web', enterprise: 'TechMada', description: 'Lorem ipsum dolor sit amet. Nous cherchons un developpeur web Experimenté.', type: 'CDI', location: 'Antananarivo', salary: '500 000 - 800 000 Ar', applicants: [], createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'j2', recruiterId: 'u2', title: 'Stagiaire RH', enterprise: 'TechMada', description: 'Lorem ipsum dolor sit amet. Stage de 6 mois en RH.', type: 'STAGE', location: 'Antananarivo', salary: 'Stage rémunéré', applicants: [], createdAt: new Date().toISOString() }
  ],
  messages: [],
  notifications: []
}

export function loadStore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Use default data if saved data is empty
      if (!parsed?.users?.length) {
        return { ...DEFAULT_DATA }
      }
      return { ...DEFAULT_DATA, ...parsed }
    }
  } catch (e) {
    console.error('Error loading store:', e)
  }
  return { ...DEFAULT_DATA }
}

export function saveStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving store:', e)
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('261')) return '+' + digits
  if (digits.startsWith('0')) return '+261' + digits.slice(1)
  return '+261' + digits
}

export function formatPhoneDisplay(phone) {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  return digits.replace(/^261/, '')
}

export const CITIES = [
  'Antsiranana',
  'Mahajanga',
  'Toamasina',
  'Antananarivo',
  'Fianarantsoa',
  'Toliara'
]

export const CATEGORIES = [
  { id: 'particular', label: 'Particulier', icon: '👤', desc: 'Utilisateur simple' },
  { id: 'agriculture', label: 'Agriculture', icon: '🌾', desc: 'Cultivateur, eleveur' },
  { id: 'artisan', label: 'Artisan', icon: '🔨', desc: 'Artisan, fabricant' },
  { id: 'tech', label: 'Tech', icon: '💻', desc: 'Developpeur, informatique' },
  { id: 'entreprise', label: 'Entreprise', icon: '🏢', desc: 'Entreprise, organisation' },
  { id: 'education', label: 'Education', icon: '📚', desc: 'Enseignant, formation' },
  { id: 'commerce', label: 'Commerce', icon: '🛒', desc: 'Vendeur, commerce' },
  { id: 'btp', label: 'BTP', icon: '🏗️', desc: 'Batiment, travaux publics' },
  { id: 'sante', label: 'Sante', icon: '🏥', desc: 'Medecin, profession medicale' },
]

export const JOB_TYPES = [
  { id: 'CDI', label: 'CDI' },
  { id: 'CDD', label: 'CDD' },
  { id: 'STAGE', label: 'Stage' },
  { id: 'FREELANCE', label: 'Freelance' },
  { id: 'INTERIM', label: 'Interim' },
]

export const POST_TYPES = [
  { id: 'OPPORTUNITY', label: 'Opportunite', color: 'green' },
  { id: 'JOB', label: 'Emploi', color: 'blue' },
  { id: 'SERVICE', label: 'Service', color: 'purple' },
  { id: 'PRODUCT', label: 'Produit', color: 'orange' },
  { id: 'FORMATION', label: 'Formation', color: 'pink' },
  { id: 'NEWS', label: 'Actualite', color: 'cyan' },
]