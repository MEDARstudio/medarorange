/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Menu, 
  X, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Palette, 
  Eye, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  Check,
  ChevronDown,
  ShieldCheck,
  Users
} from 'lucide-react';

import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import ServiceCard from './components/ServiceCard';
import AIChat from './components/AIChat';
import SecretAuthModal from './components/SecretAuthModal';
import AdminCMSModal from './components/AdminCMSModal';
import { CaseStudy, ProjectCategory, PaletteMood, AgencyService, TeamMember, StudioValue, StudioGeneralInfo } from './types';

// Curated Agency Case Studies
const PORTFOLIO_PROJECTS: CaseStudy[] = [
  {
    id: 'aura-monolith',
    title: 'Aura Monolith',
    client: 'Manufacture V. Genève',
    year: '2025',
    category: '3d-webgl',
    categoryLabel: 'Haute Horlogerie 3D & WebGL',
    tagline: 'L’anatomie du temps réinventée en shaders de titane et de saphir.',
    description: 'Conception d’un flagship digital immersif et configurateur 3D temps-réel à 60 FPS pour le lancement mondial d’un garde-temps révolutionnaire.',
    metrics: {
      stat: '+185%',
      label: 'Taux de conversion sur précommandes'
    },
    deliverables: ['Direction Artistique', 'Configurateur 3D WebGL', 'Design System'],
    gradientTheme: 'from-[#ff4b26]/50 via-[#7c1e13]/60 to-[#0c0c10]',
    accentColor: '#ff4b26',
    imagePromptFallback: 'Dark obsidian watch dial exploded in 3D WebGL space',
    award: 'Awwwards Site of the Month',
    detailedContext: {
      challenge: 'Sublimer la complexité micromécanique d’une montre à complication sans jamais alourdir le parcours d’achat sur mobile et desktop.',
      artDirection: 'Tonalités obsidienne et bronze sablé. Typographie monumentale à empattements tranchants couplée à une interface sans friction.',
      stack: ['Three.js / GLSL', 'React 19', 'Web Audio API', 'Headless Shopify'],
      result: 'Plus de 420 000 visiteurs uniques lors des 48h de lancement et un panier moyen en hausse de 42% par rapport aux collections précédentes.'
    }
  },
  {
    id: 'solaris-kinetik',
    title: 'Solaris Kinetik',
    client: 'Kinetik Architecture',
    year: '2025',
    category: 'brand-identity',
    categoryLabel: 'Identité & Spatial Design',
    tagline: 'Harmonie entre lumière zénithale et structures géométriques vivantes.',
    description: 'Plateforme institutionnelle et système visuel génératif pour un studio international d’ingénierie bioclimatique.',
    metrics: {
      stat: '€24M',
      label: 'Projets d’appels d’offres remportés'
    },
    deliverables: ['Identité de Marque', 'Plateforme Digitale', 'Animations Cinématiques'],
    gradientTheme: 'from-[#f59e0b]/50 via-[#ea580c]/60 to-[#0c0c10]',
    accentColor: '#f59e0b',
    imagePromptFallback: 'Solar warm architectural pavilion dusk photography',
    award: 'FWA of the Day',
    detailedContext: {
      challenge: 'Traduire l’impermanence de la lumière naturelle à travers un langage digital interactif capable d’évoluer selon la latitude de l’utilisateur.',
      artDirection: 'Inspiré par le crépuscule d’Atacama : nuances ambrées chaleureuses, contrastes typographiques radicaux et carrousels asymétriques.',
      stack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Sanity CMS'],
      result: 'Hausse de 240% des demandes de partenariats institutionnels et reconnaissance au sein des biennales de Venise et Copenhague.'
    }
  },
  {
    id: 'elysium-atelier',
    title: 'Elysium Atelier',
    client: 'Maison Elysium Paris',
    year: '2024',
    category: 'ecommerce-luxe',
    categoryLabel: 'E-Commerce Haute Couture',
    tagline: 'L’émotion tactile de la soie transposée dans le flux du pixel.',
    description: 'Refonte complète du commerce digital de la maison de haute couture parisienne, alliant vitesse extrême et poésie visuelle.',
    metrics: {
      stat: '+210%',
      label: 'Temps moyen passé en consultation'
    },
    deliverables: ['Audit d’Expérience', 'Direction Éditoriale', 'Développement Headless'],
    gradientTheme: 'from-[#e0a96d]/40 via-[#5b3b19]/60 to-[#0c0c10]',
    accentColor: '#e0a96d',
    imagePromptFallback: 'Haute couture editorial silk drapery and Parisian typography',
    award: 'Club des Directeurs Artistiques',
    detailedContext: {
      challenge: 'Conserver la noblesse et la lenteur contemplative du défilé tout en assurant un temps de chargement inférieur à 0.8 seconde.',
      artDirection: 'Compositions broadsheet déstructurées, grain photographique velouté et lettrines néo-classiques.',
      stack: ['Shopify Plus Headless', 'Vite', 'Turborepo', 'GSAP'],
      result: 'Progression de 180% des ventes internationales et doublement des commandes privées sur mesure.'
    }
  },
  {
    id: 'chroma-odyssey',
    title: 'Chroma Odyssey',
    client: 'Fondation d’Art Contemporain',
    year: '2024',
    category: 'generative-art',
    categoryLabel: 'Art Génératif & Installation',
    tagline: 'Une toile numérique infinie modelée par les flux des visiteurs.',
    description: 'Dispositif curatorial interactif permettant au public de sculpter des œuvres numériques par les ondes sonores et le geste.',
    metrics: {
      stat: '180K+',
      label: 'Interactions génératives enregistrées'
    },
    deliverables: ['R&D Shaders', 'Installation Web & In-Situ', 'Sound Design'],
    gradientTheme: 'from-[#2ee9a7]/40 via-[#0f766e]/60 to-[#0c0c10]',
    accentColor: '#2ee9a7',
    imagePromptFallback: 'Generative chromatic wave patterns in museum dark room',
    award: 'Red Dot Best of the Best',
    detailedContext: {
      challenge: 'Garantir un rendu visuel fluide et captivant capable de fonctionner aussi bien sur des écrans tactiles 8K de 12 mètres que sur mobile.',
      artDirection: 'Exploration des lois de réfraction des fluides non newtoniens : vert d’eau cinétique, indigo profond et pulsations harmoniques.',
      stack: ['WebGL 2.0', 'Custom Compute Shaders', 'WebSockets', 'Canvas API'],
      result: 'L’installation a voyagé dans 6 musées européens et a été élue expérience interactive de l’année.'
    }
  },
  {
    id: 'nexus-system',
    title: 'Nexus Intelligence',
    client: 'Nexus Labs Berlin',
    year: '2025',
    category: '3d-webgl',
    categoryLabel: 'Interface Spatiale & IA',
    tagline: 'Rendre intelligible et tactile l’orchestration des modèles neuronaux.',
    description: 'Interface de contrôle et portail de visualisation en temps réel pour une suite d’intelligence artificielle décentralisée.',
    metrics: {
      stat: '-40%',
      label: 'Temps de décision pour les analystes'
    },
    deliverables: ['UX / UI Systémique', 'Visualisation de Données', 'Front-End High-Perf'],
    gradientTheme: 'from-[#38bdf8]/40 via-[#1e3a8a]/60 to-[#0c0c10]',
    accentColor: '#38bdf8',
    award: 'Awwwards Developer Award',
    detailedContext: {
      challenge: 'Représenter des milliards de paramètres d’apprentissage automatique sous une forme ergonomique intuitive et sensorielle.',
      artDirection: 'Grille d’ingénierie ultra-précise, accents cyan luminescents et typographie monospace calibrée aux ratios d’or.',
      stack: ['React 19', 'D3.js', 'WebGL', 'Tailwind CSS'],
      result: 'Adoption immédiate par plus de 45 000 ingénieurs dans le monde et levée de fonds Series A de 30M€.'
    }
  },
  {
    id: 'valence-editions',
    title: 'Valence Éditions',
    client: 'Valence Publishing New York',
    year: '2024',
    category: 'brand-identity',
    categoryLabel: 'Plateforme Éditoriale & Typographie',
    tagline: 'L’art du livre rare réincarné dans une bibliothèque numérique sculpturale.',
    description: 'Conception d’un sanctuaire de lecture numérique et catalogue raisonné d’éditions d’art numérotées.',
    metrics: {
      stat: '100%',
      label: 'Des tirages de tête épuisés en 12h'
    },
    deliverables: ['Typographie Sur Mesure', 'Direction Éditoriale', 'E-Commerce'],
    gradientTheme: 'from-[#e2e8f0]/30 via-[#475569]/50 to-[#0c0c10]',
    accentColor: '#ffffff',
    detailedContext: {
      challenge: 'Créer une expérience de feuilletage virtuel qui restitue le poids du papier et la texture des encres typographiques.',
      artDirection: 'Monochrome contrasté inspiré des presses d’imprimerie artisanales du XXe siècle.',
      stack: ['Next.js', 'Canvas Paper Simulator', 'Shopify Plus'],
      result: 'Tous les exemplaires d’artistes ont trouvé acquéreur en moins de 12 heures lors de la nocturne de lancement.'
    }
  }
];

