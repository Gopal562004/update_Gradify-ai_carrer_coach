"use client";

import React, { useState } from "react";
import { generateResumeFromInput } from "../../../../actions/resume";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Link,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Brain,
  Award,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
    education: [{ degree: "", school: "", year: "" }],
    experience: [{ title: "", company: "", year: "", description: "" }],
    projects: [{ name: "", link: "", description: "" }],
    skills: "",
    certifications: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e, index, key, section) => {
    if (section) {
      const updated = [...formData[section]];
      updated[index][key] = e.target.value;
      setFormData({ ...formData, [section]: updated });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addSectionItem = (section) => {
    const newItem = Object.keys(formData[section][0]).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setFormData({ ...formData, [section]: [...formData[section], newItem] });
  };

  const removeSectionItem = (section, index) => {
    const updated = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const role = formData.experience[0]?.title || "Software Developer";
    const experienceText = formData.experience
      .map(
        (exp) =>
          `${exp.title} at ${exp.company} (${exp.year}): ${exp.description}`
      )
      .join(" | ");
    const educationText = formData.education
      .map((edu) => `${edu.degree} from ${edu.school} (${edu.year})`)
      .join(" | ");
    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await toast.promise(
        generateResumeFromInput({
          role,
          skills: skillsArray,
          experience: experienceText,
          education: educationText,
        }),
        {
          loading: "Generating resume...",
          success: "Resume generated and saved!",
          error: "Failed to generate resume",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-black">Build Your Resume</h1>
          <p className="text-black text-lg">
            Fill in your details to create a professional resume
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <SectionCard
            title="Personal Information"
            icon={User}
            description="Basic contact details and professional links"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Full Name
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="border-gray-300 focus:border-blue-500 text-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="border-gray-300 focus:border-blue-500 text-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="border-gray-300 focus:border-blue-500 text-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  LinkedIn
                </label>
                <Input
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="border-gray-300 focus:border-blue-500 text-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">GitHub</label>
                <Input
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="border-gray-300 focus:border-blue-500 text-black"
                />
              </div>
            </div>
          </SectionCard>

          {/* Professional Summary */}
          <SectionCard
            title="Professional Summary"
            icon={Brain}
            description="Brief overview of your professional background"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Summary</label>
              <Textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Experienced software developer with 5+ years in full-stack development. Passionate about creating scalable web applications and mentoring junior developers..."
                rows={4}
                className="border-gray-300 focus:border-blue-500 resize-vertical text-black"
              />
            </div>
          </SectionCard>

          {/* Education */}
          <SectionCard
            title="Education"
            icon={GraduationCap}
            description="Your academic qualifications"
          >
            {formData.education.map((edu, idx) => (
              <div
                key={idx}
                className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Degree
                    </label>
                    <Input
                      placeholder="Bachelor of Science in Computer Science"
                      value={edu.degree}
                      onChange={(e) =>
                        handleChange(e, idx, "degree", "education")
                      }
                      className="border-gray-300 focus:border-blue-500 text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Institution
                    </label>
                    <Input
                      placeholder="University of Technology"
                      value={edu.school}
                      onChange={(e) =>
                        handleChange(e, idx, "school", "education")
                      }
                      className="border-gray-300 focus:border-blue-500 text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Year
                    </label>
                    <Input
                      placeholder="2020 - 2024"
                      value={edu.year}
                      onChange={(e) =>
                        handleChange(e, idx, "year", "education")
                      }
                      className="border-gray-300 focus:border-blue-500 text-black"
                    />
                  </div>
                </div>
                {formData.education.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSectionItem("education", idx)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addSectionItem("education")}
              className="border-gray-300 text-black hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </SectionCard>

          {/* Experience */}
          <SectionCard
            title="Work Experience"
            icon={Briefcase}
            description="Your professional work history"
          >
            {formData.experience.map((exp, idx) => (
              <div
                key={idx}
                className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Job Title
                    </label>
                    <Input
                      placeholder="Senior Software Engineer"
                      value={exp.title}
                      onChange={(e) =>
                        handleChange(e, idx, "title", "experience")
                      }
                      className="border-gray-300 focus:border-blue-500 text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Company
                    </label>
                    <Input
                      placeholder="Tech Company Inc."
                      value={exp.company}
                      onChange={(e) =>
                        handleChange(e, idx, "company", "experience")
                      }
                      className="border-gray-300 focus:border-blue-500 text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Duration
                    </label>
                    <Input
                      placeholder="2022 - Present"
                      value={exp.year}
                      onChange={(e) =>
                        handleChange(e, idx, "year", "experience")
                      }
                      className="border-gray-300 focus:border-blue-500 text-black"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Description
                  </label>
                  <Textarea
                    placeholder="Describe your responsibilities, achievements, and technologies used..."
                    value={exp.description}
                    onChange={(e) =>
                      handleChange(e, idx, "description", "experience")
                    }
                    rows={3}
                    className="border-gray-300 focus:border-blue-500 resize-vertical text-black"
                  />
                </div>
                {formData.experience.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSectionItem("experience", idx)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addSectionItem("experience")}
              className="border-gray-300 text-black hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </SectionCard>

          {/* Projects */}
          <SectionCard
            title="Projects"
            icon={FolderGit2}
            description="Notable projects and achievements"
          >
            {formData.projects.map((proj, idx) => (
              <div
                key={idx}
                className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Project Name
                    </label>
                    <Input
                      placeholder="E-commerce Platform"
                      value={proj.name}
                      onChange={(e) => handleChange(e, idx, "name", "projects")}
                      className="border-gray-300 focus:border-blue-500 text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Project Link
                    </label>
                    <Input
                      placeholder="https://github.com/username/project"
                      value={proj.link}
                      onChange={(e) => handleChange(e, idx, "link", "projects")}
                      className="border-gray-300 focus:border-blue-500 text-black"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Description
                  </label>
                  <Textarea
                    placeholder="Describe the project, your role, technologies used, and outcomes..."
                    value={proj.description}
                    onChange={(e) =>
                      handleChange(e, idx, "description", "projects")
                    }
                    rows={3}
                    className="border-gray-300 focus:border-blue-500 resize-vertical text-black"
                  />
                </div>
                {formData.projects.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSectionItem("projects", idx)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addSectionItem("projects")}
              className="border-gray-300 text-black hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </SectionCard>

          {/* Skills & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard
              title="Skills"
              icon={Brain}
              description="Technical and professional skills"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Skills</label>
                <Textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, SQL, AWS, Agile Methodology, Team Leadership"
                  rows={4}
                  className="border-gray-300 focus:border-blue-500 resize-vertical text-black"
                />
                <p className="text-xs text-black">
                  Separate skills with commas
                </p>
              </div>
            </SectionCard>

            <SectionCard
              title="Certifications"
              icon={Award}
              description="Professional certifications and awards"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Certifications
                </label>
                <Textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="AWS Certified Developer, Google Professional Cloud Architect, Scrum Master Certification"
                  rows={4}
                  className="border-gray-300 focus:border-blue-500 resize-vertical text-black"
                />
                <p className="text-xs text-black">
                  Separate certifications with commas
                </p>
              </div>
            </SectionCard>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Resume...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Professional Resume
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Section Card Component
const SectionCard = ({ title, icon: Icon, description, children }) => (
  <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <CardTitle className="text-xl font-bold text-black">
            {title}
          </CardTitle>
          <CardDescription className="text-black">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default ResumeForm;
