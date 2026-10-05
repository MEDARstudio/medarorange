import React, { useState, useRef, useEffect } from 'react';
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
  FileImage,
  DollarSign,
  Film,
  Video,
  Play,
  PlusCircle,
  Instagram,
  RefreshCw,
  Link as LinkIcon,
  AlertCircle,
  Compass
} from 'lucide-react';
import { CaseStudy, AgencyService, StudioGeneralInfo, ProjectCategory, ProjectMediaItem } from '../types';
import { isInstagramUrl, getInstagramShortcode, getInstagramEmbedUrl } from '../utils/mediaHelper';

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
  budgetTiers?: string[];
  onUpdateBudgetTiers?: (tiers: string[]) => void;
  onResetDefaults: () => void;
}

type CMSTab = 'posts' | 'new-post' | 'instagram' | 'media-library' | 'services' | 'pricing' | 'studio' | 'backup';

// HD Studio Presets (Clean, ready for device upload)
const DEFAULT_PRESET_IMAGES: { id: string; name: string; category: string; url: string }[] = [];

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
  budgetTiers = ['< €100', '€100 - €300', '€300 - €750', '€750+'],
  onUpdateBudgetTiers,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<CMSTab>('posts');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Local working copy of state
  const [localProjects, setLocalProjects] = useState<CaseStudy[]>(projects);
  const [localServices, setLocalServices] = useState<AgencyService[]>(services);
  const [localStudioInfo, setLocalStudioInfo] = useState<StudioGeneralInfo>(studioInfo);
  const [localBudgetTiers, setLocalBudgetTiers] = useState<string[]>(budgetTiers);
  const [newBudgetTierInput, setNewBudgetTierInput] = useState('');

  // Synchronize state if external props change
  useEffect(() => {
    if (budgetTiers) {
      setLocalBudgetTiers(budgetTiers);
    }
  }, [budgetTiers]);

  const handleSaveBudgetTiers = (tiersToSave?: string[]) => {
    const list = tiersToSave || localBudgetTiers;
    if (list.length === 0) return;
    setLocalBudgetTiers(list);
    if (onUpdateBudgetTiers) {
      onUpdateBudgetTiers(list);
    }
    setSaveNotification('Pricing and target budget tiers updated successfully!');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Studio Media Library (stored in localStorage)
  const [mediaLibrary, setMediaLibrary] = useState<{ id: string; name: string; url: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem('medar_studio_media_library_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // New Post Form State (Clean and streamlined for freelance portfolio)
  const [newPost, setNewPost] = useState<Partial<CaseStudy>>({
    title: '',
    client: '',
    year: '2025',
    category: 'brand-identity',
    categoryLabel: 'Brand Identity',
    description: '',
    imagePromptFallback: ''
  });

  // Multi-media state for New Post (Multiple photos + videos)
  const [newPostMedia, setNewPostMedia] = useState<ProjectMediaItem[]>([]);
  const [newVideoUrlInput, setNewVideoUrlInput] = useState('');

  // Temporary URL input for media library addition
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');

  // Project selector for quick image assignment modal
  const [selectedImageToAssign, setSelectedImageToAssign] = useState<string | null>(null);
  const [isSelectingFounderImage, setIsSelectingFounderImage] = useState(false);

  // Hidden file inputs refs
  const postFileInputRef = useRef<HTMLInputElement>(null);
  const libraryFileInputRef = useRef<HTMLInputElement>(null);
  const founderFileInputRef = useRef<HTMLInputElement>(null);
  const newPostMediaFileInputRef = useRef<HTMLInputElement>(null);
  const existingPostMediaFileInputRef = useRef<HTMLInputElement>(null);
  const [activePostIdForUpload, setActivePostIdForUpload] = useState<string | null>(null);
  const [activePostIdForMultiMedia, setActivePostIdForMultiMedia] = useState<string | null>(null);
  const [existingVideoUrlInput, setExistingVideoUrlInput] = useState('');
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);

  // Instagram Integration & Importer States
  const batchInstagramFileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingBatchInstagram, setIsDraggingBatchInstagram] = useState(false);
  const [batchLinksText, setBatchLinksText] = useState('');
  const [batchDefaultCategory, setBatchDefaultCategory] = useState<ProjectCategory>('visual-design');
  const [instagramFeed, setInstagramFeed] = useState<any[]>([]);
  const [isFetchingInstagram, setIsFetchingInstagram] = useState(false);
  const [instagramFetchError, setInstagramFetchError] = useState<string | null>(null);
  const [directIgPostUrl, setDirectIgPostUrl] = useState('');
  const [directIgMediaUrl, setDirectIgMediaUrl] = useState('');
  const [directIgTitle, setDirectIgTitle] = useState('');
  const [directIgCaption, setDirectIgCaption] = useState('');
  const [directIgCategory, setDirectIgCategory] = useState<ProjectCategory>('visual-design');

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
      localStorage.setItem('medar_studio_media_library_v2', JSON.stringify(mediaLibrary));
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable:", e);
    }
    triggerSaveNotification('All changes and posts have been saved successfully!');
  };

  // Smart client-side compression for high-res images so users can upload dozens of photos safely
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!file.type.startsWith('image/')) {
          resolve(result);
          return;
        }
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_DIM = 1400;
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
            resolve(canvas.toDataURL('image/jpeg', 0.84));
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

  // Convert File to Base64 Data URL (for videos and direct reads)
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
        triggerSaveNotification(`Image uploaded successfully for this post!`);
      } else {
        // For new post form
        setNewPost((prev) => ({ ...prev, imagePromptFallback: base64 }));
        triggerSaveNotification(`Image applied to new case study!`);
      }

      // Automatically add to Studio Media Library as well!
      const newMediaItem = {
        id: `upload-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: base64,
        date: new Date().toLocaleDateString('en-US')
      };
      const updatedLib = [newMediaItem, ...mediaLibrary];
      setMediaLibrary(updatedLib);
      try {
        localStorage.setItem('medar_studio_media_library_v2', JSON.stringify(updatedLib));
      } catch (err) {
        console.warn("Image stored in memory but exceeded localStorage quota");
      }
    } catch (err) {
      triggerSaveNotification("Unable to read this image file.");
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
        date: new Date().toLocaleDateString('en-US')
      };
      const updatedLib = [newMediaItem, ...mediaLibrary];
      setMediaLibrary(updatedLib);
      try {
        localStorage.setItem('medar_studio_media_library_v2', JSON.stringify(updatedLib));
      } catch (err) {
        console.warn("Image stored in memory but exceeded localStorage quota");
      }
      triggerSaveNotification(`Image "${newMediaItem.name}" added to media library!`);
    } catch (err) {
      triggerSaveNotification("Error while uploading image.");
    }
  };

  // Upload Founder Profile Photo directly
  const handleUploadFounderImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await convertFileToBase64(file);
      setLocalStudioInfo((prev) => ({ ...prev, founderImage: base64 }));
      triggerSaveNotification('Founder profile photo updated successfully!');

      // Add to Studio Media Library as well
      const newMediaItem = {
        id: `founder-${Date.now()}`,
        name: `Founder - ${file.name.replace(/\.[^/.]+$/, '')}`,
        url: base64,
        date: new Date().toLocaleDateString('en-US')
      };
      const updatedLib = [newMediaItem, ...mediaLibrary];
      setMediaLibrary(updatedLib);
      try {
        localStorage.setItem('medar_studio_media_library_v2', JSON.stringify(updatedLib));
      } catch (err) {
        console.warn("Storage quota exceeded", err);
      }
    } catch {
      triggerSaveNotification('Unable to process the selected image.');
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
      date: new Date().toLocaleDateString('en-US')
    };

    const updatedLib = [newMediaItem, ...mediaLibrary];
    setMediaLibrary(updatedLib);
    try {
      localStorage.setItem('medar_studio_media_library_v2', JSON.stringify(updatedLib));
    } catch (e) {
      console.warn("Storage quota exceeded:", e);
    }
    setNewImageUrl('');
    setNewImageName('');
    triggerSaveNotification('Image saved to media library!');
  };

  // Delete image from media library
  const handleDeleteMediaItem = (id: string) => {
    const updated = mediaLibrary.filter((m) => m.id !== id);
    setMediaLibrary(updated);
    try {
      localStorage.setItem('medar_studio_media_library_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded:", e);
    }
    triggerSaveNotification('Image removed from media library');
  };

  // Multi-media upload for New Post (Multiple photos & videos from device)
  const handleUploadNewPostMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const added: ProjectMediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVid = file.type.startsWith('video/');
        const base64 = isVid ? await convertFileToBase64(file) : await compressImageFile(file);
        added.push({
          id: `media-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          type: isVid ? 'video' : 'image',
          url: base64,
          title: file.name.replace(/\.[^/.]+$/, '')
        });
      }
      setNewPostMedia((prev) => [...prev, ...added]);
      if (!newPost.imagePromptFallback && added.length > 0) {
        const firstImg = added.find(m => m.type === 'image')?.url || added[0].url;
        setNewPost((prev) => ({ ...prev, imagePromptFallback: firstImg }));
      }
      triggerSaveNotification(`${added.length} photo(s)/vidéo(s) ajoutée(s) au post !`);
    } catch {
      triggerSaveNotification('Erreur lors du traitement des fichiers.');
    }
  };

  // Drag & drop upload for New Post media
  const handleDropMedia = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingMedia(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    try {
      const added: ProjectMediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVid = file.type.startsWith('video/');
        const isImg = file.type.startsWith('image/');
        if (!isVid && !isImg) continue;
        const base64 = isVid ? await convertFileToBase64(file) : await compressImageFile(file);
        added.push({
          id: `media-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          type: isVid ? 'video' : 'image',
          url: base64,
          title: file.name.replace(/\.[^/.]+$/, '')
        });
      }
      if (added.length > 0) {
        setNewPostMedia((prev) => [...prev, ...added]);
        if (!newPost.imagePromptFallback) {
          const firstImg = added.find(m => m.type === 'image')?.url || added[0].url;
          setNewPost((prev) => ({ ...prev, imagePromptFallback: firstImg }));
        }
        triggerSaveNotification(`${added.length} fichier(s) photo/vidéo déposé(s) !`);
      }
    } catch {
      triggerSaveNotification('Erreur lors de la lecture des fichiers glissés.');
    }
  };

  // Add video URL to New Post
  const handleAddVideoUrlToNewPost = () => {
    if (!newVideoUrlInput.trim()) return;
    const newItem: ProjectMediaItem = {
      id: `vid-${Date.now()}`,
      type: 'video',
      url: newVideoUrlInput.trim(),
      title: 'Video Asset'
    };
    setNewPostMedia((prev) => [...prev, newItem]);
    setNewVideoUrlInput('');
    triggerSaveNotification('Video added to post!');
  };

  // Remove media item from New Post
  const handleRemoveNewPostMedia = (mediaId: string) => {
    setNewPostMedia((prev) => {
      const updated = prev.filter((m) => m.id !== mediaId);
      if (newPost.imagePromptFallback && !updated.some(m => m.url === newPost.imagePromptFallback)) {
        setNewPost((p) => ({ ...p, imagePromptFallback: updated[0]?.url || '' }));
      }
      return updated;
    });
  };

  // Set media item as cover in New Post
  const handleSetNewPostCover = (mediaItem: ProjectMediaItem) => {
    setNewPost((prev) => ({
      ...prev,
      imagePromptFallback: mediaItem.url,
      videoUrl: mediaItem.type === 'video' ? mediaItem.url : prev.videoUrl
    }));
    setNewPostMedia((prev) => [mediaItem, ...prev.filter(m => m.id !== mediaItem.id)]);
    triggerSaveNotification('Selected as cover for this project!');
  };

  // Multi-media upload for an existing post
  const handleUploadMediaToExistingPost = async (e: React.ChangeEvent<HTMLInputElement>, postId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const added: ProjectMediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVid = file.type.startsWith('video/');
        const base64 = await convertFileToBase64(file);
        added.push({
          id: `media-${Date.now()}-${i}`,
          type: isVid ? 'video' : 'image',
          url: base64,
          title: file.name.replace(/\.[^/.]+$/, '')
        });
      }

      const updated = localProjects.map((p) => {
        if (p.id !== postId) return p;
        const currentMedia = p.media && p.media.length > 0
          ? p.media
          : (p.imagePromptFallback ? [{ id: `img-0`, type: 'image' as const, url: p.imagePromptFallback }] : []);
        const nextMedia = [...currentMedia, ...added];
        const coverImg = p.imagePromptFallback || nextMedia.find(m => m.type === 'image')?.url || nextMedia[0]?.url;
        return {
          ...p,
          media: nextMedia,
          imagePromptFallback: coverImg
        };
      });

      setLocalProjects(updated);
      onUpdateProjects(updated);
      try {
        localStorage.setItem('medar_studio_projects_v2', JSON.stringify(updated));
      } catch (err) {
        console.warn("Storage quota exceeded", err);
      }
      triggerSaveNotification(`${added.length} file(s) added to project!`);
    } catch {
      triggerSaveNotification('Error while reading files.');
    }
  };

  // Add video URL to existing post
  const handleAddVideoToExistingPost = (postId: string) => {
    if (!existingVideoUrlInput.trim()) return;
    const newItem: ProjectMediaItem = {
      id: `vid-${Date.now()}`,
      type: 'video',
      url: existingVideoUrlInput.trim(),
      title: 'Video Asset'
    };

    const updated = localProjects.map((p) => {
      if (p.id !== postId) return p;
      const currentMedia = p.media && p.media.length > 0
        ? p.media
        : (p.imagePromptFallback ? [{ id: `img-0`, type: 'image' as const, url: p.imagePromptFallback }] : []);
      return {
        ...p,
        media: [...currentMedia, newItem],
        videoUrl: p.videoUrl || newItem.url
      };
    });

    setLocalProjects(updated);
    onUpdateProjects(updated);
    setExistingVideoUrlInput('');
    setActivePostIdForMultiMedia(null);
    triggerSaveNotification('Video asset added to project!');
  };

  // Remove media from an existing post
  const handleRemoveMediaFromExistingPost = (postId: string, mediaId: string) => {
    const updated = localProjects.map((p) => {
      if (p.id !== postId) return p;
      const currentMedia = p.media || [];
      const filtered = currentMedia.filter(m => m.id !== mediaId);
      return {
        ...p,
        media: filtered,
        imagePromptFallback: filtered.length > 0 ? (filtered.find(m => m.type === 'image')?.url || filtered[0].url) : ''
      };
    });

    setLocalProjects(updated);
    onUpdateProjects(updated);
    triggerSaveNotification('Media removed from project');
  };

  // Create & Publish New Post (Requires at least 1 photo or video)
  const handleCreateNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.client) {
      triggerSaveNotification('Please enter at least a project title and client name.');
      return;
    }

    const mediaList = [...newPostMedia];
    if (newPost.imagePromptFallback && !mediaList.some(m => m.url === newPost.imagePromptFallback)) {
      mediaList.unshift({
        id: `media-${Date.now()}`,
        type: 'image',
        url: newPost.imagePromptFallback,
        title: 'Cover Image'
      });
    }

    if (mediaList.length === 0) {
      triggerSaveNotification('Please upload at least 1 photo or video so visitors can see this project!');
      return;
    }

    const firstImage = mediaList.find(m => m.type === 'image')?.url || mediaList[0].url;
    const firstVideo = mediaList.find(m => m.type === 'video')?.url;

    const createdPost: CaseStudy = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      client: newPost.client,
      year: newPost.year || '2025',
      category: (newPost.category as ProjectCategory) || 'brand-identity',
      categoryLabel: newPost.categoryLabel || 'Brand Identity',
      description: newPost.description || 'Bespoke freelance design work crafted by Medar Studio.',
      media: mediaList,
      imagePromptFallback: firstImage,
      videoUrl: firstVideo,
      gradientTheme: 'from-[#ff4b26]/30 to-[#0c0c10]',
      accentColor: '#ff4b26'
    };

    const updated = [createdPost, ...localProjects];
    setLocalProjects(updated);
    onUpdateProjects(updated);
    try {
      localStorage.setItem('medar_studio_projects_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }

    // Reset new post form
    setNewPost({
      title: '',
      client: '',
      year: '2025',
      category: 'brand-identity',
      categoryLabel: 'Brand Identity',
      description: '',
      imagePromptFallback: ''
    });
    setNewPostMedia([]);
    setNewVideoUrlInput('');

    setActiveTab('posts');
    triggerSaveNotification(`Project "${createdPost.title}" published with ${mediaList.length} media file(s)!`);
  };

  // Fetch Instagram feed from Meta Graph API using user's access token
  const handleFetchInstagramFeed = async () => {
    const token = localStudioInfo.instagramToken?.trim();
    if (!token) {
      setInstagramFetchError("Veuillez renseigner votre jeton d'accès Instagram (Access Token) ci-dessous.");
      return;
    }
    setIsFetchingInstagram(true);
    setInstagramFetchError(null);
    try {
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url}&access_token=${token}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Erreur Instagram API HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data && data.data && data.data.length > 0) {
        setInstagramFeed(data.data);
        triggerSaveNotification(`${data.data.length} publication(s) Instagram récupérée(s) !`);
      } else {
        setInstagramFeed([]);
        triggerSaveNotification("Aucune publication trouvée sur ce compte Instagram.");
      }
    } catch (err: any) {
      console.error("Instagram fetch error:", err);
      setInstagramFetchError(err.message || "Impossible de contacter l'API Instagram. Vérifiez votre jeton.");
    } finally {
      setIsFetchingInstagram(false);
    }
  };

  // 1-Click Import of an Instagram post (photo, carousel album, or reel video) into Portfolio
  const handleImportInstagramPost = (igPost: any) => {
    const mediaItems: ProjectMediaItem[] = [];

    if (igPost.children && igPost.children.data && igPost.children.data.length > 0) {
      igPost.children.data.forEach((c: any, idx: number) => {
        mediaItems.push({
          id: `ig-child-${c.id || Date.now()}-${idx}`,
          type: c.media_type === 'VIDEO' ? 'video' : 'image',
          url: c.media_url,
          title: `Instagram Media #${idx + 1}`
        });
      });
    } else if (igPost.media_url) {
      mediaItems.push({
        id: `ig-${igPost.id || Date.now()}`,
        type: igPost.media_type === 'VIDEO' ? 'video' : 'image',
        url: igPost.media_url,
        title: 'Instagram Post'
      });
    }

    if (mediaItems.length === 0) {
      triggerSaveNotification("Aucune image ou vidéo exploitable trouvée pour ce post.");
      return;
    }

    const caption = igPost.caption || 'Publication Instagram';
    const firstLine = caption.split('\n')[0].replace(/[#@][\w]+/g, '').trim() || 'Instagram Artwork';
    const postTitle = firstLine.length > 40 ? firstLine.substring(0, 40) + '...' : firstLine;
    const postYear = igPost.timestamp ? new Date(igPost.timestamp).getFullYear().toString() : '2025';
    const firstImage = mediaItems.find((m) => m.type === 'image')?.url || mediaItems[0]?.url;
    const firstVideo = mediaItems.find((m) => m.type === 'video')?.url;

    const newPostItem: CaseStudy = {
      id: `post-ig-${igPost.id || Date.now()}`,
      title: postTitle,
      client: localStudioInfo.instagramHandle || 'Instagram',
      year: postYear,
      category: 'visual-design',
      categoryLabel: 'Visual Design',
      description: caption,
      media: mediaItems,
      imagePromptFallback: firstImage,
      videoUrl: firstVideo,
      accentColor: '#ff4b26',
      gradientTheme: 'from-[#ff4b26]/30 to-[#0c0c10]'
    };

    const updated = [newPostItem, ...localProjects];
    setLocalProjects(updated);
    onUpdateProjects(updated);
    try {
      localStorage.setItem('medar_studio_projects_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }

    triggerSaveNotification(`Publication "${postTitle}" importée avec succès dans le portfolio !`);
  };

  // Direct manual Instagram Post URL import
  const handleDirectInstagramImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directIgMediaUrl.trim() && !directIgPostUrl.trim()) {
      triggerSaveNotification("Veuillez renseigner le lien média ou l'URL du post Instagram.");
      return;
    }

    const mediaUrl = directIgMediaUrl.trim() || directIgPostUrl.trim();
    const isVideo = mediaUrl.includes('.mp4') || directIgPostUrl.includes('/reel/');

    const newPostItem: CaseStudy = {
      id: `post-ig-${Date.now()}`,
      title: directIgTitle.trim() || 'Instagram Visual Artwork',
      client: localStudioInfo.instagramHandle || 'Instagram Project',
      year: new Date().getFullYear().toString(),
      category: directIgCategory,
      categoryLabel:
        directIgCategory === 'brand-identity'
          ? 'Brand Identity'
          : directIgCategory === 'sports-design'
          ? 'Sports Design'
          : directIgCategory === '3d-webgl'
          ? '3D Design'
          : 'Visual Design',
      description: directIgCaption.trim() || `Design importé depuis Instagram (${directIgPostUrl.trim()})`,
      media: [
        {
          id: `media-ig-${Date.now()}`,
          type: isVideo ? 'video' : 'image',
          url: mediaUrl,
          title: 'Instagram Visual'
        }
      ],
      imagePromptFallback: isVideo ? '' : mediaUrl,
      videoUrl: isVideo ? mediaUrl : undefined,
      accentColor: '#ff4b26',
      gradientTheme: 'from-[#ff4b26]/30 to-[#0c0c10]'
    };

    const updated = [newPostItem, ...localProjects];
    setLocalProjects(updated);
    onUpdateProjects(updated);
    try {
      localStorage.setItem('medar_studio_projects_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }

    setDirectIgPostUrl('');
    setDirectIgMediaUrl('');
    setDirectIgTitle('');
    setDirectIgCaption('');
    triggerSaveNotification('Post Instagram importé avec succès dans le portfolio !');
  };

  // Batch upload: Takes multiple photos/videos and converts each one into a standalone portfolio project in 1 second!
  const handleBatchInstagramFiles = async (fileList: FileList | File[]) => {
    if (!fileList || fileList.length === 0) return;
    try {
      const newPosts: CaseStudy[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const isVid = file.type.startsWith('video/');
        const isImg = file.type.startsWith('image/');
        if (!isVid && !isImg) continue;

        const base64 = isVid ? await convertFileToBase64(file) : await compressImageFile(file);
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .trim();
        const formattedTitle = cleanName
          ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
          : `Instagram Project #${localProjects.length + i + 1}`;

        const post: CaseStudy = {
          id: `post-batch-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          title: formattedTitle,
          client: localStudioInfo.instagramHandle || 'Medar Studio',
          year: new Date().getFullYear().toString(),
          category: batchDefaultCategory,
          categoryLabel:
            batchDefaultCategory === 'brand-identity'
              ? 'Brand Identity'
              : batchDefaultCategory === 'sports-design'
              ? 'Sports Design'
              : batchDefaultCategory === '3d-webgl'
              ? '3D Design'
              : 'Visual Design',
          description: `Création visuelle importée depuis Instagram (${localStudioInfo.instagramHandle || '@medarstudio'}).`,
          media: [
            {
              id: `media-batch-${Date.now()}-${i}`,
              type: isVid ? 'video' : 'image',
              url: base64,
              title: formattedTitle
            }
          ],
          imagePromptFallback: isVid ? '' : base64,
          videoUrl: isVid ? base64 : undefined,
          accentColor: '#ff4b26',
          gradientTheme: 'from-[#ff4b26]/30 to-[#0c0c10]'
        };
        newPosts.push(post);
      }

      if (newPosts.length > 0) {
        const updated = [...newPosts, ...localProjects];
        setLocalProjects(updated);
        onUpdateProjects(updated);
        try {
          localStorage.setItem('medar_studio_projects_v2', JSON.stringify(updated));
        } catch (e) {
          console.warn("Storage quota exceeded", e);
        }
        triggerSaveNotification(`🎉 ${newPosts.length} projet(s) Instagram importé(s) instantanément dans votre portfolio !`);
      }
    } catch (err) {
      console.error(err);
      triggerSaveNotification('Erreur lors du traitement des fichiers.');
    }
  };

  // Batch paste links: Takes multiple Instagram links pasted in a textarea
  const handleBatchLinksImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchLinksText.trim()) return;

    const lines = batchLinksText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const newPosts: CaseStudy[] = lines.map((link, idx) => {
      const isReel = link.includes('/reel/');
      return {
        id: `post-link-${Date.now()}-${idx}`,
        title: `Instagram Artwork #${localProjects.length + idx + 1}`,
        client: localStudioInfo.instagramHandle || 'Instagram',
        year: new Date().getFullYear().toString(),
        category: batchDefaultCategory,
        categoryLabel:
          batchDefaultCategory === 'brand-identity'
            ? 'Brand Identity'
            : batchDefaultCategory === 'sports-design'
            ? 'Sports Design'
            : batchDefaultCategory === '3d-webgl'
            ? '3D Design'
            : 'Visual Design',
        description: `Projet issu d'Instagram : ${link}`,
        media: [
          {
            id: `media-link-${Date.now()}-${idx}`,
            type: isReel ? 'video' : 'image',
            url: link,
            title: 'Instagram Post'
          }
        ],
        imagePromptFallback: isReel ? '' : link,
        videoUrl: isReel ? link : undefined,
        accentColor: '#ff4b26',
        gradientTheme: 'from-[#ff4b26]/30 to-[#0c0c10]'
      };
    });

    const updated = [...newPosts, ...localProjects];
    setLocalProjects(updated);
    onUpdateProjects(updated);
    try {
      localStorage.setItem('medar_studio_projects_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setBatchLinksText('');
    triggerSaveNotification(`${newPosts.length} post(s) Instagram ajouté(s) au portfolio !`);
  };

  // Delete all imported projects (Reset portfolio)
  const handleDeleteAllProjects = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer TOUS les posts du portfolio ?")) {
      setLocalProjects([]);
      onUpdateProjects([]);
      try {
        localStorage.setItem('medar_studio_projects_v2', JSON.stringify([]));
      } catch (e) {
        console.warn(e);
      }
      triggerSaveNotification('Tous les projets ont été effacés. Le portfolio est propre et vide.');
    }
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    const filtered = localProjects.filter((p) => p.id !== id);
    setLocalProjects(filtered);
    onUpdateProjects(filtered);
    triggerSaveNotification('Post removed successfully');
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
    triggerSaveNotification('Image applied to selected post!');
  };

  // Export JSON
  const handleExportJSON = () => {
    const data = {
      projects: localProjects,
      services: localServices,
      studioInfo: localStudioInfo,
      budgetTiers: localBudgetTiers,
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
        if (parsed.budgetTiers && Array.isArray(parsed.budgetTiers)) {
          setLocalBudgetTiers(parsed.budgetTiers);
          if (onUpdateBudgetTiers) onUpdateBudgetTiers(parsed.budgetTiers);
        }
        if (parsed.mediaLibrary) setMediaLibrary(parsed.mediaLibrary);
        triggerSaveNotification('Data imported successfully! Click "Save Live Changes" to confirm.');
      } catch (err) {
        triggerSaveNotification('Error: The selected JSON file is invalid.');
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
        ref={newPostMediaFileInputRef}
        multiple
        accept="image/*,video/*"
        onChange={handleUploadNewPostMedia}
        className="hidden"
      />
      <input
        type="file"
        ref={existingPostMediaFileInputRef}
        multiple
        accept="image/*,video/*"
        onChange={(e) => {
          if (activePostIdForMultiMedia) {
            handleUploadMediaToExistingPost(e, activePostIdForMultiMedia);
          }
        }}
        className="hidden"
      />
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
      <input
        type="file"
        ref={founderFileInputRef}
        accept="image/*"
        onChange={handleUploadFounderImage}
        className="hidden"
      />
      <input
        type="file"
        ref={batchInstagramFileInputRef}
        multiple
        accept="image/*,video/*"
        onChange={(e) => {
          if (e.target.files) {
            handleBatchInstagramFiles(e.target.files);
            e.target.value = '';
          }
        }}
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
            {/* Tab: Manage Posts */}
            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-[#ff4b26] text-white font-bold'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Mes Posts & Projets ({localProjects.length})</span>
            </button>

            {/* Tab: Add New Post with photos & videos */}
            <button
              onClick={() => setActiveTab('new-post')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'new-post'
                  ? 'bg-[#ff4b26] text-white font-bold'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-white font-semibold">+ Nouveau Post</span>
                <span className="text-[10px] text-neutral-400 font-mono">Upload Photos & Vidéos</span>
              </div>
            </button>

            {/* Tab: Instagram Sync & Import */}
            <button
              onClick={() => setActiveTab('instagram')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'instagram'
                  ? 'bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#F56040] text-white font-bold shadow-md'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-white font-semibold">Instagram Import</span>
                <span className="text-[10px] text-neutral-400 font-mono">Sync & Importer Posts</span>
              </div>
            </button>

            {/* Tab: Media Library & Upload Images */}
            <button
              onClick={() => setActiveTab('media-library')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'media-library'
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

            {/* Tab: Pricing & Target Budgets */}
            <button
              onClick={() => setActiveTab('pricing')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'pricing'
                  ? 'bg-[#ff4b26] text-white font-bold'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Pricing & Budgets ({localBudgetTiers.length})</span>
            </button>

            {/* Tab: Studio Profile */}
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

            {/* Tab: Backup & Restore */}
            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'backup'
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
          {/* TAB 1: MANAGE EXISTING POSTS (COPY + ASSETS)                      */}
          {/* ================================================================= */}
          {activeTab === 'posts' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                    Manage Case Studies & Copy
                  </h2>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    Edit copy, visuals, metrics, and deliverables across your {localProjects.length} live case studies.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('new-post')}
                  className="px-4 py-2.5 bg-[#ff4b26] hover:bg-white text-white hover:text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shrink-0 shadow-[0_4px_14px_rgba(255,75,38,0.35)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Case Study</span>
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
                          {isInstagramUrl(project.imagePromptFallback) ? (
                            <div className="w-full h-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex flex-col items-center justify-center text-white p-1 text-center">
                              <Instagram className="w-6 h-6 mb-1" />
                              <span className="text-[8px] font-mono font-bold leading-tight">POST IG</span>
                            </div>
                          ) : project.imagePromptFallback ? (
                            <img
                              src={project.imagePromptFallback}
                              alt={project.title}
                              referrerPolicy="no-referrer"
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
                            title="Change image"
                          >
                            <Camera className="w-4 h-4 mb-1 text-[#ff4b26]" />
                            <span>Change</span>
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
                            Client: {project.client} · Year: {project.year}
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
                          <span>Upload Visual</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete case study"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inputs Grid for Post Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <label className="text-neutral-400 block mb-1">Project Title *</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleUpdateProjectField(project.id, 'title', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Client / Brand *</label>
                        <input
                          type="text"
                          value={project.client}
                          onChange={(e) => handleUpdateProjectField(project.id, 'client', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Release Year</label>
                        <input
                          type="text"
                          value={project.year}
                          onChange={(e) => handleUpdateProjectField(project.id, 'year', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Filter Category</label>
                        <select
                          value={project.category}
                          onChange={(e) => handleUpdateProjectField(project.id, 'category', e.target.value as ProjectCategory)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        >
                          <option value="brand-identity">Brand Identity</option>
                          <option value="sports-design">Sports Design</option>
                          <option value="3d-webgl">3D Design</option>
                          <option value="visual-design">Visual Design</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Displayed Category Label</label>
                        <input
                          type="text"
                          value={project.categoryLabel}
                          onChange={(e) => handleUpdateProjectField(project.id, 'categoryLabel', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      {/* Media Assets Manager (Multiple Photos & Videos) */}
                      <div className="md:col-span-3 bg-black/40 border border-white/10 p-4 rounded-lg space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <label className="text-white font-bold block text-xs">
                              Media Assets ({project.media?.length || (project.imagePromptFallback ? 1 : 0)})
                            </label>
                            {(project.media && project.media.length > 0) || project.imagePromptFallback || project.videoUrl ? (
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                ● Visible to visitors
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                ○ Hidden from visitors (Upload photo to publish)
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActivePostIdForMultiMedia(project.id);
                                existingPostMediaFileInputRef.current?.click();
                              }}
                              className="px-3 py-1.5 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>+ Add Photos & Videos</span>
                            </button>
                          </div>
                        </div>

                        {/* Media Thumbnails Grid */}
                        {project.media && project.media.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                            {project.media.map((item, mIdx) => (
                              <div
                                key={item.id || mIdx}
                                className="relative aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden border border-white/15 group"
                              >
                                {item.type === 'video' ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-cyan-400 p-2">
                                    <Film className="w-6 h-6 mb-1" />
                                    <span className="text-[8px] font-mono">VIDEO</span>
                                  </div>
                                ) : (
                                  <img
                                    src={item.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <div className="absolute top-1 left-1">
                                  <span className="text-[8px] font-mono bg-black/80 text-white px-1 rounded">
                                    #{mIdx + 1}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMediaFromExistingPost(project.id, item.id)}
                                  className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  title="Delete this media asset"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : project.imagePromptFallback ? (
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-16 rounded overflow-hidden border border-white/15 shrink-0 bg-neutral-900">
                              <img src={project.imagePromptFallback} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs text-neutral-400">1 Cover Photo assigned. Click "+ Add Photos & Videos" to add more.</span>
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-500 italic">
                            No photos or videos uploaded yet. This post is currently hidden from visitors.
                          </p>
                        )}

                        {/* Add Video URL Bar */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Add video URL (MP4, Vimeo, WebM)..."
                            value={activePostIdForMultiMedia === project.id ? existingVideoUrlInput : ''}
                            onFocus={() => setActivePostIdForMultiMedia(project.id)}
                            onChange={(e) => setExistingVideoUrlInput(e.target.value)}
                            className="flex-1 bg-[#181824] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff4b26] font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddVideoToExistingPost(project.id)}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-bold font-mono transition-colors cursor-pointer"
                          >
                            + Add Video
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <label className="text-neutral-400 block mb-1">Project Description / Story</label>
                        <textarea
                          rows={2}
                          value={project.description}
                          onChange={(e) => handleUpdateProjectField(project.id, 'description', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26] leading-relaxed"
                          placeholder="Short summary of the visual project..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: CREATE NEW CASE STUDY (WIZARD WITH LIVE 4:5 PREVIEW)       */}
          {/* ================================================================= */}
          {activeTab === 'new-post' && (
            <div className="max-w-4xl mx-auto space-y-8 font-mono text-xs">
              <div className="pb-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                    Create & Publish New Case Study
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Add a new piece of design or creative production to your live Medar Studio showcase.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('posts')}
                  className="px-3 py-1.5 border border-white/15 text-neutral-400 hover:text-white transition-colors"
                >
                  Back to Posts
                </button>
              </div>

              <form onSubmit={handleCreateNewPost} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Left Form Column */}
                  <div className="md:col-span-8 bg-[#12121b] border border-white/10 p-6 md:p-8 rounded-xl space-y-5">
                    <h3 className="font-heading text-base font-bold text-white">
                      Case Study Details & Content
                    </h3>

                    <div>
                      <label className="text-neutral-400 block mb-1">Project / Post Title *</label>
                      <input
                        type="text"
                        required
                        value={newPost.title || ''}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="e.g. Astral Chronograph"
                        className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff4b26]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-neutral-400 block mb-1">Client or Brand *</label>
                        <input
                          type="text"
                          required
                          value={newPost.client || ''}
                          onChange={(e) => setNewPost({ ...newPost, client: e.target.value })}
                          placeholder="e.g. Athletic Club / Luxury House"
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Year</label>
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
                        <label className="text-neutral-400 block mb-1">Category</label>
                        <select
                          value={newPost.category}
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              category: e.target.value as ProjectCategory,
                              categoryLabel:
                                e.target.value === 'sports-design'
                                  ? 'Sports Design'
                                  : e.target.value === '3d-webgl'
                                  ? '3D Design'
                                  : e.target.value === 'visual-design'
                                  ? 'Visual Design'
                                  : 'Brand Identity'
                            })
                          }
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        >
                          <option value="brand-identity">Brand Identity</option>
                          <option value="sports-design">Sports Design</option>
                          <option value="3d-webgl">3D Design</option>
                          <option value="visual-design">Visual Design</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Displayed Label</label>
                        <input
                          type="text"
                          value={newPost.categoryLabel || ''}
                          onChange={(e) => setNewPost({ ...newPost, categoryLabel: e.target.value })}
                          className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>
                    </div>

                    {/* Multi-Media Uploader for New Post (Photos & Videos) */}
                    <div className="p-5 bg-[#181824] border border-white/10 rounded-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div>
                          <label className="text-white font-bold block text-xs flex items-center gap-2">
                            <Upload className="w-4 h-4 text-[#ff4b26]" />
                            <span>Téléversement Photos & Vidéos (Depuis votre appareil)</span>
                          </label>
                          <span className="text-[11px] text-neutral-400 block mt-0.5">
                            Permet de mettre beaucoup de photos à la fois et des vidéos.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => newPostMediaFileInputRef.current?.click()}
                          className="px-4 py-2 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white transition-colors rounded text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>+ Parcourir Photos & Vidéos</span>
                        </button>
                      </div>

                      {/* Interactive Drag & Drop Area */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingMedia(true);
                        }}
                        onDragLeave={() => setIsDraggingMedia(false)}
                        onDrop={handleDropMedia}
                        onClick={() => newPostMediaFileInputRef.current?.click()}
                        className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                          isDraggingMedia
                            ? 'border-[#ff4b26] bg-[#ff4b26]/10 text-white scale-[1.01]'
                            : 'border-white/20 bg-black/40 hover:border-white/40 text-neutral-300'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2.5">
                          <Upload className="w-5 h-5 text-[#ff4b26]" />
                        </div>
                        <p className="text-xs font-semibold text-white mb-1">
                          {isDraggingMedia
                            ? 'Déposez vos photos et vidéos ici...'
                            : 'Glissez-déposez plusieurs photos & vidéos ici, ou cliquez pour parcourir'}
                        </p>
                        <p className="text-[10px] font-mono text-neutral-400 max-w-sm">
                          JPG, PNG, WEBP, GIF, MP4, WebM — Téléversement direct depuis votre PC/téléphone sans limite
                        </p>
                      </div>

                      {/* Video URL Adder */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={newVideoUrlInput}
                          onChange={(e) => setNewVideoUrlInput(e.target.value)}
                          placeholder="Ou collez un lien vidéo (MP4, YouTube, Vimeo, WebM)..."
                          className="flex-1 bg-[#101019] border border-white/15 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff4b26] font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddVideoUrlToNewPost}
                          className="px-3.5 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-bold font-mono rounded transition-colors cursor-pointer shrink-0"
                        >
                          + Ajouter Vidéo
                        </button>
                      </div>

                      {/* Attached Media Grid */}
                      {newPostMedia.length > 0 ? (
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-neutral-300 block font-semibold">
                              Médias attachés ({newPostMedia.length}) :
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              ✓ Prêt à être publié aux visiteurs
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                            {newPostMedia.map((item, mIdx) => {
                              const isCover = (newPost.imagePromptFallback === item.url) || (mIdx === 0 && !newPost.imagePromptFallback);
                              return (
                                <div
                                  key={item.id || mIdx}
                                  className={`relative aspect-[4/5] bg-black rounded-lg overflow-hidden border-2 group ${
                                    isCover ? 'border-[#ff4b26] ring-2 ring-[#ff4b26]/30' : 'border-white/15'
                                  }`}
                                >
                                  {item.type === 'video' ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-cyan-400 p-2">
                                      <Film className="w-6 h-6 mb-1" />
                                      <span className="text-[8px] font-mono font-bold">VIDÉO</span>
                                    </div>
                                  ) : (
                                    <img
                                      src={item.url}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  )}

                                  {/* Badge */}
                                  <div className="absolute top-1 left-1">
                                    {isCover ? (
                                      <span className="text-[8px] font-mono bg-[#ff4b26] text-white px-1.5 py-0.5 rounded font-bold">
                                        COVER
                                      </span>
                                    ) : (
                                      <span className="text-[8px] font-mono bg-black/80 text-white px-1 rounded">
                                        #{mIdx + 1}
                                      </span>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity p-1">
                                    {!isCover && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetNewPostCover(item)}
                                        className="text-[9px] font-mono bg-[#ff4b26] text-white px-2 py-0.5 rounded hover:bg-[#ff5f3c] cursor-pointer font-bold"
                                      >
                                        Cover
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveNewPostMedia(item.id)}
                                      className="text-[9px] font-mono bg-red-600 text-white p-1 rounded hover:bg-red-700 cursor-pointer"
                                      title="Supprimer ce média"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-amber-300 text-xs flex items-center gap-2">
                          <Info className="w-4 h-4 shrink-0" />
                          <span>
                            Ajoutez au moins 1 photo ou vidéo. Pour les visiteurs du site, seuls les posts avec photos/vidéos sont visibles.
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Project Description / Story</label>
                      <textarea
                        rows={3}
                        value={newPost.description || ''}
                        onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                        placeholder="Brief summary of the creative artwork, client, or concept..."
                        className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26] leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer shadow-[0_4px_16px_rgba(255,75,38,0.35)] flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Publish This Project Now ({newPostMedia.length} Media)</span>
                    </button>
                  </div>

                  {/* Right Live Preview Column */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                      <span>4:5 Card Preview</span>
                      {newPostMedia.length > 0 && (
                        <span className="text-[#ff4b26] font-bold">
                          {newPostMedia.length} Media Attached
                        </span>
                      )}
                    </div>
                    <div className="w-full aspect-[4/5] bg-[#12121b] border border-white/15 overflow-hidden relative flex flex-col justify-between p-4 shadow-xl">
                      {newPostMedia.length > 0 ? (
                        newPostMedia[0].type === 'video' ? (
                          <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center text-cyan-400">
                            <Film className="w-10 h-10 mb-2" />
                            <span className="text-xs font-mono">Video Asset Cover</span>
                          </div>
                        ) : (
                          <img
                            src={newPost.imagePromptFallback || newPostMedia[0].url}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-neutral-500">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-xs">Upload media to see preview</span>
                        </div>
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
                          {newPost.title || 'Project Title'}
                        </h4>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/10 text-[11px] text-neutral-400 space-y-1">
                      <span className="text-white font-bold block">Visitor Privacy Rule</span>
                      <p>Visitors only see this project if it contains at least 1 uploaded photo or video.</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: INSTAGRAM SYNC & POST IMPORTER (EASY SOLUTION)               */}
          {/* ================================================================= */}
          {activeTab === 'instagram' && (
            <div className="max-w-5xl mx-auto space-y-8 font-mono text-xs">
              {/* Header */}
              <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
                      <Instagram className="w-5 h-5" />
                    </span>
                    <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                      Importation Facile Instagram & Gestion Portfolio
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Importez directement vos créations Instagram en un clic, puis faites votre tri facilement : gardez ce qui vous plaît et effacez ce que vous ne voulez pas.
                  </p>
                </div>

                {localStudioInfo.instagramUrl && (
                  <a
                    href={localStudioInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white font-bold rounded-lg transition-opacity flex items-center gap-2 self-start sm:self-center cursor-pointer shadow-md"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Mon Compte Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* SECTION 1: LA SOLUTION LA PLUS FACILE (IMPORT PAR LOTS EN 1 CLIC) */}
              <div className="bg-[#12121b] border-2 border-[#ff4b26]/50 p-6 md:p-8 rounded-xl space-y-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#ff4b26] text-white text-[10px] font-bold rounded uppercase">
                        Méthode Recommandée · Ultra Rapide
                      </span>
                      <h3 className="font-heading text-base md:text-lg font-bold text-white">
                        1. Glisser-Déposer en masse vos créations Instagram
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1">
                      Prenez les photos ou vidéos de vos publications Instagram (sur votre ordinateur ou téléphone) et déposez-les ici. Chaque fichier devient instantanément un post dans votre portfolio !
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-neutral-400 text-[11px] whitespace-nowrap">Catégorie :</label>
                    <select
                      value={batchDefaultCategory}
                      onChange={(e) => setBatchDefaultCategory(e.target.value as ProjectCategory)}
                      className="bg-[#181824] border border-white/20 px-2.5 py-1.5 text-white text-xs rounded focus:outline-none focus:border-[#ff4b26]"
                    >
                      <option value="brand-identity">Brand Identity</option>
                      <option value="sports-design">Sports Design</option>
                      <option value="3d-webgl">3D Design</option>
                      <option value="visual-design">Visual Design</option>
                    </select>
                  </div>
                </div>

                {/* Dropzone Multi-Upload Express */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingBatchInstagram(true);
                  }}
                  onDragLeave={() => setIsDraggingBatchInstagram(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingBatchInstagram(false);
                    if (e.dataTransfer.files) {
                      handleBatchInstagramFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => batchInstagramFileInputRef.current?.click()}
                  className={`p-8 md:p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDraggingBatchInstagram
                      ? 'border-[#ff4b26] bg-[#ff4b26]/15 scale-[1.01]'
                      : 'border-white/20 bg-black/40 hover:border-[#ff4b26]/60 hover:bg-black/60'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center mb-4 shadow-lg">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-white mb-2">
                    {isDraggingBatchInstagram
                      ? 'Relâchez vos fichiers pour les importer tous !'
                      : 'Glissez ici 5, 10 ou 20 photos/vidéos Instagram d\'un coup'}
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-md leading-relaxed mb-4">
                    Ou cliquez pour ouvrir vos dossiers et sélectionner vos créations. Chaque image sera automatiquement convertie en projet dans votre portfolio.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      batchInstagramFileInputRef.current?.click();
                    }}
                    className="px-6 py-3 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Sélectionner plusieurs fichiers Instagram</span>
                  </button>
                </div>

                {/* Ou importation de liens multiples */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <span className="text-xs text-neutral-300 font-bold block flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5 text-[#ff4b26]" />
                    <span>Alternative : Coller un ou plusieurs liens de posts Instagram (1 par ligne)</span>
                  </span>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] font-mono text-amber-300 leading-relaxed">
                    💡 <strong>Important :</strong> Un lien de publication Instagram (ex: <code>https://www.instagram.com/p/...</code>) est une page web. Le site l'affiche automatiquement via le lecteur officiel <strong>Instagram Embed</strong>. Si vous souhaitez une image plein écran sans cadre Instagram, préférez glisser vos photos directement dans la zone ci-dessus, ou cliquez sur <em>« Joindre la photo »</em> sur chaque projet ci-dessous.
                  </div>
                  <form onSubmit={handleBatchLinksImport} className="space-y-3">
                    <textarea
                      rows={3}
                      value={batchLinksText}
                      onChange={(e) => setBatchLinksText(e.target.value)}
                      placeholder="https://www.instagram.com/p/DFxyz1/&#10;https://www.instagram.com/p/DFxyz2/&#10;https://www.instagram.com/reel/DFxyz3/"
                      className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-[#ff4b26]"
                    />
                    <button
                      type="submit"
                      disabled={!batchLinksText.trim()}
                      className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black disabled:opacity-40 font-bold rounded transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Importer ces liens dans le portfolio</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* SECTION 2: GESTIONNAIRE « JE GARDE CE QUE JE VEUX, J'EFFACE LE RESTE » */}
              <div className="bg-[#12121b] border border-white/10 p-6 md:p-8 rounded-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-[#ff4b26]" />
                      <h3 className="font-heading text-base md:text-lg font-bold text-white">
                        2. Gestion directe : Je garde ce que je veux, j'efface ce que je ne veux pas
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Voici les <strong>{localProjects.length} projet(s)</strong> actuellement dans votre portfolio. Cliquez sur « Effacer » pour supprimer en un instant les posts que vous ne souhaitez pas garder.
                    </p>
                  </div>

                  {localProjects.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteAllProjects}
                      className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Tout Effacer ({localProjects.length})</span>
                    </button>
                  )}
                </div>

                {/* Live Projects Grid with 1-Click Delete */}
                {localProjects.length === 0 ? (
                  <div className="py-12 text-center border border-white/10 bg-black/30 rounded-xl space-y-2">
                    <p className="text-neutral-400 text-xs">
                      Votre portfolio est actuellement vide. Déposez des photos Instagram ci-dessus pour le remplir en 2 secondes !
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {localProjects.map((project, idx) => (
                      <div
                        key={project.id}
                        className="bg-[#181824] border border-white/15 rounded-xl p-3 flex flex-col justify-between hover:border-[#ff4b26]/50 transition-all space-y-3 group"
                      >
                        {/* Media Thumbnail */}
                        <div className="relative aspect-[4/5] bg-black rounded-lg overflow-hidden border border-white/10">
                          {project.videoUrl ? (
                            <video
                              src={project.videoUrl}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : isInstagramUrl(project.imagePromptFallback) ? (
                            <div className="w-full h-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex flex-col items-center justify-center text-white p-3 text-center">
                              <Instagram className="w-8 h-8 mb-2 drop-shadow" />
                              <span className="text-xs font-bold font-mono">Post Instagram</span>
                              <span className="text-[9px] font-mono opacity-80 mt-1 line-clamp-1">
                                {getInstagramShortcode(project.imagePromptFallback) || 'Lien importé'}
                              </span>
                              <span className="text-[8px] font-mono bg-black/60 px-1.5 py-0.5 rounded mt-2 border border-white/20">
                                Embed actif
                              </span>
                            </div>
                          ) : project.imagePromptFallback ? (
                            <img
                              src={project.imagePromptFallback}
                              alt={project.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                              <FileImage className="w-8 h-8" />
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="text-[9px] font-mono bg-black/80 text-white px-2 py-0.5 rounded border border-white/15">
                              #{idx + 1} · {project.categoryLabel}
                            </span>
                            {project.videoUrl && (
                              <span className="text-[9px] font-mono bg-[#ff4b26] text-white px-1.5 py-0.5 rounded font-bold">
                                VIDEO
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => handleUpdateProjectField(project.id, 'title', e.target.value)}
                            placeholder="Titre du projet"
                            className="w-full bg-[#12121b] border border-white/10 px-2.5 py-1 text-white text-xs font-bold focus:outline-none focus:border-[#ff4b26] rounded mb-1"
                          />
                          <div className="flex items-center justify-between text-[10px] text-neutral-400">
                            <span>Client : {project.client}</span>
                            <span>Année : {project.year}</span>
                          </div>
                          {isInstagramUrl(project.imagePromptFallback) && (
                            <p className="text-[10px] text-amber-300 font-mono mt-1">
                              ⚡ Lecteur Instagram actif. Vous pouvez joindre la photo ci-dessous :
                            </p>
                          )}
                        </div>

                        {/* Actions : Upload Photo + Delete Button */}
                        <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePostIdForUpload(project.id);
                              postFileInputRef.current?.click();
                            }}
                            className="w-full py-1.5 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-bold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            title="Joindre la photo originale depuis votre PC ou téléphone"
                          >
                            <Camera className="w-3.5 h-3.5 text-[#ff4b26]" />
                            <span>Joindre la photo originale</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleDeleteProject(project.id);
                              triggerSaveNotification(`Projet "${project.title}" effacé.`);
                            }}
                            className="w-full py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            title="Effacer ce projet du site"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Effacer ce projet</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 3: PROFIL INSTAGRAM OFFICIEL */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-[#ff4b26]" />
                    <h3 className="font-heading text-base font-bold text-white">
                      3. Lien & Profil Instagram Officiel du Studio
                    </h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Affiché dans la barre de navigation et le footer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-bold">Identifiant / Handle Instagram</label>
                    <input
                      type="text"
                      value={localStudioInfo.instagramHandle || ''}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, instagramHandle: e.target.value })
                      }
                      placeholder="@medarstudio"
                      className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1 font-bold">URL complète du compte Instagram</label>
                    <input
                      type="url"
                      value={localStudioInfo.instagramUrl || ''}
                      onChange={(e) =>
                        setLocalStudioInfo({ ...localStudioInfo, instagramUrl: e.target.value })
                      }
                      placeholder="https://instagram.com/medarstudio"
                      className="w-full bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-neutral-400">
                    Vos visiteurs peuvent cliquer directement sur l'icône Instagram pour visiter votre profil officiel.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStudioInfo(localStudioInfo);
                      try {
                        localStorage.setItem('medar_studio_general', JSON.stringify(localStudioInfo));
                      } catch (e) {
                        console.warn(e);
                      }
                      triggerSaveNotification('Lien Instagram enregistré avec succès !');
                    }}
                    className="px-3.5 py-1.5 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-bold rounded transition-colors cursor-pointer shrink-0"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>

              {/* SECTION 4: OPTION AVANCÉE META API (POUR CEUX QUI ONT UN TOKEN) */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#ff4b26]" />
                    <h3 className="font-heading text-sm font-bold text-white">
                      4. Option Avancée : Jeton Meta Instagram Graph API (Facultatif)
                    </h3>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                    Optionnel
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={localStudioInfo.instagramToken || ''}
                    onChange={(e) =>
                      setLocalStudioInfo({ ...localStudioInfo, instagramToken: e.target.value })
                    }
                    placeholder="Collez votre jeton utilisateur Meta si vous en possédez un..."
                    className="flex-1 bg-[#181824] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26] text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleFetchInstagramFeed}
                    disabled={isFetchingInstagram}
                    className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black font-bold rounded transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingInstagram ? 'animate-spin' : ''}`} />
                    <span>{isFetchingInstagram ? 'Chargement...' : 'Tester le Jeton'}</span>
                  </button>
                </div>

                {instagramFetchError && (
                  <p className="text-red-400 text-[11px]">{instagramFetchError}</p>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: STUDIO MEDIA LIBRARY (LOCAL UPLOAD + GALLERY)              */}
          {/* ================================================================= */}
          {activeTab === 'media-library' && (
            <div className="max-w-5xl mx-auto space-y-8 font-mono text-xs">
              <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                    Media Library & Asset Manager
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Upload photos, posters, and 3D artwork directly from your device or via external links.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => libraryFileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,75,38,0.3)] shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Local Image</span>
                </button>
              </div>

              {/* Add by URL input */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <h3 className="font-heading text-base font-bold text-white">
                  Add Image via External URL
                </h3>
                <form onSubmit={handleAddImageUrlToLibrary} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newImageName}
                    onChange={(e) => setNewImageName(e.target.value)}
                    placeholder="Artwork name (e.g. Matchday Poster 2026)"
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
                    Add to Media Library
                  </button>
                </form>
              </div>

              {/* Image Grid with Quick Assign to Posts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-white">
                    Available Assets ({mediaLibrary.length})
                  </h3>
                  <span className="text-neutral-400 text-[11px]">
                    Select "Assign to post..." below any image to instantly update a project thumbnail
                  </span>
                </div>

                {mediaLibrary.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-white/15 rounded-xl bg-black/30 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#ff4b26]">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading text-lg font-bold text-white">
                        Your Media Library is clean and ready
                      </h4>
                      <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                        No dummy stock images. Upload your actual graphic design, sports visuals, and 3D artwork directly from this device (phone or PC).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => libraryFileInputRef.current?.click()}
                      className="px-6 py-3 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Artwork from Device Now</span>
                    </button>
                  </div>
                ) : (
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
                                triggerSaveNotification('Link copied to clipboard!');
                              }}
                              className="p-1.5 bg-black/70 hover:bg-[#ff4b26] text-white rounded transition-colors cursor-pointer"
                              title="Copy link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMediaItem(item.id)}
                              className="p-1.5 bg-black/70 hover:bg-red-500 text-white rounded transition-colors cursor-pointer"
                              title="Delete from media library"
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
                              Added on {item.date}
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
                                Assign to a post...
                              </option>
                              {localProjects.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.title} ({p.client})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Set as Founder Profile Photo */}
                          <button
                            type="button"
                            onClick={() => {
                              setLocalStudioInfo((prev) => ({ ...prev, founderImage: item.url }));
                              triggerSaveNotification('Image set as Founder Profile Photo!');
                            }}
                            className="w-full py-1.5 px-2 bg-white/5 hover:bg-[#ff4b26]/20 hover:border-[#ff4b26] border border-white/10 text-[10px] text-neutral-300 hover:text-white rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                          >
                            <Camera className="w-3 h-3 text-[#ff4b26]" />
                            <span>Set as Founder Photo</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  Manage Studio Services & Disciplines
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Modify titles, disciplines, and strategic descriptions for each studio offering.
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
                        <label className="text-neutral-400 block mb-1">Service Title</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => handleUpdateServiceField(service.id, 'title', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">Discipline / Tag</label>
                        <input
                          type="text"
                          value={service.tag}
                          onChange={(e) => handleUpdateServiceField(service.id, 'tag', e.target.value)}
                          className="w-full bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-neutral-400 block mb-1">Strategic Description</label>
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
          {/* TAB 5: ABOUT & STUDIO PROFILE                                     */}
          {/* ================================================================= */}
          {activeTab === 'studio' && (
            <div className="max-w-4xl mx-auto space-y-8 font-mono text-xs">
              <div className="pb-6 border-b border-white/10">
                <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                  Studio Profile & General Info
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Update the official manifesto, contact details, and founder information.
                </p>
              </div>

              {/* Manifesto & Official Text */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <h3 className="font-heading text-base font-bold text-white text-sm">
                  Official Manifesto Statement
                </h3>
                <div>
                  <label className="text-neutral-400 block mb-1">Featured Pull Quote</label>
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
                  <label className="text-neutral-400 block mb-1">Complete Studio Paragraph</label>
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
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-6">
                <div className="pb-3 border-b border-white/10">
                  <h3 className="font-heading text-base font-bold text-white text-sm">
                    Founder Profile & Studio Direction
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Manage founder identity, executive profile photo, and studio manifesto role.
                  </p>
                </div>

                {/* Founder Photo Management */}
                <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                  <label className="text-neutral-300 font-bold block text-xs flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#ff4b26]" />
                    <span>Founder Profile Photo</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Visual Preview */}
                    <div 
                      className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shrink-0 bg-neutral-900 group"
                      style={{ boxShadow: 'none', filter: 'none', backdropFilter: 'none' }}
                    >
                      {localStudioInfo.founderImage ? (
                        <img
                          src={localStudioInfo.founderImage}
                          alt={localStudioInfo.founderName}
                          className="w-full h-full object-cover object-center"
                          style={{ filter: 'none', backdropFilter: 'none', imageRendering: 'auto' }}
                        />
                      ) : (
                        <div 
                          className="w-full h-full bg-[#ff4b26] flex items-center justify-center font-heading font-black text-white text-2xl"
                          style={{ boxShadow: 'none', filter: 'none', backdropFilter: 'none' }}
                        >
                          {localStudioInfo.founderName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || 'MA'}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => founderFileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer"
                        title="Click to upload new photo"
                      >
                        <Camera className="w-4 h-4 mb-1 text-white" />
                        <span>Change</span>
                      </button>
                    </div>

                    {/* Actions & URL Input */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => founderFileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsSelectingFounderImage(true)}
                          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Pick from Media Library</span>
                        </button>

                        {localStudioInfo.founderImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setLocalStudioInfo({ ...localStudioInfo, founderImage: '' });
                              triggerSaveNotification('Founder photo removed (reset to monogram).');
                            }}
                            className="px-3 py-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Direct URL input */}
                      <div>
                        <input
                          type="url"
                          value={localStudioInfo.founderImage || ''}
                          onChange={(e) =>
                            setLocalStudioInfo({ ...localStudioInfo, founderImage: e.target.value })
                          }
                          placeholder="Or paste image URL (https://...)"
                          className="w-full bg-[#181824] border border-white/10 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff4b26] rounded font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 block mb-1">Founder Name</label>
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
                    <label className="text-neutral-400 block mb-1">Official Role</label>
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
                    <label className="text-neutral-400 block mb-1">Vision Focus / Areas of Direction</label>
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
                    <label className="text-neutral-400 block mb-1">Founder Biography</label>
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
                  Coordinates & Studio Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 block mb-1">Contact Email</label>
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
                    <label className="text-neutral-400 block mb-1">Phone Number</label>
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
                    <label className="text-neutral-400 block mb-1">City & District</label>
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
                    <label className="text-neutral-400 block mb-1">Full Studio Address</label>
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
          {/* TAB: PRICING & TARGET BUDGETS                                     */}
          {/* ================================================================= */}
          {activeTab === 'pricing' && (
            <div className="max-w-4xl mx-auto space-y-8 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                    Pricing & Target Budgets
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage the budget range options displayed in the contact form for prospective clients.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSaveBudgetTiers()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-[0_4px_15px_rgba(255,75,38,0.3)]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Pricing</span>
                  </button>
                </div>
              </div>

              {/* Quick One-Click Presets */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Quick Budget Presets (1-Click Apply)</span>
                  </h3>
                  <span className="text-[10px] text-neutral-400">Click any preset to apply instantly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      name: 'Ultra Low / Micro',
                      tag: 'Beginners & Students',
                      tiers: ['< €50', '€50 - €150', '€150 - €400', '€400+']
                    },
                    {
                      name: 'Starter / Creator',
                      tag: 'Recommended Default',
                      tiers: ['< €100', '€100 - €300', '€300 - €750', '€750+']
                    },
                    {
                      name: 'Accessible Studio',
                      tag: 'Standard SMB',
                      tiers: ['< €150', '€150 - €500', '€500 - €1,200', '€1,200+']
                    },
                    {
                      name: 'Growth & Scale',
                      tag: 'Established Brands',
                      tiers: ['< €300', '€300 - €800', '€800 - €2,000', '€2,000+']
                    }
                  ].map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSaveBudgetTiers(preset.tiers)}
                      className="p-4 bg-black/40 hover:bg-[#ff4b26]/10 border border-white/10 hover:border-[#ff4b26] rounded-lg transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-xs group-hover:text-[#ff4b26] transition-colors">
                            {preset.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block mb-3">{preset.tag}</span>
                        <div className="space-y-1 text-[11px] text-neutral-300">
                          {preset.tiers.map((t, i) => (
                            <div key={i} className="flex items-center gap-1.5 truncate">
                              <span className="w-1 h-1 rounded-full bg-[#ff4b26]" />
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="mt-3 text-[10px] text-[#ff4b26] font-semibold uppercase group-hover:underline">
                        Apply Preset →
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Tiers Editor */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                      Active Budget Options ({localBudgetTiers.length})
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Edit names directly, add new ranges, or remove tiers.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {localBudgetTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-lg"
                    >
                      <span className="text-neutral-500 font-bold text-xs w-6 shrink-0">
                        0{index + 1}
                      </span>
                      <input
                        type="text"
                        value={tier}
                        onChange={(e) => {
                          const updated = [...localBudgetTiers];
                          updated[index] = e.target.value;
                          setLocalBudgetTiers(updated);
                        }}
                        className="flex-1 bg-[#181824] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#ff4b26] rounded text-xs font-mono"
                        placeholder="e.g. < €100 or €100 - €300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (localBudgetTiers.length <= 2) {
                            triggerSaveNotification('Minimum 2 budget options required for client selection.');
                            return;
                          }
                          const updated = localBudgetTiers.filter((_, i) => i !== index);
                          setLocalBudgetTiers(updated);
                        }}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete tier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Tier */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newBudgetTierInput}
                    onChange={(e) => setNewBudgetTierInput(e.target.value)}
                    placeholder="Enter new budget range (e.g. €750 - €1,500 or < 500 MAD)..."
                    className="flex-1 bg-[#181824] border border-white/10 px-4 py-2.5 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26] rounded font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newBudgetTierInput.trim()) return;
                      const updated = [...localBudgetTiers, newBudgetTierInput.trim()];
                      setLocalBudgetTiers(updated);
                      setNewBudgetTierInput('');
                    }}
                    className="px-4 py-2.5 bg-white/10 hover:bg-[#ff4b26] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Tier</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#ff4b26]" />
                    <span>Live Public Form Preview</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400">Updated in real-time</span>
                </div>

                <div className="p-5 bg-black/60 border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Target Budget
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Accessible beginner & starter pricing
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {localBudgetTiers.map((range, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 text-center text-xs font-mono border transition-colors ${
                          idx === 1
                            ? 'bg-[#ff4b26] text-white border-[#ff4b26] font-bold shadow-[0_2px_10px_rgba(255,75,38,0.4)]'
                            : 'bg-black/30 border-white/[0.08] text-neutral-400'
                        }`}
                      >
                        {range}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer inside Pricing Tab */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    const beginnerDefault = ['< €100', '€100 - €300', '€300 - €750', '€750+'];
                    handleSaveBudgetTiers(beginnerDefault);
                  }}
                  className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                >
                  Reset to Beginner Defaults
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveBudgetTiers()}
                  className="flex items-center gap-2 px-6 py-3 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-[0_4px_15px_rgba(255,75,38,0.3)]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: BACKUP & EXPORT                                            */}
          {/* ================================================================= */}
          {activeTab === 'backup' && (
            <div className="max-w-4xl mx-auto space-y-8 font-mono text-xs">
              <div className="pb-6 border-b border-white/10">
                <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
                  Backup, Export & Restore
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage data persistence in your browser or download a portable JSON backup.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-[#ff4b26]" />
                    <h3 className="font-heading text-base font-bold text-white">
                      Export Studio Configuration
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Download all case studies, uploaded visuals, services, and profile texts in JSON format as a secure backup.
                  </p>
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-[#12121b] border border-white/10 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-[#ff4b26]" />
                    <h3 className="font-heading text-base font-bold text-white">
                      Import Studio Backup
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Restore a previously exported backup file to reload all your projects and copy in one click.
                  </p>
                  <label className="w-full py-3 bg-white/10 hover:bg-[#ff4b26] text-white font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 text-center block">
                    <Upload className="w-4 h-4" />
                    <span>Choose JSON Backup File</span>
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
                    Reset to Studio Defaults
                  </h3>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  This action resets all case studies, manifesto texts, and services back to original Medar Studio defaults.
                </p>

                {confirmReset ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        onResetDefaults();
                        onClose();
                      }}
                      className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Confirm Factory Reset Now
                    </button>
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="px-5 py-3 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Reset to Factory Defaults
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Pick Founder Image from Media Library Modal */}
      {isSelectingFounderImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121b] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#ff4b26]" />
                <h3 className="font-heading font-bold text-white text-sm">
                  Select Founder Profile Photo from Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSelectingFounderImage(false)}
                className="p-1 text-neutral-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mediaLibrary.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setLocalStudioInfo((prev) => ({ ...prev, founderImage: item.url }));
                    setIsSelectingFounderImage(false);
                    triggerSaveNotification('Founder photo updated from Media Library!');
                  }}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[#ff4b26] cursor-pointer bg-neutral-900 transition-all"
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-2 text-center transition-opacity">
                    <Check className="w-5 h-5 text-[#ff4b26] mb-1" />
                    <span className="text-[11px] text-white font-bold truncate w-full">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-[#ff4b26] font-semibold mt-0.5">Use as Profile Photo</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/40">
              <button
                type="button"
                onClick={() => {
                  setIsSelectingFounderImage(false);
                  founderFileInputRef.current?.click();
                }}
                className="text-xs text-[#ff4b26] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload new photo from device instead</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSelectingFounderImage(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCMSModal;
