
import React, { useEffect } from 'react';
/* Added ArrowRight to the imports from lucide-react to fix the 'Cannot find name' error */
import { ArrowLeft, ArrowRight, Briefcase, GraduationCap, Code, Award, Globe, Mail, Phone, Linkedin, ExternalLink } from 'lucide-react';

interface ResumePageProps {
  onBack: () => void;
}

const ResumePage: React.FC<ResumePageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const projects = [
    {
      title: 'Illustration Book',
      details: 'Conceptualized and illustrated an original book based on a narrative theme. Developed characters, environments, and scenes using consistent visual language. Explored color palettes, composition, and pacing to support narrative flow.'
    },
    {
      title: 'Illustration & Surface Design',
      details: 'Created concept-driven illustrations for a Fanta soda can, exploring bold color and playful visual language. Designed surface graphics suitable for packaging and presented final designs through realistic mockups.'
    },
    {
      title: 'Brand Identity Design',
      details: 'Developed a complete visual identity for "Hues & Brews". Designed logo, color palette, and typography system. Created brand applications including packaging, posters, and digital creatives.'
    },
    {
      title: 'Craft Documentation Book Design',
      details: 'Documented traditional craft practices through a structured book design approach. Designed layouts using grid systems, typographic hierarchy, and image–text balance with attention to readability.'
    }
  ];

  const education = [
    {
      year: '2024 - 2028',
      degree: 'Visual Communication B.Des(Hons.)',
      school: 'Unitedworld Institute of Design, Ahmedabad',
      details: 'Focusing on advanced visual storytelling, graphic design principles, and digital tool mastery.'
    }
  ];

  const softwareList = ['Adobe Illustrator', 'Adobe InDesign', 'Adobe Photoshop', 'Procreate', 'Figma'];
  const skillList = ['Branding', 'Packaging Design', 'Publication & Editorial Design', 'Illustration'];
  
  const certifications = [
    'Introduction to Graphic Design: Concepts by LinkedIn',
    'Creating Inclusive Content by LinkedIn'
  ];

  const languages = ['English', 'Hindi (Native)'];

  return (
    <div className="min-h-screen bg-white dark:bg-[#000] pt-64 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 text-black dark:text-white">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-32">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-px bg-black dark:bg-white opacity-20" />
              <span className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-400">Archival Record</span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10vw] font-black uppercase tracking-tighter leading-[0.8] dzinr-text text-black dark:text-white">
              Maansi<br/><span className="text-gray-100 dark:text-gray-900">Dhamani.</span>
            </h1>
          </div>
          <div className="lg:max-w-md pb-4 space-y-4">
             <div className="flex flex-col space-y-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <div className="flex items-center space-x-3">
                  <Mail size={12} />
                  <span>maansidhamani@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={12} />
                  <span>+91 9887714508</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin size={12} />
                  <span>linkedin.com/in/maansi-dhamani-85301a348</span>
                </div>
             </div>
             <p className="text-lg font-light text-gray-500 dark:text-gray-400 leading-tight">
               Visual Communication student with a focus on graphic design, narrative illustration, and brand systems.
             </p>
          </div>
        </div>

        {/* Projects Section */}
        <section className="mb-48">
          <div className="flex items-center space-x-8 mb-16">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border border-black/10 dark:border-white/10">
              <Briefcase size={18} className="text-black dark:text-white" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">Selected Projects</h2>
            <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
          </div>

          <div className="space-y-24">
            {projects.map((proj, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 group">
                <div className="md:col-span-3">
                  <span className="text-4xl md:text-5xl font-black text-gray-100 dark:text-gray-900 dzinr-text tracking-tighter block group-hover:text-black dark:group-hover:text-white transition-colors duration-500">0{idx + 1}</span>
                </div>
                <div className="md:col-span-9 space-y-4">
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white">{proj.title}</h3>
                  <p className="text-xl font-light text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                    {proj.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grid for Skills and Education */}
        <div className="grid lg:grid-cols-2 gap-32 mb-48">
          
          {/* Education */}
          <section>
            <div className="flex items-center space-x-8 mb-16">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-black/10 dark:border-white/10">
                <GraduationCap size={18} className="text-black dark:text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">Education</h2>
            </div>
            <div className="space-y-16">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-6 border-l-2 border-black/5 dark:border-white/10 pl-8">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">{edu.year}</span>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">{edu.degree}</h3>
                    <p className="text-xs font-black uppercase tracking-widest text-black dark:text-white">{edu.school}</p>
                  </div>
                  <p className="text-lg font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                    {edu.details}
                  </p>
                </div>
              ))}
            </div>

            {/* Certifications & Languages - Nested here for balance */}
            <div className="mt-24 space-y-16">
               <div>
                  <div className="flex items-center space-x-4 mb-8">
                    <Award size={16} className="text-gray-400" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Certifications</h4>
                  </div>
                  <ul className="space-y-4">
                    {certifications.map((cert, i) => (
                      <li key={i} className="text-sm font-bold uppercase tracking-tight text-black dark:text-white border-b border-black/5 dark:border-white/5 pb-2">
                        {cert}
                      </li>
                    ))}
                  </ul>
               </div>

               <div>
                  <div className="flex items-center space-x-4 mb-8">
                    <Globe size={16} className="text-gray-400" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Languages</h4>
                  </div>
                  <ul className="flex flex-wrap gap-8">
                    {languages.map((lang, i) => (
                      <li key={i} className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">
                        {lang}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>
          </section>

          {/* Tools & Skills */}
          <section>
            <div className="flex items-center space-x-8 mb-16">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-black/10 dark:border-white/10">
                <Code size={18} className="text-black dark:text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">Technical Core</h2>
            </div>
            
            <div className="space-y-16">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Softwares</h4>
                
                {/* Animated Logo Ticker */}
                <div className="relative w-full overflow-hidden mb-12 pb-4 border-b border-black/5 dark:border-white/5">
                    {/* Gradient Fade Edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none"></div>
                    
                    <div className="flex w-max animate-software-scroll hover:[animation-play-state:paused] items-center">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-16 mx-8">
                                <img src="https://cdn.simpleicons.org/adobeillustrator/FF9A00" alt="Adobe Illustrator" className="h-10 w-auto opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110" />
                                <img src="https://cdn.simpleicons.org/adobephotoshop/31A8FF" alt="Adobe Photoshop" className="h-10 w-auto opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110" />
                                <img src="https://cdn.simpleicons.org/adobeindesign/FF3366" alt="Adobe InDesign" className="h-10 w-auto opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110" />
                                <img src="https://cdn.simpleicons.org/figma/F24E1E" alt="Figma" className="h-10 w-auto opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110" />
                                <img src="https://cdn.simpleicons.org/procreate/000000" alt="Procreate" className="h-10 w-auto opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110 dark:invert" />
                            </div>
                        ))}
                    </div>
                    <style>{`
                        @keyframes software-scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-software-scroll {
                            animation: software-scroll 30s linear infinite;
                        }
                    `}</style>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {softwareList.map((item, i) => (
                    <div key={i} className="text-2xl font-black uppercase tracking-tighter text-black dark:text-white group flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 hover:pl-4 transition-all duration-300">
                      <span>{item}</span>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Design Skills</h4>
                <div className="flex flex-wrap gap-4">
                  {skillList.map((item, i) => (
                    <span key={i} className="px-6 py-3 border border-black/10 dark:border-white/20 text-xs font-black uppercase tracking-widest text-black dark:text-white rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Resume Footer */}
        <div className="pt-32 border-t border-black/5 dark:border-white/5 flex flex-col items-center">
          <div className="flex flex-col items-center space-y-12">
            <div className="text-center space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.8em] text-gray-300">End of Portfolio Archive</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm italic font-serif">Maansi Dhamani — Visual Communication Portfolio'26</p>
            </div>

            <button 
              onClick={onBack}
              className="group flex flex-col items-center space-y-8 cursor-pointer"
            >
              <div className="w-24 h-24 border-2 border-black dark:border-white rounded-full flex items-center justify-center transition-all group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black">
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-500" size={32} />
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-2">Return to Main View</span>
                <span className="text-2xl font-black uppercase tracking-widest text-black dark:text-white underline underline-offset-8 decoration-gray-200">EXIT ARCHIVE</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumePage;
