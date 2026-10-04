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
    client: 'Manufacture V. Geneva',
    year: '2025',
    category: '3d-webgl',
    categoryLabel: 'Haute Horlogerie 3D & WebGL',
    tagline: 'The anatomy of time reinvented through titanium and sapphire shaders.',
    description: 'Creation of an immersive digital flagship and real-time 60 FPS 3D configurator for the worldwide launch of a revolutionary timepiece.',
    metrics: {
      stat: '+185%',
      label: 'Pre-order conversion rate'
    },
    deliverables: ['Art Direction', '3D WebGL Configurator', 'Design System'],
    gradientTheme: 'from-[#ff4b26]/50 via-[#7c1e13]/60 to-[#0c0c10]',
    accentColor: '#ff4b26',
    imagePromptFallback: 'Dark obsidian watch dial exploded in 3D WebGL space',
    award: 'Awwwards Site of the Month',
    detailedContext: {
      challenge: 'Elevating the micromechanical complexity of a complicated watch without adding friction to the purchase journey on mobile and desktop.',
      artDirection: 'Obsidian and sandblasted bronze tones. Monumental sharp-serif typography paired with a frictionless interface.',
      stack: ['Three.js / GLSL', 'React 19', 'Web Audio API', 'Headless Shopify'],
      result: 'Over 420,000 unique visitors during the 48-hour launch and a 42% increase in average order value compared to prior collections.'
    }
  },
  {
    id: 'solaris-kinetik',
    title: 'Solaris Kinetik',
    client: 'Kinetik Architecture',
    year: '2025',
    category: 'brand-identity',
    categoryLabel: 'Identity & Spatial Design',
    tagline: 'Harmonizing zenithal light with living geometric structures.',
    description: 'Institutional web platform and generative visual identity system for an international bioclimatic engineering practice.',
    metrics: {
      stat: '€24M',
      label: 'Tender proposals secured'
    },
    deliverables: ['Brand Identity', 'Digital Platform', 'Cinematic Motion'],
    gradientTheme: 'from-[#f59e0b]/50 via-[#ea580c]/60 to-[#0c0c10]',
    accentColor: '#f59e0b',
    imagePromptFallback: 'Solar warm architectural pavilion dusk photography',
    award: 'FWA of the Day',
    detailedContext: {
      challenge: 'Translating the impermanence of natural daylight into an interactive digital language evolving with the visitor’s latitude.',
      artDirection: 'Inspired by Atacama twilights: warm amber gradients, radical typographic contrast, and asymmetrical layouts.',
      stack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Sanity CMS'],
      result: '240% increase in institutional partnership inquiries and recognition at the Venice and Copenhagen architecture biennales.'
    }
  },
  {
    id: 'elysium-studio',
    title: 'Elysium Studio',
    client: 'Maison Elysium Paris',
    year: '2024',
    category: 'ecommerce-luxe',
    categoryLabel: 'Haute Couture E-Commerce',
    tagline: 'The tactile elegance of haute couture silk translated into pixel flows.',
    description: 'Complete digital commerce redesign for the Parisian fashion house, uniting swift performance with visual poetry.',
    metrics: {
      stat: '+210%',
      label: 'Average session duration'
    },
    deliverables: ['Experience Audit', 'Editorial Direction', 'Headless Development'],
    gradientTheme: 'from-[#e0a96d]/40 via-[#5b3b19]/60 to-[#0c0c10]',
    accentColor: '#e0a96d',
    imagePromptFallback: 'Haute couture editorial silk drapery and Parisian typography',
    award: 'Art Directors Club Selection',
    detailedContext: {
      challenge: 'Retaining the contemplative nobility of a runway show while maintaining sub-0.8s page load speeds worldwide.',
      artDirection: 'Deconstructed broadsheet compositions, velvety photographic grain, and neoclassical typography.',
      stack: ['Shopify Plus Headless', 'Vite', 'Turborepo', 'GSAP'],
      result: '180% surge in international sales and doubling of private bespoke client orders.'
    }
  },
  {
    id: 'chroma-odyssey',
    title: 'Chroma Odyssey',
    client: 'Contemporary Art Foundation',
    year: '2024',
    category: 'generative-art',
    categoryLabel: 'Generative Art & Spatial Installation',
    tagline: 'An infinite digital canvas sculpted by audience presence and motion.',
    description: 'Interactive curatorial installation enabling the public to sculpt digital artworks through sound waves and gestural interaction.',
    metrics: {
      stat: '180K+',
      label: 'Generative interactions recorded'
    },
    deliverables: ['Shader R&D', 'Web & In-Situ Installation', 'Sound Design'],
    gradientTheme: 'from-[#2ee9a7]/40 via-[#0f766e]/60 to-[#0c0c10]',
    accentColor: '#2ee9a7',
    imagePromptFallback: 'Generative chromatic wave patterns in museum dark room',
    award: 'Red Dot Best of the Best',
    detailedContext: {
      challenge: 'Delivering fluid, captivating generative visuals running effortlessly on 12-meter 8K museum touchscreens as well as mobile devices.',
      artDirection: 'Exploring non-Newtonian fluid refraction: kinetic mint, deep indigo, and harmonic pulsations.',
      stack: ['WebGL 2.0', 'Custom Compute Shaders', 'WebSockets', 'Canvas API'],
      result: 'The installation toured 6 European contemporary art museums and was named Interactive Experience of the Year.'
    }
  },
  {
    id: 'nexus-system',
    title: 'Nexus Intelligence',
    client: 'Nexus Labs Berlin',
    year: '2025',
    category: '3d-webgl',
    categoryLabel: 'Spatial UI & AI Visualization',
    tagline: 'Transforming complex neural model orchestration into a tactile, intuitive interface.',
    description: 'Real-time control dashboard and visual portal designed for an enterprise decentralized artificial intelligence suite.',
    metrics: {
      stat: '-40%',
      label: 'Analyst decision-making time'
    },
    deliverables: ['Systemic UX / UI', 'Data Visualization', 'High-Perf Front-End'],
    gradientTheme: 'from-[#38bdf8]/40 via-[#1e3a8a]/60 to-[#0c0c10]',
    accentColor: '#38bdf8',
    award: 'Awwwards Developer Award',
    detailedContext: {
      challenge: 'Representing billions of machine-learning parameters in an intuitive, ergonomic, and sensory visual format.',
      artDirection: 'Ultra-precise engineering grid, luminescent cyan accents, and monospace typography calibrated to golden ratios.',
      stack: ['React 19', 'D3.js', 'WebGL', 'Tailwind CSS'],
      result: 'Adopted by more than 45,000 engineers globally with a €30M Series A round closed.'
    }
  },
  {
    id: 'valence-editions',
    title: 'Valence Editions',
    client: 'Valence Publishing New York',
    year: '2024',
    category: 'brand-identity',
    categoryLabel: 'Editorial Platform & Typography',
    tagline: 'The craft of rare books reincarnated in a sculptural digital library.',
    description: 'Design of a digital reading sanctuary and comprehensive catalog for numbered art publications.',
    metrics: {
      stat: '100%',
      label: 'Limited editions sold out in 12h'
    },
    deliverables: ['Custom Typography', 'Editorial Direction', 'E-Commerce'],
    gradientTheme: 'from-[#e2e8f0]/30 via-[#475569]/50 to-[#0c0c10]',
    accentColor: '#ffffff',
    detailedContext: {
      challenge: 'Crafting a virtual browsing sensation that honors the tactile weight of paper and typographic ink textures.',
      artDirection: 'High-contrast monochrome inspired by 20th-century artisan printing presses.',
      stack: ['Next.js', 'Canvas Paper Simulator', 'Shopify Plus'],
      result: 'All numbered artist editions were acquired within 12 hours during the opening preview.'
    }
  }
];

