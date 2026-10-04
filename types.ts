/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type ProjectCategory = 'all' | '3d-webgl' | 'brand-identity' | 'ecommerce-luxe' | 'generative-art';

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  metrics: {
    stat: string;
    label: string;
  };
  deliverables: string[];
  gradientTheme: string;
  accentColor: string;
  imagePromptFallback?: string;
  award?: string;
  detailedContext?: {
    challenge: string;
    artDirection: string;
    stack: string[];
    result: string;
  };
}

export interface AgencyService {
  id: string;
  number: string;
  title: string;
  scope: string[];
  description: string;
  deliverables: string[];
  tag: string;
  accent: string;
}

export interface ServiceExpertise {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  highlightMetric: string;
}

export interface StudioPhilosophy {
  step: string;
  title: string;
  concept: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  focus: string;
  bio: string;
  tag: string;
}

export interface StudioValue {
  number: string;
  title: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface CreativeBriefState {
  clientName: string;
  email: string;
  company: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  vision: string;
}

export interface StudioGeneralInfo {
  studioName: string;
  tagline: string;
  officialQuote: string;
  officialParagraph: string;
  city: string;
  address: string;
  foundedYear: string;
  email: string;
  phone: string;
  founderName: string;
  founderRole: string;
  founderFocus: string;
  founderBio: string;
}

export type PaletteMood = 'vermilion' | 'obsidian' | 'solaris' | 'kinetic-mint';
