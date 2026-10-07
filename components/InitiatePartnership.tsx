/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
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
  ChevronUp
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

const DISCIPLINES = [
  {
    id: 'Visual Identity',
    name: 'Visual Identity',
    code: '01',
    description: 'Logo systems, brand guidelines & typographic architectures',
    icon: Palette,
    accent: '#ff4b26'
  },
  {
    id: 'Sports Design',
    name: 'Sports Design',
    code: '02',
    description: 'Athlete branding, high-octane posters & franchise visuals',
    icon: Trophy,
    accent: '#ff6b3d'
  },
  {
    id: '3D & Creative',
    name: '3D & Direction',
    code: '03',
    description: 'Spatial CGI, product staging & futuristic 3D aesthetics',
    icon: Box,
    accent: '#ff8a5c'
  },
  {
    id: 'Digital Design',
    name: 'Digital & Web',
    code: '04',
    description: 'Avant-garde UI/UX, interactive platforms & portfolio experiences',
    icon: Monitor,
    accent: '#ff4b26'
  },
  {
    id: 'Graphic Design',
    name: 'Graphic & Print',
    code: '05',
    description: 'High-fashion editorial, lookbooks, packaging & collateral',
    icon: Layers,
    accent: '#ff6b3d'
  },
  {
    id: 'Studio Retainer',
    name: 'Full Retainer',
    code: '06',
    description: 'Quarterly embedded creative leadership for growing brands',
    icon: Flame,
    accent: '#ff4b26'
  }
];

const DELIVERABLE_TAGS = [
  'Brand Guidelines',
  'Primary Logo & Wordmarks',
  '3D CGI Stills / Assets',
  'Matchday / Sports Posters',
  'Social Media Architecture',
  'Digital Web UI/UX',
  'Physical Packaging',
  'Motion & Micro-animations',
  'Editorial Lookbook'
];

const TIMELINE_OPTIONS = [
  'Immediate (< 2 Weeks)',
  'Standard (3 - 5 Weeks)',
  'Flexible / Q3 Planning'
];

