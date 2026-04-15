// Template configuration — no external HTML files needed
export const templateCategories = [
  { id: "all", name: "All Templates", count: 6 },
  { id: "professional", name: "Professional", count: 3 },
  { id: "creative", name: "Creative", count: 2 },
  { id: "minimal", name: "Minimal", count: 1 },
];

export const templatesData = [
  {
    id: "modern-blue",
    name: "Modern Blue",
    category: "professional",
    description: "Clean design with modern blue accents and sans-serif fonts",
    color: "from-blue-500 to-blue-600",
    accent: "#2563eb",
    popular: true,
    premium: false,
    features: ["ATS Friendly", "Modern Layout", "Clean Typography"],
  },
  {
    id: "classic-black",
    name: "Classic Black",
    category: "professional",
    description: "Traditional design with serif fonts — perfect for formal roles",
    color: "from-gray-700 to-gray-900",
    accent: "#1f2937",
    popular: false,
    premium: false,
    features: ["Professional", "Serif Fonts", "Traditional Layout"],
  },
  {
    id: "creative-purple",
    name: "Creative Purple",
    category: "creative",
    description: "Bold gradient header with modern minimalist body",
    color: "from-purple-500 to-pink-500",
    accent: "#7c3aed",
    popular: true,
    premium: false,
    features: ["Eye-catching", "Gradient Header", "Modern Design"],
  },
  {
    id: "minimal-green",
    name: "Minimal Green",
    category: "minimal",
    description: "Ultra-clean design with minimal borders and green accents",
    color: "from-emerald-500 to-emerald-600",
    accent: "#059669",
    popular: false,
    premium: false,
    features: ["Clean", "Minimalist", "Scannable"],
  },
  {
    id: "executive-gold",
    name: "Executive Gold",
    category: "professional",
    description: "Premium design for senior roles with gold accent details",
    color: "from-amber-500 to-amber-600",
    accent: "#b45309",
    popular: false,
    premium: true,
    features: ["Executive", "Premium Feel", "Serif Typography"],
  },
  {
    id: "tech-dark",
    name: "Tech Dark",
    category: "creative",
    description: "Dark mode design for tech professionals with monospace accents",
    color: "from-slate-700 to-slate-900",
    accent: "#0ea5e9",
    popular: false,
    premium: true,
    features: ["Dark Mode", "Tech-focused", "Monospace Code Feel"],
  },
];

// Templates are built-in as React components in ResumeBuilding.jsx
// No HTML file loading needed — everything renders from user data
export const loadTemplateHtml = async (templateId) => {
  const template = templatesData.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }
  // Template rendering is handled by the canvas component directly
  return { ...template };
};

export const getAllTemplates = () => templatesData;
export const getTemplatesByCategory = (category) =>
  category === "all"
    ? templatesData
    : templatesData.filter((t) => t.category === category);
