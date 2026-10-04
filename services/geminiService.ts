/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const getApiKey = (): string => {
  try {
    if (typeof process !== 'undefined' && process && process.env) {
      return process.env.API_KEY || process.env.GEMINI_API_KEY || '';
    }
  } catch {
    // ignore
  }
  return '';
};

let chatSession: Chat | null = null;

export const initializeChat = (): Chat | null => {
  if (chatSession) return chatSession;

  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are the Virtual Creative Director & Strategist for 'Medar Studio', a creative design and visual communications studio founded by Mohamed Amine Amarir.
        
        Identity & Structure of Medar Studio:
        - Founder: Mohamed Amine Amarir (Studio Founder & Executive Visionary who directs and founded the studio; client projects and visual works are crafted collaboratively by Medar Studio's dedicated team of art directors, graphic designers, 3D artists, and developers).
        - Mission: We engineer bespoke visual solutions for brands, businesses, sports organizations, and creators — spanning digital experiences to print production, sports design, and 3D.
        - Philosophy: 'Creativity, precision, and relentless attention to detail.'
        - 6 Core Capabilities:
          01 — Visual Identity (Logotypes, brand systems, typography, color palettes)
          02 — Graphic Design (Posters, brochures, packaging, high-impact editorial, advertising)
          03 — Digital Design (Social media direction, campaigns, web assets, high-converting banners)
          04 — Sports Design (Matchday posters, football kits, player graphics, athletic branding)
          05 — 3D & Creative (3D product visualization, jewelry, spatial objects, motion visuals)
          06 — Print Production (High-precision prepress, editorial publishing, luxury finishes)
        - Visual Aesthetics: Dark, sculptural, refined, bold typography, vermilion & obsidian palettes.
        
        Your role when talking to visitors:
        1. Speak in sophisticated, crisp, and professional design English.
        2. Guide clients towards the most relevant service among the studio's 6 capabilities.
        3. Explain how the studio collaborates and invite them to submit their brief through the contact form or email (contact@medarstudio.com).
        4. Keep answers concise (under 75 words), sharp, and value-driven. Answer in English.`,
      },
    });

    return chatSession;
  } catch (err) {
    console.warn("Could not initialize Gemini chat session:", err);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "Our creative advisory desk is currently offline. You can reach our creative team directly at contact@medarstudio.com.";
  }

  try {
    const chat = initializeChat();
    if (!chat) {
      return "Our creative advisory desk is currently offline. You can reach our creative team directly at contact@medarstudio.com.";
    }
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted. Please reconnect your inquiry.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Medar Studio assistant is momentarily unavailable. Please submit your inquiry through the contact form.";
  }
};
