/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  isTransitioning: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ isTransitioning }) => {
  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden">
          {/* Main Sweep Curtain - Sweeps in from Right (100%) and exits to Left (-100%) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ 
              x: ['100%', '0%', '0%', '-100%'],
              transition: {
                duration: 0.95,
                times: [0, 0.42, 0.58, 1],
                ease: [0.76, 0, 0.24, 1]
              }
            }}
            className="absolute inset-0 bg-[#0a0a0f] flex items-center justify-center border-l-2 md:border-l-4 border-l-[#ff4b26] border-r-2 md:border-r-4 border-r-[#ff4b26]/50 shadow-[0_0_80px_rgba(255,75,38,0.35)]"
          >
            {/* Subtle High-End Grid & Radial Glow */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 75, 38, 0.2) 0%, transparent 65%),
                                  linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                backgroundSize: '100% 100%, 32px 32px, 32px 32px'
              }}
            />

            {/* Glowing Center Logo Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.92, 1, 1, 0.96],
                y: [8, 0, 0, -8],
                transition: {
                  duration: 0.95,
                  times: [0, 0.35, 0.65, 1],
                  ease: "easeInOut"
                }
              }}
              className="relative z-10 flex flex-col items-center justify-center text-center px-6 select-none"
            >
              {/* Wordmark with Vermilion Accents */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mb-3">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#ff4b26] rotate-45 shadow-[0_0_16px_#ff4b26] shrink-0" />
                <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
                  MEDAR STUDIO
                </h1>
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#ff4b26] rotate-45 shadow-[0_0_16px_#ff4b26] shrink-0" />
              </div>

              {/* Glowing Line */}
              <div className="w-36 sm:w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#ff4b26] to-transparent mb-3 shadow-[0_0_10px_#ff4b26]" />

              {/* Minimal Brand Tag */}
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
                <span>Visual Systems</span>
                <span className="text-[#ff4b26]">·</span>
                <span>Sports & 3D</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;
