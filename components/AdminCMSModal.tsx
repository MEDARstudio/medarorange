import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  FolderKanban,
  Sparkles,
  Info,
  RotateCcw,
  Check,
  ExternalLink,
  Download,
  Upload,
  LogOut,
  Copy,
  Layers,
  Eye,
  Camera,
  CheckCircle2,
  FileImage
} from 'lucide-react';
import { CaseStudy, AgencyService, StudioGeneralInfo, ProjectCategory } from '../types';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  projects: CaseStudy[];
  onUpdateProjects: (projects: CaseStudy[]) => void;
  services: AgencyService[];
  onUpdateServices: (services: AgencyService[]) => void;
  studioInfo: StudioGeneralInfo;
  onUpdateStudioInfo: (info: StudioGeneralInfo) => void;
  onResetDefaults: () => void;
}

type CMSTab = 'postes' | 'nouveau-poste' | 'mediatheque' | 'services' | 'studio' | 'sauvegarde';

// Initial HD Studio Presets
const DEFAULT_PRESET_IMAGES = [
  {
    id: 'preset-1',
    name: 'Haute Horlogerie & Titane 3D',
    category: '3D & WebGL',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'preset-2',
    name: 'Football Matchday & Affiche Sportive',
    category: 'Sports Design',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'preset-3',
    name: 'Branding Épuré & Packaging Luxe',
    category: 'Identité Visuelle',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'preset-4',
    name: 'Art Sculptural & Orfèvrerie 3D',
    category: '3D & Creative',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'preset-5',
    name: 'Typographie d’Édition & Livret d’Art',
    category: 'Print & PAO',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'preset-6',
    name: 'Campagne Digitale Haute Couture',
    category: 'Digital Design',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'
  }
];

