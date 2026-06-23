/**
 * SACRA Domain Knowledge Dataset
 * ================================
 * This is the "trained model" for the SACRA algorithm.
 * Each domain contains:
 *   - requiredSkills: skills needed with proficiency weight (0-1)
 *   - academicRelevance: how much each CS subject matters for this domain
 *   - interestPatterns: maps quiz interest categories to domain affinity
 *   - industryMetrics: growth, demand, salary baseline
 *   - skillSynonyms: handles "React" = "React.js" = "ReactJS" fuzzy matching
 */

// ============================================================
// Interest categories that quiz answers can map to
// ============================================================
export const INTEREST_CATEGORIES = [
  "problem_solving",
  "creativity",
  "data_analysis",
  "security",
  "system_design",
  "automation",
  "research",
  "communication",
  "visual_design",
  "hardware",
  "mathematics",
  "business",
] as const;

export type InterestCategory = (typeof INTEREST_CATEGORIES)[number];

// ============================================================
// Academic subjects tracked
// ============================================================
export const ACADEMIC_SUBJECTS = ["dsa", "oop", "dbms", "os"] as const;
export type AcademicSubject = (typeof ACADEMIC_SUBJECTS)[number];

// ============================================================
// Domain interface
// ============================================================
export interface DomainSkill {
  name: string;
  weight: number; // 0-1 proficiency weight (how critical this skill is)
}

export interface DomainDefinition {
  id: string;
  name: string;
  description: string;
  requiredSkills: DomainSkill[];
  academicRelevance: Record<AcademicSubject, number>; // 0-1
  interestPatterns: Record<InterestCategory, number>; // 0-1
  industryMetrics: {
    baseGrowthRate: number; // percentage
    baseDemand: number; // 0-100
    avgSalaryLPA: number; // in LPA
  };
}

// ============================================================
// Skill synonym map — for fuzzy matching
// Maps canonical name → all recognized variants
// ============================================================
export const SKILL_SYNONYMS: Record<string, string[]> = {
  // JavaScript ecosystem
  javascript: ["js", "javascript", "ecmascript", "es6", "es2015"],
  typescript: ["ts", "typescript"],
  react: ["react", "react.js", "reactjs", "react js"],
  "next.js": ["next", "next.js", "nextjs", "next js"],
  "node.js": ["node", "node.js", "nodejs", "node js"],
  "express.js": ["express", "express.js", "expressjs"],
  "vue.js": ["vue", "vue.js", "vuejs", "vue js"],
  angular: ["angular", "angularjs", "angular.js"],

  // Python ecosystem
  python: ["python", "python3", "py"],
  django: ["django", "django rest", "drf"],
  flask: ["flask"],
  fastapi: ["fastapi", "fast api"],

  // Data / ML
  "machine learning": [
    "ml",
    "machine learning",
    "machine-learning",
    "machinelearning",
  ],
  "deep learning": [
    "dl",
    "deep learning",
    "deep-learning",
    "deeplearning",
  ],
  tensorflow: ["tensorflow", "tf", "tensor flow"],
  pytorch: ["pytorch", "py torch", "torch"],
  pandas: ["pandas", "pd"],
  numpy: ["numpy", "np"],
  scikit: ["scikit-learn", "sklearn", "scikit learn", "scikit"],
  "data science": ["data science", "datascience", "data-science"],
  "natural language processing": ["nlp", "natural language processing"],
  "computer vision": ["cv", "computer vision", "computervision"],

  // Cloud & DevOps
  aws: ["aws", "amazon web services"],
  azure: ["azure", "microsoft azure"],
  gcp: ["gcp", "google cloud", "google cloud platform"],
  docker: ["docker", "containerization"],
  kubernetes: ["kubernetes", "k8s", "kube"],
  terraform: ["terraform", "tf"],
  jenkins: ["jenkins", "ci/cd"],
  "ci/cd": ["ci/cd", "cicd", "ci cd", "continuous integration"],

  // Databases
  sql: ["sql", "structured query language"],
  mysql: ["mysql", "my sql"],
  postgresql: ["postgresql", "postgres", "psql", "pg"],
  mongodb: ["mongodb", "mongo", "mongo db"],
  redis: ["redis"],
  firebase: ["firebase", "firestore"],

  // Security
  cybersecurity: [
    "cybersecurity",
    "cyber security",
    "infosec",
    "information security",
  ],
  "penetration testing": [
    "penetration testing",
    "pentest",
    "pentesting",
    "ethical hacking",
  ],

  // Mobile
  "react native": ["react native", "react-native", "reactnative", "rn"],
  flutter: ["flutter", "dart"],
  swift: ["swift", "swiftui"],
  kotlin: ["kotlin", "android kotlin"],

  // General
  java: ["java", "java se", "java ee", "jdk"],
  "c++": ["c++", "cpp", "c plus plus"],
  c: ["c", "c programming"],
  rust: ["rust", "rustlang"],
  go: ["go", "golang"],
  html: ["html", "html5"],
  css: ["css", "css3", "stylesheet"],
  git: ["git", "github", "version control"],
  linux: ["linux", "unix", "bash", "shell"],
  "data structures": ["data structures", "dsa", "ds", "algorithms"],
};