// Agency Services Data - Selling prestations as cards
const AGENCY_SERVICES: AgencyService[] = [
  {
    id: 'visual-identity',
    number: '01',
    title: 'Visual Identity',
    scope: ['Logo', 'Couleurs', 'Typographie', 'Brand System'],
    description: 'Création d’identités de marque intemporelles et mémorables. Nous façonnons votre grammaire visuelle intégrale pour asseoir une présence forte et distinctive sur tous vos marchés.',
    deliverables: [
      'Logotype principal, signatures & monogrammes vectoriels',
      'Charte chromatique exclusive & profils numériques / print',
      'Système typographique hiérarchisé & licences d’usage',
      'Brand Guidelines & Design System complet'
    ],
    tag: 'Fondation de Marque',
    accent: '#ff4b26'
  },
  {
    id: 'graphic-design',
    number: '02',
    title: 'Graphic Design',
    scope: ['Posters', 'Flyers', 'Brochures', 'Packaging', 'Advertising'],
    description: 'Design éditorial et publicitaire haute précision. De l’affiche monumentale au packaging d’exception, nous concevons des objets graphiques tactiles qui captivent immédiatement.',
    deliverables: [
      'Posters grand format & affiches culturelles / corporate',
      'Plaquettes commerciales, dossiers de presse & brochures',
      'Packaging produit, étiquettes & coffrets haut de gamme',
      'Campagnes publicitaires d’affichage & prints percutants'
    ],
    tag: 'Impact Graphique & Print',
    accent: '#e0a96d'
  },
  {
    id: 'digital-design',
    number: '03',
    title: 'Digital Design',
    scope: ['Social Media', 'Campaigns', 'Web Visuals', 'Banners'],
    description: 'Conception de contenus digitaux percutants et ergonomiques. Nous captivons vos audiences sur tous les canaux numériques avec des visuels qui convertissent l’attention en valeur.',
    deliverables: [
      'Direction artistique réseaux sociaux (Instagram, LinkedIn, X)',
      'Kits de lancement de campagne web & déclinaisons multi-formats',
      'Bannières publicitaires digitales haute performance (CTR)',
      'Visuels de hero banners, landings & newsletters premium'
    ],
    tag: 'Stratégie Numérique',
    accent: '#38bdf8'
  },
  {
    id: 'sports-design',
    number: '04',
    title: 'Sports Design',
    scope: ['Football Graphics', 'Matchday', 'Kits', 'Social Campaigns'],
    description: 'Design sportif d’élite pour clubs professionnels, marques et athlètes. Nous transmettons l’énergie brute et l’intensité de la compétition à travers des visuels cinétiques et vibrants.',
    deliverables: [
      'Affiches Matchday, compositions d’avant-match & line-ups',
      'Design conceptuel & officiel de maillots (Kits football)',
      'Campagnes visuelles pour annonces de transferts & billetterie',
      'Habillages graphiques de stades, bannières & réseaux sportifs'
    ],
    tag: 'Athletic & Football Culture',
    accent: '#2ee9a7'
  },
  {
    id: '3d-creative',
    number: '05',
    title: '3D & Creative',
    scope: ['3D Products', 'Jewelry', 'Objects', 'Promotional Visuals'],
    description: 'Modélisation et rendus 3D hyper-réalistes d’objets et produits. Idéal pour sublimer vos pièces d’horlogerie, bijoux précieux ou créations avant même leur production physique.',
    deliverables: [
      'Rendus 3D photo-réalistes de produits & packagings',
      'Modélisation de haute joaillerie, métaux précieux & pierres',
      'Visualisations volumétriques & simulations d’éclairage studio',
      'Animations 3D promotionnelles & packshots dynamiques'
    ],
    tag: 'CGI & Immersion 3D',
    accent: '#a855f7'
  },
  {
    id: 'print-production',
    number: '06',
    title: 'Print Production',
    scope: ['Préparation Professionnelle Pour Impression'],
    description: 'Expertise technique pré-presse irréprochable. Nous garantissons une restitution fidèle des couleurs, des encres et des finitions chez votre imprimeur sans mauvaise surprise.',
    deliverables: [
      'Fichiers PAO certifiés conformes aux normes d’imprimerie (PDF/X)',
      'Séparation quadrichromie CMJN & gestion des tons directs Pantone',
      'Calibrage des vernis sélectifs, dorures à chaud & gaufrages',
      'Vérification des fonds perdus, traits de coupe & suivi de BAT'
    ],
    tag: 'Haute Précision Pré-Presse',
    accent: '#ffffff'
  }
];

