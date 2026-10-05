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

// Curated Agency Case Studies (Clean Starter Slots for Freelance Portfolio)
const PORTFOLIO_PROJECTS: CaseStudy[] = [
  {
    id: 'project-1',
    title: 'Visual Identity & Branding',
    client: 'Freelance Client',
    year: '2025',
    category: 'brand-identity',
    categoryLabel: 'Brand Identity',
    description: 'Bespoke brand architecture, logotype crafting, typography system, and complete visual identity.',
    imagePromptFallback: '',
    accentColor: '#ff4b26',
    gradientTheme: 'from-[#ff4b26]/30 to-[#0c0c10]'
  },
  {
    id: 'project-2',
    title: 'Sports Graphics & Matchday',
    client: 'Sports Project',
    year: '2025',
    category: 'sports-design',
    categoryLabel: 'Sports Design',
    description: 'High-impact matchday announcements, athletic typography, player posters, and visual communication.',
    imagePromptFallback: '',
    accentColor: '#38bdf8',
    gradientTheme: 'from-[#38bdf8]/30 to-[#0c0c10]'
  },
  {
    id: 'project-3',
    title: '3D Visual & Digital Artwork',
    client: '3D Studio',
    year: '2025',
    category: '3d-webgl',
    categoryLabel: '3D Design',
    description: 'Hyper-detailed 3D modeling, studio lighting setup, and photorealistic creative artwork.',
    imagePromptFallback: '',
    accentColor: '#f59e0b',
    gradientTheme: 'from-[#f59e0b]/30 to-[#0c0c10]'
  },
  {
    id: 'project-4',
    title: 'Digital Campaign & Social Posters',
    client: 'Visual Communications',
    year: '2024',
    category: 'visual-design',
    categoryLabel: 'Visual Design',
    description: 'Engaging digital promotional assets, layout designs, and social media art direction.',
    imagePromptFallback: '',
    accentColor: '#2ee9a7',
    gradientTheme: 'from-[#2ee9a7]/30 to-[#0c0c10]'
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
  city: 'Worldwide',
  address: "",
  foundedYear: '2021',
  email: 'medarstudio@gmail.com',
  phone: '+212 698-048499',
  founderName: 'Mohamed Amine Amarir',
  founderRole: 'Studio Founder',
  founderFocus: 'Creative Direction, Studio Leadership, Brand Architecture & 3D Vision',
  founderBio: 'Founder of Medar Studio, Mohamed Amine Amarir guides the studio’s strategic vision and curatorial standard. He established Medar Studio to unite an elite collective of specialized designers, 3D artists, typographers, and creative engineers. Under his leadership, the studio’s multidisciplinary team crafts bespoke visual solutions for brands, corporations, sports organizations, and creators worldwide.',
  founderImage: ''
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
    // Update active form budget if current selection is no longer present
    setFormData((prev) => {
      if (!newTiers.includes(prev.budget) && newTiers.length > 0) {
        return { ...prev, budget: newTiers[Math.min(1, newTiers.length - 1)] };
      }
      return prev;
    });
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
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [activeProject, setActiveProject] = useState<CaseStudy | null>(null);
  const [currentMood, setCurrentMood] = useState<PaletteMood>('vermilion');

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Visual Identity',
    budget: DEFAULT_BUDGET_TIERS[1],
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to determine if a project has real uploaded media (photos or videos)
  const hasUploadedMedia = (p: CaseStudy) => {
    if (p.media && p.media.length > 0) return true;
    if (p.imagePromptFallback && p.imagePromptFallback.trim() !== '') return true;
    if (p.videoUrl && p.videoUrl.trim() !== '') return true;
    return false;
  };

  // Only published projects with actual uploaded media are shown to visitors!
  const publishedProjects = projectsList.filter(hasUploadedMedia);

  // Filter projects dynamically
  const filteredProjects = selectedCategory === 'all'
    ? publishedProjects
    : publishedProjects.filter(p => p.category === selectedCategory);

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
  }, [activeProject, publishedProjects]);

  const navigateProject = (direction: 'next' | 'prev') => {
    if (!activeProject || publishedProjects.length === 0) return;
    const currentIndex = publishedProjects.findIndex(p => p.id === activeProject.id);
    if (currentIndex === -1) return;
    let nextIndex = direction === 'next' 
      ? (currentIndex + 1) % publishedProjects.length
      : (currentIndex - 1 + publishedProjects.length) % publishedProjects.length;
    setActiveProject(publishedProjects[nextIndex]);
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
            {publishedProjects.length > 0 && (
              <button 
                onClick={() => scrollToSection('works')}
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
              >
                Works
              </button>
            )}
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
                ...(publishedProjects.length > 0 ? [{ label: 'Works', id: 'works' }] : []),
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
            <span className="block text-white font-bold tabular-nums text-sm">WORLDWIDE & REMOTE</span>
            <span className="text-[11px] text-neutral-500">Global creative reach</span>
          </div>
          <div>
            <span className="block text-white font-bold tabular-nums text-sm">BESPOKE CODE</span>
            <span className="text-[11px] text-neutral-500">Zero templates, 100% custom</span>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        PORTFOLIO / SHOWCASE SECTION (Only visible to visitors if media exists)
        =======================================================================
      */}
      {publishedProjects.length > 0 && (
        <section id="works" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
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
              { id: 'brand-identity', label: 'Brand Identity' },
              { id: 'sports-design', label: 'Sports Design' },
              { id: '3d-webgl', label: '3D Design' },
              { id: 'visual-design', label: 'Visual Design' }
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
          {filteredProjects.length === 0 ? (
            <div className="py-16 text-center border border-white/[0.06] bg-[#101016]">
              <p className="text-sm font-mono text-neutral-400">
                No published projects in this category yet.
              </p>
            </div>
          ) : (
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
          )}
        </section>
      )}

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
            <div className="min-w-0 flex items-center gap-3">
              {studioInfo.founderImage && (
                <div 
                  className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-neutral-900"
                  style={{ boxShadow: 'none', filter: 'none', backdropFilter: 'none' }}
                >
                  <img
                    src={studioInfo.founderImage}
                    alt={studioInfo.founderName}
                    className="w-full h-full object-cover object-center"
                    style={{ filter: 'none', backdropFilter: 'none', imageRendering: 'auto' }}
                  />
                </div>
              )}
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-wider block mb-0.5">Founder</span>
                <span className="text-white font-bold text-xs sm:text-sm block truncate">{studioInfo.founderName}</span>
                <span className="text-neutral-400 text-[10px] sm:text-[11px] truncate block">{studioInfo.founderRole}</span>
              </div>
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
                  {studioInfo.founderImage ? (
                    <div 
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-white/20 shrink-0 bg-neutral-900"
                      style={{ boxShadow: 'none', filter: 'none', backdropFilter: 'none' }}
                    >
                      <img
                        src={studioInfo.founderImage}
                        alt={studioInfo.founderName}
                        className="w-full h-full object-cover object-center"
                        style={{ filter: 'none', backdropFilter: 'none', imageRendering: 'auto' }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#ff4b26] flex items-center justify-center font-heading font-black text-white text-xl sm:text-2xl border border-white/20 shrink-0"
                      style={{ boxShadow: 'none', filter: 'none', backdropFilter: 'none' }}
                    >
                      {studioInfo.founderName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase() || 'MA'}
                    </div>
                  )}
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
      <section id="contact" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
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
                <Globe className="w-4 h-4 text-[#ff4b26]" />
                <span>Digital Creative Studio · Serving Clients Worldwide</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Mail className="w-4 h-4 text-[#ff4b26]" />
                <a href="mailto:medarstudio@gmail.com" className="hover:text-white underline underline-offset-4">
                  medarstudio@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Phone className="w-4 h-4 text-[#ff4b26]" />
                <a href="tel:+212698048499" className="hover:text-white underline underline-offset-4">
                  +212 698-048499
                </a>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Clock className="w-4 h-4 text-[#ff4b26]" />
                <span>Average response time: Within 12 hours</span>
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
                  Thank you {formData.name}. Our studio creative team is reviewing your brief and will respond within 12 hours with a strategic orientation.
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Target Budget
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Beginner-friendly & scalable pricing
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {budgetTiers.map((range) => (
                      <button
                        type="button"
                        key={range}
                        onClick={() => setFormData({ ...formData, budget: range })}
                        className={`p-2.5 text-center text-xs font-mono border transition-colors cursor-pointer ${
                          formData.budget === range
                            ? 'bg-[#ff4b26] text-white border-[#ff4b26] font-bold shadow-[0_2px_10px_rgba(255,75,38,0.4)]'
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
      <footer className="w-full bg-[#09090d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 border-t border-white/[0.08] pt-12 pb-28 md:pb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-xs font-mono text-neutral-500 text-center md:text-left">
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
              <span>{studioInfo.city}</span>
              <span aria-hidden="true">·</span>
              <span>All rights reserved © 2026</span>
            </div>

            {/* Center: In-frame Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-neutral-400">
              <a href="#works" className="hover:text-white transition-colors">Works</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </nav>

            {/* Right: Back to Top */}
            <div className="flex items-center justify-center md:justify-end">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-neutral-400 hover:text-[#ff4b26] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1.5"
              >
                <span>↑ Back to Top</span>
              </button>
            </div>
          </div>
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
