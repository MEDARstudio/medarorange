/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  Check, 
  Copy, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Send,
  Layers,
  Palette,
  Trophy,
  Box,
  Monitor,
  Flame,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  FileCheck2,
  Compass,
  Sliders,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { StudioGeneralInfo } from '../types';
import { GmailIcon, WhatsAppIcon } from './SocialLinks';
import { 
  trackContactFormView, 
  trackEmailDirectClick, 
  trackWhatsAppDirectClick, 
  trackFormSubmit, 
  trackCopyBrief 
} from '../utils/leadAnalytics';

interface InitiatePartnershipProps {
  studioInfo: StudioGeneralInfo;
  budgetTiers: string[];
  selectedService?: string;
  onSelectService?: (service: string) => void;
}

interface CommissionFormState {
  name: string;
  email: string;
  phoneWhatsapp: string;
  company: string;
  discipline: string;
  deliverables: string[];
  budget: string;
  timeline: string;
  notes: string;
}

interface DisciplineItem {
  id: string;
  name: string;
  code: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  deliverablesSample: string[];
}

const DISCIPLINES: DisciplineItem[] = [
  {
    id: 'Visual Identity',
    name: 'Visual Identity & Branding',
    code: '01',
    subtitle: 'Brand Systems & Typographic DNA',
    description: 'Logo systems, dynamic guidelines, typographic grid architecture & stationery collateral.',
    icon: Palette,
    accentColor: '#ff4b26',
    deliverablesSample: ['Brand Identity Book', 'Primary Logo & Symbols', 'Typography Hierarchy', 'Packaging Collateral']
  },
  {
    id: 'Sports Design',
    name: 'Sports Design & Athletes',
    code: '02',
    subtitle: 'Athletic High-Voltage Aesthetics',
    description: 'Matchday posters, athlete art direction, stadium key visuals & team apparel kit concepts.',
    icon: Trophy,
    accentColor: '#ff6239',
    deliverablesSample: ['Matchday Visual System', 'Athlete Portrait Art', 'Kit / Jersey Concepts', 'Franchise Identity']
  },
  {
    id: '3D & Creative',
    name: '3D Direction & Spatial CGI',
    code: '03',
    subtitle: 'Hyper-detailed CGI & Product Physics',
    description: 'Spatial CGI renderings, textured product staging, geometric compositions & surreal lighting.',
    icon: Box,
    accentColor: '#ff7e4f',
    deliverablesSample: ['CGI Hero Stills (4K)', 'Packaging 3D Render', 'Material Lighting Rig', 'Loop Animations']
  },
  {
    id: 'Digital Design',
    name: 'Digital Platforms & Web UI',
    code: '04',
    subtitle: 'Modern Web Experiences & Micro-Interactions',
    description: 'Avant-garde digital presence, interactive web experiences, luxury design systems & layouts.',
    icon: Monitor,
    accentColor: '#ff4b26',
    deliverablesSample: ['Full Web Experience UI', 'Design System Library', 'Micro-interactions Map', 'Mobile Responsive Spec']
  },
  {
    id: 'Graphic Design',
    name: 'Graphic Design & Print Art',
    code: '05',
    subtitle: 'High-Fashion Editorial & Hardcopy Print',
    description: 'Editorial lookbooks, large format exhibition prints, luxury packaging & vinyl gatefolds.',
    icon: Layers,
    accentColor: '#ff6b3d',
    deliverablesSample: ['Hardcover Lookbook', 'Large Exhibition Poster', 'Foil & Embossed Print', 'Merchandise Line']
  },
  {
    id: 'Studio Retainer',
    name: 'Studio Retainer & Art Advisory',
    code: '06',
    subtitle: 'Embedded Creative Leadership',
    description: 'Dedicated monthly creative sprints, brand evolution, art direction & multi-campaign supervision.',
    icon: Flame,
    accentColor: '#ff370f',
    deliverablesSample: ['Priority Studio Queue', 'Weekly Art Direction', 'Multi-channel Assets', 'Strategic Advisory']
  }
];