// Agency Services Data - Selling prestations as cards
const AGENCY_SERVICES: AgencyService[] = [
  {
    id: 'visual-identity',
    number: '01',
    title: 'Visual Identity',
    scope: ['Logo', 'Colors', 'Typography', 'Brand System'],
    description: 'Creation of timeless, unforgettable brand identities. We define your complete visual grammar to command a strong and distinct presence across all markets.',
    deliverables: [
      'Primary logotypes, signatures & vector monograms',
      'Exclusive chromatic system & digital/print color profiles',
      'Hierarchical typographic system & commercial licenses',
      'Comprehensive Brand Guidelines & Design System'
    ],
    tag: 'Brand Foundation',
    accent: '#ff4b26'
  },
  {
    id: 'graphic-design',
    number: '02',
    title: 'Graphic Design',
    scope: ['Posters', 'Flyers', 'Brochures', 'Packaging', 'Advertising'],
    description: 'High-precision editorial and promotional design. From monumental display posters to luxury packaging, we engineer tactile graphic objects that instantly captivate.',
    deliverables: [
      'Large-format posters & cultural/corporate displays',
      'Commercial brochures, press kits & editorial booklets',
      'Product packaging, labels & luxury gift boxes',
      'High-impact print advertising campaigns'
    ],
    tag: 'Graphic Impact & Print',
    accent: '#e0a96d'
  },
  {
    id: 'digital-design',
    number: '03',
    title: 'Digital Design',
    scope: ['Social Media', 'Campaigns', 'Web Visuals', 'Banners'],
    description: 'Creation of high-converting digital visual assets. We engage audiences across all digital channels with designs that convert attention into brand value.',
    deliverables: [
      'Social media art direction (Instagram, LinkedIn, X)',
      'Multi-format digital campaign rollout kits',
      'High-CTR digital advertising banners',
      'Hero visuals, landing page assets & premium newsletters'
    ],
    tag: 'Digital Strategy',
    accent: '#38bdf8'
  },
  {
    id: 'sports-design',
    number: '04',
    title: 'Sports Design',
    scope: ['Football Graphics', 'Matchday', 'Kits', 'Social Campaigns'],
    description: 'Elite athletic and sports design for professional clubs, brands, and athletes. We channel raw competitive intensity into vibrant, kinetic visuals.',
    deliverables: [
      'Matchday posters, pre-game compositions & starting lineups',
      'Official & conceptual football kit design',
      'Transfer announcement campaigns & ticketing graphics',
      'Stadium visual environmental graphics & social assets'
    ],
    tag: 'Athletic & Football Culture',
    accent: '#2ee9a7'
  },
  {
    id: '3d-creative',
    number: '05',
    title: '3D & Creative',
    scope: ['3D Products', 'Jewelry', 'Objects', 'Promotional Visuals'],
    description: 'Hyper-realistic 3D modeling and rendering of physical objects and products. Elevating timepieces, precious jewelry, and luxury concepts before physical production.',
    deliverables: [
      'Photorealistic 3D product & packaging renders',
      'Fine jewelry modeling: precious metals, gemstones & diamonds',
      'Volumetric lighting simulations & studio atmospheres',
      '3D promotional animations & dynamic packshots'
    ],
    tag: 'CGI & 3D Immersion',
    accent: '#a855f7'
  },
  {
    id: 'print-production',
    number: '06',
    title: 'Print Production',
    scope: ['Professional Prepress & Print Preparation'],
    description: 'Flawless prepress technical expertise. We guarantee faithful color reproduction, ink calibration, and luxury finishes at your printing facility without surprises.',
    deliverables: [
      'Certified prepress files complying with ISO print standards (PDF/X)',
      'CMYK color separation & Pantone spot-color management',
      'Selective varnishes, hot foil stamping & embossing calibration',
      'Bleed verification, crop mark inspection & printer proof oversight'
    ],
    tag: 'Prepress High Precision',
    accent: '#ffffff'
  }
];