export const InitiatePartnership: React.FC<InitiatePartnershipProps> = ({
  studioInfo,
  budgetTiers,
  selectedService
}) => {
  // Same phone number for calls and WhatsApp as confirmed by user
  const rawPhone = studioInfo.phone || '+212 698-048499';
  const cleanPhoneForWa = rawPhone.replace(/[^0-9]/g, ''); // "212698048499"
  const whatsappUrl = `https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(
    "Hello Medar Studio, I would like to discuss a project commission."
  )}`;

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

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const formMatrixRef = React.useRef<HTMLDivElement>(null);
  const contactSectionRef = React.useRef<HTMLElement>(null);

  // Sync if selectedService changes from exterior and auto-expand form
  React.useEffect(() => {
    if (selectedService) {
      setFormState((prev) => ({ ...prev, discipline: selectedService }));
      setIsFormExpanded(true);
    }
  }, [selectedService]);

  // Listen to open_brief_form trigger from CTA buttons ('Start a Project')
  React.useEffect(() => {
    const handleOpenBrief = () => {
      setIsFormExpanded(true);
    };
    window.addEventListener('open_brief_form', handleOpenBrief);
    return () => window.removeEventListener('open_brief_form', handleOpenBrief);
  }, []);

  // Track when contact form comes into view
  React.useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;

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

  const sendViaEmailDirect = () => {
    trackEmailDirectClick('mailto', formState.name);
    const subject = `[Project Commission] ${formState.discipline} — ${formState.name || 'Client'}`;
    const body = generateEmailBody();
    const mailtoUrl = `mailto:${studioInfo.email || 'medarstudio@gmail.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
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
      `*Company:* ${formState.company || 'Private'}\n` +
      `*Discipline:* ${formState.discipline}\n` +
      `*Deliverables:* ${formState.deliverables.join(', ') || 'To be defined'}\n` +
      `*Target Budget:* ${formState.budget}\n` +
      `*Timeline:* ${formState.timeline}\n` +
      `*Notes:* ${formState.notes || 'Looking forward to discussing.'}`;

    window.open(`https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section 
      id="contact" 
      ref={contactSectionRef}
      className="py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]"
    >
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-widest text-[#ff4b26]">
            <span className="w-2 h-2 rounded-full bg-[#ff4b26] animate-pulse" />
            <span>Commission Protocol // Initiate a Partnership</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Let’s engineer your <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#ff4b26]">
              next visual milestone.
            </span>
          </h2>

          <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl">
            We collaborate with ambitious brands, athletes, and creative enterprises worldwide. 
            Choose your preferred approach: start with our express direct lines or configure your tailored brief.
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

      {/* Express Direct Hotlines Deck (Phone is the same as WhatsApp) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {/* WhatsApp Direct Line */}
        <div className="relative group p-6 bg-[#0f0f15] hover:bg-[#13131b] border border-white/[0.08] hover:border-[#25D366]/60 transition-all duration-300 flex flex-col justify-between">
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
              className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Chat on WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => copyToClipboard(rawPhone, 'whatsapp')}
              title="Copy WhatsApp Number"
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
            >
              {copiedField === 'whatsapp' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Gmail Official Studio Inbox */}
        <div className="relative group p-6 bg-[#0f0f15] hover:bg-[#13131b] border border-white/[0.08] hover:border-[#EA4335]/60 transition-all duration-300 flex flex-col justify-between">
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
              className="flex-1 py-2.5 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Compose in Gmail</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => copyToClipboard(studioInfo.email || 'medarstudio@gmail.com', 'email')}
              title="Copy Email"
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
            >
              {copiedField === 'email' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Studio Phone Line & Global Base */}
        <div className="relative group p-6 bg-[#0f0f15] hover:bg-[#13131b] border border-white/[0.08] hover:border-[#ff4b26]/60 transition-all duration-300 flex flex-col justify-between">
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
              className="flex-1 py-2.5 bg-white/10 hover:bg-[#ff4b26] text-white font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Call Direct Line</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => copyToClipboard(rawPhone, 'phone')}
              title="Copy Phone Number"
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
            >
              {copiedField === 'phone' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* The Creative Brief Studio Matrix (Creative Architecture) */}
      <div ref={formMatrixRef} className="bg-[#0f0f14] border border-white/[0.1] relative overflow-hidden transition-all duration-300">
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="relative p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div 
              onClick={() => setIsFormExpanded(prev => !prev)}
              className="cursor-pointer group select-none"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-[#ff4b26] uppercase tracking-widest block">
                  Phase 01 — Bespoke Inquiry
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10 group-hover:border-[#ff4b26]/40 transition-colors">
                  {isFormExpanded ? 'Formulaire Ouvert' : 'Formulaire Replié / Masqué'}
                </span>
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <span>Commission Architecture & Brief</span>
                <span className="text-[#ff4b26] text-sm group-hover:translate-x-1 transition-transform">
                  {isFormExpanded ? '▲' : '▼'}
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Studio NDA Guarantee</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextState = !isFormExpanded;
                  setIsFormExpanded(nextState);
                  if (!nextState && formMatrixRef.current) {
                    formMatrixRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }}
                className={`px-4 py-2 border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isFormExpanded
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    : 'bg-[#ff4b26] hover:bg-[#ff5f3c] text-white border-[#ff4b26] shadow-[0_2px_12px_rgba(255,75,38,0.35)]'
                }`}
              >
                <span>{isFormExpanded ? 'Masquer / Replier' : 'Déplier le Formulaire'}</span>
                {isFormExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsed State Teaser when hidden */}
          {!isFormExpanded && !isSubmitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 text-center max-w-xl mx-auto space-y-4"
            >
              <div className="text-xs font-mono text-neutral-400 leading-relaxed">
                Le formulaire de brief détaillé est replié pour alléger la page. Vous pouvez le remonter et l’ouvrir en un clic ou utiliser les lignes directes ci-dessus (WhatsApp & Gmail).
              </div>
              <button
                type="button"
                onClick={() => setIsFormExpanded(true)}
                className="px-6 py-3 bg-white hover:bg-[#ff4b26] text-black hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Ouvrir & Remplir le Brief Projet</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <AnimatePresence>
            {isFormExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-8 overflow-hidden"
              >
                {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center max-w-xl mx-auto space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.3)]">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Email transmis directement à medarstudio</span>
                </div>
                <h4 className="font-heading text-3xl font-bold text-white">
                  Brief Transmis avec Succès !
                </h4>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Merci <strong className="text-white">{formState.name}</strong> ! Vos paramètres de commission ont été transmis directement par email à <strong className="text-white">{studioInfo.email || 'medarstudio@gmail.com'}</strong> via notre passerelle Formspree. Notre équipe analysera votre cahier des charges et vous répondra sous 12 heures.
              </p>

              {/* Fast Forward via WhatsApp & Direct Email buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={sendViaWhatsAppDirect}
                  className="w-full sm:w-auto px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(37,211,102,0.25)]"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Doubler sur WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={sendViaGmailWebDirect}
                  className="w-full sm:w-auto px-5 py-3 bg-[#171720] hover:bg-[#20202c] border border-white/20 hover:border-white/40 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <GmailIcon className="w-4 h-4" />
                  <span>Ouvrir dans Gmail</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Nouveau brief / Modifier
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Step 1: Discipline Selector (Architectural Grid Cards) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                  1. Select Primary Discipline <span className="text-[#ff4b26]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DISCIPLINES.map((item) => {
                    const isSelected = formState.discipline === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFormState({ ...formState, discipline: item.id })}
                        className={`p-4 text-left border transition-all duration-200 group relative cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-[0_4px_20px_rgba(255,255,255,0.1)]'
                            : 'bg-black/40 border-white/[0.08] text-neutral-300 hover:border-white/25 hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-mono tracking-widest ${
                            isSelected ? 'text-black/60' : 'text-neutral-500'
                          }`}>
                            {item.code}
                          </span>
                          <IconComp className={`w-4 h-4 ${
                            isSelected ? 'text-[#ff4b26]' : 'text-neutral-400 group-hover:text-white'
                          }`} />
                        </div>
                        <div className={`font-heading text-sm font-bold mb-1 ${
                          isSelected ? 'text-black' : 'text-white'
                        }`}>
                          {item.name}
                        </div>
                        <div className={`text-[11px] leading-snug ${
                          isSelected ? 'text-neutral-700' : 'text-neutral-400'
                        }`}>
                          {item.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Scope & Deliverables Checklist */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                  2. Requested Deliverables & Modules
                </label>
                <div className="flex flex-wrap gap-2">
                  {DELIVERABLE_TAGS.map((tag) => {
                    const active = formState.deliverables.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleDeliverable(tag)}
                        className={`px-3.5 py-2 text-xs font-mono transition-all duration-200 border cursor-pointer flex items-center gap-2 ${
                          active
                            ? 'bg-[#ff4b26] text-white border-[#ff4b26] font-semibold shadow-[0_2px_12px_rgba(255,75,38,0.35)]'
                            : 'bg-black/40 border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span>{active ? '✓' : '+'}</span>
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Budget & Timeline Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Target Budget */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400">
                      3. Target Budget Scope
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Accessible for startups & creators
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {budgetTiers.map((tier) => {
                      const isSelected = formState.budget === tier;
                      return (
                        <button
                          type="button"
                          key={tier}
                          onClick={() => setFormState({ ...formState, budget: tier })}
                          className={`p-3 text-center text-xs font-mono border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black border-white font-bold'
                              : 'bg-black/40 border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Timeline */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                    4. Target Schedule / Delivery
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {TIMELINE_OPTIONS.map((time) => {
                      const isSelected = formState.timeline === time;
                      return (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setFormState({ ...formState, timeline: time })}
                          className={`p-3 text-center text-xs font-mono border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black border-white font-bold'
                              : 'bg-black/40 border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 4: Contact & Identity Inputs */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                  5. Contact & Brand Dossier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Full Name <span className="text-[#ff4b26]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Marc Henderson"
                      className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Email Address <span className="text-[#ff4b26]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="m.henderson@brand.com"
                      className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      type="text"
                      value={formState.phoneWhatsapp}
                      onChange={(e) => setFormState({ ...formState, phoneWhatsapp: e.target.value })}
                      placeholder="e.g. +33 6 12 34 56 78"
                      className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Company / Organization / Project Name
                  </label>
                  <input
                    type="text"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    placeholder="e.g. Athletic Apparel Brand or Creative Studio"
                    className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Vision, References & Ambition
                  </label>
                  <textarea
                    rows={4}
                    value={formState.notes}
                    onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                    placeholder="Briefly describe your objectives, key deliverables, target launch date, reference aesthetic, or any specific constraints..."
                    className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26] resize-none"
                  />
                </div>
              </div>

              {/* Submit Error Banner with Instant Alternates */}
              {submitError && (
                <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-rose-200">
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

              {/* Commission Summary Terminal & Dual Transmit Actions */}
              <div className="p-5 sm:p-6 bg-[#08080c] border border-white/[0.1] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="text-[10px] uppercase tracking-widest text-[#ff4b26] flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Commission Manifest:</span>
                  </div>
                  <div className="text-white font-medium">
                    {formState.discipline} · {formState.budget} · {formState.timeline}
                  </div>
                  <div className="text-neutral-500 text-[11px]">
                    {formState.deliverables.length} module{formState.deliverables.length > 1 ? 's' : ''} selected · Studio Non-Disclosure Agreement active
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Envoi direct par email vers medarstudio (Formspree actif)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  {/* Option A: Direct WhatsApp Transmission */}
                  <button
                    type="button"
                    onClick={sendViaWhatsAppDirect}
                    className="px-5 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(37,211,102,0.25)]"
                    title="Send brief directly to WhatsApp with zero intermediaries"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>via WhatsApp</span>
                  </button>

                  {/* Option B: Direct Email / Gmail Transmission */}
                  <button
                    type="button"
                    onClick={sendViaGmailWebDirect}
                    className="px-5 py-3.5 bg-[#171720] hover:bg-[#20202c] border border-white/20 hover:border-white/40 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    title="Compose directly in Gmail with zero intermediaries"
                  >
                    <GmailIcon className="w-4 h-4" />
                    <span>via Gmail Direct</span>
                  </button>

                  {/* Option C: Standard Studio Submission via Formspree */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3.5 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-[0_4px_20px_rgba(255,75,38,0.35)]"
                    title="Envoyer le brief directement par email à medarstudio via Formspree"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Envoi direct...</span>
                      </>
                    ) : (
                      <>
                        <span>Envoyer le Brief</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default InitiatePartnership;
