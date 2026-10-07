/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Check,
  Upload,
  LogOut,
  Layers,
  Save,
  Star,
  Film,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MousePointerClick,
  Eye,
  Mail,
  MessageSquare,
  FileText,
  RotateCcw,
  Sparkles,
  BarChart3,
  Clock,
  ArrowUpRight,
  Filter,
  Copy,
  Activity,
  Flame,
  Send,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { CaseStudy, AgencyService, StudioGeneralInfo, ProjectMediaItem } from '../types';
import {
  getLeadAnalytics,
  resetLeadAnalytics,
  subscribeToLeadAnalytics,
  trackStartProjectClick,
  LeadAnalyticsData,
  LeadAnalyticsEvent
} from '../utils/leadAnalytics';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  projects: CaseStudy[];
  onUpdateProjects: (projects: CaseStudy[]) => void;
  services?: AgencyService[];
  onUpdateServices?: (services: AgencyService[]) => void;
  studioInfo?: StudioGeneralInfo;
  onUpdateStudioInfo?: (info: StudioGeneralInfo) => void;
  budgetTiers?: string[];
  onUpdateBudgetTiers?: (tiers: string[]) => void;
  onResetDefaults?: () => void;
}

const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  projects,
  onUpdateProjects,
  studioInfo,
  onUpdateStudioInfo,
  budgetTiers,
  onUpdateBudgetTiers,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'analytics'>('analytics');
  const [localProjects, setLocalProjects] = useState<CaseStudy[]>(projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'featured' | 'archive'>('all');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [activeUploadProjectId, setActiveUploadProjectId] = useState<string | null>(null);

  // Lead Analytics & Counter State
  const [analytics, setAnalytics] = useState<LeadAnalyticsData>(getLeadAnalytics());
  const [analyticsFilter, setAnalyticsFilter] = useState<'all' | 'clicks' | 'views' | 'inquiries'>('all');
  const [analyticsSearchQuery, setAnalyticsSearchQuery] = useState('');

  // Formspree Integration State
  const [isTestingFormspree, setIsTestingFormspree] = useState(false);
  const [formspreeEndpointInput, setFormspreeEndpointInput] = useState(
    studioInfo?.formspreeEndpoint || 'https://formspree.io/f/xnpjpvaw'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state when projects prop changes
  useEffect(() => {
    if (projects) {
      setLocalProjects(projects);
    }
  }, [projects]);

  // Subscribe to real-time analytics updates whenever modal is open
  useEffect(() => {
    setAnalytics(getLeadAnalytics());
    const unsubscribe = subscribeToLeadAnalytics((data) => {
      setAnalytics(data);
    });
    return unsubscribe;
  }, [isOpen]);

  const triggerNotification = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Simulate a test interaction for instant verification
  const handleSimulateTestLead = () => {
    const sources: Array<'navbar' | 'mobileDrawer' | 'aboutBanner' | 'allProjectsModal'> = [
      'navbar',
      'aboutBanner',
      'mobileDrawer',
      'allProjectsModal'
    ];
    const picked = sources[Math.floor(Math.random() * sources.length)];
    trackStartProjectClick(picked);
    triggerNotification(`Logged test 'Start a Project' click (${picked})!`);
  };

  // Reset counters and clear log with confirmation
  const handleResetAnalytics = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all lead interest counters and clear the activity log? This cannot be undone.'
    );
    if (!confirmed) return;
    const clean = resetLeadAnalytics();
    setAnalytics(clean);
    triggerNotification('Lead counters and activity log reset.');
  };

  // Copy analytics summary to clipboard
  const handleCopyAnalyticsSummary = () => {
    const totalClicks = analytics.totalStartProjectClicks;
    const totalViews = analytics.totalFormViews;
    const totalEmail = analytics.totalEmailDirectClicks;
    const totalWhatsApp = analytics.totalWhatsAppDirectClicks;
    const totalSubmissions = analytics.totalFormSubmissions;
    const totalInquiries = totalEmail + totalWhatsApp + totalSubmissions;
    const convRate = totalClicks > 0 ? ((totalInquiries / totalClicks) * 100).toFixed(1) : '0';

    const report = `MEDAR STUDIO — LEAD INTEREST & CONVERSION REPORT\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `========================================\n` +
      `• Total 'Start a Project' Clicks: ${totalClicks}\n` +
      `  - Navbar CTA: ${analytics.clicksBySource.navbar}\n` +
      `  - About Banner: ${analytics.clicksBySource.aboutBanner}\n` +
      `  - Mobile Drawer: ${analytics.clicksBySource.mobileDrawer}\n` +
      `  - Archive Overlay CTA: ${analytics.clicksBySource.allProjectsModal}\n` +
      `• Contact Form Views: ${totalViews}\n` +
      `• Direct Gmail / Mail Clicks: ${totalEmail}\n` +
      `• Direct WhatsApp Inquiries: ${totalWhatsApp}\n` +
      `• Brief Form Submissions: ${totalSubmissions}\n` +
      `• Total Inbound Leads: ${totalInquiries}\n` +
      `• Conversion / Interest Rate: ${convRate}%\n` +
      `========================================\n` +
      `Total Logged Events: ${analytics.recentEvents.length}`;

    navigator.clipboard.writeText(report);
    triggerNotification('Lead metrics copied to clipboard!');
  };

  // Test direct submission to Formspree
  const handleTestFormspree = async () => {
    setIsTestingFormspree(true);
    const endpoint = formspreeEndpointInput || 'https://formspree.io/f/xnpjpvaw';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Mohamed Amine (Admin Test)',
          email: 'medarstudio@gmail.com',
          discipline: 'Vérification Système Formspree',
          deliverables: 'Test de transmission directe',
          message: 'Ce message confirme que Formspree transmet les formulaires directement vers votre email medarstudio.',
          _subject: '[TEST MEDAR STUDIO] Validation passerelle Formspree'
        })
      });

      if (res.ok) {
        triggerNotification('Test envoyé avec succès vers medarstudio via Formspree !');
      } else {
        triggerNotification('Réponse Formspree reçue. Vérifiez la validation de votre email Formspree.');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('Erreur réseau lors du test Formspree.');
    } finally {
      setIsTestingFormspree(false);
    }
  };

  // Save updated Formspree endpoint
  const handleSaveFormspreeEndpoint = () => {
    const clean = formspreeEndpointInput.trim();
    if (!clean) return;
    if (onUpdateStudioInfo && studioInfo) {
      const updated = { ...studioInfo, formspreeEndpoint: clean };
      onUpdateStudioInfo(updated);
      try {
        localStorage.setItem('medar_studio_general', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
    triggerNotification('Lien Formspree enregistré avec succès !');
  };

  // Save all projects to parent and localStorage
  const handleSaveAll = (updatedProjects?: CaseStudy[]) => {
    const list = updatedProjects || localProjects;
    setLocalProjects(list);
    onUpdateProjects(list);
    try {
      localStorage.setItem('medar_studio_projects_v2', JSON.stringify(list));
      localStorage.setItem('medar_studio_projects_v3', JSON.stringify(list));
    } catch (e) {
      console.warn('Storage quota exceeded:', e);
    }
    triggerNotification('All portfolio projects saved successfully!');
  };

  // Toggle Featured Status (À la Une / Homepage Showcase)
  const handleToggleFeatured = (projectId: string) => {
    const updated = localProjects.map((p) => {
      if (p.id === projectId) {
        const nextState = p.isFeatured !== false ? false : true;
        return { ...p, isFeatured: nextState };
      }
      return p;
    });
    handleSaveAll(updated);
  };

  // Update specific field for a project
  const handleUpdateField = (projectId: string, field: keyof CaseStudy, value: any) => {
    const updated = localProjects.map((p) => {
      if (p.id === projectId) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setLocalProjects(updated);
  };

  // Create a new project slot
  const handleAddNewProject = () => {
    const newId = `project-${Date.now()}`;
    const newProject: CaseStudy = {
      id: newId,
      title: `New Design Project #${localProjects.length + 1}`,
      client: 'Medar Studio',
      year: new Date().getFullYear().toString(),
      category: 'brand-identity',
      categoryLabel: 'Brand Identity',
      description: 'Bespoke design, visual communication, and creative direction.',
      media: [],
      imagePromptFallback: '',
      isFeatured: true,
      accentColor: '#ff4b26'
    };

    const updated = [newProject, ...localProjects];
    handleSaveAll(updated);
    triggerNotification(`Created "${newProject.title}"!`);
  };

  // Delete project
  const handleDeleteProject = (projectId: string) => {
    const pToDelete = localProjects.find((p) => p.id === projectId);
    const confirmed = window.confirm(`Are you sure you want to delete "${pToDelete?.title || 'this project'}"?`);
    if (!confirmed) return;

    const updated = localProjects.filter((p) => p.id !== projectId);
    handleSaveAll(updated);
    triggerNotification('Project deleted from portfolio.');
  };

  // Convert File to Compressed Base64 Data URL
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_DIM = 1600;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.86));
          } else {
            resolve(result);
          }
        };
        img.onerror = () => resolve(result);
        img.src = result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload Multiple Photos / Videos for a specific project
  const handleUploadFilesForProject = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeUploadProjectId) return;

    try {
      const addedMedia: ProjectMediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVid = file.type.startsWith('video/');
        const base64 = isVid ? await convertFileToBase64(file) : await compressImageFile(file);
        addedMedia.push({
          id: `media-${Date.now()}-${i}`,
          type: isVid ? 'video' : 'image',
          url: base64,
          title: file.name.replace(/\.[^/.]+$/, '')
        });
      }

      const updated = localProjects.map((p) => {
        if (p.id !== activeUploadProjectId) return p;
        const currentMedia = p.media || [];
        const nextMedia = [...currentMedia, ...addedMedia];
        const firstImg = nextMedia.find((m) => m.type === 'image')?.url || nextMedia[0]?.url || '';
        return {
          ...p,
          media: nextMedia,
          imagePromptFallback: p.imagePromptFallback || firstImg,
          videoUrl: p.videoUrl || nextMedia.find((m) => m.type === 'video')?.url
        };
      });

      handleSaveAll(updated);
      triggerNotification(`${addedMedia.length} media file(s) attached to project!`);
    } catch {
      triggerNotification('Error reading uploaded files.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setActiveUploadProjectId(null);
    }
  };

  // Remove a media item from a project
  const handleRemoveMediaItem = (projectId: string, mediaId: string) => {
    const updated = localProjects.map((p) => {
      if (p.id !== projectId) return p;
      const filtered = (p.media || []).filter((m) => m.id !== mediaId);
      const firstImg = filtered.find((m) => m.type === 'image')?.url || filtered[0]?.url || '';
      return {
        ...p,
        media: filtered,
        imagePromptFallback: firstImg,
        videoUrl: filtered.find((m) => m.type === 'video')?.url
      };
    });
    handleSaveAll(updated);
    triggerNotification('Media item removed.');
  };

  if (!isOpen) return null;

  // Filtered list according to search & filter
  const featuredCount = localProjects.filter((p) => p.isFeatured !== false).length;
  const filteredList = localProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'featured') return p.isFeatured !== false;
    if (filterMode === 'archive') return p.isFeatured === false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0f] text-neutral-200 overflow-hidden">
      {/* Hidden file input for multi-photo & video uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUploadFilesForProject}
        multiple
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Top Header Bar */}
      <header className="h-20 border-b border-white/10 bg-[#0e0e16] px-6 md:px-10 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#ff4b26] flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
            M
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg font-bold text-white tracking-tight">
                {activeTab === 'projects' ? 'Portfolio & Homepage Showcase' : 'Lead Interest & Telemetry'}
              </h1>
              <span className="text-[10px] font-mono bg-white/10 text-neutral-300 px-2 py-0.5 rounded border border-white/10">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              {activeTab === 'projects' 
                ? 'Curate featured projects, attach media, and edit portfolio case studies.'
                : "Real-time tracker of 'Start a Project' clicks and email/contact inquiries."}
            </p>
          </div>
        </div>

        {/* Primary Tab Switcher */}
        <div className="flex items-center bg-[#151522] border border-white/15 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolio Projects</span>
            <span className="sm:hidden">Projects</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              activeTab === 'projects' ? 'bg-black/15 text-black' : 'bg-white/10 text-neutral-300'
            }`}>
              {localProjects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#ff4b26] text-white shadow-[0_2px_12px_rgba(255,75,38,0.4)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lead Interest & Log</span>
            <span className="sm:hidden">Leads</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-white font-bold tabular-nums">
              {analytics.totalStartProjectClicks} clicks
            </span>
          </button>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {activeTab === 'projects' ? (
            <>
              <button
                type="button"
                onClick={handleAddNewProject}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">+ Add Project</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveAll()}
                className="px-3.5 py-2 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save All</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSimulateTestLead}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Test click tracking"
              >
                <MousePointerClick className="w-3.5 h-3.5 text-[#ff4b26]" />
                <span className="hidden md:inline">Test Click</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAnalyticsSummary}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Copy metrics report"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Copy Report</span>
              </button>

              <button
                type="button"
                onClick={handleResetAnalytics}
                className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-200 font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Reset counters & log"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
            title="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Save Notification Toast */}
      <AnimatePresence>
        {saveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-[#161622] border border-[#ff4b26] px-5 py-2.5 shadow-2xl flex items-center gap-2.5 text-xs font-mono text-white rounded-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls & Filter Sub-Bar */}
      {activeTab === 'projects' ? (
        <div className="bg-[#12121b] border-b border-white/10 px-6 md:px-10 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or client..."
                className="w-full bg-[#181824] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#ff4b26]"
              />
            </div>

            {/* Filter Segmented Control */}
            <div className="flex items-center bg-[#181824] border border-white/10 rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterMode === 'all' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All ({localProjects.length})
              </button>
              <button
                onClick={() => setFilterMode('featured')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  filterMode === 'featured' ? 'bg-[#ff4b26] text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>Featured ({featuredCount})</span>
              </button>
              <button
                onClick={() => setFilterMode('archive')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterMode === 'archive' ? 'bg-white/20 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Archive ({localProjects.length - featuredCount})
              </button>
            </div>
          </div>

          {/* Counter Info */}
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                <strong className="text-white">{featuredCount}</strong> featured on homepage
              </span>
            </div>
            <span>·</span>
            <span>
              <strong className="text-white">{localProjects.length}</strong> total projects
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-[#12121b] border-b border-white/10 px-6 md:px-10 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input for Activity Log */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={analyticsSearchQuery}
                onChange={(e) => setAnalyticsSearchQuery(e.target.value)}
                placeholder="Search activity log..."
                className="w-full bg-[#181824] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#ff4b26]"
              />
            </div>

            {/* Filter Segmented Control for Log */}
            <div className="flex items-center bg-[#181824] border border-white/10 rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => setAnalyticsFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  analyticsFilter === 'all' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Events ({analytics.recentEvents.length})
              </button>
              <button
                onClick={() => setAnalyticsFilter('clicks')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  analyticsFilter === 'clicks' ? 'bg-[#ff4b26] text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MousePointerClick className="w-3 h-3" />
                <span>Clicks ({analytics.totalStartProjectClicks})</span>
              </button>
              <button
                onClick={() => setAnalyticsFilter('views')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  analyticsFilter === 'views' ? 'bg-sky-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Views ({analytics.totalFormViews})</span>
              </button>
              <button
                onClick={() => setAnalyticsFilter('inquiries')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  analyticsFilter === 'inquiries' ? 'bg-emerald-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>
                  Inquiries ({analytics.totalEmailDirectClicks + analytics.totalWhatsAppDirectClicks + analytics.totalFormSubmissions})
                </span>
              </button>
            </div>
          </div>

          {/* Status info */}
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">Real-Time Lead Telemetry</span>
            </div>
            <span>·</span>
            <span className="text-neutral-300">
              Interest conversion: <strong className="text-white">{analytics.totalStartProjectClicks > 0 ? (((analytics.totalEmailDirectClicks + analytics.totalWhatsAppDirectClicks + analytics.totalFormSubmissions) / analytics.totalStartProjectClicks) * 100).toFixed(1) : '0'}%</strong>
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area: Tab Specific */}
      {activeTab === 'projects' ? (
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
        {filteredList.length === 0 ? (
          <div className="py-20 text-center border border-white/10 bg-[#12121b] rounded-2xl max-w-xl mx-auto space-y-4">
            <Layers className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-heading font-bold text-white">No projects found</h3>
            <p className="text-xs text-neutral-400 font-mono">
              Try adjusting your search query or click the button below to add a project.
            </p>
            <button
              type="button"
              onClick={handleAddNewProject}
              className="px-5 py-2.5 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white text-xs font-bold font-mono rounded-lg uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Project</span>
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {filteredList.map((project, idx) => {
              const mediaList = project.media || [];
              const isFeatured = project.isFeatured !== false;

              return (
                <div
                  key={project.id}
                  className={`bg-[#12121b] border rounded-2xl p-6 transition-all duration-200 ${
                    isFeatured
                      ? 'border-[#ff4b26]/50 shadow-lg bg-gradient-to-r from-[#141420] to-[#12121b]'
                      : 'border-white/10 opacity-90 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  {/* Top Bar of Project Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* FEATURED TOGGLE BADGE */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(project.id)}
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isFeatured
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                        title="Click to toggle homepage display"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-emerald-400 text-emerald-400' : 'text-neutral-500'}`} />
                        <span>{isFeatured ? '★ Featured on Homepage' : 'Archive Only (Click to Feature)'}</span>
                      </button>

                      <span className="text-xs font-mono text-neutral-400 border border-white/10 px-2 py-0.5 rounded">
                        {mediaList.length} Media File{mediaList.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveUploadProjectId(project.id);
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black font-mono font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Attach multiple photos or videos"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#ff4b26]" />
                        <span>+ Add Photos / Videos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Delete this project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Main Project Form Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-start">
                    {/* Left: Media Assets Preview (Multiple Photos & Videos) */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span>Project Media Gallery</span>
                        <span className="text-[11px] text-neutral-500">
                          {mediaList.length === 0 ? 'No photos yet' : `${mediaList.length} files attached`}
                        </span>
                      </div>

                      {mediaList.length === 0 ? (
                        <div
                          onClick={() => {
                            setActiveUploadProjectId(project.id);
                            fileInputRef.current?.click();
                          }}
                          className="h-44 border-2 border-dashed border-white/15 hover:border-[#ff4b26]/60 rounded-xl bg-black/40 hover:bg-black/60 flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:border-[#ff4b26]/50">
                            <Upload className="w-4 h-4 text-[#ff4b26]" />
                          </div>
                          <span className="text-xs font-bold text-white mb-0.5">
                            Upload Photos & Videos
                          </span>
                          <span className="text-[11px] font-mono text-neutral-500 max-w-xs">
                            Click here to select multiple images or video files from your device.
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Grid of uploaded media items */}
                          <div className="grid grid-cols-3 gap-2">
                            {mediaList.map((m, mIdx) => (
                              <div
                                key={m.id || mIdx}
                                className="relative aspect-[4/5] bg-black rounded-lg overflow-hidden border border-white/15 group shadow"
                              >
                                {m.type === 'video' ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-cyan-400 p-2 text-center">
                                    <Film className="w-6 h-6 mb-1" />
                                    <span className="text-[8px] font-mono text-white truncate max-w-full">
                                      Video
                                    </span>
                                  </div>
                                ) : (
                                  <img
                                    src={m.url}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                )}

                                {/* Cover indicator on first item */}
                                {mIdx === 0 && (
                                  <span className="absolute top-1 left-1 text-[8px] font-mono font-bold bg-[#ff4b26] text-white px-1.5 py-0.5 rounded shadow">
                                    COVER
                                  </span>
                                )}

                                {/* Delete media item button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMediaItem(project.id, m.id)}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                                  title="Delete this file"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveUploadProjectId(project.id);
                              fileInputRef.current?.click();
                            }}
                            className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white rounded-lg text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#ff4b26]" />
                            <span>Add more photos/videos to this project</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right: Project Information Fields */}
                    <div className="lg:col-span-7 space-y-4">
                      {/* Title & Client Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => handleUpdateField(project.id, 'title', e.target.value)}
                            placeholder="e.g. Apex Athletic System"
                            className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white text-xs font-bold rounded-lg focus:outline-none focus:border-[#ff4b26]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                            Client / Brand
                          </label>
                          <input
                            type="text"
                            value={project.client}
                            onChange={(e) => handleUpdateField(project.id, 'client', e.target.value)}
                            placeholder="e.g. Medar Studio"
                            className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white text-xs rounded-lg focus:outline-none focus:border-[#ff4b26]"
                          />
                        </div>
                      </div>

                      {/* Year & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                            Year
                          </label>
                          <input
                            type="text"
                            value={project.year}
                            onChange={(e) => handleUpdateField(project.id, 'year', e.target.value)}
                            placeholder="2025"
                            className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white text-xs rounded-lg focus:outline-none focus:border-[#ff4b26]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                            Discipline / Category
                          </label>
                          <input
                            type="text"
                            value={project.categoryLabel || 'Brand Identity'}
                            onChange={(e) => handleUpdateField(project.id, 'categoryLabel', e.target.value)}
                            placeholder="e.g. Brand Identity, Sports Design..."
                            className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white text-xs rounded-lg focus:outline-none focus:border-[#ff4b26]"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                          Project Description & Overview
                        </label>
                        <textarea
                          rows={3}
                          value={project.description}
                          onChange={(e) => handleUpdateField(project.id, 'description', e.target.value)}
                          placeholder="Brief explanation of the project visual narrative and art direction..."
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white text-xs rounded-lg focus:outline-none focus:border-[#ff4b26] leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      ) : (
        /* Lead Interest & Telemetry Main Dashboard */
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* 6 Key Metric Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Card 1: Start a Project Clicks */}
              <div className="bg-[#12121b] border border-[#ff4b26]/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    'Start Project' Clicks
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#ff4b26]/20 border border-[#ff4b26]/40 flex items-center justify-center text-[#ff4b26]">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                  {analytics.totalStartProjectClicks}
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-400 truncate">
                  Total CTA Button Clicks
                </div>
              </div>

              {/* Card 2: Contact Form Views */}
              <div className="bg-[#12121b] border border-sky-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Form In-View / Opened
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                  {analytics.totalFormViews}
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-400 truncate">
                  #contact section arrivals
                </div>
              </div>

              {/* Card 3: Direct Email / Gmail Clicks */}
              <div className="bg-[#12121b] border border-rose-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Direct Email Clicks
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                  {analytics.totalEmailDirectClicks}
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-400 truncate">
                  Gmail Web & mailto clicks
                </div>
              </div>

              {/* Card 4: WhatsApp Hotline */}
              <div className="bg-[#12121b] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    WhatsApp Inquiries
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                  {analytics.totalWhatsAppDirectClicks}
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-400 truncate">
                  Direct WhatsApp Hotline chats
                </div>
              </div>

              {/* Card 5: Briefs Submitted */}
              <div className="bg-[#12121b] border border-amber-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Briefs Submitted
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                  {analytics.totalFormSubmissions}
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-400 truncate">
                  Full brief submissions
                </div>
              </div>

              {/* Card 6: Engagement Rate */}
              <div className="bg-[#12121b] border border-violet-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Lead Interest Rate
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                  {analytics.totalStartProjectClicks > 0
                    ? `${(((analytics.totalEmailDirectClicks + analytics.totalWhatsAppDirectClicks + analytics.totalFormSubmissions) / analytics.totalStartProjectClicks) * 100).toFixed(0)}%`
                    : '0%'}
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-400 truncate">
                  Inquiries / CTA Clicks
                </div>
              </div>
            </div>

            {/* Two-Column Section: Left Attribution & Funnel, Right Live Activity Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: CTA Source Attribution & Conversion Funnel */}
              <div className="lg:col-span-5 space-y-6">
                {/* CTA Source Attribution Card */}
                <div className="bg-[#12121b] border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <MousePointerClick className="w-4 h-4 text-[#ff4b26]" />
                      <h3 className="font-heading text-sm font-bold text-white">
                        'Start a Project' Click Breakdown
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      {analytics.totalStartProjectClicks} total
                    </span>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    {/* Source 1: Header Navbar */}
                    <div>
                      <div className="flex justify-between text-neutral-300 mb-1">
                        <span>Top Navigation Bar CTA</span>
                        <span className="text-white font-bold">
                          {analytics.clicksBySource.navbar} ({analytics.totalStartProjectClicks > 0 ? Math.round((analytics.clicksBySource.navbar / analytics.totalStartProjectClicks) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                          className="bg-[#ff4b26] h-full transition-all duration-300"
                          style={{
                            width: `${analytics.totalStartProjectClicks > 0 ? (analytics.clicksBySource.navbar / analytics.totalStartProjectClicks) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Source 2: About / Collaborate Banner */}
                    <div>
                      <div className="flex justify-between text-neutral-300 mb-1">
                        <span>About Section Banner CTA</span>
                        <span className="text-white font-bold">
                          {analytics.clicksBySource.aboutBanner} ({analytics.totalStartProjectClicks > 0 ? Math.round((analytics.clicksBySource.aboutBanner / analytics.totalStartProjectClicks) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{
                            width: `${analytics.totalStartProjectClicks > 0 ? (analytics.clicksBySource.aboutBanner / analytics.totalStartProjectClicks) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Source 3: Mobile Drawer Menu */}
                    <div>
                      <div className="flex justify-between text-neutral-300 mb-1">
                        <span>Mobile Drawer Menu CTA</span>
                        <span className="text-white font-bold">
                          {analytics.clicksBySource.mobileDrawer} ({analytics.totalStartProjectClicks > 0 ? Math.round((analytics.clicksBySource.mobileDrawer / analytics.totalStartProjectClicks) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                          className="bg-sky-500 h-full transition-all duration-300"
                          style={{
                            width: `${analytics.totalStartProjectClicks > 0 ? (analytics.clicksBySource.mobileDrawer / analytics.totalStartProjectClicks) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Source 4: All Projects Modal CTA */}
                    <div>
                      <div className="flex justify-between text-neutral-300 mb-1">
                        <span>Portfolio Archive Overlay CTA</span>
                        <span className="text-white font-bold">
                          {analytics.clicksBySource.allProjectsModal} ({analytics.totalStartProjectClicks > 0 ? Math.round((analytics.clicksBySource.allProjectsModal / analytics.totalStartProjectClicks) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{
                            width: `${analytics.totalStartProjectClicks > 0 ? (analytics.clicksBySource.allProjectsModal / analytics.totalStartProjectClicks) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead Conversion Funnel */}
                <div className="bg-[#12121b] border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-heading text-sm font-bold text-white">
                      Lead Conversion Funnel
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#181824] border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#ff4b26]/20 text-[#ff4b26] flex items-center justify-center font-bold text-[11px]">
                          1
                        </span>
                        <span>Clicked 'Start a Project'</span>
                      </div>
                      <span className="font-bold text-white tabular-nums">
                        {analytics.totalStartProjectClicks}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#181824] border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px]">
                          2
                        </span>
                        <span>Form Viewed / Opened</span>
                      </div>
                      <span className="font-bold text-white tabular-nums">
                        {analytics.totalFormViews}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#181824] border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                          3
                        </span>
                        <span>Inbound Action (Email / WhatsApp / Form)</span>
                      </div>
                      <span className="font-bold text-emerald-400 tabular-nums">
                        {analytics.totalEmailDirectClicks + analytics.totalWhatsAppDirectClicks + analytics.totalFormSubmissions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Formspree Email Gateway Routing Card */}
                <div className="bg-[#12121b] border border-[#ff4b26]/30 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#ff4b26]" />
                      <h3 className="font-heading text-sm font-bold text-white">
                        Passerelle Formspree // medarstudio
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Actif</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <div>
                      <span className="text-[11px] text-neutral-400 block mb-1">
                        Endpoint Formspree (Envoi direct vers medarstudio) :
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formspreeEndpointInput}
                          onChange={(e) => setFormspreeEndpointInput(e.target.value)}
                          placeholder="https://formspree.io/f/xnpjpvaw"
                          className="flex-1 bg-[#181824] border border-white/15 px-3 py-2 text-white text-xs rounded-lg font-mono focus:outline-none focus:border-[#ff4b26]"
                        />
                        <button
                          type="button"
                          onClick={handleSaveFormspreeEndpoint}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-bold cursor-pointer"
                          title="Enregistrer le lien Formspree"
                        >
                          Sauver
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-[#181824] border border-white/5 rounded-lg flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Destination des emails :</span>
                      <strong className="text-white">medarstudio@gmail.com</strong>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleTestFormspree}
                        disabled={isTestingFormspree}
                        className="flex-1 py-2.5 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                      >
                        {isTestingFormspree ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Test en cours...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Tester l'envoi Formspree</span>
                          </>
                        )}
                      </button>

                      <a
                        href="https://formspree.io/forms/xnpjpvaw/submissions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Ouvrir le tableau de bord Formspree"
                      >
                        <span>Formspree</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Privacy & Zero-Intermediary Guarantee */}
                <div className="bg-[#0f0f17] border border-white/10 rounded-2xl p-5 text-xs font-mono text-neutral-400 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Zero-Intermediary Telemetry</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-neutral-400">
                    Lead counters and interaction events are tracked directly within your browser and persisted in secure localStorage. No third-party ad networks, telemetry cookies, or external servers are involved.
                  </p>
                </div>
              </div>

              {/* Right Column: Live Chronological Activity Log */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#12121b] border border-white/10 rounded-2xl p-6">
                  {/* Activity Log Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#ff4b26]" />
                      <h3 className="font-heading text-sm font-bold text-white">
                        Live Activity Stream & Audit Log
                      </h3>
                      <span className="text-[10px] font-mono bg-white/10 text-neutral-300 px-2 py-0.5 rounded">
                        {analytics.recentEvents.length} Recorded
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSimulateTestLead}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white rounded text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                        title="Add a test click to verify tracking"
                      >
                        <Plus className="w-3 h-3 text-[#ff4b26]" />
                        <span>Add Test Event</span>
                      </button>
                    </div>
                  </div>

                  {/* Events Stream */}
                  {analytics.recentEvents.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
                        <Activity className="w-6 h-6" />
                      </div>
                      <h4 className="font-heading text-base font-bold text-white">
                        No lead activity recorded yet
                      </h4>
                      <p className="text-xs text-neutral-400 font-mono max-w-sm mx-auto leading-relaxed">
                        Interactions will appear here in real time as prospective clients click 'Start a Project' or initiate inquiries.
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateTestLead}
                        className="mt-3 px-4 py-2 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-mono text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
                      >
                        <MousePointerClick className="w-3.5 h-3.5" />
                        <span>Simulate Test Click</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                      {analytics.recentEvents
                        .filter((ev) => {
                          if (analyticsFilter === 'clicks' && ev.type !== 'start_project_click') return false;
                          if (analyticsFilter === 'views' && ev.type !== 'form_view') return false;
                          if (
                            analyticsFilter === 'inquiries' &&
                            ev.type !== 'email_direct_click' &&
                            ev.type !== 'whatsapp_direct_click' &&
                            ev.type !== 'form_submit'
                          )
                            return false;

                          if (analyticsSearchQuery.trim()) {
                            const q = analyticsSearchQuery.toLowerCase();
                            const matchLabel = ev.label.toLowerCase().includes(q);
                            const matchSource = (ev.source || '').toLowerCase().includes(q);
                            const matchDetails = (ev.details || '').toLowerCase().includes(q);
                            return matchLabel || matchSource || matchDetails;
                          }
                          return true;
                        })
                        .map((ev) => {
                          let badgeBg = 'bg-[#ff4b26]/20 text-[#ff4b26] border-[#ff4b26]/40';
                          let IconComp = MousePointerClick;

                          if (ev.type === 'form_view') {
                            badgeBg = 'bg-sky-500/20 text-sky-400 border-sky-500/40';
                            IconComp = Eye;
                          } else if (ev.type === 'email_direct_click') {
                            badgeBg = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
                            IconComp = Mail;
                          } else if (ev.type === 'whatsapp_direct_click') {
                            badgeBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                            IconComp = MessageSquare;
                          } else if (ev.type === 'form_submit') {
                            badgeBg = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
                            IconComp = FileText;
                          } else if (ev.type === 'copy_brief') {
                            badgeBg = 'bg-neutral-500/20 text-neutral-300 border-neutral-500/40';
                            IconComp = Copy;
                          }

                          return (
                            <div
                              key={ev.id}
                              className="p-3.5 bg-[#181824] hover:bg-[#1c1c2a] border border-white/5 hover:border-white/15 rounded-xl transition-all duration-150 flex items-start justify-between gap-3"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${badgeBg}`}>
                                  <IconComp className="w-4 h-4" />
                                </div>

                                <div className="min-w-0 space-y-0.5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-heading text-xs font-bold text-white tracking-tight">
                                      {ev.label}
                                    </span>
                                    {ev.source && (
                                      <span className="text-[10px] font-mono bg-white/10 text-neutral-300 px-1.5 py-0.2 rounded border border-white/10">
                                        {ev.source}
                                      </span>
                                    )}
                                  </div>

                                  {ev.details && (
                                    <p className="text-[11px] font-mono text-neutral-400 leading-relaxed truncate">
                                      {ev.details}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-mono text-neutral-400 block tabular-nums">
                                  {ev.formattedTime}
                                </span>
                                <span className="text-[9px] font-mono text-neutral-500 block">
                                  {ev.formattedDate}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default AdminCMSModal;