// Founder Profile & Approach for About Section
const STUDIO_FOUNDER: TeamMember = {
  name: 'Mohamed Amine Amarir',
  role: 'Founder & Studio Director',
  focus: 'Studio Direction, Strategic Vision & Brand Architecture',
  bio: 'Founder of Medar Studio, Mohamed Amine Amarir guides the studio’s strategic vision and curatorial standard. He established Medar Studio to unite an elite collective of specialized designers, 3D artists, typographers, and creative engineers. Under his leadership, the studio’s multidisciplinary team crafts bespoke visual solutions for brands, corporations, sports organizations, and creators worldwide.',
  tag: 'Founder & Studio Leadership'
};

// Core Approach Pillars derived from official manifesto
const STUDIO_APPROACH: StudioValue[] = [
  {
    number: '01',
    title: 'Bespoke Solutions',
    description: 'Custom visual systems engineered for forward-thinking brands, companies, sports franchises, and creators — completely free from generic templates.'
  },
  {
    number: '02',
    title: 'From Digital to Print',
    description: 'Seamless mastery across the entire creative spectrum, from high-converting digital campaigns to certified luxury print production.'
  },
  {
    number: '03',
    title: 'Sports Design & 3D',
    description: 'A signature specialization fusing the raw kinetic energy of athletic matchdays with photorealistic 3D spatial craft.'
  },
  {
    number: '04',
    title: 'Precision & Memorability',
    description: 'Uncompromising attention to typography, proportion, and finishing to deliver timeless, high-impact brand equity.'
  }
];

