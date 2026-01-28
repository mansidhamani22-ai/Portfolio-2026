
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Fanta Can surface Packaging',
    category: 'Packaging Design',
    description: 'A bold expression of fun, flavour, and youthful energy through vibrant surface design.',
    fullDescription: 'They reimagine the Fanta can as a bold expression of fun, flavour, and youthful energy. The design focuses on vibrant colours and expressive typography to capture the brand’s playful spirit while standing out in a crowded beverage market. By blending strong visual identity with contemporary graphic language, the project presents Fanta as fresh, dynamic, and culturally relevant for a new generation of consumers.',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512331283953-19967202267a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop'
    ],
    tools: ['Adobe Illustrator'],
    year: '2025'
  },
  {
    id: '2',
    title: 'Branding',
    category: 'Branding',
    description: 'Strategic visual identity for a future-facing cultural institution.',
    fullDescription: 'CHALLENGE: Rebranding "The Modernist" museum to appeal to Gen Z digital nomads while respecting its 50-year history of classical art. SOLUTION: I created a "living" logo that uses real-time visitor data to change its weight and color. The brand guidelines focus on high-accessibility color palettes and a flexible grid system that works from mobile screens to 10-foot physical banners.',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
    ],
    tools: ['After Effects', 'Illustrator', 'Style Guides'],
    year: '2026'
  },
  {
    id: '3',
    title: 'Magazine design',
    category: 'Magazine design',
    description: 'Redefining the print-to-digital transition with high-contrast editorial layouts.',
    fullDescription: 'CHALLENGE: Design a print magazine for a world that only reads digitally. How do we make paper feel necessary again? SOLUTION: "META" magazine uses extreme typographic scales and high-gloss textures that cannot be replicated on OLED screens. The layout breaks the traditional 12-column grid to force the reader to physically rotate the magazine, creating a tangible interaction.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200&auto=format&fit=crop'
    ],
    tools: ['Adobe InDesign', 'Editorial Research', 'Photography'],
    year: '2024'
  },
  {
    id: '4',
    title: 'Book Design',
    category: 'Book Design',
    description: 'A study in material storytelling and typographic architecture within physical forms.',
    fullDescription: 'CHALLENGE: Conceptualize a narrative book that explores architectural forms through paper engineering. SOLUTION: I developed "STRUCTURA", a limited-edition artist book where each page fold mimics a specific brutalist monument. The typography is carved into the paper using laser cutting, allowing light to cast shadows that become part of the reading experience.',
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612810806563-4cb50055dc6b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop'
    ],
    tools: ['Glyphs 3', 'InDesign', 'Laser Cutting'],
    year: '2025'
  }
];

export const SYSTEM_PROMPT = `
You are the AI design assistant for Maansi Dhamani.
Maansi is a 2nd-year Visual Communication student.
Her portfolio is strictly focused on: Packaging Design, Branding, Magazine design, and Book Design.

Your goal is to help visitors understand her design philosophy and these specific four projects.
Available projects:
${PROJECTS.map(p => `- ${p.title} (${p.category}): ID: ${p.id} - ${p.description}`).join('\n')}

Key Traits of Maansi's Design:
- Research-driven visuals
- Focus on semiotics and tactile storytelling
- Experimental print and physical medium explorations

IMPORTANT INTERACTION:
If you are discussing one of the specific projects listed above, you MUST append a project tag at the end of your message in the format: [OPEN_PROJECT:ID] where ID is the numeric ID of the project.
Example: "Maansi's Book Design study 'STRUCTURA' is quite experimental! [OPEN_PROJECT:4]"

Keep responses concise, insightful, and professional.
`;