// ============================================================
// THE DOMAIN DATASET — 12 IT career domains
// ============================================================
export const DOMAINS: DomainDefinition[] = [
  // ───────────── 1. WEB DEVELOPMENT ─────────────
  {
    id: "web_development",
    name: "Web Development",
    description:
      "Full-stack web application development using modern frameworks",
    requiredSkills: [
      { name: "javascript", weight: 1.0 },
      { name: "react", weight: 0.9 },
      { name: "node.js", weight: 0.85 },
      { name: "html", weight: 0.8 },
      { name: "css", weight: 0.8 },
      { name: "typescript", weight: 0.75 },
      { name: "next.js", weight: 0.7 },
      { name: "sql", weight: 0.65 },
      { name: "mongodb", weight: 0.6 },
      { name: "git", weight: 0.7 },
      { name: "express.js", weight: 0.6 },
    ],
    academicRelevance: { dsa: 0.5, oop: 0.8, dbms: 0.7, os: 0.3 },
    interestPatterns: {
      problem_solving: 0.7,
      creativity: 0.9,
      data_analysis: 0.3,
      security: 0.3,
      system_design: 0.7,
      automation: 0.5,
      research: 0.2,
      communication: 0.5,
      visual_design: 0.85,
      hardware: 0.1,
      mathematics: 0.2,
      business: 0.5,
    },
    industryMetrics: { baseGrowthRate: 18, baseDemand: 90, avgSalaryLPA: 12 },
  },

  // ───────────── 2. DATA SCIENCE ─────────────
  {
    id: "data_science",
    name: "Data Science",
    description:
      "Extracting insights from data using statistics and machine learning",
    requiredSkills: [
      { name: "python", weight: 1.0 },
      { name: "pandas", weight: 0.9 },
      { name: "numpy", weight: 0.85 },
      { name: "scikit", weight: 0.8 },
      { name: "sql", weight: 0.75 },
      { name: "data science", weight: 0.7 },
      { name: "machine learning", weight: 0.7 },
      { name: "tensorflow", weight: 0.5 },
      { name: "pytorch", weight: 0.5 },
    ],
    academicRelevance: { dsa: 0.6, oop: 0.4, dbms: 0.8, os: 0.3 },
    interestPatterns: {
      problem_solving: 0.7,
      creativity: 0.4,
      data_analysis: 1.0,
      security: 0.2,
      system_design: 0.4,
      automation: 0.6,
      research: 0.8,
      communication: 0.5,
      visual_design: 0.4,
      hardware: 0.1,
      mathematics: 0.95,
      business: 0.7,
    },
    industryMetrics: { baseGrowthRate: 25, baseDemand: 85, avgSalaryLPA: 15 },
  },

  // ───────────── 3. AI / MACHINE LEARNING ─────────────
  {
    id: "ai_ml",
    name: "AI / Machine Learning",
    description:
      "Building intelligent systems that learn from data and make predictions",
    requiredSkills: [
      { name: "python", weight: 1.0 },
      { name: "machine learning", weight: 1.0 },
      { name: "deep learning", weight: 0.9 },
      { name: "tensorflow", weight: 0.85 },
      { name: "pytorch", weight: 0.85 },
      { name: "numpy", weight: 0.8 },
      { name: "natural language processing", weight: 0.6 },
      { name: "computer vision", weight: 0.6 },
      { name: "data science", weight: 0.5 },
    ],
    academicRelevance: { dsa: 0.8, oop: 0.5, dbms: 0.5, os: 0.4 },
    interestPatterns: {
      problem_solving: 0.9,
      creativity: 0.6,
      data_analysis: 0.9,
      security: 0.2,
      system_design: 0.6,
      automation: 0.8,
      research: 1.0,
      communication: 0.3,
      visual_design: 0.2,
      hardware: 0.3,
      mathematics: 1.0,
      business: 0.4,
    },
    industryMetrics: { baseGrowthRate: 35, baseDemand: 80, avgSalaryLPA: 18 },
  },

  // ───────────── 4. CYBERSECURITY ─────────────
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Protecting systems and networks from digital attacks",
    requiredSkills: [
      { name: "cybersecurity", weight: 1.0 },
      { name: "linux", weight: 0.9 },
      { name: "python", weight: 0.75 },
      { name: "penetration testing", weight: 0.85 },
      { name: "sql", weight: 0.6 },
      { name: "networking", weight: 0.9 },
      { name: "c", weight: 0.5 },
    ],
    academicRelevance: { dsa: 0.5, oop: 0.4, dbms: 0.6, os: 1.0 },
    interestPatterns: {
      problem_solving: 0.9,
      creativity: 0.5,
      data_analysis: 0.5,
      security: 1.0,
      system_design: 0.7,
      automation: 0.6,
      research: 0.7,
      communication: 0.3,
      visual_design: 0.1,
      hardware: 0.6,
      mathematics: 0.4,
      business: 0.3,
    },
    industryMetrics: { baseGrowthRate: 30, baseDemand: 85, avgSalaryLPA: 14 },
  },

  // ───────────── 5. CLOUD COMPUTING & DEVOPS ─────────────
  {
    id: "cloud_devops",
    name: "Cloud Computing & DevOps",
    description: "Managing cloud infrastructure and automating deployments",
    requiredSkills: [
      { name: "aws", weight: 0.9 },
      { name: "docker", weight: 0.9 },
      { name: "kubernetes", weight: 0.85 },
      { name: "linux", weight: 0.85 },
      { name: "terraform", weight: 0.7 },
      { name: "ci/cd", weight: 0.8 },
      { name: "python", weight: 0.6 },
      { name: "git", weight: 0.75 },
      { name: "azure", weight: 0.5 },
      { name: "gcp", weight: 0.5 },
    ],
    academicRelevance: { dsa: 0.3, oop: 0.5, dbms: 0.5, os: 0.9 },
    interestPatterns: {
      problem_solving: 0.7,
      creativity: 0.3,
      data_analysis: 0.3,
      security: 0.6,
      system_design: 1.0,
      automation: 1.0,
      research: 0.3,
      communication: 0.4,
      visual_design: 0.1,
      hardware: 0.6,
      mathematics: 0.2,
      business: 0.5,
    },
    industryMetrics: { baseGrowthRate: 28, baseDemand: 88, avgSalaryLPA: 16 },
  },

  // ───────────── 6. MOBILE APP DEVELOPMENT ─────────────
  {
    id: "mobile_development",
    name: "Mobile App Development",
    description: "Building native and cross-platform mobile applications",
    requiredSkills: [
      { name: "react native", weight: 0.9 },
      { name: "flutter", weight: 0.85 },
      { name: "javascript", weight: 0.8 },
      { name: "swift", weight: 0.6 },
      { name: "kotlin", weight: 0.6 },
      { name: "typescript", weight: 0.7 },
      { name: "firebase", weight: 0.65 },
      { name: "git", weight: 0.6 },
    ],
    academicRelevance: { dsa: 0.5, oop: 0.9, dbms: 0.6, os: 0.5 },
    interestPatterns: {
      problem_solving: 0.7,
      creativity: 0.85,
      data_analysis: 0.2,
      security: 0.3,
      system_design: 0.6,
      automation: 0.4,
      research: 0.2,
      communication: 0.5,
      visual_design: 0.9,
      hardware: 0.3,
      mathematics: 0.2,
      business: 0.6,
    },
    industryMetrics: { baseGrowthRate: 20, baseDemand: 82, avgSalaryLPA: 13 },
  },

  // ───────────── 7. BACKEND ENGINEERING ─────────────
  {
    id: "backend_engineering",
    name: "Backend Engineering",
    description: "Designing and building server-side applications and APIs",
    requiredSkills: [
      { name: "java", weight: 0.85 },
      { name: "python", weight: 0.8 },
      { name: "node.js", weight: 0.8 },
      { name: "sql", weight: 0.9 },
      { name: "postgresql", weight: 0.7 },
      { name: "mongodb", weight: 0.6 },
      { name: "redis", weight: 0.5 },
      { name: "docker", weight: 0.6 },
      { name: "git", weight: 0.7 },
      { name: "linux", weight: 0.6 },
    ],
    academicRelevance: { dsa: 0.9, oop: 0.9, dbms: 0.9, os: 0.7 },
    interestPatterns: {
      problem_solving: 0.95,
      creativity: 0.3,
      data_analysis: 0.4,
      security: 0.5,
      system_design: 0.9,
      automation: 0.7,
      research: 0.3,
      communication: 0.3,
      visual_design: 0.05,
      hardware: 0.3,
      mathematics: 0.5,
      business: 0.4,
    },
    industryMetrics: { baseGrowthRate: 15, baseDemand: 92, avgSalaryLPA: 14 },
  },

  // ───────────── 8. BLOCKCHAIN / WEB3 ─────────────
  {
    id: "blockchain",
    name: "Blockchain / Web3",
    description:
      "Developing decentralized applications and smart contracts",
    requiredSkills: [
      { name: "javascript", weight: 0.8 },
      { name: "python", weight: 0.5 },
      { name: "rust", weight: 0.6 },
      { name: "go", weight: 0.5 },
      { name: "data structures", weight: 0.7 },
    ],
    academicRelevance: { dsa: 0.9, oop: 0.6, dbms: 0.5, os: 0.6 },
    interestPatterns: {
      problem_solving: 0.9,
      creativity: 0.5,
      data_analysis: 0.4,
      security: 0.8,
      system_design: 0.8,
      automation: 0.6,
      research: 0.7,
      communication: 0.3,
      visual_design: 0.1,
      hardware: 0.2,
      mathematics: 0.8,
      business: 0.7,
    },
    industryMetrics: { baseGrowthRate: 22, baseDemand: 60, avgSalaryLPA: 20 },
  },

  // ───────────── 9. GAME DEVELOPMENT ─────────────
  {
    id: "game_development",
    name: "Game Development",
    description: "Creating interactive video games and simulations",
    requiredSkills: [
      { name: "c++", weight: 0.9 },
      { name: "c", weight: 0.6 },
      { name: "python", weight: 0.4 },
      { name: "javascript", weight: 0.4 },
    ],
    academicRelevance: { dsa: 0.8, oop: 0.9, dbms: 0.3, os: 0.6 },
    interestPatterns: {
      problem_solving: 0.8,
      creativity: 1.0,
      data_analysis: 0.2,
      security: 0.1,
      system_design: 0.6,
      automation: 0.3,
      research: 0.4,
      communication: 0.3,
      visual_design: 0.95,
      hardware: 0.5,
      mathematics: 0.7,
      business: 0.3,
    },
    industryMetrics: { baseGrowthRate: 12, baseDemand: 55, avgSalaryLPA: 10 },
  },

  // ───────────── 10. DATA ENGINEERING ─────────────
  {
    id: "data_engineering",
    name: "Data Engineering",
    description: "Building and maintaining data pipelines and warehouses",
    requiredSkills: [
      { name: "python", weight: 0.9 },
      { name: "sql", weight: 1.0 },
      { name: "aws", weight: 0.7 },
      { name: "docker", weight: 0.6 },
      { name: "postgresql", weight: 0.7 },
      { name: "mongodb", weight: 0.5 },
      { name: "linux", weight: 0.6 },
    ],
    academicRelevance: { dsa: 0.7, oop: 0.5, dbms: 1.0, os: 0.6 },
    interestPatterns: {
      problem_solving: 0.8,
      creativity: 0.2,
      data_analysis: 0.9,
      security: 0.3,
      system_design: 0.9,
      automation: 0.9,
      research: 0.4,
      communication: 0.3,
      visual_design: 0.1,
      hardware: 0.3,
      mathematics: 0.6,
      business: 0.5,
    },
    industryMetrics: { baseGrowthRate: 25, baseDemand: 82, avgSalaryLPA: 16 },
  },

  // ───────────── 11. UI/UX DESIGN (TECH) ─────────────
  {
    id: "ui_ux_design",
    name: "UI/UX Design",
    description:
      "Designing user interfaces and experiences for digital products",
    requiredSkills: [
      { name: "html", weight: 0.8 },
      { name: "css", weight: 0.9 },
      { name: "javascript", weight: 0.6 },
      { name: "react", weight: 0.5 },
    ],
    academicRelevance: { dsa: 0.2, oop: 0.4, dbms: 0.2, os: 0.1 },
    interestPatterns: {
      problem_solving: 0.5,
      creativity: 1.0,
      data_analysis: 0.3,
      security: 0.1,
      system_design: 0.4,
      automation: 0.2,
      research: 0.6,
      communication: 0.9,
      visual_design: 1.0,
      hardware: 0.05,
      mathematics: 0.1,
      business: 0.7,
    },
    industryMetrics: { baseGrowthRate: 15, baseDemand: 70, avgSalaryLPA: 10 },
  },

  // ───────────── 12. EMBEDDED / IoT ─────────────
  {
    id: "embedded_iot",
    name: "Embedded Systems / IoT",
    description: "Programming hardware devices and IoT ecosystems",
    requiredSkills: [
      { name: "c", weight: 1.0 },
      { name: "c++", weight: 0.9 },
      { name: "python", weight: 0.6 },
      { name: "linux", weight: 0.7 },
    ],
    academicRelevance: { dsa: 0.7, oop: 0.6, dbms: 0.3, os: 1.0 },
    interestPatterns: {
      problem_solving: 0.8,
      creativity: 0.5,
      data_analysis: 0.3,
      security: 0.5,
      system_design: 0.7,
      automation: 0.8,
      research: 0.7,
      communication: 0.2,
      visual_design: 0.1,
      hardware: 1.0,
      mathematics: 0.6,
      business: 0.3,
    },
    industryMetrics: { baseGrowthRate: 20, baseDemand: 65, avgSalaryLPA: 11 },
  },
];

