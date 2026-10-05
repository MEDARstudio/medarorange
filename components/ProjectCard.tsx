/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers, Film, Instagram } from 'lucide-react';
import { CaseStudy, ProjectMediaItem } from '../types';
import { isInstagramUrl, getInstagramShortcode, getInstagramEmbedUrl } from '../utils/mediaHelper';

interface ProjectCardProps {
  project: CaseStudy;
  index: number;
  onSelect: (project: CaseStudy) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onSelect }) => {
  const [imageError, setImageError] = React.useState(false);

  // Extract all media items
  const mediaItems: ProjectMediaItem[] = React.useMemo(() => {
    if (project.media && project.media.length > 0) {
      return project.media;
    }
    const items: ProjectMediaItem[] = [];
    if (project.videoUrl) {
      items.push({ id: 'video-1', type: 'video', url: project.videoUrl });
    }
    if (project.imagePromptFallback) {
      items.push({ id: 'img-1', type: 'image', url: project.imagePromptFallback });
    }
    return items;
  }, [project]);

  const coverItem = mediaItems[0];
  const targetUrl = coverItem?.url || project.imagePromptFallback || '';
  const isInsta = isInstagramUrl(targetUrl);
  const instaShortcode = isInsta ? getInstagramShortcode(targetUrl) : null;
  const isVideo = coverItem?.type === 'video' || (targetUrl && (targetUrl.startsWith('data:video/') || targetUrl.endsWith('.mp4')));

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      onClick={() => onSelect(project)}
      data-hover="true"
      className="group relative cursor-pointer flex flex-col justify-between bg-[#121218] hover:bg-[#161620] border border-white/[0.08] hover:border-[#ff4b26]/50 transition-all duration-300 overflow-hidden p-5 md:p-6"
    >
      {/* 
        =======================================================================
        VISUAL ARTWORK AREA - 4:5 ASPECT RATIO
        =======================================================================
      */}
      <div className="relative w-full aspect-[4/5] overflow-hidden mb-5 bg-[#0a0a0f] border border-white/[0.08] shadow-lg flex flex-col justify-between p-4">
        {/* Render Cover Media */}
        {isInsta && instaShortcode ? (
          <div className="absolute inset-0 w-full h-full bg-[#0d0d14] flex flex-col items-center justify-center overflow-hidden">
            <iframe
              src={getInstagramEmbedUrl(instaShortcode) || undefined}
              title={project.title}
              className="w-full h-full border-0 pointer-events-none scale-[1.02] group-hover:scale-105 transition-transform duration-500"
              scrolling="no"
              loading="lazy"
            />
          </div>
        ) : isVideo ? (
          <video
            src={targetUrl}
            muted
            autoPlay
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : targetUrl && !imageError ? (
          <img
            src={targetUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            style={{ imageRendering: 'auto' }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1c1c28] via-[#12121b] to-[#0a0a0f] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              {isInsta ? (
                <Instagram className="w-7 h-7 text-pink-500" />
              ) : (
                <Layers className="w-7 h-7 text-[#ff4b26]" />
              )}
            </div>
            <span className="text-xs font-heading font-bold text-white mb-1 line-clamp-1">
              {project.title}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {isInsta ? 'Post Instagram' : 'Artwork Design'}
            </span>
          </div>
        )}

        {/* Contrast vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/90 tracking-wider">
          <span className="flex items-center gap-1.5 bg-black/80 px-2 py-0.5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.accentColor || '#ff4b26' }} />
            <span>4:5 POST</span>
          </span>

          <div className="flex items-center gap-1.5">
            {isInsta ? (
              <span className="flex items-center gap-1 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-2 py-0.5 text-white text-[9px] font-bold rounded">
                <Instagram className="w-3 h-3" />
                <span>INSTAGRAM</span>
              </span>
            ) : mediaItems.length > 1 ? (
              <span className="flex items-center gap-1 bg-black/80 px-2 py-0.5 border border-white/15 text-white text-[9px]">
                <Layers className="w-3 h-3 text-[#ff4b26]" />
                <span>{mediaItems.length} MEDIA</span>
              </span>
            ) : null}

            {isVideo && (
              <span className="flex items-center gap-1 bg-black/80 px-2 py-0.5 border border-white/15 text-white text-[9px]">
                <Film className="w-3 h-3 text-cyan-400" />
                <span>VIDEO</span>
              </span>
            )}
          </div>
        </div>

        {/* Center Hover prompt */}
        <div className="relative z-10 my-auto flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[11px] font-mono tracking-widest uppercase bg-black/85 px-3 py-1 text-white border border-white/20">
            View Project
          </span>
        </div>

        {/* Bottom Bar of 4:5 Poster Artwork */}
        <div className="relative z-10 flex items-end justify-between border-t border-white/15 pt-2.5">
          <div className="min-w-0 pr-2">
            <span className="block text-[9px] font-mono text-neutral-400 uppercase tracking-widest truncate">
              {project.client}
            </span>
            <span className="block text-xs font-bold text-white tracking-wide truncate">
              {project.title}
            </span>
          </div>

          <div className="w-7 h-7 bg-white text-black flex items-center justify-center shrink-0 group-hover:bg-[#ff4b26] group-hover:text-white transition-colors duration-200">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Metadata & Project Description */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono tracking-wider mb-1.5">
            <span className="text-white/80 font-medium truncate">{project.client}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="tabular-nums">{project.year}</span>
          </div>

          <h3 className="font-heading text-lg font-bold text-white tracking-tight mb-2 group-hover:text-[#ff4b26] transition-colors duration-200">
            {project.title}
          </h3>

          {project.description && (
            <p className="text-xs text-neutral-400 font-normal leading-relaxed line-clamp-2 mb-4">
              {project.description}
            </p>
          )}
        </div>

        {/* Clean Footer Bar */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <span className="text-[10px] uppercase text-neutral-500 tracking-wider">
            {project.categoryLabel}
          </span>

          <span className="text-xs text-neutral-300 font-medium group-hover:text-white transition-colors flex items-center gap-1">
            Open <ArrowUpRight className="w-3 h-3 text-[#ff4b26]" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
