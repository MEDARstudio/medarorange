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
  Phone,
  Globe,
  Send,
  Check,
  ChevronDown,
  ShieldCheck,
  Users,
  Instagram
} from 'lucide-react';

import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import AllProjectsView from './components/AllProjectsView';
import ServiceCard from './components/ServiceCard';
import SocialLinks from './components/SocialLinks';
import InitiatePartnership from './components/InitiatePartnership';
import PageTransition from './components/PageTransition';
import AIChat from './components/AIChat';
import SecretAuthModal from './components/SecretAuthModal';
import AdminCMSModal from './components/AdminCMSModal';
import { trackStartProjectClick, trackContactFormView } from './utils/leadAnalytics';
import { CaseStudy, ProjectCategory, PaletteMood, AgencyService, TeamMember, StudioValue, StudioGeneralInfo } from './types';

// Curated Agency Case Studies (9 Studio Projects Ready for Assets)
const PORTFOLIO_PROJECTS: CaseStudy[] = [
  {
    id: 'project-1',
    title: 'Apex Athletic Performance',
    client: 'Apex Global',
    year: '2025',
    category: 'sports-design',
    categoryLabel: 'Sports Design',
    description: 'High-intensity athletic branding, dynamic matchday posters, player art direction, and bespoke kit concepts.',
    media: [],
    imagePromptFallback: '',
    isFeatured: true,
    accentColor: '#38bdf8'
  },
  {
    id: 'project-2',
    title: 'Chrono Precision Horology',
    client: 'Chrono Atelier',
    year: '2025',
    category: 'brand-identity',
    categoryLabel: 'Brand Identity',
    description: 'Luxury horology brand architecture, bespoke editorial typography, and minimalist gold-foil collateral.',
    media: [],
    imagePromptFallback: '',
    isFeatured: true,
    accentColor: '#ff4b26'
  },
  {
    id: 'project-3',
    title: 'Nova Spatial Dimension',
    client: 'Nova Interactive',
    year: '2025',
    category: '3d-webgl',
    categoryLabel: '3D Design',
    description: 'Immersive real-time spatial visuals, abstract geometric compositions, and dynamic 3D digital branding.',
    media: [],
    imagePromptFallback: '',
    isFeatured: true,
    accentColor: '#a855f7'
  },
  {
    id: 'project-4',
    title: 'Velour Haute Couture',
    client: 'Maison Velour',
    year: '2025',
    category: 'visual-design',
    categoryLabel: 'Visual Design',
    description: 'Contemporary fashion editorial art direction, runway lookbook layout, and high-contrast typographic identity.',
    media: [],
    imagePromptFallback: '',
    isFeatured: true,
    accentColor: '#e0a96d'
  },
  {
    id: 'project-5',
    title: 'Zenith Formula GP',
    client: 'Zenith Racing',
    year: '2024',
    category: 'sports-design',
    categoryLabel: 'Sports Design',
    description: 'Motorsport aerodynamic livery design, paddock visual environment, and kinetic digital racing assets.',
    media: [],
    imagePromptFallback: '',
    isFeatured: true,
    accentColor: '#f59e0b'
  },
  {
    id: 'project-6',
    title: 'Lumina Sound Acoustics',
    client: 'Lumina Audio',
    year: '2024',
    category: 'brand-identity',
    categoryLabel: 'Brand Identity',
    description: 'Acoustic waveform identity system, packaging design, and sensory spatial product communication.',
    media: [],
    imagePromptFallback: '',
    isFeatured: true,
    accentColor: '#2ee9a7'
  },
  {
    id: 'project-7',
    title: 'Orbit Global Protocol',
    client: 'Orbit Labs',
    year: '2024',
    category: '3d-webgl',
    categoryLabel: '3D Design',
    description: 'Decentralized digital brand system, motion graphic design tokens, and next-gen interface guidelines.',
    media: [],
    imagePromptFallback: '',
    isFeatured: true,
    accentColor: '#06b6d4'
  },
  {
    id: 'project-8',
    title: 'Kanso Pure Living',
    client: 'Kanso Studio',
    year: '2024',
    category: 'visual-design',
    categoryLabel: 'Visual Design',
    description: 'Architectural lifestyle identity, sustainable tactile packaging, and Japanese-inspired editorial book.',
    media: [],
    imagePromptFallback: '',
    isFeatured: true,
    accentColor: '#ec4899'
  },
  {
    id: 'project-9',
    title: 'Solaris Future Energy',
    client: 'Solaris Collective',
    year: '2024',
    category: 'brand-identity',
    categoryLabel: 'Brand Identity',
    description: 'Clean energy vision identity, editorial infographic systems, and dynamic brand storytelling.',
    media: [],
    imagePromptFallback: '',
    isFeatured: true,
    accentColor: '#eab308'
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
  tagline: 'Digital Agency · Creative Design & Visual Communications',
  officialQuote: 'Medar Studio is a multidisciplinary digital agency dedicated to graphic design, visual identity, sports design, and 3D experiences.',
  officialParagraph: 'Our studio engineers bespoke visual solutions for brands, businesses, sports organizations, and creators — spanning digital experiences to print production, sports design, and 3D. Our approach combines creative ingenuity, mathematical precision, and obsessive attention to detail to transform each idea into an enduring, modern, and memorable visual universe.',
  city: 'Worldwide',
  address: "",
  foundedYear: '2021',
  email: 'medarstudio@gmail.com',
  phone: '+212 698-048499',
  founderName: 'Mohamed Amine Amarir',
  founderRole: 'Studio Founder',
  founderFocus: 'Creative Direction, Studio Leadership, Brand Architecture & 3D Vision',
  founderBio: 'Founder of Medar Studio, Mohamed Amine Amarir guides the studio’s strategic vision and curatorial standard. He established Medar Studio to unite an elite collective of specialized designers, 3D artists, typographers, and creative engineers. Under his leadership, the studio’s multidisciplinary team crafts bespoke visual solutions for brands, corporations, sports organizations, and creators worldwide.',
  founderImage: '',
  instagramHandle: '@medarstudio',
  instagramUrl: 'https://instagram.com/medarstudio',
  facebookUrl: 'https://facebook.com/medarstudio',
  linkedinUrl: 'https://linkedin.com/company/medarstudio',
  xUrl: 'https://x.com/medarstudio',
  tiktokUrl: 'https://tiktok.com/@medarstudio',
  instagramToken: ''
};

// Default Target Budgets (Ultra Accessible for Beginners, Creators, Startups)
const DEFAULT_BUDGET_TIERS: string[] = ['< €100', '€100 - €300', '€300 - €750', '€750+'];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Dynamic Content with LocalStorage Persistence
  const [projectsList, setProjectsList] = useState<CaseStudy[]>(() => {
    try {
      const saved = localStorage.getItem('medar_studio_projects_v2');
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'bonjour@medarstudio.fr' || parsed.email === 'contact@medarstudio.com') {
          parsed.email = 'medarstudio@gmail.com';
        }
        if (parsed.phone === '+33 1 89 71 34 20') {
          parsed.phone = '+212 698-048499';
        }
        if (parsed.address && parsed.address.includes('Hauteville')) {
          parsed.address = '';
          parsed.city = 'Worldwide';
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STUDIO_INFO;
  });

  // Dynamic Budget Tiers Managed via Admin Panel
  const [budgetTiers, setBudgetTiers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('medar_studio_budget_tiers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_BUDGET_TIERS;
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
      localStorage.setItem('medar_studio_projects_v2', JSON.stringify(newProjects));
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable:", e);
    }
  };

  const handleUpdateSingleProjectImage = (projectId: string, imageBase64: string) => {
    const updated = projectsList.map((p) =>
      p.id === projectId ? { ...p, imagePromptFallback: imageBase64 } : p
    );
    setProjectsList(updated);
    if (activeProject && activeProject.id === projectId) {
      setActiveProject({ ...activeProject, imagePromptFallback: imageBase64 });
    }
    try {
      localStorage.setItem('medar_studio_projects_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded:", e);
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

  const handleUpdateBudgetTiers = (newTiers: string[]) => {
    setBudgetTiers(newTiers);
    try {
      localStorage.setItem('medar_studio_budget_tiers', JSON.stringify(newTiers));
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable:", e);
    }
  };

  const handleResetDefaults = () => {
    try {
      localStorage.removeItem('medar_studio_projects');
      localStorage.removeItem('medar_studio_projects_v2');
      localStorage.removeItem('medar_studio_services');
      localStorage.removeItem('medar_studio_general');
      localStorage.removeItem('medar_studio_budget_tiers');
      localStorage.removeItem('medar_studio_media_library');
      localStorage.removeItem('medar_studio_media_library_v2');
    } catch (e) {
      console.warn("Storage unavailable:", e);
    }
    setProjectsList(PORTFOLIO_PROJECTS);
    setServicesList(AGENCY_SERVICES);
    setStudioInfo(DEFAULT_STUDIO_INFO);
    setBudgetTiers(DEFAULT_BUDGET_TIERS);
  };

  // States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<CaseStudy | null>(null);
  const [currentMood, setCurrentMood] = useState<PaletteMood>('vermilion');
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Full-Screen Page Transition from Right to Left with Centered Logo
  const triggerPageTransition = (action?: () => void) => {
    if (isPageTransitioning) return;
    setIsPageTransitioning(true);
    // Midpoint: screen is completely covered by transition curtain
    setTimeout(() => {
      action?.();
    }, 440);
    // Transition curtain completes its sweep to the left
    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 950);
  };

  const handleOpenAllProjects = () => {
    setMobileMenuOpen(false);
    triggerPageTransition(() => {
      setIsAllProjectsOpen(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  };

  const handleCloseAllProjects = () => {
    triggerPageTransition(() => {
      setIsAllProjectsOpen(false);
    });
  };

  const handleNavigateToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (isAllProjectsOpen) {
      triggerPageTransition(() => {
        setIsAllProjectsOpen(false);
        setTimeout(() => {
          scrollToSection(id);
        }, 50);
      });
    } else {
      triggerPageTransition(() => {
        scrollToSection(id);
      });
    }
  };

  // Active Selected Service for Commission
  const [selectedServiceTitle, setSelectedServiceTitle] = useState('Visual Identity');

  // Featured projects shown on the homepage (the 9 projects or user-selected featured ones)
  const featuredProjects = projectsList.filter((p) => p.isFeatured !== false);

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
    if (!activeProject || projectsList.length === 0) return;
    const currentIndex = projectsList.findIndex(p => p.id === activeProject.id);
    if (currentIndex === -1) return;
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
    setSelectedServiceTitle(serviceTitle);
    handleNavigateToSection('contact');
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
          {/* Zone 1: Wordmark */}
          <a 
            href="#" 
            className="flex items-center group shrink-0"
          >
            <span className="font-heading text-lg md:text-xl font-black tracking-tight text-white group-hover:text-[#ff4b26] transition-colors">
              MEDAR STUDIO
            </span>
          </a>

          {/* Zone 2: Clean text links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-9 text-xs font-semibold uppercase tracking-wider text-neutral-300">
            <button 
              onClick={() => handleNavigateToSection('works')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              Works
            </button>
            <button 
              onClick={handleOpenAllProjects}
              className="hover:text-white text-neutral-300 transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              All Projects
            </button>
            <button 
              onClick={() => handleNavigateToSection('services')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavigateToSection('about')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              About
            </button>
            <button 
              onClick={() => handleNavigateToSection('contact')}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                trackStartProjectClick('navbar');
                trackContactFormView('Navbar CTA');
                handleNavigateToSection('contact');
              }}
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
              <button
                onClick={() => handleNavigateToSection('works')}
                className="text-left hover:text-[#ff4b26] transition-colors bg-transparent border-none py-2"
              >
                Works
              </button>
              <button
                onClick={handleOpenAllProjects}
                className="text-left hover:text-[#ff4b26] transition-colors bg-transparent border-none py-2"
              >
                All Projects
              </button>
              <button
                onClick={() => handleNavigateToSection('services')}
                className="text-left hover:text-[#ff4b26] transition-colors bg-transparent border-none py-2"
              >
                Services
              </button>
              <button
                onClick={() => handleNavigateToSection('about')}
                className="text-left hover:text-[#ff4b26] transition-colors bg-transparent border-none py-2"
              >
                About
              </button>
              <button
                onClick={() => handleNavigateToSection('contact')}
                className="text-left hover:text-[#ff4b26] transition-colors bg-transparent border-none py-2"
              >
                Contact
              </button>
            </div>

            <button
              onClick={() => {
                trackStartProjectClick('mobileDrawer');
                trackContactFormView('Mobile Drawer CTA');
                handleNavigateToSection('contact');
              }}
              className="w-full py-4 bg-[#ff4b26] text-white font-bold uppercase tracking-wider text-sm text-center"
            >
              Start a Project
            </button>

            <div className="mt-8 pt-8 border-t border-white/10 text-xs font-mono text-neutral-400 space-y-1">
              <p className="text-white font-semibold">Medar Studio · Worldwide Creative Studio</p>
              <p>medarstudio@gmail.com</p>
              <p>+212 698-048499</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        =======================================================================
        HERO SECTION: High-impact editorial agency manifesto
        =======================================================================
      */}
      <section className="relative min-h-[92svh] flex flex-col justify-center pt-32 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div style={{ y, opacity }} className="w-full">
          {/* Studio Trust Marker / Editorial Tag */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 mb-6 tracking-widest uppercase">
            <span className="text-[#ff4b26] font-semibold">Art Direction & Creative Tech</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Worldwide Creative Studio</span>
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
              onClick={() => handleNavigateToSection('works')}
              data-hover="true"
              className="px-8 py-4 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-3 cursor-pointer"
            >
              <span>Explore Works</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNavigateToSection('services')}
              data-hover="true"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#ff4b26]" />
              <span>Discover Our Services</span>
            </button>
          </div>
        </motion.div>

        {/* Studio Core Pillars & Capabilities */}
        <div className="mt-20 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-neutral-400 font-mono">
          <div>
            <span className="block text-white font-bold text-sm tracking-wide">DIRECTION ARTISTIQUE</span>
            <span className="text-[11px] text-neutral-500">Identités visuelles & chartes fortes</span>
          </div>
          <div>
            <span className="block text-white font-bold text-sm tracking-wide">DESIGN SPORT & CULTURE</span>
            <span className="text-[11px] text-neutral-500">Affiches, athlètes & branding</span>
          </div>
          <div>
            <span className="block text-white font-bold text-sm tracking-wide">CRÉATION 3D & DIGITAL</span>
            <span className="text-[11px] text-neutral-500">Rendus haute précision & visuels web</span>
          </div>
          <div>
            <span className="block text-white font-bold text-sm tracking-wide">ACCOMPAGNEMENT DÉDIÉ</span>
            <span className="text-[11px] text-neutral-500">Écoute, réactivité & livrables soignés</span>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        PORTFOLIO / SHOWCASE SECTION (Featured Projects on Homepage)
        =======================================================================
      */}
      <section id="works" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b26]" />
              <span>Homepage Showcase · {featuredProjects.length} Selected Projects</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white">
              Featured Projects.
            </h2>
          </div>

          <p className="text-sm md:text-base text-neutral-400 max-w-md leading-relaxed">
            Curated selection of our standout case studies across brand identity, sports design, and 3D visual direction.
          </p>
        </div>

        {/* The Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onSelect={(p) => setActiveProject(p)}
            />
          ))}
        </div>

        {/* Discovery Call-to-Action: Opens dedicated All Projects Page */}
        <div className="mt-14 pt-10 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#111117] border border-white/10 p-6 md:p-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#ff4b26] block mb-1">
              Complete Studio Archive
            </span>
            <h3 className="text-xl md:text-2xl font-heading font-bold text-white tracking-tight">
              Explore all {projectsList.length} studio projects
            </h3>
            <p className="text-xs md:text-sm text-neutral-400 font-mono mt-1">
              Browse our full portfolio archive with case studies, art direction, and digital assets.
            </p>
          </div>
          <button
            onClick={handleOpenAllProjects}
            className="px-8 py-4 bg-white hover:bg-[#ff4b26] text-black hover:text-white text-xs font-bold font-mono uppercase tracking-widest transition-all duration-200 flex items-center gap-3 shrink-0 cursor-pointer shadow-xl group"
          >
            <span>Discover All Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 
        =======================================================================
        SERVICES SECTION — CORE CAPABILITIES (Card Grid)
        =======================================================================
      */}
      <section id="services" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
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
        Studio leadership and creative team
        =======================================================================
      */}
      <section id="about" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08] w-full box-border overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16 gap-6 w-full">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b26] shrink-0" />
              <span>Creative Studio · Digital Agency</span>
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
              <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Studio</span>
              <span className="text-white font-bold text-xs sm:text-sm block truncate">MEDAR STUDIO</span>
              <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">Casablanca & International</span>
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
            onClick={() => {
              trackStartProjectClick('aboutBanner');
              trackContactFormView('About Banner CTA');
              scrollToSection('contact');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-3 shrink-0 cursor-pointer shadow-[0_4px_20px_rgba(255,75,38,0.35)]"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 
        =======================================================================
        INTERACTIVE COMMISSION & PARTNERSHIP SECTION (INITIATE A PARTNERSHIP)
        Bespoke Creative Architecture & Direct Hotlines (WhatsApp & Gmail)
        =======================================================================
      */}
      <InitiatePartnership
        studioInfo={studioInfo}
        budgetTiers={budgetTiers}
        selectedService={selectedServiceTitle}
        onSelectService={(service) => setSelectedServiceTitle(service)}
      />

      {/* 
        =======================================================================
        QUIET FOOTER
        Wordmark, coordinates, legal and back to top
        =======================================================================
      */}
      <footer className="w-full bg-[#09090d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 border-t border-white/[0.08] pt-12 pb-24 md:pb-16">
          {/* Top Row: Brand Info & Primary Navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06] text-xs font-mono text-neutral-500 text-center md:text-left">
            {/* Left: Brand & Legal */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
              {/* Secret 5-Clicks Admin Trigger: Completely discreet, no counter display */}
              <span
                onClick={handleSecretFooterClick}
                className="text-white font-bold tracking-tight cursor-default select-none hover:text-[#ff4b26] transition-colors"
                title=""
              >
                {studioInfo.studioName.toUpperCase()}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400">Digital Agency</span>
              <span aria-hidden="true">·</span>
              <span>{studioInfo.city}</span>
              <span aria-hidden="true">·</span>
              <span>All rights reserved © 2026</span>
            </div>

            {/* Center: In-frame Navigation Links (No numbers next to All Projects) */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-neutral-400">
              <button 
                type="button"
                onClick={() => handleNavigateToSection('works')} 
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                Works
              </button>
              <button
                type="button"
                onClick={handleOpenAllProjects}
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                All Projects
              </button>
              <button 
                type="button"
                onClick={() => handleNavigateToSection('services')} 
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                Services
              </button>
              <button 
                type="button"
                onClick={() => handleNavigateToSection('about')} 
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                About
              </button>
              <button 
                type="button"
                onClick={() => handleNavigateToSection('contact')} 
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Bottom Row: Official Social Platforms & Back to Top */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            {/* Social Platforms Dock: Instagram, Facebook, LinkedIn, X, TikTok */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-xs font-mono text-neutral-400">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                Socials:
              </span>
              <SocialLinks studioInfo={studioInfo} variant="footer" />
            </div>

            {/* Right: Back to Top */}
            <div className="flex items-center justify-center md:justify-end">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs font-mono text-neutral-400 hover:text-[#ff4b26] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1.5"
              >
                <span>↑ Back to Top</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Complete Projects Archive View (Dedicated Page/Overlay) */}
      <AllProjectsView
        isOpen={isAllProjectsOpen}
        onClose={handleCloseAllProjects}
        projects={projectsList}
        onSelectProject={(p) => setActiveProject(p)}
        onOpenContact={() => handleNavigateToSection('contact')}
      />

      {/* Interactive Project Deep-Dive Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNavigate={navigateProject}
      />

      {/* Cinematic Right-to-Left Page Transition Curtain with Centered Logo */}
      <PageTransition isTransitioning={isPageTransitioning} />

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
        budgetTiers={budgetTiers}
        onUpdateBudgetTiers={handleUpdateBudgetTiers}
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