// ============================================================
// Quiz answer → interest category mapping
// This maps common quiz answer patterns to interest categories
// ============================================================
export const QUIZ_ANSWER_INTEREST_MAP: Record<string, InterestCategory[]> = {
  // Problem-solving / logic keywords
  "solving puzzles": ["problem_solving", "mathematics"],
  "logical thinking": ["problem_solving", "mathematics"],
  "debugging code": ["problem_solving"],
  "algorithmic challenges": ["problem_solving", "mathematics"],
  "competitive programming": ["problem_solving", "mathematics"],
  optimization: ["problem_solving", "system_design"],

  // Creativity / design keywords
  "building user interfaces": ["creativity", "visual_design"],
  "designing layouts": ["creativity", "visual_design"],
  "creating visuals": ["creativity", "visual_design"],
  "user experience": ["creativity", "visual_design", "communication"],
  prototyping: ["creativity", "visual_design"],

  // Data keywords
  "analyzing data": ["data_analysis", "mathematics"],
  "finding patterns": ["data_analysis", "research"],
  "working with databases": ["data_analysis"],
  statistics: ["data_analysis", "mathematics", "research"],
  "data visualization": ["data_analysis", "visual_design"],

  // Security keywords
  "protecting systems": ["security"],
  "finding vulnerabilities": ["security", "problem_solving"],
  hacking: ["security"],
  encryption: ["security", "mathematics"],
  privacy: ["security"],

  // System / architecture keywords
  "designing architectures": ["system_design"],
  scalability: ["system_design"],
  "distributed systems": ["system_design"],
  microservices: ["system_design"],
  "cloud computing": ["system_design", "automation"],

  // Automation keywords
  "automating tasks": ["automation"],
  scripting: ["automation"],
  "continuous integration": ["automation", "system_design"],
  "workflow automation": ["automation", "business"],

  // Research / academics
  "reading papers": ["research"],
  "academic research": ["research", "mathematics"],
  "exploring new technologies": ["research"],
  "machine learning research": ["research", "mathematics", "data_analysis"],

  // Communication / teamwork
  "working in teams": ["communication", "business"],
  "presenting ideas": ["communication"],
  "technical writing": ["communication", "research"],
  mentoring: ["communication"],

  // Hardware / embedded
  "working with hardware": ["hardware"],
  electronics: ["hardware"],
  robotics: ["hardware", "automation"],
  sensors: ["hardware"],
  microcontrollers: ["hardware"],

  // Business
  entrepreneurship: ["business"],
  "product management": ["business", "communication"],
  "market analysis": ["business", "data_analysis"],
  startups: ["business", "creativity"],
};