// Default Studio General Info
const DEFAULT_STUDIO_INFO: StudioGeneralInfo = {
  studioName: 'Medar Studio',
  tagline: 'Creative Design & Visual Communications Studio',
  officialQuote: 'Medar Studio is a multidisciplinary creative design studio founded by Mohamed Amine Amarir, dedicated to graphic design and visual communications.',
  officialParagraph: 'Our studio engineers bespoke visual solutions for brands, businesses, sports organizations, and creators — spanning digital experiences to print production, sports design, and 3D. Our approach combines creative ingenuity, mathematical precision, and obsessive attention to detail to transform each idea into an enduring, modern, and memorable visual universe.',
  city: 'Paris 10th District',
  address: "28 Hauteville Street, 75010 Paris",
  foundedYear: '2021',
  email: 'contact@medarstudio.com',
  phone: '+33 1 89 71 34 20',
  founderName: 'Mohamed Amine Amarir',
  founderRole: 'Studio Founder',
  founderFocus: 'Creative Direction, Studio Leadership, Brand Architecture & 3D Vision',
  founderBio: 'Founder of Medar Studio, Mohamed Amine Amarir guides the studio’s strategic vision and curatorial standard. He established Medar Studio to unite an elite collective of specialized designers, 3D artists, typographers, and creative engineers. Under his leadership, the studio’s multidisciplinary team crafts bespoke visual solutions for brands, corporations, sports organizations, and creators worldwide.'
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
              onClick={() => scrollToSection('works')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              Works
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              About
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
              Start a Project
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
              {[
                { label: 'Works', id: 'works' },
                { label: 'Services', id: 'services' },
                { label: 'About', id: 'about' },
                { label: 'Contact', id: 'contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left hover:text-[#ff4b26] transition-colors bg-transparent border-none py-2"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollToSection('contact')}
              className="w-full py-4 bg-[#ff4b26] text-white font-bold uppercase tracking-wider text-sm text-center"
            >
              Start a Project
            </button>

            <div className="mt-8 pt-8 border-t border-white/10 text-xs font-mono text-neutral-400 space-y-1">
              <p>Medar Studio Paris · 28 Hauteville Street</p>
              <p>contact@medarstudio.com</p>
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
            <span className="text-[#ff4b26] font-semibold">Art Direction & Creative Tech</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Studio Founded in Paris</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="tabular-nums">Booking Q2 2026</span>
          </div>

          {/* Hero Main Headline with Balanced Wrap */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] max-w-5xl mb-8">
            We sculpt the digital future of{' '}
            <GradientText 
              text="visionary brands." 
              variant={currentMood === 'solaris' ? 'gold' : currentMood === 'kinetic-mint' ? 'silver' : 'vermilion'}
            />
          </h1>

          {/* Value proposition paragraph */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-light max-w-3xl leading-relaxed mb-12">
            Medar Studio fuses high aesthetic discipline with real-time 3D WebGL architectures. We engineer timeless visual identities and extraordinary digital platforms that translate raw emotion into enduring brand equity.
          </p>

          {/* Hero Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => scrollToSection('works')}
              data-hover="true"
              className="px-8 py-4 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-3"
            >
              <span>Explore Works</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('services')}
              data-hover="true"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-3"
            >
              <Sparkles className="w-4 h-4 text-[#ff4b26]" />
              <span>Discover Our Services</span>
            </button>
          </div>
        </motion.div>

        {/* Studio Editorial Ticker / Institutional References */}
        <div className="mt-20 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-neutral-400 font-mono">
          <div>
            <span className="block text-white font-bold tabular-nums text-sm">14 MAJOR AWARDS</span>
            <span className="text-[11px] text-neutral-500">Awwwards, FWA, Red Dot</span>
          </div>
          <div>
            <span className="block text-white font-bold tabular-nums text-sm">+185% CONVERSION</span>
            <span className="text-[11px] text-neutral-500">Average client lift</span>
          </div>
          <div>
            <span className="block text-white font-bold tabular-nums text-sm">PARIS & GLOBAL</span>
            <span className="text-[11px] text-neutral-500">International reach</span>
          </div>
          <div>
            <span className="block text-white font-bold tabular-nums text-sm">BESPOKE CODE</span>
            <span className="text-[11px] text-neutral-500">Zero templates, 100% custom</span>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        PORTFOLIO / SHOWCASE SECTION
        =======================================================================
      */}
      <section id="works" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b26]" />
              <span>Selected Archives · 4:5 Post Format</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white">
              Digital Works & Case Studies.
            </h2>
          </div>

          <p className="text-sm md:text-base text-neutral-400 max-w-md leading-relaxed">
            Signature artworks and visual deliverables calibrated to the 4:5 ratio for digital and editorial showcase, uniting artistic distinction and technical precision.
          </p>
        </div>

        {/* Filter Bar (Interactive Segmented Buttons) */}
        <div className="flex flex-wrap items-center gap-2 mb-12 p-1.5 bg-[#121218] border border-white/[0.08] w-fit">
          {[
            { id: 'all', label: 'All Works' },
            { id: '3d-webgl', label: '3D WebGL & Shaders' },
            { id: 'brand-identity', label: 'Brand Identity' },
            { id: 'ecommerce-luxe', label: 'Luxury E-Commerce' },
            { id: 'generative-art', label: 'Generative Art' }
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
        SERVICES SECTION — CORE CAPABILITIES (Card Grid)
        =======================================================================
      */}
      <section id="services" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b26]" />
              <span>Core Capabilities · What We Do</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white max-w-2xl">
              SERVICES — Engineering Visual Impact.
            </h2>
          </div>
          <p className="text-sm md:text-base text-neutral-400 max-w-md leading-relaxed">
            Each service is engineered as a direct catalyst for brand equity. From bespoke visual identities to high-intensity matchday sports design and photorealistic 3D, discover our 6 core disciplines.
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
        ABOUT SECTION — MEDAR STUDIO COLLECTIVE
        Founded by Mohamed Amine Amarir · Studio leadership and creative team
        =======================================================================
      */}
      <section id="about" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08] w-full box-border overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16 gap-6 w-full">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b26] shrink-0" />
              <span>Creative Studio · Founded by {studioInfo.founderName}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white break-words">
              ABOUT MEDAR STUDIO
            </h2>
          </div>
          <p className="text-sm md:text-base text-neutral-400 max-w-md leading-relaxed break-words">
            A multidisciplinary creative studio dedicated to graphic design and visual communications, blending creative intuition with mathematical precision.
          </p>
        </div>

        {/* Narrative Manifest Card with User's Official Paragraph */}
        <div className="relative bg-[#111117] border border-white/[0.1] p-6 sm:p-8 md:p-12 mb-16 overflow-hidden w-full box-border">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff4b26]/10 blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl w-full">
            <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest block mb-4">
              Studio Manifesto & Official Profile
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
              <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Founder</span>
              <span className="text-white font-bold text-xs sm:text-sm block truncate">{studioInfo.founderName}</span>
              <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">{studioInfo.founderRole}</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Discipline</span>
              <span className="text-white font-bold text-xs sm:text-sm block truncate">Graphic Design</span>
              <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">Visual Communication</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Expertise</span>
              <span className="text-white font-bold text-xs sm:text-sm block truncate">Digital & Print</span>
              <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">Sports Design & 3D</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Approach</span>
              <span className="text-white font-bold text-xs sm:text-sm block truncate">100% Bespoke</span>
              <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">Precision & Detail</span>
            </div>
          </div>
        </div>

        {/* The Founder Card Spotlight */}
        <div className="mb-20 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest block mb-1">
                Studio Leadership & Vision
              </span>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-tight">
                The Founder
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
              Methodology & Precision
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-tight">
              Our Core 4 Pillars
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

        {/* Studio Direct Contact Banner */}
        <div className="p-6 sm:p-8 md:p-12 bg-gradient-to-r from-[#14141d] to-[#0c0c10] border border-white/[0.1] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 w-full box-border">
          <div className="max-w-xl">
            <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest block mb-2">
              Collaborate With Medar Studio
            </span>
            <h4 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 break-words">
              Let’s bring your visual identity to life.
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed break-words">
              Brands, corporations, sports projects, and creators: let’s align on your objectives and engineer a modern, enduring visual universe.
            </p>
          </div>

          <button
            onClick={() => scrollToSection('contact')}
            className="w-full sm:w-auto px-8 py-4 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-3 shrink-0 cursor-pointer shadow-[0_4px_20px_rgba(255,75,38,0.35)]"
          >
            <span>Start a Project</span>
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
                Initiate a Partnership
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Let’s Discuss Your Next Commission.
              </h2>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-8">
                We take on a curated number of commissions each quarter to guarantee that every client receives the undivided attention of our studio directors and specialist creative team.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/[0.08] font-mono text-xs">
              <div className="flex items-center gap-3 text-neutral-300">
                <MapPin className="w-4 h-4 text-[#ff4b26]" />
                <span>Paris Studio: 28 Hauteville Street, 75010 Paris</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Mail className="w-4 h-4 text-[#ff4b26]" />
                <a href="mailto:contact@medarstudio.com" className="hover:text-white underline underline-offset-4">
                  contact@medarstudio.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Clock className="w-4 h-4 text-[#ff4b26]" />
                <span>Average response time: Within 24 hours</span>
              </div>
            </div>

            <div className="p-4 bg-white/[0.03] border border-white/[0.08] text-xs text-neutral-400">
              <span className="text-white font-semibold block mb-1">Strict Confidentiality</span>
              All project briefs, intellectual property, and inquiries submitted through this form are governed by our studio non-disclosure standard.
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
                  Brief Received by Studio.
                </h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you {formData.name}. Our studio creative team is reviewing your brief and will respond within 24 hours with a strategic orientation.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* 1. Project Type Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Requested Capability
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
                    Target Budget
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alexander Vance"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alexander@company.com"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Fine Watchmaking House or Athletic Brand"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Project Scope & Ambition
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your creative ambitions, key deliverables, target schedule, or references..."
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
                    <span>Transmitting brief...</span>
                  ) : (
                    <>
                      <span>Submit Brief to Studio</span>
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
            <span>All rights reserved © 2026</span>
          </div>

          {/* Navigation Links with Back to Top grouped cleanly in center */}
          <div className="flex flex-wrap items-center gap-6">
            <a href="#works" className="hover:text-white transition-colors">Works</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <span aria-hidden="true" className="text-neutral-700 hidden sm:inline">·</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-neutral-300 hover:text-[#ff4b26] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1.5"
            >
              <span>↑ Back to Top</span>
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

      {/* Secret Authentication Modal (Masked PIN 010904) */}
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