const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  projects,
  onUpdateProjects,
  services,
  onUpdateServices,
  studioInfo,
  onUpdateStudioInfo,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<CMSTab>('postes');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Local working copy of state
  const [localProjects, setLocalProjects] = useState<CaseStudy[]>(projects);
  const [localServices, setLocalServices] = useState<AgencyService[]>(services);
  const [localStudioInfo, setLocalStudioInfo] = useState<StudioGeneralInfo>(studioInfo);

  // Studio Media Library (stored in localStorage)
  const [mediaLibrary, setMediaLibrary] = useState<{ id: string; name: string; url: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem('medar_studio_media_library');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PRESET_IMAGES.map((p) => ({
      id: p.id,
      name: p.name,
      url: p.url,
      date: 'Preset Studio'
    }));
  });

  // New Post Form State
  const [newPost, setNewPost] = useState<Partial<CaseStudy>>({
    title: '',
    client: '',
    year: '2026',
    category: 'brand-identity',
    categoryLabel: 'Identité Visuelle & Direction Artistique',
    tagline: '',
    description: '',
    imagePromptFallback: DEFAULT_PRESET_IMAGES[0].url,
    metrics: { stat: '+150%', label: 'Impact Visuel' },
    deliverables: ['Identité de Marque', 'Direction Artistique', 'Déploiement'],
    award: ''
  });

  // Temporary URL input for media library addition
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');

  // Project selector for quick image assignment modal
  const [selectedImageToAssign, setSelectedImageToAssign] = useState<string | null>(null);

  // Hidden file inputs refs
  const postFileInputRef = useRef<HTMLInputElement>(null);
  const libraryFileInputRef = useRef<HTMLInputElement>(null);
  const [activePostIdForUpload, setActivePostIdForUpload] = useState<string | null>(null);

  // Synchronize with props
  React.useEffect(() => {
    if (isOpen) {
      setLocalProjects(projects);
      setLocalServices(services);
      setLocalStudioInfo(studioInfo);
    }
  }, [isOpen, projects, services, studioInfo]);

  const triggerSaveNotification = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => {
      setSaveNotification(null);
    }, 2800);
  };

  const handleSaveAll = () => {
    onUpdateProjects(localProjects);
    onUpdateServices(localServices);
    onUpdateStudioInfo(localStudioInfo);
    try {
      localStorage.setItem('medar_studio_media_library', JSON.stringify(mediaLibrary));
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable:", e);
    }
    triggerSaveNotification('Toutes les modifications et postes ont été enregistrés avec succès !');
  };

  // Convert File to Base64 Data URL
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload image directly for a specific post
  const handleUploadImageForPost = async (e: React.ChangeEvent<HTMLInputElement>, postId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await convertFileToBase64(file);

      // If uploading for a specific post in the list
      if (postId) {
        handleUpdateProjectField(postId, 'imagePromptFallback', base64);
        triggerSaveNotification(`Image chargée avec succès pour le poste !`);
      } else {
        // For new post form
        setNewPost((prev) => ({ ...prev, imagePromptFallback: base64 }));
        triggerSaveNotification(`Image locale appliquée au nouveau poste !`);
      }

      // Automatically add to Studio Media Library as well!
      const newMediaItem = {
        id: `upload-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: base64,
        date: new Date().toLocaleDateString('fr-FR')
      };
      const updatedLib = [newMediaItem, ...mediaLibrary];
      setMediaLibrary(updatedLib);
      try {
        localStorage.setItem('medar_studio_media_library', JSON.stringify(updatedLib));
      } catch (err) {
        console.warn("Image stockée en session mais dépasse le quota localStorage");
      }
    } catch (err) {
      triggerSaveNotification("Impossible de lire ce fichier image.");
    }
  };

  // Upload image to library directly
  const handleUploadImageToLibrary = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await convertFileToBase64(file);
      const newMediaItem = {
        id: `lib-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: base64,
        date: new Date().toLocaleDateString('fr-FR')
      };
      const updatedLib = [newMediaItem, ...mediaLibrary];
      setMediaLibrary(updatedLib);
      try {
        localStorage.setItem('medar_studio_media_library', JSON.stringify(updatedLib));
      } catch (err) {
        console.warn("Image stockée en mémoire mais dépasse le quota localStorage");
      }
      triggerSaveNotification(`Image "${newMediaItem.name}" ajoutée à votre médiathèque !`);
    } catch (err) {
      triggerSaveNotification("Erreur lors de l'import de l'image.");
    }
  };

  // Add Image URL to Media Library
  const handleAddImageUrlToLibrary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    const newMediaItem = {
      id: `url-${Date.now()}`,
      name: newImageName.trim() || `Image ${mediaLibrary.length + 1}`,
      url: newImageUrl.trim(),
      date: new Date().toLocaleDateString('fr-FR')
    };

    const updatedLib = [newMediaItem, ...mediaLibrary];
    setMediaLibrary(updatedLib);
    try {
      localStorage.setItem('medar_studio_media_library', JSON.stringify(updatedLib));
    } catch (e) {
      console.warn("Storage quota exceeded:", e);
    }
    setNewImageUrl('');
    setNewImageName('');
    triggerSaveNotification('Image enregistrée dans la médiathèque !');
  };

  // Delete image from media library
  const handleDeleteMediaItem = (id: string) => {
    const updated = mediaLibrary.filter((m) => m.id !== id);
    setMediaLibrary(updated);
    try {
      localStorage.setItem('medar_studio_media_library', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded:", e);
    }
    triggerSaveNotification('Image retirée de la médiathèque');
  };

  // Create & Publish New Post
  const handleCreateNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.client) {
      triggerSaveNotification('Veuillez renseigner au minimum le titre et le nom du client.');
      return;
    }

    const createdPost: CaseStudy = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      client: newPost.client,
      year: newPost.year || '2026',
      category: (newPost.category as ProjectCategory) || 'brand-identity',
      categoryLabel: newPost.categoryLabel || 'Direction Artistique',
      tagline: newPost.tagline || 'Création visuelle sur mesure',
      description: newPost.description || 'Description complète du projet conçu par Medar Studio.',
      metrics: newPost.metrics || { stat: '+100%', label: 'Impact' },
      deliverables: typeof newPost.deliverables === 'string'
        ? (newPost.deliverables as string).split(',').map((s) => s.trim())
        : (newPost.deliverables || ['Identité de Marque']),
      gradientTheme: 'from-[#ff4b26]/30 to-black',
      accentColor: '#ff4b26',
      imagePromptFallback: newPost.imagePromptFallback || DEFAULT_PRESET_IMAGES[0].url,
      award: newPost.award || undefined
    };

    const updated = [createdPost, ...localProjects];
    setLocalProjects(updated);
    onUpdateProjects(updated);

    // Reset new post form
    setNewPost({
      title: '',
      client: '',
      year: '2026',
      category: 'brand-identity',
      categoryLabel: 'Identité Visuelle & Direction Artistique',
      tagline: '',
      description: '',
      imagePromptFallback: DEFAULT_PRESET_IMAGES[0].url,
      metrics: { stat: '+150%', label: 'Impact Visuel' },
      deliverables: ['Identité de Marque', 'Direction Artistique', 'Déploiement'],
      award: ''
    });

    setActiveTab('postes');
    triggerSaveNotification(`Le poste "${createdPost.title}" a été créé et publié avec succès !`);
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce poste / projet ?')) {
      const filtered = localProjects.filter((p) => p.id !== id);
      setLocalProjects(filtered);
      onUpdateProjects(filtered);
      triggerSaveNotification('Poste supprimé');
    }
  };

  // Quick field updates
  const handleUpdateProjectField = (id: string, field: keyof CaseStudy, value: any) => {
    setLocalProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleUpdateProjectMetrics = (id: string, stat: string, label: string) => {
    setLocalProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, metrics: { stat, label } } : p))
    );
  };

  const handleUpdateServiceField = (id: string, field: keyof AgencyService, value: any) => {
    setLocalServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Assign image from library to a post
  const handleAssignImageToPost = (postId: string, imageUrl: string) => {
    handleUpdateProjectField(postId, 'imagePromptFallback', imageUrl);
    setSelectedImageToAssign(null);
    triggerSaveNotification('Image appliquée au poste sélectionné !');
  };

  // Export JSON
  const handleExportJSON = () => {
    const data = {
      projects: localProjects,
      services: localServices,
      studioInfo: localStudioInfo,
      mediaLibrary: mediaLibrary,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medar-studio-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.projects) setLocalProjects(parsed.projects);
        if (parsed.services) setLocalServices(parsed.services);
        if (parsed.studioInfo) setLocalStudioInfo(parsed.studioInfo);
        if (parsed.mediaLibrary) setMediaLibrary(parsed.mediaLibrary);
        triggerSaveNotification('Données importées avec succès ! Cliquez sur "Enregistrer" pour valider.');
      } catch (err) {
        triggerSaveNotification('Erreur : le fichier JSON sélectionné est invalide.');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#09090d] text-white flex flex-col overflow-hidden font-sans">
      {/* Hidden Global File Inputs for direct upload */}
      <input
        type="file"
        ref={postFileInputRef}
        accept="image/*"
        onChange={(e) => handleUploadImageForPost(e, activePostIdForUpload || undefined)}
        className="hidden"
      />
      <input
        type="file"
        ref={libraryFileInputRef}
        accept="image/*"
        onChange={handleUploadImageToLibrary}
        className="hidden"
      />

      {/* Top Bar Header */}
      <header className="h-16 md:h-20 border-b border-white/10 px-4 md:px-8 flex items-center justify-between shrink-0 bg-[#0d0d14]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#ff4b26] flex items-center justify-center font-bold text-white text-sm shadow-[0_0_15px_rgba(255,75,38,0.5)]">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-base md:text-lg font-bold text-white tracking-tight">
                MEDAR STUDIO CMS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#ff4b26]/15 text-[#ff4b26] border border-[#ff4b26]/30 uppercase tracking-widest font-semibold">
                Live Studio
              </span>
            </div>
            <span className="text-xs font-mono text-neutral-400 hidden sm:block">
              Full control of case studies, official statements, and media assets without code
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(255,75,38,0.3)]"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Live Changes</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border border-white/15"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">View Site</span>
          </button>

          <button
            onClick={onLogout}
            title="Log out"
            className="p-2 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
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
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#161622] border border-[#ff4b26] px-5 py-2.5 shadow-2xl flex items-center gap-2.5 text-xs font-mono text-white"
          >
            <Check className="w-4 h-4 text-[#ff4b26]" />
            <span>{saveNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout: Sidebar Navigation + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-60 md:w-68 border-r border-white/10 bg-[#0c0c12] p-4 flex flex-col justify-between shrink-0">
          <nav className="space-y-1.5 text-xs font-mono">
            {/* Tab: Postes & Projets */}
            <button
              onClick={() => setActiveTab('postes')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'postes'
                  ? 'bg-[#ff4b26] text-white font-bold'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Manage Posts ({localProjects.length})</span>
            </button>

            {/* Tab: Ajouter Nouveau Poste */}
            <button
              onClick={() => setActiveTab('nouveau-poste')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'nouveau-poste'
                  ? 'bg-[#ff4b26] text-white font-bold'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-semibold">+ New Case Study</span>
            </button>

            {/* Tab: Médiathèque & Upload Images */}
            <button
              onClick={() => setActiveTab('mediatheque')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'mediatheque'
                  ? 'bg-[#ff4b26] text-white font-bold'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media Library ({mediaLibrary.length})</span>
            </button>

            {/* Tab: Services */}
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#ff4b26] text-white font-bold'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Services & Offerings</span>
            </button>

            {/* Tab: Qui Sommes-Nous */}
            <button
              onClick={() => setActiveTab('studio')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-[#ff4b26] text-white font-bold'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About & Studio Profile</span>
            </button>

            {/* Tab: Sauvegarde */}
            <button
              onClick={() => setActiveTab('sauvegarde')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'sauvegarde'
                  ? 'bg-[#ff4b26] text-white font-bold'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Backup & Export</span>
            </button>
          </nav>

          {/* Bottom Quick Help Card */}
          <div className="p-3 bg-[#111119] border border-white/5 rounded-lg text-[11px] font-mono text-neutral-400 space-y-1.5">
            <span className="text-[#ff4b26] font-bold block">Quick Tip</span>
            <p className="leading-relaxed">
              Upload visuals directly from your computer or phone without requiring an external hosting provider.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#09090d]">
          {/* ================================================================= */}
          {/* TAB 1: GÉRER LES POSTES EXISTANTS (TEXTES + IMAGES)               */}
          {/* ================================================================= */}
          {activeTab === 'postes' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                    Gestion des Postes & Textes
                  </h2>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    Modifiez tous les textes, images, métriques et livrables de vos {localProjects.length} postes publiés.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('nouveau-poste')}
                  className="px-4 py-2.5 bg-[#ff4b26] hover:bg-white text-white hover:text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shrink-0 shadow-[0_4px_14px_rgba(255,75,38,0.35)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Nouveau Poste</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-8">
                {localProjects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="bg-[#12121b] border border-white/10 p-6 md:p-8 rounded-xl hover:border-[#ff4b26]/50 transition-all space-y-6"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        {/* Live Image Thumbnail with Upload Trigger */}
                        <div className="relative group w-20 h-24 rounded-lg overflow-hidden border border-white/15 bg-neutral-900 shrink-0">
                          {project.imagePromptFallback ? (
                            <img
                              src={project.imagePromptFallback}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                              <FileImage className="w-6 h-6" />
                            </div>
                          )}

                          {/* Hover Overlay to change image */}
                          <button
                            type="button"
                            onClick={() => {
                              setActivePostIdForUpload(project.id);
                              postFileInputRef.current?.click();
                            }}
                            className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer p-1 text-[9px] font-mono text-center"
                            title="Changer l'image"
                          >
                            <Camera className="w-4 h-4 mb-1 text-[#ff4b26]" />
                            <span>Changer</span>
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#ff4b26] font-bold">
                              POST #{idx + 1}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400 border border-white/10 px-2 py-0.5 rounded">
                              {project.categoryLabel}
                            </span>
                          </div>
                          <h3 className="font-heading text-xl font-bold text-white mt-1">
                            {project.title}
                          </h3>
                          <span className="text-xs font-mono text-neutral-400">
                            Client : {project.client} · Année : {project.year}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePostIdForUpload(project.id);
                            postFileInputRef.current?.click();
                          }}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Téléverser Image</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Supprimer le poste"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inputs Grid for Post Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <label className="text-neutral-400 block mb-1">Titre du Poste *</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleUpdateProjectField(project.id, 'title', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Client / Marque *</label>
                        <input
                          type="text"
                          value={project.client}
                          onChange={(e) => handleUpdateProjectField(project.id, 'client', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Année de Réalisation</label>
                        <input
                          type="text"
                          value={project.year}
                          onChange={(e) => handleUpdateProjectField(project.id, 'year', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Catégorie Filtre</label>
                        <select
                          value={project.category}
                          onChange={(e) => handleUpdateProjectField(project.id, 'category', e.target.value as ProjectCategory)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        >
                          <option value="3d-webgl">3D & WebGL</option>
                          <option value="brand-identity">Identité Visuelle</option>
                          <option value="ecommerce-luxe">E-Commerce & Luxe</option>
                          <option value="generative-art">Art Génératif</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Libellé Catégorie Affiché</label>
                        <input
                          type="text"
                          value={project.categoryLabel}
                          onChange={(e) => handleUpdateProjectField(project.id, 'categoryLabel', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Métrique Chiffrée & Libellé</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={project.metrics.stat}
                            onChange={(e) => handleUpdateProjectMetrics(project.id, e.target.value, project.metrics.label)}
                            className="w-24 bg-[#181824] border border-white/10 px-3 py-2 text-white font-bold"
                            placeholder="+240%"
                          />
                          <input
                            type="text"
                            value={project.metrics.label}
                            onChange={(e) => handleUpdateProjectMetrics(project.id, project.metrics.stat, e.target.value)}
                            className="flex-1 bg-[#181824] border border-white/10 px-3 py-2 text-white"
                            placeholder="Conversion"
                          />
                        </div>
                      </div>

                      {/* Image Field with Preview & Paste */}
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-neutral-400 block">URL de l'Image ou Donnée Image</label>
                          <button
                            type="button"
                            onClick={() => {
                              setActivePostIdForUpload(project.id);
                              postFileInputRef.current?.click();
                            }}
                            className="text-[#ff4b26] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Téléverser depuis l'ordinateur</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          value={project.imagePromptFallback}
                          onChange={(e) => handleUpdateProjectField(project.id, 'imagePromptFallback', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white text-[11px] focus:outline-none focus:border-[#ff4b26]"
                          placeholder="https://... ou téléversez un fichier"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Distinction / Award (Optionnel)</label>
                        <input
                          type="text"
                          value={project.award || ''}
                          onChange={(e) => handleUpdateProjectField(project.id, 'award', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                          placeholder="Awwwards Site of the Day"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="text-neutral-400 block mb-1">Slogan / Tagline *</label>
                        <input
                          type="text"
                          value={project.tagline}
                          onChange={(e) => handleUpdateProjectField(project.id, 'tagline', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="text-neutral-400 block mb-1">Description Stratégique du Projet *</label>
                        <textarea
                          rows={3}
                          value={project.description}
                          onChange={(e) => handleUpdateProjectField(project.id, 'description', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26] leading-relaxed"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="text-neutral-400 block mb-1">Livrables Conçus (séparés par des virgules)</label>
                        <input
                          type="text"
                          value={project.deliverables.join(', ')}
                          onChange={(e) =>
                            handleUpdateProjectField(
                              project.id,
                              'deliverables',
                              e.target.value.split(',').map((s) => s.trim())
                            )
                          }
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                          placeholder="Identité de Marque, Affiches Matchday, Rendu 3D"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: CRÉATEUR DE NOUVEAU POSTE (WIZARD DÉDIÉ AVEC LIVE PREVIEW) */}
          {/* ================================================================= */}
          {activeTab === 'nouveau-poste' && (
            <div className="max-w-4xl mx-auto space-y-8 font-mono text-xs">
              <div className="pb-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                    Créer & Publier un Nouveau Poste
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Ajoutez une nouvelle publication ou pièce de design à votre portfolio Medar Studio.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('postes')}
                  className="px-3 py-1.5 border border-white/15 text-neutral-400 hover:text-white transition-colors"
                >
                  Retour aux postes
                </button>
              </div>

              <form onSubmit={handleCreateNewPost} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Left Form Column */}
                  <div className="md:col-span-8 bg-[#12121b] border border-white/10 p-6 md:p-8 rounded-xl space-y-5">
                    <h3 className="font-heading text-base font-bold text-white">
                      Détails & Contenu du Poste
                    </h3>

                    <div>
                      <label className="text-neutral-400 block mb-1">Titre du Projet / Poste *</label>
                      <input
                        type="text"
                        required
                        value={newPost.title || ''}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="e.g. Chronographe Astral"
                        className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff4b26]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-neutral-400 block mb-1">Client ou Projet *</label>
                        <input
                          type="text"
                          required
                          value={newPost.client || ''}
                          onChange={(e) => setNewPost({ ...newPost, client: e.target.value })}
                          placeholder="e.g. Club Sportif / Maison Luxe"
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Année</label>
                        <input
                          type="text"
                          value={newPost.year || '2026'}
                          onChange={(e) => setNewPost({ ...newPost, year: e.target.value })}
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-neutral-400 block mb-1">Catégorie</label>
                        <select
                          value={newPost.category}
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              category: e.target.value as ProjectCategory,
                              categoryLabel:
                                e.target.value === '3d-webgl'
                                  ? '3D & Rendu Immersif'
                                  : e.target.value === 'brand-identity'
                                  ? 'Identité Visuelle & Typographie'
                                  : e.target.value === 'ecommerce-luxe'
                                  ? 'E-Commerce Luxe'
                                  : 'Art Génératif & Sports'
                            })
                          }
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        >
                          <option value="brand-identity">Identité Visuelle</option>
                          <option value="3d-webgl">3D & WebGL</option>
                          <option value="ecommerce-luxe">E-Commerce & Luxe</option>
                          <option value="generative-art">Art Génératif & Sports</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Libellé Affiché</label>
                        <input
                          type="text"
                          value={newPost.categoryLabel || ''}
                          onChange={(e) => setNewPost({ ...newPost, categoryLabel: e.target.value })}
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Slogan / Tagline *</label>
                      <input
                        type="text"
                        value={newPost.tagline || ''}
                        onChange={(e) => setNewPost({ ...newPost, tagline: e.target.value })}
                        placeholder="Une ligne forte qui résume l'essence visuelle"
                        className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Description Complète *</label>
                      <textarea
                        rows={3}
                        value={newPost.description || ''}
                        onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                        placeholder="Expliquez la vision plastique, le problème résolu et le résultat..."
                        className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26] leading-relaxed"
                      />
                    </div>

                    {/* Image Selector for New Post */}
                    <div className="p-4 bg-[#181824] border border-white/10 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-white font-bold block">
                          Image de Couverture du Poste
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setActivePostIdForUpload(null);
                            postFileInputRef.current?.click();
                          }}
                          className="px-3 py-1 bg-[#ff4b26] hover:bg-white text-white hover:text-black transition-colors rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Téléverser depuis cet appareil</span>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={newPost.imagePromptFallback || ''}
                        onChange={(e) => setNewPost({ ...newPost, imagePromptFallback: e.target.value })}
                        placeholder="Collez une URL d'image ou cliquez sur Téléverser..."
                        className="w-full bg-[#101019] border border-white/15 px-3 py-2 text-white text-[11px] focus:outline-none focus:border-[#ff4b26]"
                      />

                      <div className="flex items-center gap-2 pt-1 text-[10px] text-neutral-400">
                        <span>Ou choisissez parmi les presets :</span>
                        <div className="flex flex-wrap gap-1.5">
                          {DEFAULT_PRESET_IMAGES.slice(0, 3).map((p) => (
                            <button
                              type="button"
                              key={p.name}
                              onClick={() => setNewPost({ ...newPost, imagePromptFallback: p.url })}
                              className="px-2 py-0.5 bg-white/5 hover:bg-white/20 border border-white/10 text-neutral-300 rounded cursor-pointer"
                            >
                              {p.name.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-neutral-400 block mb-1">Métrique Clé (Stat)</label>
                        <input
                          type="text"
                          value={newPost.metrics?.stat || ''}
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              metrics: { stat: e.target.value, label: newPost.metrics?.label || 'Impact' }
                            })
                          }
                          placeholder="+280%"
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Libellé Métrique</label>
                        <input
                          type="text"
                          value={newPost.metrics?.label || ''}
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              metrics: { stat: newPost.metrics?.stat || '+100%', label: e.target.value }
                            })
                          }
                          placeholder="Croissance conversion"
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Livrables (séparés par des virgules)</label>
                      <input
                        type="text"
                        value={Array.isArray(newPost.deliverables) ? newPost.deliverables.join(', ') : ''}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            deliverables: e.target.value.split(',').map((s) => s.trim())
                          })
                        }
                        placeholder="Identité de Marque, 3D CGI, Affiches Matchday"
                        className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer shadow-[0_4px_16px_rgba(255,75,38,0.35)] flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Publier Immédiatement ce Poste</span>
                    </button>
                  </div>

                  {/* Right Live Preview Column */}
                  <div className="md:col-span-4 space-y-4">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block">
                      Aperçu de la Carte 4:5
                    </span>
                    <div className="w-full aspect-[4/5] bg-[#12121b] border border-white/15 overflow-hidden relative flex flex-col justify-between p-4 shadow-xl">
                      {newPost.imagePromptFallback && (
                        <img
                          src={newPost.imagePromptFallback}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

                      <div className="relative z-10 flex items-center justify-between text-[9px] text-white/70">
                        <span className="bg-black/60 px-2 py-0.5 border border-white/10">4:5 POST</span>
                        <span className="bg-black/60 px-2 py-0.5 border border-white/10">{newPost.year || '2026'}</span>
                      </div>

                      <div className="relative z-10 border-t border-white/10 pt-2.5">
                        <span className="text-[9px] text-neutral-400 uppercase block">
                          {newPost.client || 'Client'}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-white truncate">
                          {newPost.title || 'Titre du Projet'}
                        </h4>
                        <span className="text-[10px] text-[#ff4b26] block truncate">
                          {newPost.tagline || 'Tagline du poste'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/10 text-[11px] text-neutral-400 space-y-1">
                      <span className="text-white font-bold block">Publication Directe</span>
                      <p>Ce poste sera immédiatement inséré en première position de la grille de votre site.</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: MÉDIATHÈQUE D'IMAGES DU STUDIO (UPLOAD LOCAL + GALERIE)   */}
          {/* ================================================================= */}
          {activeTab === 'mediatheque' && (
            <div className="max-w-5xl mx-auto space-y-8 font-mono text-xs">
              <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                    Médiathèque & Gestionnaire d'Images
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Téléversez vos photos, affiches et visuels 3D directement depuis votre appareil.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => libraryFileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,75,38,0.3)] shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>Téléverser une Image Locale</span>
                </button>
              </div>

              {/* Add by URL input */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <h3 className="font-heading text-base font-bold text-white">
                  Ajouter une Image par Lien Externe (URL)
                </h3>
                <form onSubmit={handleAddImageUrlToLibrary} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newImageName}
                    onChange={(e) => setNewImageName(e.target.value)}
                    placeholder="Nom du visuel (e.g. Affiche Matchday 2026)"
                    className="sm:w-64 bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                  />
                  <input
                    type="text"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Ajouter à la Médiathèque
                  </button>
                </form>
              </div>

              {/* Image Grid with Quick Assign to Posts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-white">
                    Images Disponibles ({mediaLibrary.length})
                  </h3>
                  <span className="text-neutral-400 text-[11px]">
                    Cliquez sur "Appliquer à un poste" pour changer le visuel d'un projet
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaLibrary.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-[#12121b] border border-white/10 rounded-xl overflow-hidden hover:border-[#ff4b26] transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(item.url);
                              triggerSaveNotification('Lien copié dans le presse-papiers !');
                            }}
                            className="p-1.5 bg-black/70 hover:bg-[#ff4b26] text-white rounded transition-colors cursor-pointer"
                            title="Copier le lien"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMediaItem(item.id)}
                            className="p-1.5 bg-black/70 hover:bg-red-500 text-white rounded transition-colors cursor-pointer"
                            title="Supprimer de la médiathèque"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <span className="font-bold text-white text-xs block truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 block mt-0.5">
                            Ajouté le {item.date}
                          </span>
                        </div>

                        {/* Quick Assign Dropdown */}
                        <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignImageToPost(e.target.value, item.url);
                                e.target.value = '';
                              }
                            }}
                            defaultValue=""
                            className="w-full bg-[#181824] border border-white/15 px-2.5 py-1.5 text-[11px] text-neutral-200 focus:outline-none focus:border-[#ff4b26]"
                          >
                            <option value="" disabled>
                              Appliquer à un poste...
                            </option>
                            {localProjects.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title} ({p.client})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: SERVICES                                                   */}
          {/* ================================================================= */}
          {activeTab === 'services' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="pb-6 border-b border-white/10">
                <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                  Gestion des 6 Services du Studio
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Modifiez les intitulés, descriptions et livrables de chaque discipline.
                </p>
              </div>

              <div className="space-y-6">
                {localServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[#ff4b26] font-bold text-sm">
                        {service.number} — {service.title}
                      </span>
                      <span className="text-neutral-500 text-[11px]">{service.tag}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-neutral-400 block mb-1">Titre de la Prestation</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => handleUpdateServiceField(service.id, 'title', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Tag / Spécialité</label>
                        <input
                          type="text"
                          value={service.tag}
                          onChange={(e) => handleUpdateServiceField(service.id, 'tag', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-neutral-400 block mb-1">Description Stratégique</label>
                        <textarea
                          rows={2}
                          value={service.description}
                          onChange={(e) => handleUpdateServiceField(service.id, 'description', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: QUI SOMMES-NOUS & STUDIO                                   */}
          {/* ================================================================= */}
          {activeTab === 'studio' && (
            <div className="max-w-4xl mx-auto space-y-8 font-mono text-xs">
              <div className="pb-6 border-b border-white/10">
                <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                  Informations Générales & Qui Sommes-Nous
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Mettez à jour le manifeste officiel, les coordonnées et les informations du fondateur.
                </p>
              </div>

              {/* Manifesto & Official Text */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <h3 className="font-heading text-base font-bold text-white text-sm">
                  Texte Officiel du Manifeste
                </h3>
                <div>
                  <label className="text-neutral-400 block mb-1">Citation Mise en Avant</label>
                  <input
                    type="text"
                    value={localStudioInfo.officialQuote}
                    onChange={(e) =>
                      setLocalStudioInfo({ ...localStudioInfo, officialQuote: e.target.value })
                    }
                    className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Paragraphe Complet du Studio</label>
                  <textarea
                    rows={4}
                    value={localStudioInfo.officialParagraph}
                    onChange={(e) =>
                      setLocalStudioInfo({ ...localStudioInfo, officialParagraph: e.target.value })
                    }
                    className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26] leading-relaxed"
                  />
                </div>
              </div>

              {/* Founder Information */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <h3 className="font-heading text-base font-bold text-white text-sm">
                  Identité du Fondateur & Direction
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 block mb-1">Nom du Fondateur</label>
                    <input
                      type="text"
                      value={localStudioInfo.founderName}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, founderName: e.target.value })
                      }
                      className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Rôle Officiel</label>
                    <input
                      type="text"
                      value={localStudioInfo.founderRole}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, founderRole: e.target.value })
                      }
                      className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-neutral-400 block mb-1">Domaines d'Expertise (Focus)</label>
                    <input
                      type="text"
                      value={localStudioInfo.founderFocus}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, founderFocus: e.target.value })
                      }
                      className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-neutral-400 block mb-1">Biographie du Fondateur</label>
                    <textarea
                      rows={3}
                      value={localStudioInfo.founderBio}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, founderBio: e.target.value })
                      }
                      className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26] leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <h3 className="font-heading text-base font-bold text-white text-sm">
                  Coordonnées & Localisation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 block mb-1">Email de Contact</label>
                    <input
                      type="email"
                      value={localStudioInfo.email}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, email: e.target.value })
                      }
                      className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={localStudioInfo.phone}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, phone: e.target.value })
                      }
                      className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Ville & Arrondissement</label>
                    <input
                      type="text"
                      value={localStudioInfo.city}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, city: e.target.value })
                      }
                      className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Adresse Complète</label>
                    <input
                      type="text"
                      value={localStudioInfo.address}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, address: e.target.value })
                      }
                      className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: SAUVEGARDE & EXPORT                                        */}
          {/* ================================================================= */}
          {activeTab === 'sauvegarde' && (
            <div className="max-w-4xl mx-auto space-y-8 font-mono text-xs">
              <div className="pb-6 border-b border-white/10">
                <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                  Sauvegarde, Export & Restauration
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Gérez la persistance de vos données dans le navigateur ou téléchargez une sauvegarde JSON.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-[#ff4b26]" />
                    <h3 className="font-heading text-base font-bold text-white">
                      Exporter la Configuration
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Téléchargez l'intégralité de vos postes, images téléversées, services et textes au format JSON pour conserver une copie de secours.
                  </p>
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger la Sauvegarde JSON</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-[#ff4b26]" />
                    <h3 className="font-heading text-base font-bold text-white">
                      Importer une Sauvegarde
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Restaurez une configuration préalablement exportée pour charger vos projets et textes en un instant.
                  </p>
                  <label className="w-full py-3 bg-white/10 hover:bg-[#ff4b26] text-white font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 text-center block">
                    <Upload className="w-4 h-4" />
                    <span>Choisir un fichier JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="bg-[#1a1114] border border-red-500/20 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-red-400" />
                  <h3 className="font-heading text-base font-bold text-white">
                    Réinitialisation d'Atelier
                  </h3>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Cette action réinitialise tous les projets, textes officiels et services aux paramètres d'origine de Medar Studio.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les données aux valeurs par défaut ?')) {
                      onResetDefaults();
                      onClose();
                    }
                  }}
                  className="px-5 py-3 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Réinitialiser aux Valeurs par Défaut
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminCMSModal;