// Founder Profile & Approach for Qui Sommes-Nous
const STUDIO_FOUNDER: TeamMember = {
  name: 'Mohamed Amine Amarir',
  role: 'Fondateur & Directeur Artistique',
  focus: 'Design Graphique, Communication Visuelle, Design Sportif & 3D',
  bio: 'Fondateur de Medar Studio, Mohamed Amine Amarir imagine et conçoit des solutions visuelles sur mesure pour les marques, entreprises, projets sportifs et créateurs. Son approche combine créativité, rigueur géométrique et sens aiguisé du détail pour métamorphoser chaque idée en une identité visuelle forte, moderne et mémorable.',
  tag: 'Fondateur & Direction Artistique'
};

// Core Approach Pillars derived from official manifesto
const STUDIO_APPROACH: StudioValue[] = [
  {
    number: '01',
    title: 'Solutions Sur Mesure',
    description: 'Créations visuelles exclusives façonnées pour les marques, entreprises, projets sportifs et créateurs, sans gabarit préfabriqué.'
  },
  {
    number: '02',
    title: 'Du Digital à l’Impression',
    description: 'Une maîtrise intégrale de la chaîne visuelle, des campagnes numériques percutantes aux fichiers d’impression haute précision certifiés.'
  },
  {
    number: '03',
    title: 'Design Sportif & 3D',
    description: 'Une expertise singulière combinant l’intensité des visuels de matchday et l’impact immersif de la modélisation 3D photoréaliste.'
  },
  {
    number: '04',
    title: 'Précision & Mémorabilité',
    description: 'Un sens du détail sans compromis pour transformer chaque concept en une identité visuelle pérenne, moderne et marquante.'
  }
];

