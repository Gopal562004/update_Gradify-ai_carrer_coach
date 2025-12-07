// app/resume/_components/templates/index.js

// Template data matching YOUR EXACT FILES
export const templateCategories = [
  { id: "all", name: "All Templates", count: 2 },
  { id: "professional", name: "Professional", count: 2 },
  { id: "creative", name: "Creative", count: 0 },
];

export const templatesData = [
  {
    id: "modern-blue",
    name: "Modern Blue",
    category: "professional",
    description: "Clean, professional design with modern typography",
    color: "from-blue-500 to-blue-600",
    popular: true,
    premium: false,
    features: ["ATS Friendly", "Modern Layout", "Easy to Customize"],
    htmlFile: "modern-blue.html",
  },
  {
    id: "resume",
    name: "Professional Resume",
    category: "professional",
    description: "Standard professional resume template",
    color: "from-green-500 to-green-600",
    popular: true,
    premium: false,
    features: ["Professional", "Clean Layout", "ATS Optimized"],
    htmlFile: "resume.html",
  },
];

// Load ACTUAL HTML content from your files
export const loadTemplateHtml = async (templateId) => {
  console.log("🔄 Loading template:", templateId);

  const template = templatesData.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(
      `Template ${templateId} not found. Available: ${templatesData
        .map((t) => t.id)
        .join(", ")}`
    );
  }

  try {
    // Try to load the ACTUAL HTML file from your public folder
    const response = await fetch(`/templates/${template.htmlFile}`);

    if (response.ok) {
      const htmlContent = await response.text();
      console.log("✅ Loaded actual HTML file:", template.htmlFile);
      return {
        ...template,
        htmlContent: htmlContent,
      };
    } else {
      // If file not found, try alternative paths
      console.warn(
        `File not found at /templates/${template.htmlFile}, trying alternatives...`
      );

      // Try direct path (if files are in public folder)
      const response2 = await fetch(`/${template.htmlFile}`);
      if (response2.ok) {
        const htmlContent = await response2.text();
        console.log("✅ Loaded from alternative path:", template.htmlFile);
        return {
          ...template,
          htmlContent: htmlContent,
        };
      }

      throw new Error(`HTML file not found: ${template.htmlFile}`);
    }
  } catch (error) {
    console.error("❌ Error loading HTML file:", error);

    // As a LAST RESORT, use the exact HTML you provided
    if (templateId === "modern-blue") {
      console.log("🔄 Using hardcoded Modern Blue template");
      return {
        ...template,
        htmlContent: `
<div class="resume-modern">
  <div class="header" data-section="header">
    <h1 data-editable="true" data-field="name" style="font-size: 32px; font-weight: bold; color: #1f2937; margin: 0;">JOHN DOE</h1>
    <h2 data-editable="true" data-field="title" style="font-size: 20px; color: #6b7280; margin: 5px 0 20px 0;">SOFTWARE ENGINEER</h2>
    <div data-editable="true" data-field="contact" style="color: #666; font-size: 14px;">
      john.doe@email.com • (123) 456-7890 • linkedin.com/in/johndoe • github.com/johndoe
    </div>
  </div>

  <div class="section" data-section="summary">
    <h3 style="font-size: 18px; font-weight: bold; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px;">PROFESSIONAL SUMMARY</h3>
    <p data-editable="true" data-field="summary" style="line-height: 1.6; margin: 0;">
      Experienced software engineer with 5+ years in full-stack development. 
      Specialized in React, Node.js, and cloud technologies. Passionate about 
      building scalable applications and mentoring junior developers.
    </p>
  </div>

  <div class="section" data-section="experience">
    <h3 style="font-size: 18px; font-weight: bold; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px;">PROFESSIONAL EXPERIENCE</h3>
    <div data-editable="true" data-field="experience">
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
          <strong style="font-size: 16px;">Senior Software Engineer</strong>
          <span style="color: #666;">2022 - Present</span>
        </div>
        <div style="color: #666; margin-bottom: 8px;">Tech Solutions Inc., San Francisco, CA</div>
        <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.5;">
          <li data-editable="true" data-field="experience-item-1">Led a team of 5 developers in building scalable microservices architecture</li>
          <li data-editable="true" data-field="experience-item-2">Improved application performance by 40% through code optimization</li>
          <li data-editable="true" data-field="experience-item-3">Mentored junior developers and conducted technical interviews</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="section" data-section="skills">
    <h3 style="font-size: 18px; font-weight: bold; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px;">TECHNICAL SKILLS</h3>
    <div data-editable="true" data-field="skills" style="line-height: 1.8;">
      <strong>Languages:</strong> JavaScript, TypeScript, Python, Java<br>
      <strong>Frameworks:</strong> React, Node.js, Express, Django<br>
      <strong>Tools:</strong> AWS, Docker, Git, Jenkins, MongoDB<br>
      <strong>Soft Skills:</strong> Leadership, Agile Methodology, Team Mentoring
    </div>
  </div>

  <div class="section" data-section="education">
    <h3 style="font-size: 18px; font-weight: bold; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px;">EDUCATION</h3>
    <div data-editable="true" data-field="education">
      <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between;">
          <strong>Bachelor of Science in Computer Science</strong>
          <span>2016 - 2020</span>
        </div>
        <div style="color: #666;">University of Technology, Graduated Magna Cum Laude</div>
      </div>
    </div>
  </div>
</div>

<style>
.resume-modern {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  min-height: 1100px;
  line-height: 1.4;
}
.header { 
  text-align: center; 
  margin-bottom: 30px; 
  padding-bottom: 20px;
  border-bottom: 3px solid #2563eb;
}
.section { 
  margin-bottom: 25px; 
}
</style>
        `,
      };
    }

    throw new Error(`Failed to load template: ${template.id}`);
  }
};

export const getAllTemplates = () => templatesData;
export const getTemplatesByCategory = (category) =>
  category === "all"
    ? templatesData
    : templatesData.filter((t) => t.category === category);

// Debug info
console.log(
  "🎯 Template system ready. Templates:",
  templatesData.map((t) => t.name)
);
