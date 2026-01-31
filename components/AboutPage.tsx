import React, { useEffect } from 'react';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Updated profile image with reliable Google Drive thumbnail API
  const profileImage = "https://drive.google.com/thumbnail?id=1NTKhCkoYLFzIhPaomEDnH-WCMc6IPpFL&sz=w1000";
  const fallbackImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-32 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 h-full flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col mb-12 md:mb-24 border-b border-black/10 dark:border-white/10 pb-12">
          <div className="space-y-0 max-w-fit">
            <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gray-500 block mb-1">
              A LITTLE
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter dzinr-text leading-[0.8] text-orange-500 cursor-default">
              ABOUT ME?
            </h2>
          </div>
        </div>

        {/* Main Centered Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-24 py-10">
          
          {/* Centered Image */}
          <div className="w-full lg:w-auto flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-md lg:w-[480px] aspect-square lg:aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-[#0a0a0a] shadow-2xl">
              <img 
                src={profileImage} 
                alt="Maansi Dhamani Portrait" 
                className="w-full h-full object-cover grayscale brightness-[0.95] dark:brightness-[0.85] transition-all duration-1000 ease-in-out"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>
          </div>

          {/* Right Side Bio */}
          <div className="w-full lg:w-[450px] space-y-12 text-left order-1 lg:order-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">Maansi Dhamani</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] leading-relaxed transition-colors duration-500 hover:text-orange-400 cursor-default">
                  Visual Communication Designer
                </p>
              </div>
              
              <p className="text-sm md:text-base font-light text-gray-500 dark:text-gray-400 leading-relaxed max-w-md italic serif border-l border-black/10 dark:border-white/10 pl-6 py-2">
                "I’m a visual communication designer who approaches design through observation, experimentation, and conscious decision-making. I’m interested in how visuals communicate ideas, evoke emotion, and build meaningful connections. Guided by clarity, context, and intent, I’m continuously learning and refining my visual language through making."
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-col space-y-5 border-t border-black/5 dark:border-white/5 pt-10">
              <a 
                href="https://www.instagram.com/_maansi4301?igsh=MTg2ODR6OXAzOTZqMw==" 
                target="_blank" 
                className="group flex items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] text-black dark:text-white hover:text-gray-400 transition-colors"
              >
                <span>Instagram</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
              <a 
                href="https://www.linkedin.com/in/maansi-dhamani-85301a348" 
                target="_blank" 
                className="group flex items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] text-black dark:text-white hover:text-gray-400 transition-colors"
              >
                <span>Linkedin</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
              <a 
                href="https://www.behance.net/maansidhamani22" 
                target="_blank" 
                className="group flex items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] text-black dark:text-white hover:text-gray-400 transition-colors"
              >
                <span>Behance</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Back Navigation */}
        <div className="mt-auto pt-12 flex flex-col items-center">
          <button 
            onClick={onBack}
            className="group flex flex-col items-center space-y-6 cursor-pointer"
          >
            <div className="w-14 h-14 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black group-hover:border-black dark:group-hover:border-white">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">Back to Home</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;