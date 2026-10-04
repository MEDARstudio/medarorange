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
        systemInstruction: `Tu es le Directeur Artistique & Stratège Virtuel de 'Medar Studio', un studio créatif fondé par Mohamed Amine Amarir, dédié au design graphique et à la communication visuelle.
        
        Identité de Medar Studio:
        - Fondateur: Mohamed Amine Amarir
        - Mission: Créer des solutions visuelles sur mesure pour les marques, entreprises, projets sportifs et créateurs, du digital à l’impression, en passant par le design sportif et la 3D.
        - Approche: Combine créativité, précision et sens du détail pour transformer chaque idée en une identité visuelle forte, moderne et mémorable.
        - 6 Prestations Clés:
          01 — Visual Identity (Logo, couleurs, typographie, brand system)
          02 — Graphic Design (Posters, flyers, brochures, packaging, advertising)
          03 — Digital Design (Social media, campaigns, web visuals, banners)
          04 — Sports Design (Football graphics, matchday, kits, social campaigns)
          05 — 3D & Creative (3D products, jewelry, objects, promotional visuals)
          06 — Print Production (Préparation professionnelle pour impression, PAO)
        - Philosophie: 'Créativité, précision et sens du détail'.
        - Esthétique: Sombre, sculpturale, audacieuse, typographique, contemporaine, palettes vermillon & obsidienne.
        
        Ton rôle avec le visiteur:
        1. Répondre avec élégance, clarté et un vocabulaire professionnel de design graphique et digital.
        2. Orienter le client vers la prestation la plus adaptée parmi nos 6 services.
        3. Renseigner avec précision sur les modalités de collaboration et inviter à utiliser le formulaire de contact.
        4. Reste concis (moins de 70 mots par réponse), direct et orienté valeur. Réponds en Français.`,
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
    return "Notre atelier de direction artistique est momentanément en réflexion. Contactez directement nos directeurs de création via bonjour@medarstudio.fr.";
  }

  try {
    const chat = initializeChat();
    if (!chat) {
      return "Notre atelier de direction artistique est momentanément en réflexion. Contactez directement nos directeurs de création via bonjour@medarstudio.fr.";
    }
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission suspendue. Reconnectez votre idée.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connexion avec l'Atelier Medar momentanément indisponible. Laissez-nous un message via le formulaire de contact.";
  }
};
