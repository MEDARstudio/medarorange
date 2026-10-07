/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LeadEventType = 
  | 'start_project_click' 
  | 'form_view' 
  | 'email_direct_click' 
  | 'whatsapp_direct_click' 
  | 'form_submit' 
  | 'copy_brief';

export interface LeadAnalyticsEvent {
  id: string;
  timestamp: string; // ISO String
  formattedTime: string; // e.g. "18:42:15"
  formattedDate: string; // e.g. "Oct 7, 2026"
  type: LeadEventType;
  label: string;
  source?: string;
  details?: string;
}

export interface LeadAnalyticsData {
  totalStartProjectClicks: number;
  clicksBySource: {
    navbar: number;
    mobileDrawer: number;
    aboutBanner: number;
    allProjectsModal: number;
    other: number;
  };
  totalFormViews: number;
  totalEmailDirectClicks: number;
  totalWhatsAppDirectClicks: number;
  totalFormSubmissions: number;
  totalCopyBriefClicks: number;
  firstTrackedAt: string;
  lastActivityAt: string;
  recentEvents: LeadAnalyticsEvent[];
}

const STORAGE_KEY = 'medar_studio_lead_metrics_v1';
const EVENT_NAME = 'medar_lead_analytics_update';

const createInitialData = (): LeadAnalyticsData => {
  const now = new Date();
  return {
    totalStartProjectClicks: 0,
    clicksBySource: {
      navbar: 0,
      mobileDrawer: 0,
      aboutBanner: 0,
      allProjectsModal: 0,
      other: 0,
    },
    totalFormViews: 0,
    totalEmailDirectClicks: 0,
    totalWhatsAppDirectClicks: 0,
    totalFormSubmissions: 0,
    totalCopyBriefClicks: 0,
    firstTrackedAt: now.toISOString(),
    lastActivityAt: now.toISOString(),
    recentEvents: []
  };
};

/**
 * Retrieve lead analytics from localStorage
 */
export const getLeadAnalytics = (): LeadAnalyticsData => {
  if (typeof window === 'undefined') return createInitialData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialData();
    const parsed = JSON.parse(raw);
    return {
      ...createInitialData(),
      ...parsed,
      clicksBySource: {
        ...createInitialData().clicksBySource,
        ...(parsed.clicksBySource || {})
      },
      recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : []
    };
  } catch (err) {
    console.warn('Error reading lead analytics from localStorage:', err);
    return createInitialData();
  }
};

/**
 * Save lead analytics to localStorage and notify listeners
 */
const saveLeadAnalytics = (data: LeadAnalyticsData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
  } catch (err) {
    console.warn('Error saving lead analytics to localStorage:', err);
  }
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Track a generic lead event
 */
export const logLeadEvent = (
  type: LeadEventType,
  label: string,
  source?: string,
  details?: string
) => {
  const data = getLeadAnalytics();
  const now = new Date();

  const newEvent: LeadAnalyticsEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedTime: formatTime(now),
    formattedDate: formatDate(now),
    type,
    label,
    source,
    details
  };

  // Keep up to 120 recent events
  const updatedEvents = [newEvent, ...data.recentEvents].slice(0, 120);

  const updated: LeadAnalyticsData = {
    ...data,
    lastActivityAt: now.toISOString(),
    recentEvents: updatedEvents
  };

  saveLeadAnalytics(updated);
  return newEvent;
};

/**
 * Track 'Start a Project' CTA Click
 */
export const trackStartProjectClick = (
  source: 'navbar' | 'mobileDrawer' | 'aboutBanner' | 'allProjectsModal' | 'other' = 'navbar'
) => {
  const data = getLeadAnalytics();
  const now = new Date();

  let sourceLabel = 'Navigation Bar';
  if (source === 'mobileDrawer') sourceLabel = 'Mobile Drawer Menu';
  if (source === 'aboutBanner') sourceLabel = 'About / Collaborate Banner';
  if (source === 'allProjectsModal') sourceLabel = 'Portfolio Archive Modal CTA';
  if (source === 'other') sourceLabel = 'Direct CTA';

  const newEvent: LeadAnalyticsEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedTime: formatTime(now),
    formattedDate: formatDate(now),
    type: 'start_project_click',
    label: `Clicked 'Start a Project'`,
    source: sourceLabel,
    details: `Triggered from ${sourceLabel}`
  };

  const updatedClicksBySource = {
    ...data.clicksBySource,
    [source]: (data.clicksBySource[source] || 0) + 1
  };

  const updated: LeadAnalyticsData = {
    ...data,
    totalStartProjectClicks: data.totalStartProjectClicks + 1,
    clicksBySource: updatedClicksBySource,
    lastActivityAt: now.toISOString(),
    recentEvents: [newEvent, ...data.recentEvents].slice(0, 120)
  };

  saveLeadAnalytics(updated);
};

/**
 * Track when contact form is opened/scrolled into view
 */
