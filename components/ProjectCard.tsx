/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CaseStudy, ProjectMediaItem } from '../types';

interface ProjectCardProps {
  project: CaseStudy;
  index: number;
  onSelect: (project: CaseStudy) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  // Extract media items
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
  const isVideo =
    coverItem?.type === 'video' ||
    (targetUrl && (targetUrl.startsWith('data:video/') || targetUrl.endsWith('.mp4')));

  const hasMedia = Boolean(targetUrl && !imageError);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      onClick={() => onSelect(project)}
      data-hover="true"
      className="group relative cursor-pointer flex flex-col bg-[#111116] hover:bg-[#15151c] border border-white/[0.08] hover:border-[#ff4b26]/50 transition-all duration-300 p-3.5 md:p-4"
    >
      {/* 
        =======================================================================
        PURE 4:5 ARTWORK POSTER
        Zero text written on top of the image as requested — no conflicting overlays.
        =======================================================================
      */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#0c0c10] border border-white/[0.06]">
        {isVideo ? (
          <video
            src={targetUrl}
            muted
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : hasMedia ? (
          <img
            src={targetUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            style={{ imageRendering: 'auto' }}
          />
        ) : (
          /* Sleek Minimalist Studio Placeholder (Before photos are added) */
          <div className="w-full h-full relative flex items-center justify-center bg-[#0a0a0e] overflow-hidden">
            {/* Ambient Accent Glow */}
            <div
              className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: project.accentColor || '#ff4b26' }}
            />
            <div
              className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full blur-3xl opacity-15 pointer-events-none"
              style={{ backgroundColor: project.accentColor || '#ff4b26' }}
            />

            {/* Subtle Studio Geometric Grid */}
            <div className="absolute inset-4 border border-white/[0.05] pointer-events-none flex items-center justify-center">
              <div
                className="w-12 h-12 rounded-full border border-white/[0.1] flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                style={{ borderColor: `${project.accentColor || '#ff4b26'}40` }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: project.accentColor || '#ff4b26' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 
        =======================================================================
        CLEAN TITLE AREA BELOW THE IMAGE
        Only the project title is displayed below the poster.
        =======================================================================
      */}
      <div className="pt-3.5 flex items-center justify-between gap-3 min-w-0">
        <h3 className="font-heading text-sm md:text-base font-bold text-white tracking-tight group-hover:text-[#ff4b26] transition-colors duration-200 truncate">
          {project.title}
        </h3>

        <div className="w-6 h-6 flex items-center justify-center shrink-0 text-neutral-400 group-hover:text-[#ff4b26] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
