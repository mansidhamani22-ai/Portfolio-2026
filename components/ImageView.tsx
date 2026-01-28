
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { GeneratedImage } from '../types';

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const url = await generateImage(prompt);
      const newImg: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt,
        timestamp: new Date()
      };
      setCurrentImage(url);
      setHistory(prev => [newImg, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Image generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Generation Controls */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Image Studio</h2>
              <p className="text-white/60">Transform text into hyper-realistic artwork.</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic cyber-city floating in the clouds, neon highlights, cinematic lighting, 8k resolution..."
                className="w-full h-32 glass p-4 rounded-2xl outline-none focus:ring-1 focus:ring-blue-500/50 text-white placeholder-white/20 resize-none text-sm transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all font-bold tracking-wide flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Visualizing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Generate Artifact</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-widest">Technicals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 glass rounded-xl border-white/5">
                <span className="text-[10px] block opacity-40 uppercase">Model</span>
                <span className="text-sm font-medium">Gemini 2.5 Flash</span>
              </div>
              <div className="p-3 glass rounded-xl border-white/5">
                <span className="text-[10px] block opacity-40 uppercase">Resolution</span>
                <span className="text-sm font-medium">1024 x 1024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Output Canvas */}
        <div className="aspect-square glass rounded-3xl overflow-hidden relative flex items-center justify-center group">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/40 backdrop-blur-sm z-10">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-blue-400 animate-pulse">Rendering Pixel Streams...</p>
            </div>
          ) : null}

          {currentImage ? (
            <img 
              src={currentImage} 
              alt="Generated Result" 
              className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
            />
          ) : (
            <div className="text-center space-y-4 opacity-20">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">Awaiting prompt input</p>
            </div>
          )}
        </div>
      </div>

      {/* Generation History */}
      {history.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-bold">Session History</h3>
            <button 
              onClick={() => setHistory([])}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setCurrentImage(item.url)}
                className="aspect-square glass rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all active:scale-95 group"
              >
                <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageView;
