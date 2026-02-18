
import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Briefcase, GraduationCap, Code, Award, Globe, Mail, Phone, Linkedin } from 'lucide-react';

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
    <div className="min-h-screen bg-transparent pt-20 pb-12 transition-colors duration-500">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 text-black dark:text-white">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-px bg-black dark:bg-white opacity-20" />
              <span className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-400">Archival Record</span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9vw] font-black uppercase tracking-tighter leading-[0.8] dzinr-text text-black dark:text-white">
              Maansi<br/><span className="text-gray-100 dark:text-gray-900">Dhamani.</span>
            </h1>
          </div>
          <div className="lg:max-w-md pb-1 space-y-2">
             <div className="flex flex-col space-y-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <div className="flex items-center space-x-3">
                  <Mail size={12} />
                  <span>maansidhamani@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe size={12} />
                  <span>Ahmedabad, India</span>
                </div>
             </div>
             <p className="text-sm leading-relaxed font-light text-gray-500 dark:text-gray-400">
                A multidisciplinary designer crafting visual narratives through branding, packaging, and editorial design.
             </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-black/10 dark:bg-white/10 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left Column (Experience & Education) */}
            <div className="lg:col-span-8 space-y-10">
                
                {/* Projects Section */}
                <section>
                    <div className="flex items-center space-x-3 mb-6">
                        <Briefcase size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Selected Projects</h3>
                    </div>
                    <div className="space-y-6">
                        {projects.map((job, index) => (
                           <div key={index} className="group relative border-l-2 border-black/5 dark:border-white/5 pl-5 hover:border-orange-500 transition-colors duration-300">
                              <h4 className="text-lg font-bold uppercase tracking-tight mb-1 group-hover:text-orange-500 transition-colors">
                                {job.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                                {job.details}
                              </p>
                           </div>
                        ))}
                    </div>
                </section>

                {/* Education Section */}
                <section>
                    <div className="flex items-center space-x-3 mb-6">
                        <GraduationCap size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Education</h3>
                    </div>
                    <div className="space-y-4">
                        {education.map((edu, index) => (
                           <div key={index} className="flex flex-col space-y-0.5">
                              <span className="text-[10px] font-mono text-gray-400 mb-0.5">{edu.year}</span>
                              <h4 className="text-base font-bold uppercase tracking-tight">{edu.degree}</h4>
                              <p className="text-sm font-medium text-gray-500">{edu.school}</p>
                              <p className="text-xs text-gray-400 mt-1">{edu.details}</p>
                           </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Right Column (Skills & Tools) */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* Software */}
                <section>
                    <div className="flex items-center space-x-3 mb-4">
                        <Code size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Software</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {softwareList.map(skill => (
                            <span key={skill} className="px-3 py-1 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-default">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <div className="flex items-center space-x-3 mb-4">
                        <Award size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Expertise</h3>
                    </div>
                    <ul className="space-y-2">
                        {skillList.map(skill => (
                            <li key={skill} className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                <span>{skill}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Certifications */}
                <section>
                    <div className="flex items-center space-x-3 mb-4">
                        <Award size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Certifications</h3>
                    </div>
                    <ul className="space-y-3">
                        {certifications.map((cert, i) => (
                            <li key={i} className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-b border-black/5 dark:border-white/5 pb-2 last:border-0">
                                {cert}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Languages */}
                <section>
                    <div className="flex items-center space-x-3 mb-4">
                        <Globe size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Languages</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {languages.map(lang => (
                            <span key={lang} className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {lang}
                            </span>
                        ))}
                    </div>
                </section>

            </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex justify-center">
             <button 
                onClick={onBack}
                className="group flex flex-col items-center space-y-3"
             >
                <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">Return</span>
             </button>
        </div>

      </div>
    </div>
  );
};

export default ResumePage;
