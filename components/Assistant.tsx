
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Minus, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT, PROJECTS } from '../constants';
import { ChatMessage, Project } from '../types';

interface AssistantProps {
  onOpenProject?: (project: Project) => void;
}

const Assistant: React.FC<AssistantProps> = ({ onOpenProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm Maansi's portfolio assistant. Curious about any of her visual communication projects or her design journey?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      /* Initializing GoogleGenAI with the process.env.API_KEY string directly as per instructions */
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      /* Updated implementation to use systemInstruction for better model behavior and guidelines compliance */
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            ...messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });

      /* Accessing .text property directly from the response object as per SDK guidelines */
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: response.text || "I'm sorry, I couldn't process that. Could you try again?" 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Gemini Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I had a bit of a creative block. Please check the connection and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.role === 'user') return msg.content;

    // Regex to find [OPEN_PROJECT:ID]
    const projectTagRegex = /\[OPEN_PROJECT:(\w+)\]/g;
    const projectIds: string[] = [];
    let cleanContent = msg.content.replace(projectTagRegex, (_, id) => {
      projectIds.push(id);
      return ''; // Remove the tag from the text
    });

    return (
      <div className="space-y-4">
        <p>{cleanContent}</p>
        {projectIds.map(id => {
          const project = PROJECTS.find(p => p.id === id);
          if (!project) return null;
          return (
            <button
              key={id}
              onClick={() => onOpenProject?.(project)}
              className="flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 group"
            >
              <span>View Project: {project.title}</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          );
        })}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 left-10 z-50 flex items-center space-x-3 bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border border-black/10 dark:border-white/10"
      >
        <Sparkles size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">Guide</span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-10 left-10 z-[100] w-[350px] md:w-[400px] bg-white dark:bg-[#000] border border-black/10 dark:border-white/10 rounded-sm overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'}`}
      id="ai"
    >
      {/* Header */}
      <div className="p-4 bg-white dark:bg-[#000] border-b border-black/5 dark:border-white/10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-sm bg-black dark:bg-white flex items-center justify-center">
            <Sparkles size={12} className="text-white dark:text-black" />
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Portfolio AI</h4>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-gray-500">
            <Minus size={14} />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-gray-500">
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white dark:bg-[#000]"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'text-black dark:text-white font-bold text-right' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {renderMessageContent(m)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-black/5 dark:border-white/10 bg-white dark:bg-[#000]">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about my work..."
                className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 pr-10 text-xs text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-black dark:text-white disabled:opacity-20"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Assistant;
