/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  variant?: 'vermilion' | 'gold' | 'monochrome' | 'silver';
}

const GradientText: React.FC<GradientTextProps> = ({ 
  text, 
  as: Component = 'span', 
  className = '',
  variant = 'vermilion'
}) => {
  const gradientStyles = {
    vermilion: 'from-[#ffffff] via-[#ff6a42] via-[#ff4b26] to-[#e0a96d]',
    gold: 'from-[#ffffff] via-[#f59e0b] via-[#d97706] to-[#fef3c7]',
    monochrome: 'from-[#ffffff] via-[#e4e4e7] via-[#a1a1aa] to-[#ffffff]',
    silver: 'from-[#ffffff] via-[#cbd5e1] via-[#94a3b8] to-[#ffffff]'
  }[variant];

  return (
    <Component className={`relative inline-block font-heading tracking-tight ${className}`}>
      {/* Animated subtle shimmer layer */}
      <motion.span
        className={`absolute inset-0 z-10 block bg-gradient-to-r ${gradientStyles} bg-[length:200%_auto] bg-clip-text text-transparent will-change-[background-position]`}
        animate={{
          backgroundPosition: ['0% center', '200% center'],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)',
        }}
      >
        {text}
      </motion.span>
      
      {/* Fallback readable base text */}
      <span 
        className="block text-[#f4f3ee] opacity-40 select-none"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent' 
        }}
      >
        {text}
      </span>
      
      {/* Ambient soft glow */}
      <span
        className={`absolute inset-0 -z-10 block bg-gradient-to-r ${gradientStyles} bg-[length:200%_auto] bg-clip-text text-transparent blur-2xl opacity-25`}
        aria-hidden="true"
      >
        {text}
      </span>
    </Component>
  );
};

export default GradientText;