const DELIVERABLE_POOL = [
  { id: 'Brand Guidelines', label: 'Brand Guidelines (PDF & System)', cat: 'Branding' },
  { id: 'Primary Logo & Wordmarks', label: 'Primary Logo & Vector Suite', cat: 'Branding' },
  { id: '3D CGI Stills / Assets', label: '3D CGI Stills / Rendered Assets', cat: '3D' },
  { id: 'Matchday / Sports Posters', label: 'Matchday / Sports Key Visuals', cat: 'Sports' },
  { id: 'Social Media Architecture', label: 'Social Media Kit & Motion Templates', cat: 'Digital' },
  { id: 'Digital Web UI/UX', label: 'Full Interactive Web Experience', cat: 'Digital' },
  { id: 'Physical Packaging', label: 'Custom Luxury Packaging Die-cuts', cat: 'Print' },
  { id: 'Motion & Micro-animations', label: 'Dynamic Motion / Kinetic Typography', cat: 'Motion' },
  { id: 'Editorial Lookbook', label: 'High-end Editorial Catalog / Print', cat: 'Print' }
];

const TIMELINE_OPTIONS = [
  { id: 'Express (1 - 2 Weeks)', label: 'Express Sprint', time: '1 - 2 Semaines', badge: 'Fast Track' },
  { id: 'Standard (3 - 5 Weeks)', label: 'Cycle Standard', time: '3 - 5 Semaines', badge: 'Recommandé' },
  { id: 'Flexible / Q3 Planning', label: 'Projet Stratégique', time: 'Flexible / 6+ Sem.', badge: 'Complet' }
];

