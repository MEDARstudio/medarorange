/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Award } from 'lucide-react';
import { CaseStudy } from '../types';

interface ProjectModalProps {
  project: CaseStudy | null;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onNavigate }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
        {/* Backdrop dismiss */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-5xl bg-[#101017] border border-white/10 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        >
          {/* Top Bar inside modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0c0c12]">
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span className="text-white font-semibold">{project.client}</span>
              <span aria-hidden="true">/</span>
              <span>{project.categoryLabel}</span>
              <span aria-hidden="true">/</span>
              <span className="tabular-nums">{project.year}</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#ff4b26]">4:5 Format</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('prev')}
                data-hover="true"
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-white/30 text-white transition-colors"
                title="Previous project"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('next')}
                data-hover="true"
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-white/30 text-white transition-colors"
                title="Next project"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                data-hover="true"
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white text-white hover:text-black transition-colors ml-2"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 md:p-10 space-y-8">
            {/* Visual & Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Instagram 4:5 Poster Artwork Display */}
              <div className="md:col-span-5 relative w-full aspect-[4/5] bg-[#08080c] border border-white/15 overflow-hidden flex flex-col justify-between p-5 shadow-2xl">
                {/* Real Post Artwork */}
                {project.imagePromptFallback && (
                  <img
                    src={project.imagePromptFallback}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                <div className={`absolute inset-0 bg-gradient-to-b ${project.gradientTheme} ${
                  project.imagePromptFallback ? 'opacity-30' : 'opacity-50'
                }`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/60 pointer-events-none" />
                
                {/* Subtle grid */}
                <div 
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                  }}
                />

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/70">
                  <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/10">4:5 INSTAGRAM POST</span>
                  {project.award && (
                    <span className="flex items-center gap-1 text-[10px] text-white bg-black/70 backdrop-blur-md px-2 py-0.5 border border-white/15">
                      <Award className="w-3 h-3 text-[#ff4b26]" />
                      <span>{project.award}</span>
                    </span>
                  )}
                </div>

                {/* Center Vector Graphics (when no image is set) */}
                <div className="relative z-10 my-auto flex items-center justify-center pointer-events-none">
                  {!project.imagePromptFallback && (
                    <svg className="w-full h-auto max-h-[220px] opacity-80" viewBox="0 0 320 280" fill="none">
                      <circle cx="160" cy="140" r="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                      <circle cx="160" cy="140" r="75" stroke={project.accentColor} strokeWidth="1.5" strokeOpacity="0.7" />
                      <line x1="40" y1="140" x2="280" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <line x1="160" y1="20" x2="160" y2="260" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <rect x="95" y="85" width="130" height="110" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                      <text x="160" y="145" textAnchor="middle" fill="#ffffff" fontSize="14" fontFamily="Syne" fontWeight="bold" letterSpacing="0.25em">
                        {project.client.toUpperCase()}
                      </text>
                      <text x="160" y="165" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">
                        ARCHIVE · 4:5 FORMAT
                      </text>
                    </svg>
                  )}
                </div>

                <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-3">
                  <div>
                    <span className="block text-[9px] font-mono text-neutral-400 uppercase">Medar Studio</span>
                    <span className="block text-xs font-bold text-white">{project.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">1080 × 1350 px</span>
                </div>
              </div>

              {/* Title & Core Meta Column */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                    {project.title}
                  </h2>
                  <p className="text-base text-[#ff4b26] font-mono">
                    {project.tagline}
                  </p>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed">
                  {project.description}
                </p>

                {/* 3-Column Stats */}
                <div className="grid grid-cols-2 gap-4 p-5 bg-white/[0.03] border border-white/[0.08]">
                  <div>
                    <span className="block text-2xl font-bold font-mono text-white tabular-nums">
                      {project.metrics.stat}
                    </span>
                    <span className="block text-[11px] uppercase tracking-wider text-neutral-400 mt-0.5">
                      {project.metrics.label}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                      Deliverables
                    </span>
                    <div className="text-xs text-neutral-300">
                      {project.deliverables.join(' · ')}
                    </div>
                  </div>
                </div>

                {project.detailedContext && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Challenge & Strategic Context
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {project.detailedContext.challenge}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Art Direction
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {project.detailedContext.artDirection}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Technologies & Stack
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.detailedContext.stack.map((item, idx) => (
                          <span key={idx} className="text-[11px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-neutral-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <a
                href="#contact"
                onClick={onClose}
                className="px-6 py-3 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white text-xs font-bold uppercase tracking-widest transition-colors"
                data-hover="true"
              >
                Inquire About a Similar Project
              </a>
              <span className="text-xs text-neutral-500 font-mono">
                Medar Studio Archive · #{project.id}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
