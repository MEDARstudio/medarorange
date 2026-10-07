/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Search, Star, Layers, Film, Sparkles, Filter } from 'lucide-react';
import { trackStartProjectClick, trackContactFormView } from '../utils/leadAnalytics';
import { CaseStudy } from '../types';
import ProjectCard from './ProjectCard';

interface AllProjectsViewProps {
  isOpen: boolean;
  onClose: () => void;
  projects: CaseStudy[];
  onSelectProject: (project: CaseStudy) => void;
  onOpenContact: () => void;
}

const AllProjectsView: React.FC<AllProjectsViewProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onOpenContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewFilter, setViewFilter] = useState<'all' | 'featured'>('all');

  if (!isOpen) return null;

  const featuredCount = projects.filter((p) => p.isFeatured !== false).length;

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (viewFilter === 'featured') return p.isFeatured !== false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0c0c10] text-[#f4f3ee] overflow-y-auto"
    >
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c10]/95 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 md:px-12 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            title="Return to Homepage"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="font-heading text-lg font-black tracking-tight text-white">
              MEDAR STUDIO
            </span>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-44 sm:w-64 md:w-80">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-[#181824] border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white font-mono placeholder:text-neutral-500 focus:outline-none focus:border-[#ff4b26]"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            className="hidden md:flex px-4 py-2 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white text-xs font-bold uppercase tracking-wider font-mono transition-colors cursor-pointer"
          >
            Start a Project
          </button>
        </div>
      </header>

      {/* Page Hero Banner */}
      <section className="pt-16 pb-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="text-xs font-mono text-[#ff4b26] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b26]" />
              <span>Full Archive & Portfolio</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-3">
              All Projects.
            </h1>
            <p className="text-sm md:text-base text-neutral-400 font-light max-w-2xl leading-relaxed">
              Explore the complete collection of Medar Studio case studies, digital artworks, and brand identities. Click any project to inspect its visual assets, details, and photography.
            </p>
          </div>

          {/* Quick Counter Badges & Filter */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-end text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                viewFilter === 'all'
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              All Projects
            </button>

            <button
              type="button"
              onClick={() => setViewFilter('featured')}
              className={`px-3 py-1.5 border transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewFilter === 'featured'
                  ? 'bg-[#ff4b26] text-white font-bold border-[#ff4b26]'
                  : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Featured on Homepage</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="pt-12">
          {filteredProjects.length === 0 ? (
            <div className="py-24 text-center border border-white/[0.08] bg-[#111118] rounded-xl max-w-lg mx-auto p-8">
              <Layers className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-lg font-heading font-bold text-white mb-1">No matching projects found</h3>
              <p className="text-xs text-neutral-400 font-mono mb-4">
                No projects matched your search query "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map((project, index) => (
                <div key={project.id} className="relative group">
                  <ProjectCard
                    project={project}
                    index={index}
                    onSelect={onSelectProject}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Sticky Return Banner */}
      <footer className="border-t border-white/[0.08] bg-[#09090d] py-12 px-4 sm:px-6 md:px-12 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-400">
          <div>
            <span className="text-white font-bold block mb-0.5">MEDAR STUDIO · DIGITAL AGENCY</span>
            <span>Worldwide Creative Direction & High-End Visuals</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              ← Back to Homepage
            </button>

            <button
              type="button"
              onClick={() => {
                trackStartProjectClick('allProjectsModal');
                trackContactFormView('All Projects Modal CTA');
                onOpenContact();
              }}
              className="px-5 py-2.5 bg-[#ff4b26] hover:bg-[#ff5f3c] text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Start a Project
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default AllProjectsView;