// Default Studio General Info
const DEFAULT_STUDIO_INFO: StudioGeneralInfo = {
  studioName: 'Medar Studio',
  tagline: 'Direction Artistique & Creative Tech',
  officialQuote: 'Medar Studio est un studio créatif fondé par Mohamed Amine Amarir, dédié au design graphique et à la communication visuelle.',
  officialParagraph: 'Nous créons des solutions visuelles sur mesure pour les marques, entreprises, projets sportifs et créateurs, du digital à l’impression, en passant par le design sportif et la 3D. Notre approche combine créativité, précision et sens du détail pour transformer chaque idée en une identité visuelle forte, moderne et mémorable.',
  city: 'Paris 10e',
  address: "28 Rue d'Hauteville, 75010 Paris",
  foundedYear: '2021',
  email: 'bonjour@medarstudio.fr',
  phone: '+33 1 89 71 34 20',
  founderName: 'Mohamed Amine Amarir',
  founderRole: 'Fondateur & Directeur Artistique',
  founderFocus: 'Design Graphique, Communication Visuelle, Design Sportif & 3D',
  founderBio: 'Fondateur de Medar Studio, Mohamed Amine Amarir imagine et conçoit des solutions visuelles sur mesure pour les marques, entreprises, projets sportifs et créateurs. Son approche combine créativité, rigueur géométrique et sens aiguisé du détail pour métamorphoser chaque idée en une identité visuelle forte, moderne et mémorable.'
};

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Dynamic Content with LocalStorage Persistence
  const [projectsList, setProjectsList] = useState<CaseStudy[]>(() => {
    try {
      const saved = localStorage.getItem('medar_studio_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return PORTFOLIO_PROJECTS;
  });

  const [servicesList, setServicesList] = useState<AgencyService[]>(() => {
    try {
      const saved = localStorage.getItem('medar_studio_services');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return AGENCY_SERVICES;
  });

  const [studioInfo, setStudioInfo] = useState<StudioGeneralInfo>(() => {
    try {
      const saved = localStorage.getItem('medar_studio_general');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STUDIO_INFO;
  });

  // Secret Admin Portal States
  const [isSecretAuthOpen, setIsSecretAuthOpen] = useState(false);
  const [isAdminCMSOpen, setIsAdminCMSOpen] = useState(false);
  const secretClickCountRef = useRef(0);
  const secretClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Secret Footer 5 Clicks Trigger (completely silent, no counter displayed)
  const handleSecretFooterClick = () => {
    secretClickCountRef.current += 1;
    if (secretClickTimerRef.current) {
      clearTimeout(secretClickTimerRef.current);
    }
    if (secretClickCountRef.current >= 5) {
      secretClickCountRef.current = 0;
      setIsSecretAuthOpen(true);
    } else {
      secretClickTimerRef.current = setTimeout(() => {
        secretClickCountRef.current = 0;
      }, 3000);
    }
  };

  const handleUpdateProjects = (newProjects: CaseStudy[]) => {
    setProjectsList(newProjects);
    try {
      localStorage.setItem('medar_studio_projects', JSON.stringify(newProjects));
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable:", e);
    }
  };

  const handleUpdateServices = (newServices: AgencyService[]) => {
    setServicesList(newServices);
    try {
      localStorage.setItem('medar_studio_services', JSON.stringify(newServices));
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable:", e);
    }
  };

  const handleUpdateStudioInfo = (newInfo: StudioGeneralInfo) => {
    setStudioInfo(newInfo);
    try {
      localStorage.setItem('medar_studio_general', JSON.stringify(newInfo));
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable:", e);
    }
  };

  const handleResetDefaults = () => {
    try {
      localStorage.removeItem('medar_studio_projects');
      localStorage.removeItem('medar_studio_services');
      localStorage.removeItem('medar_studio_general');
    } catch (e) {
      console.warn("Storage unavailable:", e);
    }
    setProjectsList(PORTFOLIO_PROJECTS);
    setServicesList(AGENCY_SERVICES);
    setStudioInfo(DEFAULT_STUDIO_INFO);
  };

  // States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [activeProject, setActiveProject] = useState<CaseStudy | null>(null);
  const [currentMood, setCurrentMood] = useState<PaletteMood>('vermilion');

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Visual Identity',
    budget: '50k€ - 100k€',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter projects dynamically
  const filteredProjects = selectedCategory === 'all'
    ? projectsList
    : projectsList.filter(p => p.category === selectedCategory);

  // Keyboard navigation for project modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeProject) return;
      if (e.key === 'ArrowLeft') navigateProject('prev');
      if (e.key === 'ArrowRight') navigateProject('next');
      if (e.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject, projectsList]);

  const navigateProject = (direction: 'next' | 'prev') => {
    if (!activeProject) return;
    const currentIndex = projectsList.findIndex(p => p.id === activeProject.id);
    let nextIndex = direction === 'next' 
      ? (currentIndex + 1) % projectsList.length
      : (currentIndex - 1 + projectsList.length) % projectsList.length;
    setActiveProject(projectsList[nextIndex]);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: serviceTitle
    }));
    scrollToSection('contact');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen text-[#f4f3ee] selection:bg-[#ff4b26] selection:text-white overflow-x-hidden">
      {/* Atmospheric Interactive Studio Canvas Background */}
      <FluidBackground mood={currentMood} />

      {/* 
        =======================================================================
        TOP NAVIGATION BAR (Strict Top Bar Contract - Anti Layout Shift)
        Zone 1: Single text element wordmark (shrink-0)
        Zone 2: Clean text navigation links (whitespace-nowrap, fluid gap)
        Zone 3: Primary action (shrink-0)
        =======================================================================
      */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0c0c10]/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-20 flex items-center justify-between gap-4">
          {/* Zone 1: Single element wordmark */}
          <a 
            href="#" 
            className="font-heading text-lg md:text-xl font-black tracking-tight text-white hover:text-[#ff4b26] transition-colors shrink-0"
          >
            MEDAR STUDIO
          </a>

          {/* Zone 2: Clean text links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 xl:gap-10 text-xs font-semibold uppercase tracking-wider text-neutral-300">
            <button 
              onClick={() => scrollToSection('projets')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              Projets
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('qui-sommes-nous')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              Qui Sommes-Nous
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Primary action */}
          <div className="hidden md:flex items-center shrink-0">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 lg:px-5 py-2.5 bg-white text-black hover:bg-[#ff4b26] hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Démarrer un Projet
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 cursor-pointer shrink-0"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#0c0c10]/98 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-heading font-bold text-white mb-10">
              {['Projets', 'Services', 'Qui Sommes-Nous', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item === 'Qui Sommes-Nous' ? 'qui-sommes-nous' : item.toLowerCase())}
                  className="text-left hover:text-[#ff4b26] transition-colors bg-transparent border-none py-2"
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollToSection('contact')}
              className="w-full py-4 bg-[#ff4b26] text-white font-bold uppercase tracking-wider text-sm text-center"
            >
              Démarrer un Projet
            </button>

            <div className="mt-8 pt-8 border-t border-white/10 text-xs font-mono text-neutral-400 space-y-1">
              <p>Medar Studio Paris · 28 Rue d'Hauteville</p>
              <p>bonjour@medarstudio.fr</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        =======================================================================
        HERO SECTION: High-impact editorial agency manifesto
        =======================================================================
      */}
      <section className="relative min-h-[92svh] flex flex-col justify-center pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div style={{ y, opacity }} className="w-full">
          {/* Studio Trust Marker / Editorial Tag */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 mb-6 tracking-widest uppercase">
            <span className="text-[#ff4b26] font-semibold">Direction Artistique & Creative Tech</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Studio Fondé à Paris</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="tabular-nums">Disponibilité Q2 2026</span>
          </div>

          {/* Hero Main Headline with Balanced Wrap */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] max-w-5xl mb-8">
            Nous sculptons le futur digital des{' '}
            <GradientText 
              text="marques visionnaires." 
              variant={currentMood === 'solaris' ? 'gold' : currentMood === 'kinetic-mint' ? 'silver' : 'vermilion'}
            />
          </h1>

          {/* Value proposition paragraph */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-light max-w-3xl leading-relaxed mb-12">
            Medar Studio fusionne haute exigence plastique et architectures 3D WebGL temps-réel. Nous concevons des identités visuelles intemporelles et des plateformes numériques d’exception qui convertissent l’émotion en valeur pérenne.
          </p>

          {/* Hero Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => scrollToSection('projets')}
              data-hover="true"
              className="px-8 py-4 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-3"
            >
              <span>Explorer les Réalisations</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('services')}
              data-hover="true"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-3"
            >
              <Sparkles className="w-4 h-4 text-[#ff4b26]" />
              <span>Découvrir nos Services</span>
            </button>
          </div>
        </motion.div>

        {/* Studio Editorial Ticker / Institutional References */}
        <div className="mt-20 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-neutral-400 font-mono">
          <div>
            <span className="block text-white font-bold tabular-nums text-sm">14 PRIX MAJEURS</span>
            <span className="text-[11px] text-neutral-500">Awwwards, FWA, Club des DA</span>
          </div>
          <div>
            <span className="block text-white font-bold tabular-nums text-sm">+185% IMPACT</span>
            <span className="text-[11px] text-neutral-500">Croissance moyenne de conversion</span>
          </div>
          <div>
            <span className="block text-white font-bold tabular-nums text-sm">PARIS & TOKYO</span>
            <span className="text-[11px] text-neutral-500">Rayonnement international</span>
          </div>
          <div>
            <span className="block text-white font-bold tabular-nums text-sm">CODE SUR-MESURE</span>
            <span className="text-[11px] text-neutral-500">Zéro template, 100% propriétaire</span>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        PORTFOLIO / SHOWCASE SECTION
        =======================================================================
      */}
      <section id="projets" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b26]" />
              <span>Archives Sélectionnées · Format Post 4:5</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white">
              Œuvres Digitales & Cas d'Étude.
            </h2>
          </div>

          <p className="text-sm md:text-base text-neutral-400 max-w-md leading-relaxed">
            Visuels et pièces maîtresses calibrés au ratio 4:5 pour les réseaux et supports éditoriaux, combinant impact graphique et performance technique.
          </p>
        </div>

        {/* Filter Bar (Interactive Segmented Buttons) */}
        <div className="flex flex-wrap items-center gap-2 mb-12 p-1.5 bg-[#121218] border border-white/[0.08] w-fit">
          {[
            { id: 'all', label: 'Tous les Projets' },
            { id: '3d-webgl', label: '3D WebGL & Shaders' },
            { id: 'brand-identity', label: 'Identité de Marque' },
            { id: 'ecommerce-luxe', label: 'E-Commerce de Luxe' },
            { id: 'generative-art', label: 'Art Génératif' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as ProjectCategory)}
              data-hover="true"
              className={`px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onSelect={(p) => setActiveProject(p)}
            />
          ))}
        </div>
      </section>

      {/* 
        =======================================================================
        SERVICES SECTION — VENDRE VOS PRESTATIONS (Présentation en Cartes)
        =======================================================================
      */}
      <section id="services" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b26]" />
              <span>Prestations d'Élite · Ce Que Nous Faisons</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white max-w-2xl">
              SERVICES — Vendre vos prestations.
            </h2>
          </div>
          <p className="text-sm md:text-base text-neutral-400 max-w-md leading-relaxed">
            Chaque prestation est conçue comme un vecteur d'impact direct. Du logo sculpté sur mesure aux visuels de matchday et à la modélisation 3D, découvrez nos 6 pôles de création.
          </p>
        </div>

        {/* 6 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesList.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onSelect={handleSelectService}
            />
          ))}
        </div>
      </section>

      {/* 
        =======================================================================
        QUI SOMMES-NOUS — L'ATELIER MEDAR STUDIO
        Fondé par Mohamed Amine Amarir · Manifeste officiel et approche d'excellence
        =======================================================================
      */}
      <section id="qui-sommes-nous" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08] w-full box-border overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16 gap-6 w-full">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b26] shrink-0" />
              <span>Studio Créatif · Fondé par {studioInfo.founderName}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white break-words">
              QUI SOMMES-NOUS
            </h2>
          </div>
          <p className="text-sm md:text-base text-neutral-400 max-w-md leading-relaxed break-words">
            Un studio créatif dédié au design graphique et à la communication visuelle, combinant créativité, précision et sens du détail.
          </p>
        </div>

        {/* Narrative Manifest Card with User's Official Paragraph */}
        <div className="relative bg-[#111117] border border-white/[0.1] p-6 sm:p-8 md:p-12 mb-16 overflow-hidden w-full box-border">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff4b26]/10 blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl w-full">
            <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest block mb-4">
              Manifeste & Présentation Officielle
            </span>
            <blockquote className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-bold leading-relaxed tracking-tight mb-6 break-words">
              « <span className="text-white">{studioInfo.officialQuote}</span> »
            </blockquote>
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed font-normal break-words">
              {studioInfo.officialParagraph}
            </p>
          </div>

          {/* Key Facts Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 mt-8 border-t border-white/[0.08] text-xs font-mono w-full">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Fondateur</span>
              <span className="text-white font-bold text-xs sm:text-sm block truncate">{studioInfo.founderName}</span>
              <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">{studioInfo.founderRole}</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Discipline</span>
              <span className="text-white font-bold text-xs sm:text-sm block truncate">Design Graphique</span>
              <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">Communication Visuelle</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Expertises</span>
              <span className="text-white font-bold text-xs sm:text-sm block truncate">Digital & Print</span>
              <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">Design Sportif & 3D</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Approche</span>
              <span className="text-white font-bold text-xs sm:text-sm block truncate">100% Sur Mesure</span>
              <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">Précision & Détail</span>
            </div>
          </div>
        </div>

        {/* The Founder Card Spotlight */}
        <div className="mb-20 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest block mb-1">
                Direction Créative & Vision
              </span>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-tight">
                Le Fondateur
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest border border-white/10 px-3 py-1 self-start sm:self-auto">
              {studioInfo.founderName}
            </span>
          </div>

          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#111117] border border-white/[0.08] hover:border-[#ff4b26]/50 p-6 sm:p-10 transition-all duration-300 relative overflow-hidden w-full box-border"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 w-full">
                <div className="flex items-start sm:items-center gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#ff4b26] to-[#7f1d07] flex items-center justify-center font-heading font-black text-white text-xl sm:text-2xl shadow-[0_0_24px_rgba(255,75,38,0.35)] shrink-0">
                    MA
                  </div>
                  <div>
                    <h4 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {studioInfo.founderName}
                    </h4>
                    <span className="text-xs sm:text-sm font-mono text-[#ff4b26] font-semibold block mt-1">
                      {studioInfo.founderRole}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 block mt-1">
                      {studioInfo.founderFocus}
                    </span>
                  </div>
                </div>

                <div className="max-w-xl text-sm sm:text-base text-neutral-300 leading-relaxed break-words border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-6 lg:pt-0 lg:pl-8">
                  {studioInfo.founderBio}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4 Pillars of Approach */}
        <div className="mb-16 w-full">
          <div className="mb-8">
            <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest block mb-1">
              Méthodologie & Rigueur
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-tight">
              Notre Approche en 4 Piliers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 w-full box-border">
            {STUDIO_APPROACH.map((val, i) => (
              <motion.div
                key={val.number}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-[#111117] border border-white/[0.08] hover:border-white/20 p-6 flex flex-col justify-between transition-colors w-full box-border"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#ff4b26] block mb-4">
                    {val.number}
                  </span>
                  <h4 className="font-heading text-base font-bold text-white mb-2 break-words">
                    {val.title}
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed break-words">
                    {val.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Atelier Direct Contact Banner */}
        <div className="p-6 sm:p-8 md:p-12 bg-gradient-to-r from-[#14141d] to-[#0c0c10] border border-white/[0.1] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 w-full box-border">
          <div className="max-w-xl">
            <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest block mb-2">
              Collaborer Avec Medar Studio
            </span>
            <h4 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 break-words">
              Donnons vie à votre identité visuelle.
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed break-words">
              Marques, entreprises, projets sportifs ou créateurs : parlons de vos objectifs et bâtissons une image moderne, forte et mémorable.
            </p>
          </div>

          <button
            onClick={() => scrollToSection('contact')}
            className="w-full sm:w-auto px-8 py-4 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-3 shrink-0 cursor-pointer shadow-[0_4px_20px_rgba(255,75,38,0.35)]"
          >
            <span>Démarrer un Projet</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 
        =======================================================================
        INTERACTIVE BRIEF & CONTACT SECTION
        =======================================================================
      */}
      <section id="contact" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3">
                Démarrer une Collaboration
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Parlons de Votre Prochaine Œuvre.
              </h2>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-8">
                Nous sélectionnons un nombre restreint de projets par trimestre pour garantir à chaque partenaire l’attention intégrale de nos fondateurs et directeurs artistiques.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/[0.08] font-mono text-xs">
              <div className="flex items-center gap-3 text-neutral-300">
                <MapPin className="w-4 h-4 text-[#ff4b26]" />
                <span>Atelier Paris : 28 Rue d'Hauteville, 75010 Paris</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Mail className="w-4 h-4 text-[#ff4b26]" />
                <a href="mailto:bonjour@medarstudio.fr" className="hover:text-white underline underline-offset-4">
                  bonjour@medarstudio.fr
                </a>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Clock className="w-4 h-4 text-[#ff4b26]" />
                <span>Temps de réponse moyen : Moins de 24 heures</span>
              </div>
            </div>

            <div className="p-4 bg-white/[0.03] border border-white/[0.08] text-xs text-neutral-400">
              <span className="text-white font-semibold block mb-1">Confidentialité Stricte</span>
              Toutes les informations et idées partagées dans ce formulaire sont soumises à un accord de confidentialité implicite d'atelier.
            </div>
          </div>

          {/* Right Lead Capture Form */}
          <div className="lg:col-span-7 bg-[#111117] border border-white/[0.1] p-8 md:p-12">
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-[#ff4b26]/20 border border-[#ff4b26] flex items-center justify-center mx-auto text-[#ff4b26]">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  Brief Transmis à l’Atelier.
                </h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Merci {formData.name}. Nos directeurs de création étudient votre demande et reviendront vers vous sous 24h avec une première esquisse stratégique.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* 1. Project Type Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Prestation Souhaitée
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Visual Identity',
                      'Graphic Design',
                      'Digital Design',
                      'Sports Design',
                      '3D & Creative',
                      'Print Production'
                    ].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, projectType: type })}
                        className={`p-2.5 text-left text-xs border transition-colors ${
                          formData.projectType === type
                            ? 'bg-white text-black border-white font-semibold'
                            : 'bg-black/30 border-white/[0.08] text-neutral-300 hover:border-white/30'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Budget Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Enveloppe Budgétaire
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['25k€ - 50k€', '50k€ - 100k€', '100k€ - 200k€', '> 200k€'].map((range) => (
                      <button
                        type="button"
                        key={range}
                        onClick={() => setFormData({ ...formData, budget: range })}
                        className={`p-2.5 text-center text-xs font-mono border transition-colors ${
                          formData.budget === range
                            ? 'bg-[#ff4b26] text-white border-[#ff4b26]'
                            : 'bg-black/30 border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Votre Nom & Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alexandre Moreau"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Email Professionnel *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alexandre@entreprise.fr"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Entreprise / Marque
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Maison de Haute Joaillerie"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Vision & Contraintes du Projet
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Décrivez vos ambitions artistiques, vos délais souhaités ou vos inspirations..."
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-hover="true"
                  className="w-full py-4 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <>
                      <span>Transmettre le Brief au Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        QUIET FOOTER
        Wordmark, coordinates, legal and back to top
        =======================================================================
      */}
      <footer className="border-t border-white/[0.08] pt-12 pb-28 md:pb-20 px-6 md:px-12 bg-[#09090d]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-xs font-mono text-neutral-500">
          <div className="flex flex-wrap items-center gap-3">
            {/* Secret 5-Clicks Admin Trigger: Completely discreet, no counter display */}
            <span
              onClick={handleSecretFooterClick}
              className="text-white font-bold tracking-tight cursor-default select-none"
              title=""
            >
              {studioInfo.studioName.toUpperCase()}
            </span>
            <span aria-hidden="true">·</span>
            <span>{studioInfo.city}</span>
            <span aria-hidden="true">·</span>
            <span>Tous droits réservés © 2026</span>
          </div>

          {/* Navigation Links with Back to Top grouped cleanly in center */}
          <div className="flex flex-wrap items-center gap-6">
            <a href="#projets" className="hover:text-white transition-colors">Projets</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#qui-sommes-nous" className="hover:text-white transition-colors">Qui Sommes-Nous</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <span aria-hidden="true" className="text-neutral-700 hidden sm:inline">·</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-neutral-300 hover:text-[#ff4b26] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1.5"
            >
              <span>↑ Haut de Page</span>
            </button>
          </div>

          {/* Reserved clearance zone on the right so the floating AI advisor widget never obscures footer items */}
          <div className="hidden lg:block w-48 pointer-events-none" />
        </div>
      </footer>

      {/* Interactive Project Deep-Dive Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNavigate={navigateProject}
      />

      {/* Medar Studio AI Advisor Widget */}
      <AIChat />

      {/* Secret Authentification Modal (Code 010904 masqué) */}
      <SecretAuthModal
        isOpen={isSecretAuthOpen}
        onClose={() => setIsSecretAuthOpen(false)}
        onSuccess={() => {
          setIsSecretAuthOpen(false);
          setIsAdminCMSOpen(true);
        }}
      />

      {/* Full-Featured Live Site Management CMS */}
      <AdminCMSModal
        isOpen={isAdminCMSOpen}
        onClose={() => setIsAdminCMSOpen(false)}
        onLogout={() => setIsAdminCMSOpen(false)}
        projects={projectsList}
        onUpdateProjects={handleUpdateProjects}
        services={servicesList}
        onUpdateServices={handleUpdateServices}
        studioInfo={studioInfo}
        onUpdateStudioInfo={handleUpdateStudioInfo}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
};

// Helper Icon for Arrow Down Right
const ArrowDownRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="7" y1="7" x2="17" y2="17" />
    <polyline points="17 7 17 17 7 17" />
  </svg>
);

export default App;
