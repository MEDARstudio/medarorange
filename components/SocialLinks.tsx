/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { StudioGeneralInfo } from '../types';

interface SocialLinksProps {
  studioInfo: StudioGeneralInfo;
  variant?: 'footer' | 'compact';
  className?: string;
}

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const TiktokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23 1.01.14 2.11.89 2.8.69.66 1.71.93 2.63.74.84-.14 1.59-.68 1.99-1.42.23-.48.33-1.02.33-1.55.02-4.42-.01-8.84.02-13.26.01-.15.01-.31.02-.46z"/>
  </svg>
);

export const GmailIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.491l8.073-5.998C21.691 2.28 24 3.434 24 5.457z"/>
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const SOCIAL_PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@medarstudio',
    defaultUrl: 'https://instagram.com/medarstudio',
    getUrl: (info: StudioGeneralInfo) => info.instagramUrl || 'https://instagram.com/medarstudio',
    Icon: InstagramIcon,
    color: '#E4405F'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Medar Studio',
    defaultUrl: 'https://facebook.com/medarstudio',
    getUrl: (info: StudioGeneralInfo) => info.facebookUrl || 'https://facebook.com/medarstudio',
    Icon: FacebookIcon,
    color: '#1877F2'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Medar Studio',
    defaultUrl: 'https://linkedin.com/company/medarstudio',
    getUrl: (info: StudioGeneralInfo) => info.linkedinUrl || 'https://linkedin.com/company/medarstudio',
    Icon: LinkedinIcon,
    color: '#0A66C2'
  },
  {
    id: 'x',
    name: 'X',
    handle: '@medarstudio',
    defaultUrl: 'https://x.com/medarstudio',
    getUrl: (info: StudioGeneralInfo) => info.xUrl || 'https://x.com/medarstudio',
    Icon: XIcon,
    color: '#ffffff'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@medarstudio',
    defaultUrl: 'https://tiktok.com/@medarstudio',
    getUrl: (info: StudioGeneralInfo) => info.tiktokUrl || 'https://tiktok.com/@medarstudio',
    Icon: TiktokIcon,
    color: '#25F4EE'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    handle: 'medarstudio@gmail.com',
    defaultUrl: 'mailto:medarstudio@gmail.com',
    getUrl: (info: StudioGeneralInfo) => `mailto:${info.email || 'medarstudio@gmail.com'}`,
    Icon: GmailIcon,
    color: '#EA4335'
  }
];

const SocialLinks: React.FC<SocialLinksProps> = ({
  studioInfo,
  className = ''
}) => {
  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {SOCIAL_PLATFORMS.map((platform) => {
        const url = platform.getUrl(studioInfo);
        const { Icon } = platform;
        return (
          <a
            key={platform.id}
            href={url}
            target={platform.id === 'gmail' ? undefined : "_blank"}
            rel={platform.id === 'gmail' ? undefined : "noopener noreferrer"}
            aria-label={`${platform.name} - Medar Studio`}
            title={platform.id === 'gmail' ? `Email via ${platform.name}` : `Follow Medar Studio on ${platform.name}`}
            className="w-8 h-8 rounded-none border border-white/10 bg-white/[0.04] hover:bg-[#ff4b26] hover:border-[#ff4b26] text-neutral-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm group cursor-pointer"
          >
            <Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
