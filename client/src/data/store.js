const STORAGE_KEY = 'madahub_data'

const DEFAULT_DATA = {
  users: [
    { id: 'u1', name: 'Jean Raveloson', bio: 'Cultivateur de riz dans la région de Mandraka. Cherche à moderniser ma production.', phone: '+261321234567', location: 'Antananarivo', category: 'agriculture', avatar: null, createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
    { id: 'u2', name: 'Marie Razafindrakoto', bio: 'Directrice RH chez TechMada. Passionnée par le développement des talents locaux.', phone: '+261334567890', location: 'Antananarivo', category: 'entreprise', avatar: null, createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
    { id: 'u3', name: 'Paulin Ratsarazaka', bio: 'Maître artisan à Fianarantsoa. Spécialisé dans la fabrication d\'instruments de musique traditionnelle.', phone: '+261347890123', location: 'Fianarantsoa', category: 'artisan', avatar: null, createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 'u4', name: 'Patota Rafanomezantsoa', bio: 'Developpeur web et mobile.', phone: '+261388637599', location: 'Toamasina', category: 'tech', avatar: null, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    
    // --- LES 5 NOUVEAUX UTILISATEURS ---
    { id: 'u5', name: 'Naina Andrianjaka', bio: 'Enseignant et fondateur d\'un centre de formation pour jeunes déscolarisés.', phone: '+261330123456', location: 'Toliara', category: 'education', avatar: null, createdAt: new Date(Date.now() - 86400000 * 18).toISOString() },
    { id: 'u6', name: 'Fidy Rabemananjara', bio: 'Gérant d\'une entreprise de BTP. Spécialiste des fondations et bâtiments R+3.', phone: '+261320987654', location: 'Mahajanga', category: 'btp', avatar: null, createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'u7', name: 'Dr. Kanto Raheliarisoa', bio: 'Médecin généraliste au Centre Hospitalier de Référence Régional.', phone: '+261340567890', location: 'Antsiranana', category: 'sante', avatar: null, createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: 'u8', name: 'Hery Andriamananjara', bio: 'Commerçant en matériel informatique et électroménager.', phone: '+261331122334', location: 'Antananarivo', category: 'commerce', avatar: null, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'u9', name: 'Tiana Rasoloarison', bio: 'Designer UI/UX freelance. Passionné par l\'accessibilité numérique.', phone: '+261344556677', location: 'Fianarantsoa', category: 'tech', avatar: null, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() }
  ],
  posts: [
    // --- POSTS ORIGINAUX ---
    { id: 'p1', authorId: 'u1', content: 'Bonjour la communauté ! Je cherche un partenaire technique ou un étudiant en agronomie pour m\'aider à installer un système d\'irrigation goutte-à-goutte sur ma rizière de 2 hectares à Mandraka. Sérieux uniquement, merci !', type: 'OPPORTUNITY', likes: ['u2', 'u5'], comments: [{id:'c1', authorId:'u2', content:'Super initiative Jean, je partage.', createdAt: new Date(Date.now() - 86400000).toISOString()}], location: 'Antananarivo', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'p2', authorId: 'u2', content: 'TechMada recrute ! Nous recherchons 3 développeurs Full Stack pour notre nouveau projet de Fintech locale. Télétravail possible à 50%. Envoyez vos CVs directement en message privé.', type: 'JOB', likes: ['u1', 'u4', 'u9'], comments: [], location: 'Antananarivo', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'p3', authorId: 'u3', content: 'Nouveau stock d\'Aponga et de Valiha arrivés ! Fabriqués artisanalement à Fianarantsoa avec du bois de palissandre certifié. Idéal pour les hôtels ou les écoles de musique. Livraison possible dans les grandes villes. Contactez-moi en MP pour le catalogue.', type: 'PRODUCT', likes: ['u1', 'u7'], comments: [], location: 'Fianarantsoa', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    
    // --- LES ~20 NOUVEAUX POSTS ---
    { id: 'p4', authorId: 'u5', content: 'Recherche bénévoles ou étudiants pour un projet d\'alphabétisation numérique dans un village près de Toliara le mois prochain. Si vous avez des vieux ordinateurs qui fonctionnent, je les accepte aussi !', type: 'OPPORTUNITY', likes: ['u4', 'u7', 'u9'], comments: [], location: 'Toliara', createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
    { id: 'p5', authorId: 'u6', content: 'Vente directe usine de parpaings (20x20x40) et sable de rivière lavé. Prix dégressifs à partir de 1000 unités. Livraison possible sur tout le grand Mahajanga avec nos camions.', type: 'PRODUCT', likes: ['u1'], comments: [], location: 'Mahajanga', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'p6', authorId: 'u7', content: '📢 Campagne gratuite de dépistage du diabète et de l\'hypertension ce samedi à Antsiranana (Espace 67 Ha). Venez à jeun de 7h à 12h. Prévention avant tout !', type: 'NEWS', likes: ['u2', 'u5', 'u8'], comments: [], location: 'Antsiranana', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'p7', authorId: 'u8', content: 'Promotion de fin d\'année sur les PC portables reconditionnés (Dell, HP, Lenovo). Garantie 6 mois. À partir de 450 000 Ar. Idéal pour les étudiants et les freelances.', type: 'PRODUCT', likes: ['u4', 'u9'], comments: [], location: 'Antananarivo', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'p8', authorId: 'u9', content: 'Je lance une formation intensive de 3 mois en Design UI/UX (Figma) à Fianarantsoa. Prochaine session en Mars. 10 places uniquement. Inscriptions ouvertes !', type: 'FORMATION', likes: ['u3', 'u4'], comments: [], location: 'Fianarantsoa', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'p9', authorId: 'u4', content: 'Service de création de sites vitrines et d\'applications mobiles. Je prends des commandes pour le mois prochain. Techno : React / Node.js. Paiement en plusieurs fois possible pour les startups.', type: 'SERVICE', likes: ['u2', 'u8', 'u9'], comments: [], location: 'Toamasina', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'p10', authorId: 'u3', content: 'Exposition exceptionnelle ce week-end à la gare de Fianarantsoa : "L\'Artisanat Malgache Moderne". Sculptures, marqueterie, textile. Entrée libre !', type: 'NEWS', likes: ['u5', 'u6'], comments: [], location: 'Fianarantsoa', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'p11', authorId: 'u6', content: 'Urgent ! Cherche 5 maçons qualifiés (savoir lire un plan) pour chantier R+2 à Mahajanga. Contrat de 2 mois, logement sur place fourni.', type: 'JOB', likes: [], comments: [], location: 'Mahajanga', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'p12', authorId: 'u1', content: 'Récolte exceptionnelle cette année ! J\'ai 500kg de vanille verte certifiée bio à vendre. Je cherche des acheteurs sérieux ou des intermédiaires pour l\'export. Contactez-moi en privé.', type: 'OPPORTUNITY', likes: ['u8'], comments: [], location: 'Antananarivo', createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: 'p13', authorId: 'u5', content: 'Cours de malgache langue étrangère pour les expatriés et les travailleurs internationaux. Cours en ligne via Zoom ou en présentiel à Toliara. Méthode immursive.', type: 'FORMATION', likes: ['u2', 'u7'], comments: [], location: 'Toliara', createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: 'p14', authorId: 'u7', content: 'Notre clinique a besoin d\'un électromécanicien pour l\'entretien des équipements médicaux. Contrat CDI, poste basé à Antsiranana.', type: 'JOB', likes: [], comments: [], location: 'Antsiranana', createdAt: new Date().toISOString() },
    { id: 'p15', authorId: 'u8', content: 'Service de déménagement professionnel dans tout Antananarivo. Emballage, transport et déballage. Devis gratuit en moins de 24h. Appelez-nous !', type: 'SERVICE', likes: ['u1', 'u6'], comments: [], location: 'Antananarivo', createdAt: new Date().toISOString() },
    { id: 'p16', authorId: 'u9', content: 'Je recherche un développeur Backend (Node.js ou Python) pour former un binôme sur un projet EdTech visant à digitaliser les cours du primaire. Projet à but non lucratif.', type: 'OPPORTUNITY', likes: ['u4', 'u5'], comments: [], location: 'Fianarantsoa', createdAt: new Date().toISOString() },
    { id: 'p17', authorId: 'u2', content: 'TechMada recherche un Data Analyst (H/F) pour analyser les tendances de consommation de nos applications. Maîtrise de SQL et PowerBI requise.', type: 'JOB', likes: ['u4'], comments: [], location: 'Antananarivo', createdAt: new Date().toISOString() },
    { id: 'p18', authorId: 'u3', content: 'Atelier découverte de la marqueterie ce samedi à Fianarantsoa. Durée 3h, tout le matériel est fourni. Coût : 25 000 Ar. Inscription par MP.', type: 'FORMATION', likes: ['u9'], comments: [], location: 'Fianarantsoa', createdAt: new Date().toISOString() },
    { id: 'p19', authorId: 'u6', content: 'Fin de chantier : à vendre 20 fenêtres en aluminium et 2 portes blindées (neuf, jamais posé). Prix très intéressant. À venir chercher sur Mahajanga.', type: 'PRODUCT', likes: ['u1'], comments: [], location: 'Mahajanga', createdAt: new Date().toISOString() },
    { id: 'p20', authorId: 'u5', content: 'Le Forum Économique de Toliara aura lieu la semaine prochaine. Thème : "L\'agriculture résiliente face au changement climatique". Entrée libre pour les étudiants.', type: 'NEWS', likes: ['u1', 'u2', 'u7'], comments: [], location: 'Toliara', createdAt: new Date().toISOString() },
    { id: 'p21', authorId: 'u8', content: 'Recherche graphiste freelance pour créer des visuels pour nos publicités sur les réseaux sociaux. Mission récurrente. Envoyez votre portfolio.', type: 'JOB', likes: ['u9'], comments: [], location: 'Antananarivo', createdAt: new Date().toISOString() },
    { id: 'p22', authorId: 'u4', content: 'Astuce Dev : Saviez-vous qu\'on peut héberger une application React statique gratuitement sur Netlify ? C\'est ce que j\'utilise pour mes prototypes. Si quelqu\'un veut un petit tuto, demandez en commentaire !', type: 'NEWS', likes: ['u9', 'u2'], comments: [], location: 'Toamasina', createdAt: new Date().toISOString() },
    { id: 'p23', authorId: 'u7', content: 'Recherche fournisseur de matériel médical de base (tensiomètres, thermomètres) pour approvisionnement groupé à Antsiranana. Si vous avez des contacts fiables, partagez svp.', type: 'OPPORTUNITY', likes: ['u8'], comments: [], location: 'Antsiranana', createdAt: new Date().toISOString() }
  ],
  jobs: [
    // --- JOBS ORIGINAUX ---
    { id: 'j1', recruiterId: 'u2', title: 'Développeur Full Stack (React/Node.js)', enterprise: 'TechMada', description: 'Nous cherchons un développeur confirmé pour prendre en charge la refonte de notre plateforme e-commerce. Vous travaillerez en équipe avec le CTO. Avantage : mutuelle santé et prime de performance.', type: 'CDI', location: 'Antananarivo', salary: '1 200 000 - 1 800 000 Ar', applicants: [], createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'j2', recruiterId: 'u2', title: 'Assistant RH (Stage)', enterprise: 'TechMada', description: 'Stage de 6 mois pour assister l\'équipe RH dans le processus de recrutement et la gestion des paies. Formation sur le logiciel de paie incluse. Recherche profil dynamique titulaire d\'un BTS ou Licence en Droit/Gestion.', type: 'STAGE', location: 'Antananarivo', salary: '400 000 Ar / mois', applicants: [], createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    
    // --- LES NOUVEAUX JOBS ---
    { id: 'j3', recruiterId: 'u7', title: 'Infirmier(e) Polyvalent(e)', enterprise: 'Clinique Nord', description: 'Accueil des patients, soins courants et urgences légères. Travail en 3x8. Diplôme d\'état obligatoire avec inscription à l\'Ordre.', type: 'CDI', location: 'Antsiranana', salary: '900 000 - 1 100 000 Ar', applicants: [], createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'j4', recruiterId: 'u6', title: 'Maçon Qualifié', enterprise: 'BTP Mahajanga', description: 'Chantier de voirie. Savoir lire un plan de coffrage. Équipement de sécurité fourni.', type: 'INTERIM', location: 'Mahajanga', salary: '250 000 Ar / mois + prime panier', applicants: [], createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'j5', recruiterId: 'u8', title: 'Manutentionnaire Entrepôt', enterprise: 'InfoTrade Mada', description: 'Préparation des commandes de matériel informatique, chargement et déchargement des camions. Métier physique, besoin de force et d\'organisation.', type: 'CDD', location: 'Antananarivo', salary: '500 000 Ar / mois', applicants: [], createdAt: new Date().toISOString() },
    { id: 'j6', recruiterId: 'u9', title: 'Graphiste / Monteur Vidéo (Stage)', enterprise: 'Studio TK Design', description: 'Création de logos, mockups et montage de courtes vidéos pour nos clients. Maîtrise de Photoshop et Premiere Pro requise.', type: 'STAGE', location: 'Fianarantsoa', salary: '300 000 Ar / mois', applicants: [], createdAt: new Date().toISOString() },
    { id: 'j7', recruiterId: 'u2', title: 'Data Analyst (H/F)', enterprise: 'TechMada', description: 'Analyse des données utilisateurs de nos applications. Création de dashboards. SQL, Python et PowerBI sont indispensables.', type: 'CDI', location: 'Antananarivo', salary: '1 500 000 - 2 000 000 Ar', applicants: [], createdAt: new Date().toISOString() },
    { id: 'j8', recruiterId: 'u5', title: 'Rédacteur Web (Freelance)', enterprise: 'EduAction Mada', description: 'Rédaction de fiches de cours et de quiz en ligne pour notre plateforme éducative. Besoin de 20 fiches par mois. Paiement à la fiche.', type: 'FREELANCE', location: 'Toliara', salary: '15 000 Ar / fiche', applicants: [], createdAt: new Date().toISOString() }
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