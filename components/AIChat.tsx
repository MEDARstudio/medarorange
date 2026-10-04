/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Welcome to Medar Studio. I am your creative director & strategy advisor. Tell me about your project, or ask about our capabilities and workflows.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!customText) setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 80);

    const responseText = await sendMessageToGemini(textToSend);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[92vw] sm:w-[420px] bg-[#0e0e14]/95 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#14141c] p-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff4b26] animate-pulse" />
                <div>
                  <h3 className="font-heading text-sm font-bold text-white tracking-wide">
                    Medar Studio · Creative Advisory
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    Virtual Creative Director
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-neutral-400 hover:text-white p-1"
                data-hover="true"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-72 overflow-y-auto p-4 space-y-3 font-sans text-xs scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#ff4b26] text-white font-medium'
                        : 'bg-[#181822] text-neutral-200 border border-white/[0.08]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#181822] p-3 border border-white/[0.08] flex items-center gap-1.5 text-neutral-400">
                    <span className="w-1.5 h-1.5 bg-[#ff4b26] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#ff4b26] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#ff4b26] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] ml-1 font-mono">Artistic reasoning...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Inspiration Prompts */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-black/40 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                {[
                  'Luxury brand color palette',
                  'WebGL 3D feasibility',
                  'Typical timeline & budget'
                ].map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(promptText)}
                    className="text-[11px] text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 border border-white/10 transition-colors"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 border-t border-white/10 bg-[#0a0a0f]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask a question about your project..."
                  className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#ff4b26]"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#ff4b26] hover:bg-[#ff5f3c] p-2 text-white transition-colors disabled:opacity-40"
                  data-hover="true"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-[#13131a] hover:bg-[#1a1a24] text-white border border-white/20 shadow-2xl flex items-center gap-2.5 text-xs font-mono tracking-wider uppercase transition-colors"
        data-hover="true"
      >
        <span className="w-2 h-2 rounded-full bg-[#ff4b26] animate-pulse" />
        {isOpen ? (
          <>
            <X className="w-3.5 h-3.5 text-white" />
            <span>Close</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-[#ff4b26]" />
            <span>Creative Advisor</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
