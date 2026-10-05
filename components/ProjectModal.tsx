/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Film, Image as ImageIcon, Layers, Instagram, ExternalLink } from 'lucide-react';
import { CaseStudy, ProjectMediaItem } from '../types';
import { isInstagramUrl, getInstagramShortcode, getInstagramEmbedUrl } from '../utils/mediaHelper';

interface ProjectModalProps {
  project: CaseStudy | null;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onNavigate
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Extract all media items for the active project
  const mediaItems: ProjectMediaItem[] = React.useMemo(() => {
    if (!project) return [];
    if (project.media && project.media.length > 0) {
      return project.media;
    }
    const items: ProjectMediaItem[] = [];
    if (project.videoUrl) {
      items.push({ id: 'video-1', type: 'video', url: project.videoUrl, title: 'Video' });
    }
    if (project.imagePromptFallback) {
      items.push({ id: 'img-1', type: 'image', url: project.imagePromptFallback, title: 'Cover Image' });
    }
    return items;
  }, [project]);

  // Reset media index when project changes
  useEffect(() => {
    setActiveMediaIndex(0);
    setImgError(false);
  }, [project?.id]);

  if (!project) return null;

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0];
  const currentUrl = currentMedia?.url || project.imagePromptFallback || '';
  const isInsta = isInstagramUrl(currentUrl);
  const instaShortcode = isInsta ? getInstagramShortcode(currentUrl) : null;
  const isVideo = currentMedia?.type === 'video' || (currentUrl && (currentUrl.startsWith('data:video/') || currentUrl.endsWith('.mp4')));

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaItems.length <= 1) return;
    setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length);
    setImgError(false);
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaItems.length <= 1) return;
    setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    setImgError(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 overflow-y-auto">
        {/* Backdrop dismiss */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-5xl bg-[#101017] border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Bar inside modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0c0c12]">
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span className="text-white font-semibold">{project.client}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#ff4b26]">{project.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{project.year}</span>
              {mediaItems.length > 1 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-white/80 font-mono bg-white/10 px-2 py-0.5 rounded">
                    {activeMediaIndex + 1} / {mediaItems.length}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('prev')}
                data-hover="true"
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer"
                title="Previous project"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('next')}
                data-hover="true"
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer"
                title="Next project"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                data-hover="true"
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white text-white hover:text-black transition-colors ml-2 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Visual Display (4:5 Artwork Carousel) */}
              <div className="md:col-span-7 flex flex-col gap-3">
                <div className="relative w-full aspect-[4/5] bg-[#08080c] border border-white/15 overflow-hidden flex flex-col justify-between p-4 shadow-xl group">
                  {/* Media Content */}
                  {isInsta && instaShortcode ? (
                    <div className="absolute inset-0 w-full h-full bg-[#0a0a10] flex flex-col">
                      <iframe
                        src={getInstagramEmbedUrl(instaShortcode, true) || undefined}
                        title={project.title}
                        className="w-full h-full border-0"
                        scrolling="yes"
                        loading="lazy"
                        allowTransparency
                      />
                    </div>
                  ) : currentMedia && (
                    isVideo ? (
                      <video
                        key={currentMedia.url}
                        src={currentMedia.url}
                        controls
                        playsInline
                        autoPlay
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : !imgError ? (
                      <img
                        key={currentMedia.url}
                        src={currentMedia.url}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ imageRendering: 'auto' }}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-[#12121b] flex flex-col items-center justify-center p-6 text-center">
                        <Instagram className="w-10 h-10 text-pink-500 mb-2" />
                        <span className="text-sm font-bold text-white mb-1">Visual Media</span>
                        <a
                          href={currentMedia.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono rounded mt-2 flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ouvrir le lien média</span>
                        </a>
                      </div>
                    )
                  )}

                  {/* Top Overlay Badge */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/90">
                    <span className="bg-black/80 px-2 py-0.5 border border-white/15">
                      {isInsta ? 'POST INSTAGRAM' : isVideo ? 'VIDEO ASSET' : '4:5 POST'}
                    </span>
                    {mediaItems.length > 1 && (
                      <span className="bg-black/80 px-2 py-0.5 border border-white/15 text-white flex items-center gap-1 font-mono">
                        <Layers className="w-3 h-3 text-[#ff4b26]" />
                        <span>{activeMediaIndex + 1} of {mediaItems.length}</span>
                      </span>
                    )}
                  </div>

                  {/* Carousel Previous / Next Arrows (if multiple media) */}
                  {mediaItems.length > 1 && (
                    <div className="relative z-20 flex items-center justify-between pointer-events-none my-auto">
                      <button
                        type="button"
                        onClick={handlePrevMedia}
                        className="w-10 h-10 rounded-full bg-black/80 hover:bg-[#ff4b26] text-white flex items-center justify-center pointer-events-auto transition-colors border border-white/20 shadow-lg cursor-pointer"
                        title="Previous photo/video"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMedia}
                        className="w-10 h-10 rounded-full bg-black/80 hover:bg-[#ff4b26] text-white flex items-center justify-center pointer-events-auto transition-colors border border-white/20 shadow-lg cursor-pointer"
                        title="Next photo/video"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Bottom Overlay Label */}
                  <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-2.5 bg-black/70 -mx-4 -mb-4 p-3">
                    <div>
                      <span className="block text-[9px] font-mono text-neutral-400 uppercase">Medar Studio</span>
                      <span className="block text-xs font-bold text-white truncate max-w-[200px]">{project.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {isInsta ? 'Instagram Embed' : isVideo ? 'Dynamic Motion' : 'High Resolution'}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Navigation Strip if multiple media */}
                {mediaItems.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {mediaItems.map((item, idx) => (
                      <button
                        key={item.id || idx}
                        type="button"
                        onClick={() => {
                          setActiveMediaIndex(idx);
                          setImgError(false);
                        }}
                        className={`relative w-16 h-20 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          activeMediaIndex === idx
                            ? 'border-[#ff4b26] ring-2 ring-[#ff4b26]/40 scale-105'
                            : 'border-white/15 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {item.type === 'video' ? (
                          <div className="w-full h-full bg-black flex items-center justify-center text-cyan-400">
                            <Film className="w-5 h-5" />
                          </div>
                        ) : isInstagramUrl(item.url) ? (
                          <div className="w-full h-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white">
                            <Instagram className="w-5 h-5" />
                          </div>
                        ) : (
                          <img
                            src={item.url}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono bg-black/80 text-white px-1 rounded">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Information Column */}
              <div className="md:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest block mb-1">
                    {project.categoryLabel}
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mt-2">
                    <span>Client: <strong className="text-white">{project.client}</strong></span>
                    <span>·</span>
                    <span>Year: <strong className="text-white">{project.year}</strong></span>
                  </div>

                  {isInsta && (
                    <div className="mt-4">
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs font-bold font-mono rounded hover:opacity-95 transition-opacity shadow-md"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>Voir la publication sur Instagram</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5">
                    Project Overview
                  </span>
                  <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                    {project.description || 'Bespoke freelance visual solution crafted by Medar Studio.'}
                  </p>
                </div>

                {/* Media Counter details */}
                <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Gallery Content</span>
                  <span className="text-white font-bold">
                    {mediaItems.length} {mediaItems.length === 1 ? 'Asset' : 'Assets'}
                  </span>
                </div>

                {/* Contact CTA */}
                <div className="pt-2">
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="block text-center w-full py-3.5 px-4 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-lg"
                  >
                    Inquire About a Similar Project
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