let lastFormViewTimestamp = 0;
export const trackContactFormView = (triggerSource: string = 'Navigation') => {
  const nowTime = Date.now();
  // Prevent duplicate bursts within 4 seconds
  if (nowTime - lastFormViewTimestamp < 4000) return;
  lastFormViewTimestamp = nowTime;

  const data = getLeadAnalytics();
  const now = new Date();

  const newEvent: LeadAnalyticsEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedTime: formatTime(now),
    formattedDate: formatDate(now),
    type: 'form_view',
    label: 'Contact Form Opened / Viewed',
    source: triggerSource,
    details: `User navigated or arrived at #contact commission form`
  };

  const updated: LeadAnalyticsData = {
    ...data,
    totalFormViews: data.totalFormViews + 1,
    lastActivityAt: now.toISOString(),
    recentEvents: [newEvent, ...data.recentEvents].slice(0, 120)
  };

  saveLeadAnalytics(updated);
};

/**
 * Track direct email click (Gmail compose or mailto)
 */
export const trackEmailDirectClick = (method: 'gmail_web' | 'mailto' = 'gmail_web', clientName?: string) => {
  const data = getLeadAnalytics();
  const now = new Date();

  const methodLabel = method === 'gmail_web' ? 'Gmail Direct Web' : 'Mail Client (mailto)';
  const details = clientName 
    ? `Prepared brief for "${clientName}" via ${methodLabel}` 
    : `Inquiry via ${methodLabel}`;

  const newEvent: LeadAnalyticsEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedTime: formatTime(now),
    formattedDate: formatDate(now),
    type: 'email_direct_click',
    label: `Initiated Email (${methodLabel})`,
    source: methodLabel,
    details
  };

  const updated: LeadAnalyticsData = {
    ...data,
    totalEmailDirectClicks: data.totalEmailDirectClicks + 1,
    lastActivityAt: now.toISOString(),
    recentEvents: [newEvent, ...data.recentEvents].slice(0, 120)
  };

  saveLeadAnalytics(updated);
};

/**
 * Track direct WhatsApp message click
 */
export const trackWhatsAppDirectClick = (clientName?: string) => {
  const data = getLeadAnalytics();
  const now = new Date();

  const details = clientName 
    ? `Brief formulated for "${clientName}" via WhatsApp Hotline` 
    : `Direct inquiry via WhatsApp Hotline`;

  const newEvent: LeadAnalyticsEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedTime: formatTime(now),
    formattedDate: formatDate(now),
    type: 'whatsapp_direct_click',
    label: `Initiated WhatsApp Inquiry`,
    source: 'WhatsApp Hotline',
    details
  };

  const updated: LeadAnalyticsData = {
    ...data,
    totalWhatsAppDirectClicks: data.totalWhatsAppDirectClicks + 1,
    lastActivityAt: now.toISOString(),
    recentEvents: [newEvent, ...data.recentEvents].slice(0, 120)
  };

  saveLeadAnalytics(updated);
};

/**
 * Track form submission (Submit Brief to Studio)
 */
export const trackFormSubmit = (discipline?: string, clientName?: string) => {
  const data = getLeadAnalytics();
  const now = new Date();

  const details = `Discipline: ${discipline || 'General'} · Client: ${clientName || 'Anonymous'}`;

  const newEvent: LeadAnalyticsEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedTime: formatTime(now),
    formattedDate: formatDate(now),
    type: 'form_submit',
    label: `Brief Submitted to Studio`,
    source: 'Interactive Commission Form',
    details
  };

  const updated: LeadAnalyticsData = {
    ...data,
    totalFormSubmissions: data.totalFormSubmissions + 1,
    lastActivityAt: now.toISOString(),
    recentEvents: [newEvent, ...data.recentEvents].slice(0, 120)
  };

  saveLeadAnalytics(updated);
};

/**
 * Track Copy Brief to Clipboard
 */
export const trackCopyBrief = () => {
  const data = getLeadAnalytics();
  const now = new Date();

  const newEvent: LeadAnalyticsEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedTime: formatTime(now),
    formattedDate: formatDate(now),
    type: 'copy_brief',
    label: `Brief Copied to Clipboard`,
    source: 'Interactive Commission Form',
    details: 'User copied formatted brief specs'
  };

  const updated: LeadAnalyticsData = {
    ...data,
    totalCopyBriefClicks: data.totalCopyBriefClicks + 1,
    lastActivityAt: now.toISOString(),
    recentEvents: [newEvent, ...data.recentEvents].slice(0, 120)
  };

  saveLeadAnalytics(updated);
};

/**
 * Reset all counters and activity log
 */
export const resetLeadAnalytics = () => {
  const clean = createInitialData();
  saveLeadAnalytics(clean);
  return clean;
};

/**
 * Subscribe to real-time analytics updates
 */
export const subscribeToLeadAnalytics = (callback: (data: LeadAnalyticsData) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<LeadAnalyticsData>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getLeadAnalytics());
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
};
