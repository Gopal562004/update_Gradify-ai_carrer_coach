"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  MessageSquare,
  Pencil,
  Star,
  User,
  Rocket,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";
export default function AnimatedHero() {
  const [displayText, setDisplayText] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const baseText = "Launch Your Dream Career with ";
  const rotatingWords = [
    "AI Power",
    "Smart Tools",
    "Expert Guidance",
    "Proven Methods",
  ];
  const subtitle =
    "Get personalized career guidance, AI-optimized resumes, interview practice, and everything you need to accelerate your professional journey.";

  // Word cycling effect
  useEffect(() => {
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const animateText = () => {
      const currentWord = rotatingWords[currentWordIndex];

      if (!isDeleting) {
        // Typing
        if (currentCharIndex <= currentWord.length) {
          setCurrentWord(currentWord.slice(0, currentCharIndex));
          currentCharIndex++;
          setTimeout(animateText, 100);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => {
            isDeleting = true;
            animateText();
          }, 3000);
        }
      } else {
        // Deleting
        if (currentCharIndex >= 0) {
          setCurrentWord(currentWord.slice(0, currentCharIndex));
          currentCharIndex--;
          setTimeout(animateText, 60);
        } else {
          // Finished deleting, move to next word
          isDeleting = false;
          currentWordIndex = (currentWordIndex + 1) % rotatingWords.length;
          setTimeout(animateText, 1000);
        }
      }
    };

    // Start animation after base text is set
    setDisplayText(baseText);
    setTimeout(animateText, 1000);
  }, []);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const stats = [
    { number: "10K+", label: "Careers Guided" },
    { number: "25K+", label: "Resumes Built" },
    { number: "15K+", label: "Interviews Practiced" },
    { number: "95%", label: "Success Rate" },
  ];

  

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_#f8fafc_25%,_transparent_25%),_linear-gradient(-45deg,_#f8fafc_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_#f8fafc_75%),_linear-gradient(-45deg,_transparent_75%,_#f8fafc_75%)] bg-[size:20px_20px] opacity-30"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-300 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trusted By Section - Like the image */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Trusted by 50,000+ professionals worldwide
          </div>
        </motion.div>

        {/* Main Heading - Single Line */}
        <div className="mb-8">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-sans mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-gray-900">{displayText}</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {currentWord}
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-1">
              {showCursor && "|"}
            </span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-transparent"
          >
            Start Free Trial
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.3 + index * 0.1 }}
              whileHover={{
                y: -2,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="text-gray-500 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.8 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-1"
          >
            <span className="text-xs text-gray-400 font-medium">
              Scroll to explore
            </span>
            <div className="w-5 h-8 border border-gray-300 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-0.5 h-2 bg-gray-400 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Accents */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400/20 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-gray-400/20 rounded-full"
        animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      />
    </section>
  );
}
