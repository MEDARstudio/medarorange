/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { AgencyService } from '../types';

interface ServiceCardProps {
  service: AgencyService;
  index: number;
  onSelect: (serviceTitle: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="group relative bg-[#111117] hover:bg-[#14141e] border border-white/[0.08] hover:border-[#ff4b26] hover:shadow-[0_20px_50px_rgba(255,75,38,0.2),0_0_25px_rgba(255,75,38,0.1)] transition-all duration-300 p-8 flex flex-col justify-between overflow-hidden"
    >
      {/* Top luminous accent beam on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff4b26] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Ambient background glow on hover */}
      <div 
        className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: `${service.accent}20` }}
      />

      {/* Card Content */}
      <div className="relative z-10">
        {/* Top row: Number & Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#ff4b26] group-hover:text-white transition-colors">
              {service.number}
            </span>
            <span 
              className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:scale-125 transition-all"
              style={{ backgroundColor: service.accent }}
            />
          </div>

          <span className="text-[11px] font-mono text-neutral-400 group-hover:text-white tracking-wider uppercase border border-white/10 group-hover:border-white/25 px-2.5 py-0.5 transition-colors">
            {service.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-2xl font-bold text-white tracking-tight mb-3 group-hover:text-white transition-colors">
          {service.number} — {service.title}
        </h3>

        {/* Scope unboxed list */}
        <div className="text-xs font-mono text-[#ff4b26] mb-5 tracking-wide flex flex-wrap items-center gap-1.5">
          {service.scope.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="group-hover:text-[#ff6a49] transition-colors">{item}</span>
              {idx < service.scope.length - 1 && (
                <span aria-hidden="true" className="text-neutral-600">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-300 leading-relaxed mb-6 group-hover:text-neutral-200 transition-colors">
          {service.description}
        </p>

        {/* Deliverables */}
        <div className="pt-4 border-t border-white/[0.08] group-hover:border-white/15 mb-8 space-y-2 transition-colors">
          <span className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 group-hover:text-neutral-400 mb-2 transition-colors">
            Key Deliverables
          </span>
          <ul className="space-y-1.5">
            {service.deliverables.map((d, i) => (
              <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#ff4b26] mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <button
        onClick={() => onSelect(service.title)}
        className="relative z-10 w-full py-3 px-4 bg-white/5 hover:bg-[#ff4b26] text-white font-mono text-xs uppercase tracking-wider transition-all duration-200 border border-white/10 hover:border-[#ff4b26] flex items-center justify-between cursor-pointer"
      >
        <span className="font-semibold">Commission this Service</span>
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </motion.div>
  );
};

export default ServiceCard;