export const InitiatePartnership: React.FC<InitiatePartnershipProps> = ({
  studioInfo,
  budgetTiers,
  selectedService
}) => {
  const rawPhone = studioInfo.phone || '+212 698-048499';
  const cleanPhoneForWa = rawPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(
    "Hello Medar Studio, I would like to discuss a project commission."
  )}`;

  // Form State
  const [formState, setFormState] = useState<CommissionFormState>({
    name: '',
    email: '',
    phoneWhatsapp: '',
    company: '',
    discipline: selectedService || 'Visual Identity',
    deliverables: ['Brand Guidelines', 'Primary Logo & Wordmarks'],
    budget: budgetTiers[1] || budgetTiers[0] || '€100 - €300',
    timeline: 'Standard (3 - 5 Weeks)',
    notes: ''
  });

  // Interactive Form Navigation State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Interactive Live Hologram Tilt effect state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const formMatrixRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);

  // Sync if selectedService changes from exterior and jump to form
  useEffect(() => {
    if (selectedService) {
      setFormState((prev) => ({ ...prev, discipline: selectedService }));
      setIsFormExpanded(true);
      setCurrentStep(1);
    }
  }, [selectedService]);

  // Listen to open_brief_form trigger from CTA buttons ('Start a Project')
  useEffect(() => {
    const handleOpenBrief = () => {
      setIsFormExpanded(true);
      setCurrentStep(1);
    };
    window.addEventListener('open_brief_form', handleOpenBrief);
    return () => window.removeEventListener('open_brief_form', handleOpenBrief);
  }, []);

  // Track when contact form comes into view
  useEffect(() => {
    if (!contactSectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackContactFormView('In-View Scroll');
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(contactSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Mouse hover movement for the card glow effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formMatrixRef.current) return;
    const rect = formMatrixRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    trackCopyBrief();
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleDeliverable = (tag: string) => {
    setFormState((prev) => {
      const exists = prev.deliverables.includes(tag);
      return {
        ...prev,
        deliverables: exists
          ? prev.deliverables.filter((t) => t !== tag)
          : [...prev.deliverables, tag]
      };
    });
  };

  // Completion calculation
  const getStepProgress = () => {
    let score = 0;
    if (formState.discipline) score += 25;
    if (formState.deliverables.length > 0) score += 25;
    if (formState.budget && formState.timeline) score += 25;
    if (formState.name.trim() && formState.email.trim()) score += 25;
    return score;
  };

  const isStepValid = (step: number) => {
    if (step === 1) return Boolean(formState.discipline);
    if (step === 2) return formState.deliverables.length > 0;
    if (step === 3) return Boolean(formState.budget && formState.timeline);
    if (step === 4) return Boolean(formState.name.trim() && formState.email.trim());
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim()) {
      setCurrentStep(4);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const endpoint = studioInfo.formspreeEndpoint || 'https://formspree.io/f/xnpjpvaw';

    const payload = {
      name: formState.name,
      email: formState.email,
      phoneWhatsapp: formState.phoneWhatsapp || 'Non renseigné',
      company: formState.company || 'Particulier / Non spécifié',
      discipline: formState.discipline,
      deliverables: formState.deliverables.length > 0 ? formState.deliverables.join(', ') : 'À définir ensemble',
      budget: formState.budget,
      timeline: formState.timeline,
      message: formState.notes || 'Aucune note additionnelle',
      _replyto: formState.email,
      _subject: `[Medar Studio] Nouvelle demande de commission — ${formState.name} (${formState.discipline})`
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        trackFormSubmit(formState.discipline, formState.name);
        setIsSubmitted(true);
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMsg =
          errorData?.error ||
          (errorData?.errors && errorData.errors.map((item: any) => item.message).join(', ')) ||
          'Erreur lors de l’envoi. Veuillez réessayer ou utiliser l’option WhatsApp / Gmail.';
        setSubmitError(errorMsg);
      }
    } catch (err: any) {
      console.error('Formspree dispatch error:', err);
      setSubmitError('Erreur de transmission réseau. Vous pouvez également nous contacter directement via WhatsApp ou Gmail.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateEmailBody = () => {
    return `NEW COMMISSION INQUIRY — MEDAR STUDIO\n` +
      `========================================\n\n` +
      `CLIENT CONTACT:\n` +
      `• Name: ${formState.name || 'Not specified'}\n` +
      `• Email: ${formState.email || 'Not specified'}\n` +
      `• Phone/WhatsApp: ${formState.phoneWhatsapp || 'Not specified'}\n` +
      `• Company / Brand: ${formState.company || 'Private'}\n\n` +
      `PROJECT SPECIFICATIONS:\n` +
      `• Primary Discipline: ${formState.discipline}\n` +
      `• Selected Deliverables: ${formState.deliverables.join(', ') || 'To define together'}\n` +
      `• Budget Bracket: ${formState.budget}\n` +
      `• Timeline Target: ${formState.timeline}\n\n` +
      `BRIEF & CREATIVE AMBITION:\n` +
      `${formState.notes || 'Looking forward to discussing project details.'}\n\n` +
      `----------------------------------------\n` +
      `Transmitted from Medar Studio Official Digital Portal`;
  };

  const sendViaGmailWebDirect = () => {
    trackEmailDirectClick('gmail_web', formState.name);
    const subject = `[Project Commission] ${formState.discipline} — ${formState.name || 'Client'}`;
    const body = generateEmailBody();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(studioInfo.email || 'medarstudio@gmail.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  const sendViaWhatsAppDirect = () => {
    trackWhatsAppDirectClick(formState.name);
    const text = `*NEW COMMISSION INQUIRY — MEDAR STUDIO*\n\n` +
      `*Client:* ${formState.name || 'Inquirer'}\n` +
      `*Email:* ${formState.email || 'N/A'}\n` +
      `*Phone/WA:* ${formState.phoneWhatsapp || 'N/A'}\n` +
      `*Company:* ${formState.company || 'Private'}\n` +
      `*Discipline:* ${formState.discipline}\n` +
      `*Deliverables:* ${formState.deliverables.join(', ') || 'To be defined'}\n` +
      `*Target Budget:* ${formState.budget}\n` +
      `*Timeline:* ${formState.timeline}\n` +
      `*Notes:* ${formState.notes || 'Looking forward to discussing.'}`;

    window.open(`https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const activeDisciplineObj = DISCIPLINES.find((d) => d.id === formState.discipline) || DISCIPLINES[0];

  return (
    <section 
      id="contact" 
      ref={contactSectionRef}
      className="py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08] relative"
    >
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="max-w-3xl space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-3 py-1 bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#ff4b26]"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff4b26] animate-pulse" />
            <span>Interactive Commission Lab // Direct Portal</span>
          </motion.div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Let’s engineer your <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#ff4b26]">
              next visual milestone.
            </span>
          </h2>

          <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl">
            We collaborate with ambitious brands, athletes, and creative enterprises worldwide. 
            Configure your project parameters through our interactive canvas below, or connect instantly through our direct channels.
          </p>
        </div>

        {/* Real-Time Studio Status Badge */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
          <div className="px-4 py-2.5 bg-[#121218] border border-white/[0.1] text-xs font-mono text-neutral-300 flex items-center gap-2.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white font-medium">Studio disponible pour vos projets</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-[#ff4b26]" />
            <span>Réponse garantie sous 12h</span>
          </div>
        </div>
      </div>

      {/* Express Direct Hotlines Deck (WhatsApp, Gmail, Direct Call) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {/* WhatsApp Direct Line */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="relative group p-6 bg-[#0f0f15] hover:bg-[#13131b] border border-white/[0.08] hover:border-[#25D366]/60 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 border border-[#25D366]/20">
                Direct WhatsApp Line
              </span>
              <div className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                <WhatsAppIcon className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-1">
              WhatsApp Messenger
            </h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Same number as phone. Ideal for voice memos, instant project briefs, or quick reference links.
            </p>
            <div className="text-sm font-mono text-white font-semibold mb-6 tracking-wide">
              {rawPhone}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Chat on WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => copyToClipboard(rawPhone, 'whatsapp')}
              title="Copy WhatsApp Number"
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              {copiedField === 'whatsapp' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Gmail Official Studio Inbox */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="relative group p-6 bg-[#0f0f15] hover:bg-[#13131b] border border-white/[0.08] hover:border-[#EA4335]/60 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#EA4335] bg-[#EA4335]/10 px-2 py-0.5 border border-[#EA4335]/20">
                Official Studio Desk
              </span>
              <div className="w-8 h-8 rounded-full bg-[#EA4335]/10 text-[#EA4335] flex items-center justify-center group-hover:scale-110 transition-transform">
                <GmailIcon className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-1">
              Direct Gmail Inbox
            </h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Official written communication. Send detailed RFPs, PDF presentations, or NDA requests.
            </p>
            <div className="text-sm font-mono text-white font-semibold mb-6 tracking-wide truncate">
              {studioInfo.email || 'medarstudio@gmail.com'}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
            <a
              href={`mailto:${studioInfo.email || 'medarstudio@gmail.com'}?subject=${encodeURIComponent(
                'Project Commission Inquiry — Medar Studio'
              )}`}
              className="flex-1 py-2.5 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Compose in Gmail</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => copyToClipboard(studioInfo.email || 'medarstudio@gmail.com', 'email')}
              title="Copy Email"
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              {copiedField === 'email' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Studio Phone Line & Direct Call */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="relative group p-6 bg-[#0f0f15] hover:bg-[#13131b] border border-white/[0.08] hover:border-[#ff4b26]/60 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff4b26] bg-[#ff4b26]/10 px-2 py-0.5 border border-[#ff4b26]/20">
                Direct Voice Line
              </span>
              <div className="w-8 h-8 rounded-full bg-[#ff4b26]/10 text-[#ff4b26] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="font-mono text-xs font-bold">24/7</span>
              </div>
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-1">
              Direct Phone Call
            </h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Same number for direct phone calls and WhatsApp. Mon – Fri, 9am – 8pm UTC.
            </p>
            <div className="text-sm font-mono text-white font-semibold mb-6 tracking-wide">
              {rawPhone}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
            <a
              href={`tel:${cleanPhoneForWa}`}
              className="flex-1 py-2.5 bg-white/10 hover:bg-[#ff4b26] text-white font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Call Direct Line</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => copyToClipboard(rawPhone, 'phone')}
              title="Copy Phone Number"
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              {copiedField === 'phone' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* THE CREATIVE ANIMATIVE COMMISSION LAB (DYNAMIC BRIEF MATRIX)               */}
      {/* ========================================================================= */}
      <div 
        ref={formMatrixRef}
        onMouseMove={handleMouseMove}
        className="relative bg-[#0d0d13] border border-white/[0.12] rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      >
        {/* Dynamic Interactive Cursor Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 75, 38, 0.15), transparent 70%)`
          }}
        />

        {/* Ambient Top Glow Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#ff4b26] to-transparent" />

        {/* Studio Matrix Header */}
        <div className="p-6 sm:p-8 md:p-10 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-mono text-[#ff4b26] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Phase 01 // Bespoke Inquiry Terminal</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SSL Secured & NDA Active
              </span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Configurateur de Projet Créatif
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Personnalisez votre cahier des charges étape par étape et visualisez le devis en direct.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Progress Radial / Bar */}
            <div className="flex items-center gap-3 bg-[#14141e] border border-white/10 px-4 py-2 rounded-xl">
              <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#ff4b26] to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${getStepProgress()}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-white tabular-nums">
                {getStepProgress()}%
              </span>
            </div>

            {/* Toggle Expand/Collapse */}
            <button
              type="button"
              onClick={() => setIsFormExpanded(prev => !prev)}
              className="p-2.5 bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
              title={isFormExpanded ? "Replier le formulaire" : "Déplier le formulaire"}
            >
              {isFormExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsed State Teaser */}
        {!isFormExpanded && !isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center max-w-lg mx-auto space-y-4 px-6 relative z-10"
          >
            <p className="text-xs font-mono text-neutral-400">
              Le configurateur interactif est replié. Cliquez ci-dessous pour reprendre la personnalisation de votre brief créatif.
            </p>
            <button
              type="button"
              onClick={() => setIsFormExpanded(true)}
              className="px-6 py-3 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_20px_rgba(255,75,38,0.35)] cursor-pointer inline-flex items-center gap-2"
            >
              <span>Déplier & Personnaliser le Projet</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Main Interactive Form Body */}
        <AnimatePresence>
          {isFormExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="relative z-10"
            >
              {isSubmitted ? (
                /* SUCCESS STATE CELEBRATION */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="p-8 sm:p-14 text-center max-w-xl mx-auto space-y-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                  >
                    <Check className="w-10 h-10 stroke-[2.5]" />
                  </motion.div>

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Transmis avec succès à medarstudio</span>
                    </div>
                    <h4 className="font-heading text-3xl font-bold text-white tracking-tight">
                      Brief Créatif Validé !
                    </h4>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Merci <strong className="text-white">{formState.name}</strong> ! Votre cahier des charges pour{' '}
                    <span className="text-[#ff4b26] font-semibold">{formState.discipline}</span> a été transmis directement à{' '}
                    <strong className="text-white">{studioInfo.email || 'medarstudio@gmail.com'}</strong>. Notre directeur créatif étudiera vos références et vous retournera une proposition détaillée sous 12 heures.
                  </p>

                  {/* Summary of what was sent */}
                  <div className="bg-[#14141e] border border-white/10 rounded-xl p-4 text-left text-xs font-mono space-y-1.5">
                    <div className="text-neutral-400 flex justify-between">
                      <span>Discipline :</span>
                      <span className="text-white font-medium">{formState.discipline}</span>
                    </div>
                    <div className="text-neutral-400 flex justify-between">
                      <span>Budget estimé :</span>
                      <span className="text-emerald-400 font-medium">{formState.budget}</span>
                    </div>
                    <div className="text-neutral-400 flex justify-between">
                      <span>Délai cible :</span>
                      <span className="text-white font-medium">{formState.timeline}</span>
                    </div>
                    <div className="text-neutral-400 flex justify-between">
                      <span>Modules ({formState.deliverables.length}) :</span>
                      <span className="text-neutral-300 truncate max-w-[200px]">{formState.deliverables.join(', ')}</span>
                    </div>
                  </div>

                  {/* Action Fast-Forwards */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={sendViaWhatsAppDirect}
                      className="w-full sm:w-auto px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(37,211,102,0.25)]"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>Doubler sur WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={sendViaGmailWebDirect}
                      className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <GmailIcon className="w-4 h-4" />
                      <span>Ouvrir dans Gmail</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto px-5 py-3 bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Nouveau brief
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* STEP-BY-STEP INTERACTIVE CANVAS WITH LIVE VISUAL FEEDBACK */
                <form onSubmit={handleSubmit}>
                  {/* Step Navigation Pill Bar */}
                  <div className="px-6 sm:px-10 py-4 bg-[#111119] border-b border-white/[0.08] flex items-center justify-between gap-2 overflow-x-auto">
                    <div className="flex items-center gap-2 min-w-max">
                      {[
                        { num: 1, title: 'Discipline', icon: Compass },
                        { num: 2, title: 'Livrables', icon: Sliders },
                        { num: 3, title: 'Budget & Délai', icon: DollarSign },
                        { num: 4, title: 'Vos Coordonnées', icon: User }
                      ].map((step) => {
                        const isActive = currentStep === step.num;
                        const isDone = currentStep > step.num || (step.num === 1 && formState.discipline) || (step.num === 2 && formState.deliverables.length > 0);
                        const StepIcon = step.icon;

                        return (
                          <button
                            type="button"
                            key={step.num}
                            onClick={() => setCurrentStep(step.num)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#ff4b26] text-white shadow-[0_2px_12px_rgba(255,75,38,0.35)]'
                                : isDone
                                ? 'bg-white/5 text-neutral-200 hover:bg-white/10'
                                : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                              isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-neutral-400'
                            }`}>
                              {step.num}
                            </span>
                            <span className="hidden sm:inline">{step.title}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[11px] font-mono text-neutral-400 hidden lg:flex items-center gap-1.5">
                      <span className="text-white font-bold">Étape {currentStep}/4</span>
                      <span>·</span>
                      <span className="text-[#ff4b26]">{activeDisciplineObj.name}</span>
                    </div>
                  </div>

                  {/* Step Contents Area */}
                  <div className="p-6 sm:p-10 md:p-12">
                    <AnimatePresence mode="wait">
                      {/* ======================================================== */}
                      {/* STEP 1: INTERACTIVE DISCIPLINE SELECTOR                 */}
                      {/* ======================================================== */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-wider block font-semibold">
                                Étape 01 — Direction Créative
                              </span>
                              <h4 className="text-xl sm:text-2xl font-heading font-bold text-white">
                                Quel est le domaine principal de votre projet ?
                              </h4>
                            </div>
                            <span className="text-xs font-mono text-neutral-400">
                              Sélectionnez une spécialité
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {DISCIPLINES.map((item) => {
                              const isSelected = formState.discipline === item.id;
                              const IconComp = item.icon;

                              return (
                                <motion.div
                                  key={item.id}
                                  whileHover={{ scale: 1.015, y: -2 }}
                                  whileTap={{ scale: 0.985 }}
                                  onClick={() => {
                                    setFormState({ ...formState, discipline: item.id });
                                  }}
                                  className={`relative p-5 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between select-none ${
                                    isSelected
                                      ? 'bg-gradient-to-br from-[#1a1213] to-[#241315] border-[#ff4b26] shadow-[0_8px_30px_rgba(255,75,38,0.25)] ring-1 ring-[#ff4b26]'
                                      : 'bg-[#12121a]/80 border-white/[0.08] hover:border-white/25 hover:bg-[#151522]'
                                  }`}
                                >
                                  {/* Active Corner Glow */}
                                  {isSelected && (
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff4b26]/20 rounded-full blur-2xl pointer-events-none" />
                                  )}

                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <span className={`text-[11px] font-mono font-bold tracking-widest ${
                                        isSelected ? 'text-[#ff4b26]' : 'text-neutral-500'
                                      }`}>
                                        {item.code}
                                      </span>
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                        isSelected ? 'bg-[#ff4b26] text-white' : 'bg-white/5 text-neutral-400'
                                      }`}>
                                        <IconComp className="w-4 h-4" />
                                      </div>
                                    </div>

                                    <h5 className="font-heading text-base font-bold text-white mb-1">
                                      {item.name}
                                    </h5>
                                    <p className="text-[11px] font-mono text-[#ff4b26]/90 mb-2">
                                      {item.subtitle}
                                    </p>
                                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                                      {item.description}
                                    </p>
                                  </div>

                                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                                    <span className={isSelected ? 'text-white font-semibold' : 'text-neutral-500'}>
                                      {isSelected ? '✓ Sélectionné' : 'Choisir cette discipline'}
                                    </span>
                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                      isSelected ? 'border-[#ff4b26] bg-[#ff4b26]' : 'border-white/20'
                                    }`}>
                                      {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* ======================================================== */}
                      {/* STEP 2: SCOPE & DELIVERABLES DYNAMIC PICKER             */}
                      {/* ======================================================== */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-wider block font-semibold">
                                Étape 02 — Modules & Livrables
                              </span>
                              <h4 className="text-xl sm:text-2xl font-heading font-bold text-white">
                                Quels livrables souhaitez-vous pour {activeDisciplineObj.name} ?
                              </h4>
                            </div>
                            <span className="text-xs font-mono text-emerald-400">
                              {formState.deliverables.length} module(s) sélectionné(s)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {DELIVERABLE_POOL.map((item) => {
                              const isChecked = formState.deliverables.includes(item.id);

                              return (
                                <motion.button
                                  type="button"
                                  key={item.id}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => toggleDeliverable(item.id)}
                                  className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                                    isChecked
                                      ? 'bg-gradient-to-r from-[#1f1214] to-[#181116] border-[#ff4b26] text-white shadow-[0_4px_16px_rgba(255,75,38,0.2)]'
                                      : 'bg-[#12121a]/80 border-white/[0.08] text-neutral-300 hover:border-white/20 hover:bg-[#151522]'
                                  }`}
                                >
                                  <div>
                                    <span className={`text-[10px] font-mono uppercase tracking-wider block mb-1 ${
                                      isChecked ? 'text-[#ff4b26]' : 'text-neutral-500'
                                    }`}>
                                      {item.cat}
                                    </span>
                                    <span className="text-xs sm:text-sm font-heading font-bold block">
                                      {item.label}
                                    </span>
                                  </div>

                                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                                    isChecked ? 'bg-[#ff4b26] border-[#ff4b26] text-white' : 'border-white/20 bg-white/5'
                                  }`}>
                                    {isChecked ? <Check className="w-3.5 h-3.5" /> : null}
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>

                          {/* Quick selection presets */}
                          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
                            <span className="text-neutral-400">Presets rapides :</span>
                            <button
                              type="button"
                              onClick={() => setFormState({ ...formState, deliverables: ['Brand Guidelines', 'Primary Logo & Wordmarks', 'Social Media Architecture'] })}
                              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-md border border-white/10 transition-colors cursor-pointer"
                            >
                              Pack Identité Complet
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormState({ ...formState, deliverables: ['3D CGI Stills / Assets', 'Matchday / Sports Posters', 'Motion & Micro-animations'] })}
                              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-md border border-white/10 transition-colors cursor-pointer"
                            >
                              Pack Sports & 3D Impact
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormState({ ...formState, deliverables: DELIVERABLE_POOL.map(d => d.id) })}
                              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-md border border-white/10 transition-colors cursor-pointer"
                            >
                              Tout sélectionner
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* ======================================================== */}
                      {/* STEP 3: BUDGET & TIMELINE SLIDERS                       */}
                      {/* ======================================================== */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-8"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-wider block font-semibold">
                                Étape 03 — Cadre Économique & Calendrier
                              </span>
                              <h4 className="text-xl sm:text-2xl font-heading font-bold text-white">
                                Alignement budgétaire et horizon de livraison
                              </h4>
                            </div>
                            <span className="text-xs font-mono text-neutral-400">
                              Flexible selon vos jalons
                            </span>
                          </div>

                          {/* Budget Matrix */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 font-bold">
                                <DollarSign className="w-4 h-4 text-[#ff4b26]" />
                                <span>Fourchette Budgétaire Cible</span>
                              </label>
                              <span className="text-xs font-mono text-emerald-400">
                                Transparence garantie
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {budgetTiers.map((tier) => {
                                const isSelected = formState.budget === tier;

                                return (
                                  <motion.button
                                    type="button"
                                    key={tier}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormState({ ...formState, budget: tier })}
                                    className={`p-4 rounded-xl border text-center font-mono text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#ff4b26] text-white border-[#ff4b26] font-bold shadow-[0_4px_20px_rgba(255,75,38,0.35)]'
                                        : 'bg-[#12121a]/80 border-white/[0.08] text-neutral-300 hover:border-white/20 hover:bg-[#151522]'
                                    }`}
                                  >
                                    <span className="block text-base sm:text-lg font-heading font-bold mb-0.5">
                                      {tier}
                                    </span>
                                    <span className={`text-[10px] block ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                                      {tier.includes('€100') ? 'Démarrage & Essais' : tier.includes('€300') ? 'Projet PME / Startup' : 'Direction Premium'}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Timeline / Schedule */}
                          <div>
                            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 font-bold mb-3">
                              <Calendar className="w-4 h-4 text-[#ff4b26]" />
                              <span>Rythme de Livraison Estimé</span>
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {TIMELINE_OPTIONS.map((time) => {
                                const isSelected = formState.timeline === time.id;

                                return (
                                  <motion.button
                                    type="button"
                                    key={time.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormState({ ...formState, timeline: time.id })}
                                    className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                      isSelected
                                        ? 'bg-white text-black border-white shadow-[0_4px_20px_rgba(255,255,255,0.15)] font-bold'
                                        : 'bg-[#12121a]/80 border-white/[0.08] text-neutral-300 hover:border-white/20 hover:bg-[#151522]'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                        isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-400'
                                      }`}>
                                        {time.badge}
                                      </span>
                                      <Clock className="w-3.5 h-3.5 opacity-60" />
                                    </div>
                                    <div className="font-heading text-sm font-bold mb-0.5">
                                      {time.label}
                                    </div>
                                    <div className={`text-[11px] font-mono ${
                                      isSelected ? 'text-neutral-800' : 'text-neutral-500'
                                    }`}>
                                      {time.time}
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ======================================================== */}
                      {/* STEP 4: CONTACT, COMPANY & VISION NOTES                  */}
                      {/* ======================================================== */}
                      {currentStep === 4 && (
                        <motion.div
                          key="step-4"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-wider block font-semibold">
                                Étape 04 — Coordonnées & Ambition
                              </span>
                              <h4 className="text-xl sm:text-2xl font-heading font-bold text-white">
                                Présentez-vous pour l’envoi de votre dossier
                              </h4>
                            </div>
                            <span className="text-xs font-mono text-neutral-400">
                              Dernière étape avant envoi
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                                Votre Nom & Prénom <span className="text-[#ff4b26]">*</span>
                              </label>
                              <div className="relative">
                                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  required
                                  value={formState.name}
                                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                  placeholder="Ex : Marc Henderson"
                                  className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-[#ff4b26] focus:ring-1 focus:ring-[#ff4b26]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                                Adresse Email Professionnelle <span className="text-[#ff4b26]">*</span>
                              </label>
                              <div className="relative">
                                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="email"
                                  required
                                  value={formState.email}
                                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                  placeholder="contact@votrebrand.com"
                                  className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-[#ff4b26] focus:ring-1 focus:ring-[#ff4b26]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                                Téléphone / WhatsApp (Optionnel)
                              </label>
                              <div className="relative">
                                <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={formState.phoneWhatsapp}
                                  onChange={(e) => setFormState({ ...formState, phoneWhatsapp: e.target.value })}
                                  placeholder="+212 6... ou +33 6..."
                                  className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-[#ff4b26] focus:ring-1 focus:ring-[#ff4b26]"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                              Entreprise, Marque ou Club Sportif
                            </label>
                            <div className="relative">
                              <Building className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={formState.company}
                                onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                                placeholder="Ex : Apex Apparel Co. ou Projet Indépendant"
                                className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-[#ff4b26] focus:ring-1 focus:ring-[#ff4b26]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                              Vision, Contexte & Références
                            </label>
                            <textarea
                              rows={3}
                              value={formState.notes}
                              onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                              placeholder="Décrivez vos inspirations, les échéances clés, vos concurrents de référence ou vos contraintes techniques..."
                              className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-[#ff4b26] focus:ring-1 focus:ring-[#ff4b26] resize-none"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Error Toast */}
                    {submitError && (
                      <div className="mt-6 p-4 bg-rose-950/60 border border-rose-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-rose-200">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{submitError}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={sendViaWhatsAppDirect}
                            className="px-3 py-1.5 bg-[#25D366] text-black font-bold text-[11px] rounded transition-colors cursor-pointer"
                          >
                            Via WhatsApp
                          </button>
                          <button
                            type="button"
                            onClick={sendViaGmailWebDirect}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] rounded transition-colors cursor-pointer"
                          >
                            Via Gmail
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Footer Action Terminal with Live Summary */}
                  <div className="p-6 sm:p-8 bg-[#0a0a0f] border-t border-white/[0.08] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
                    {/* Live Manifest Preview */}
                    <div className="space-y-1 text-xs font-mono">
                      <div className="text-[10px] uppercase tracking-widest text-[#ff4b26] flex items-center gap-1.5 font-bold">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Brief Paramétré en direct :</span>
                      </div>
                      <div className="text-white font-medium flex flex-wrap items-center gap-2">
                        <span className="text-[#ff4b26]">{formState.discipline}</span>
                        <span>·</span>
                        <span>{formState.deliverables.length} module(s)</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-semibold">{formState.budget}</span>
                        <span>·</span>
                        <span className="text-neutral-400">{formState.timeline}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Passerelle Formspree active vers {studioInfo.email || 'medarstudio@gmail.com'}
                      </div>
                    </div>

                    {/* Step Navigator and Multi-Channel Submission Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                      {/* Previous Step Button */}
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                          className="px-4 py-3 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-xl border border-white/10 font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Précédent</span>
                        </button>
                      )}

                      {/* Next Step / Direct Transmit */}
                      {currentStep < 4 ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (isStepValid(currentStep)) {
                              setCurrentStep(prev => Math.min(4, prev + 1));
                            }
                          }}
                          className="px-6 py-3.5 bg-white hover:bg-[#ff4b26] text-black hover:text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                        >
                          <span>Étape Suivante</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* Option 1: WhatsApp instant dispatch */}
                          <button
                            type="button"
                            onClick={sendViaWhatsAppDirect}
                            className="px-4 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-black rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_16px_rgba(37,211,102,0.25)]"
                            title="Envoyer instantanément le brief sur WhatsApp"
                          >
                            <WhatsAppIcon className="w-4 h-4" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Option 2: Gmail direct compose */}
                          <button
                            type="button"
                            onClick={sendViaGmailWebDirect}
                            className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            title="Ouvrir le brief dans Gmail"
                          >
                            <GmailIcon className="w-4 h-4" />
                            <span>Gmail</span>
                          </button>

                          {/* Option 3: Formspree Official Transmission */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3.5 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-[0_4px_24px_rgba(255,75,38,0.4)]"
                            title="Transmettre le brief par email via Formspree"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Transmission...</span>
                              </>
                            ) : (
                              <>
                                <span>Transmettre le Brief</span>
                                <Send className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InitiatePartnership;
