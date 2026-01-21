// // // // "use client";

// // // // import React, { useMemo, useState } from "react";
// // // // import { motion, AnimatePresence } from "framer-motion";
// // // // import { generateQuiz, evaluateAnswers } from "@/actions/gemini_res";
// // // // import {
// // // //   ResponsiveContainer,
// // // //   RadarChart,
// // // //   Radar,
// // // //   PolarGrid,
// // // //   PolarAngleAxis,
// // // //   PolarRadiusAxis,
// // // //   Tooltip,
// // // // } from "recharts";
// // // // import ReactFlow, {
// // // //   Background,
// // // //   Controls,
// // // //   MiniMap,
// // // //   MarkerType,
// // // // } from "reactflow";
// // // // import "reactflow/dist/style.css";
// // // // import {
// // // //   BookOpen,
// // // //   Cpu,
// // // //   FlaskConical,
// // // //   Rocket,
// // // //   Trophy,
// // // //   ArrowLeft,
// // // // } from "lucide-react";

// // // // /* ------------------------------ helpers ------------------------------ */

// // // // // normalize roadmap phases (Gemini may return strings OR {phase, details})
// // // // function normalizePhases(phases) {
// // // //   return (phases || []).map((p, i) => {
// // // //     if (typeof p === "string") {
// // // //       // try to split "Phase X: Title — details"
// // // //       const [titlePart, ...rest] = p.split(":");
// // // //       const title =
// // // //         p.toLowerCase().includes("phase") && titlePart ? p : `Phase ${i + 1}`;
// // // //       const details =
// // // //         p.toLowerCase().includes("phase") && p.includes(":")
// // // //           ? p.split(":").slice(1).join(":").trim()
// // // //           : p;
// // // //       return {
// // // //         id: `phase-${i + 1}`,
// // // //         phase: title.trim(),
// // // //         details: details.trim(),
// // // //       };
// // // //     }
// // // //     // already structured
// // // //     return {
// // // //       id: p.id || `phase-${i + 1}`,
// // // //       phase: p.phase || `Phase ${i + 1}`,
// // // //       details: p.details || "",
// // // //     };
// // // //   });
// // // // }

// // // // function getPhaseIcon(idx) {
// // // //   const icons = [BookOpen, Cpu, FlaskConical, Rocket, Trophy];
// // // //   return icons[idx % icons.length];
// // // // }

// // // // function buildFlowFromPhases(phases) {
// // // //   const norm = normalizePhases(phases);
// // // //   const gapX = 320;
// // // //   const startX = 50;
// // // //   const y = 80;

// // // //   const nodes = norm.map((p, idx) => {
// // // //     const Icon = getPhaseIcon(idx);
// // // //     return {
// // // //       id: p.id,
// // // //       position: { x: startX + idx * gapX, y },
// // // //       data: { label: p.phase, details: p.details, Icon },
// // // //       type: "default",
// // // //       style: {
// // // //         padding: 12,
// // // //         width: 280,
// // // //         borderRadius: 16,
// // // //         background:
// // // //           "linear-gradient(180deg, rgba(39,39,42,1) 0%, rgba(24,24,27,1) 100%)",
// // // //         border: "1px solid #3f3f46",
// // // //         color: "#fafafa",
// // // //         boxShadow:
// // // //           "0 10px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
// // // //       },
// // // //     };
// // // //   });

// // // //   const edges = norm.slice(0, -1).map((p, idx) => ({
// // // //     id: `e-${p.id}-${norm[idx + 1].id}`,
// // // //     source: p.id,
// // // //     target: norm[idx + 1].id,
// // // //     animated: true,
// // // //     type: "smoothstep",
// // // //     style: { stroke: "#a855f7" },
// // // //     markerEnd: {
// // // //       type: MarkerType.ArrowClosed,
// // // //       color: "#a855f7",
// // // //     },
// // // //   }));

// // // //   return { nodes, edges, normalized: norm };
// // // // }

// // // // /* ------------------------------ UI bits ------------------------------ */

// // // // const Loader = ({ text = "Loading..." }) => (
// // // //   <div className="flex flex-col items-center justify-center py-16">
// // // //     <div className="h-12 w-12 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
// // // //     <p className="mt-4 text-zinc-400">{text}</p>
// // // //   </div>
// // // // );

// // // // const Card = ({ children, className = "" }) => (
// // // //   <div
// // // //     className={`rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl ${className}`}
// // // //   >
// // // //     {children}
// // // //   </div>
// // // // );

// // // // const SectionTitle = ({ children }) => (
// // // //   <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
// // // //     {children}
// // // //   </h3>
// // // // );

// // // // /* ------------------------------ main page ------------------------------ */

// // // // export default function GeminiPage() {
// // // //   const [step, setStep] = useState("start"); // start | quiz | result
// // // //   const [quiz, setQuiz] = useState(null);
// // // //   const [answers, setAnswers] = useState({});
// // // //   const [result, setResult] = useState(null);
// // // //   const [loading, setLoading] = useState(false);

// // // //   // quiz navigation
// // // //   const [currentPart, setCurrentPart] = useState("partA");
// // // //   const [currentIndex, setCurrentIndex] = useState(0);

// // // //   // result UI
// // // //   const [selectedField, setSelectedField] = useState(null);

// // // //   const totalQ = quiz
// // // //     ? (quiz.partA?.length || 0) + (quiz.partB?.length || 0)
// // // //     : 0;
// // // //   const answeredQ =
// // // //     (Object.values(answers.partA || {}).length || 0) +
// // // //     (Object.values(answers.partB || {}).length || 0);
// // // //   const progress = totalQ > 0 ? Math.round((answeredQ / totalQ) * 100) : 0;

// // // //   // Start quiz
// // // //   const handleStart = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const q = await generateQuiz();
// // // //       setQuiz(q);
// // // //       setStep("quiz");
// // // //       setCurrentPart("partA");
// // // //       setCurrentIndex(0);
// // // //     } catch (e) {
// // // //       console.error(e);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // Answer + auto-next
// // // //   const handleAnswer = (option) => {
// // // //     const q =
// // // //       currentPart === "partA"
// // // //         ? quiz.partA[currentIndex]
// // // //         : quiz.partB[currentIndex];

// // // //     setAnswers((prev) => ({
// // // //       ...prev,
// // // //       [currentPart]: { ...(prev[currentPart] || {}), [q.id]: option },
// // // //     }));

// // // //     setTimeout(() => {
// // // //       if (currentPart === "partA" && currentIndex < quiz.partA.length - 1) {
// // // //         setCurrentIndex((i) => i + 1);
// // // //       } else if (currentPart === "partA") {
// // // //         setCurrentPart("partB");
// // // //         setCurrentIndex(0);
// // // //       } else if (currentIndex < quiz.partB.length - 1) {
// // // //         setCurrentIndex((i) => i + 1);
// // // //       } else {
// // // //         handleSubmit();
// // // //       }
// // // //     }, 120);
// // // //   };

// // // //   // Prev
// // // //   const handlePrev = () => {
// // // //     if (currentPart === "partB" && currentIndex === 0) {
// // // //       setCurrentPart("partA");
// // // //       setCurrentIndex(quiz.partA.length - 1);
// // // //     } else if (currentIndex > 0) {
// // // //       setCurrentIndex((i) => i - 1);
// // // //     }
// // // //   };

// // // //   // Submit to Gemini
// // // //   const handleSubmit = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const res = await evaluateAnswers(answers);
// // // //       setResult(res);
// // // //       setSelectedField(res?.topFields?.[0] || null);
// // // //       setStep("result");
// // // //     } catch (e) {
// // // //       console.error(e);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // Radar data (fake 100/90/80 ladder so chart looks nice visually)
// // // //   const radarData = useMemo(() => {
// // // //     if (!result?.topFields) return [];
// // // //     const base = [92, 86, 80, 74, 68];
// // // //     return result.topFields.map((field, i) => ({
// // // //       field,
// // // //       score: base[i] ?? 65,
// // // //     }));
// // // //   }, [result]);

// // // //   // Flow data for selected field
// // // //   const { nodes, edges } = useMemo(() => {
// // // //     if (!result?.roadmaps || !selectedField) return { nodes: [], edges: [] };
// // // //     const phases = result.roadmaps[selectedField] || [];
// // // //     return buildFlowFromPhases(phases);
// // // //   }, [result, selectedField]);

// // // //   // animation variants
// // // //   const qVariants = {
// // // //     enter: { opacity: 0, x: 50 },
// // // //     center: { opacity: 1, x: 0 },
// // // //     exit: { opacity: 0, x: -50 },
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white">
// // // //       <div className="mx-auto max-w-6xl px-4 py-10">
// // // //         <motion.h1
// // // //           initial={{ opacity: 0, y: 10 }}
// // // //           animate={{ opacity: 1, y: 0 }}
// // // //           className="mb-8 text-center text-4xl font-bold tracking-tight"
// // // //         >
// // // //           Career Guidance Quiz <span className="text-zinc-400">🎓</span>
// // // //         </motion.h1>

// // // //         {/* START */}
// // // //         {step === "start" && (
// // // //           <Card className="p-10 text-center">
// // // //             <motion.p
// // // //               initial={{ opacity: 0 }}
// // // //               animate={{ opacity: 1 }}
// // // //               className="mx-auto mb-8 max-w-2xl text-zinc-400"
// // // //             >
// // // //               Discover your ideal IT career path based on your{" "}
// // // //               <span className="text-zinc-200">interests</span> and{" "}
// // // //               <span className="text-zinc-200">aptitude</span>. Take a short
// // // //               two-part quiz and get a personalized roadmap with projects,
// // // //               internships, and job-prep steps.
// // // //             </motion.p>
// // // //             <motion.button
// // // //               whileHover={{ scale: 1.03 }}
// // // //               whileTap={{ scale: 0.98 }}
// // // //               onClick={handleStart}
// // // //               disabled={loading}
// // // //               className="rounded-xl bg-white px-8 py-3 font-semibold text-black shadow-2xl transition hover:bg-zinc-200 disabled:opacity-60"
// // // //             >
// // // //               {loading ? "Preparing…" : "Start Quiz"}
// // // //             </motion.button>
// // // //           </Card>
// // // //         )}

// // // //         {/* QUIZ */}
// // // //         {step === "quiz" && quiz && (
// // // //           <div className="space-y-6">
// // // //             {loading && <Loader text="Loading quiz…" />}
// // // //             {!loading && (
// // // //               <>
// // // //                 {/* progress */}
// // // //                 <Card className="p-4">
// // // //                   <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
// // // //                     <span>
// // // //                       {currentPart === "partA"
// // // //                         ? "Part A — Interest Mapping"
// // // //                         : "Part B — Aptitude & Awareness"}
// // // //                     </span>
// // // //                     <span>
// // // //                       {answeredQ}/{totalQ} answered
// // // //                     </span>
// // // //                   </div>
// // // //                   <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
// // // //                     <motion.div
// // // //                       initial={{ width: 0 }}
// // // //                       animate={{ width: `${progress}%` }}
// // // //                       transition={{ duration: 0.35 }}
// // // //                       className="h-full bg-white"
// // // //                     />
// // // //                   </div>
// // // //                 </Card>

// // // //                 {/* question */}
// // // //                 <Card className="p-6">
// // // //                   <AnimatePresence mode="wait">
// // // //                     <motion.div
// // // //                       key={`${currentPart}-${currentIndex}`}
// // // //                       variants={qVariants}
// // // //                       initial="enter"
// // // //                       animate="center"
// // // //                       exit="exit"
// // // //                       transition={{ duration: 0.22 }}
// // // //                     >
// // // //                       <div className="mb-5 text-sm uppercase tracking-wider text-zinc-400">
// // // //                         {currentPart === "partA"
// // // //                           ? "Part A: Interest Mapping"
// // // //                           : "Part B: Aptitude & Awareness"}
// // // //                       </div>
// // // //                       <div className="mb-6 text-xl font-medium leading-relaxed text-zinc-100">
// // // //                         {currentPart === "partA"
// // // //                           ? quiz.partA[currentIndex].question
// // // //                           : quiz.partB[currentIndex].question}
// // // //                       </div>

// // // //                       <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
// // // //                         {(currentPart === "partA"
// // // //                           ? quiz.partA[currentIndex].options
// // // //                           : quiz.partB[currentIndex].options
// // // //                         ).map((opt, idx) => (
// // // //                           <motion.button
// // // //                             key={idx}
// // // //                             whileHover={{ scale: 1.02 }}
// // // //                             whileTap={{ scale: 0.98 }}
// // // //                             onClick={() => handleAnswer(opt)}
// // // //                             className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-left text-zinc-200 transition hover:bg-zinc-800"
// // // //                           >
// // // //                             {opt}
// // // //                           </motion.button>
// // // //                         ))}
// // // //                       </div>

// // // //                       <div className="mt-6 flex items-center justify-between">
// // // //                         <button
// // // //                           onClick={handlePrev}
// // // //                           disabled={
// // // //                             currentPart === "partA" && currentIndex === 0
// // // //                           }
// // // //                           className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
// // // //                         >
// // // //                           <ArrowLeft className="h-4 w-4" />
// // // //                           Previous
// // // //                         </button>
// // // //                         <div className="text-xs text-zinc-500">
// // // //                           auto-advances on selection
// // // //                         </div>
// // // //                       </div>
// // // //                     </motion.div>
// // // //                   </AnimatePresence>
// // // //                 </Card>
// // // //               </>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* RESULT */}
// // // //         {step === "result" && result && (
// // // //           <AnimatePresence>
// // // //             <motion.div
// // // //               initial={{ opacity: 0, y: 14 }}
// // // //               animate={{ opacity: 1, y: 0 }}
// // // //               exit={{ opacity: 0 }}
// // // //               className="space-y-8"
// // // //             >
// // // //               {/* summary */}
// // // //               <Card className="p-6">
// // // //                 <h2 className="mb-2 text-2xl font-semibold text-zinc-100">
// // // //                   🎯 Your Career Path
// // // //                 </h2>
// // // //                 <p className="max-w-3xl text-zinc-400">{result.summary}</p>
// // // //               </Card>

// // // //               {/* radar + fields */}
// // // //               <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
// // // //                 <Card className="p-6">
// // // //                   <SectionTitle>Top Fields (Radar)</SectionTitle>
// // // //                   <div className="mt-4 h-72 w-full">
// // // //                     <ResponsiveContainer width="100%" height="100%">
// // // //                       <RadarChart data={radarData}>
// // // //                         <PolarGrid />
// // // //                         <PolarAngleAxis dataKey="field" stroke="#d4d4d8" />
// // // //                         <PolarRadiusAxis stroke="#52525b" />
// // // //                         <Radar
// // // //                           dataKey="score"
// // // //                           stroke="#ffffff"
// // // //                           fill="#ffffff"
// // // //                           fillOpacity={0.35}
// // // //                           name="Suitability"
// // // //                         />
// // // //                         <Tooltip
// // // //                           wrapperStyle={{
// // // //                             background: "#18181b",
// // // //                             border: "1px solid #3f3f46",
// // // //                             color: "#fafafa",
// // // //                             borderRadius: 12,
// // // //                           }}
// // // //                           contentStyle={{
// // // //                             background: "#18181b",
// // // //                             border: "none",
// // // //                             color: "#fafafa",
// // // //                           }}
// // // //                           labelStyle={{ color: "#fafafa" }}
// // // //                         />
// // // //                       </RadarChart>
// // // //                     </ResponsiveContainer>
// // // //                   </div>
// // // //                 </Card>

// // // //                 <Card className="p-6">
// // // //                   <SectionTitle>Your Recommended Fields</SectionTitle>
// // // //                   <div className="mt-4 flex flex-wrap gap-3">
// // // //                     {result.topFields?.map((f) => (
// // // //                       <button
// // // //                         key={f}
// // // //                         onClick={() => setSelectedField(f)}
// // // //                         className={`rounded-xl border px-4 py-2 text-sm transition ${
// // // //                           selectedField === f
// // // //                             ? "border-zinc-200 bg-zinc-200 text-black"
// // // //                             : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
// // // //                         }`}
// // // //                       >
// // // //                         {f}
// // // //                       </button>
// // // //                     ))}
// // // //                   </div>

// // // //                   <div className="mt-6 text-sm text-zinc-500">
// // // //                     Click a field to view its roadmap as a flow.
// // // //                   </div>
// // // //                 </Card>
// // // //               </div>

// // // //               {/* flow map */}
// // // //               <Card className="p-6">
// // // //                 <div className="mb-4 flex items-end justify-between">
// // // //                   <div>
// // // //                     <SectionTitle>
// // // //                       {selectedField
// // // //                         ? `${selectedField} — Roadmap Flow`
// // // //                         : "Roadmap Flow"}
// // // //                     </SectionTitle>
// // // //                     <p className="mt-1 text-sm text-zinc-400">
// // // //                       Drag to pan • Wheel to zoom • Click nodes for details.
// // // //                     </p>
// // // //                   </div>
// // // //                 </div>

// // // //                 <div className="h-[380px] w-full rounded-xl border border-zinc-800">
// // // //                   {selectedField ? (
// // // //                     <ReactFlow
// // // //                       nodes={nodes.map((n) => ({
// // // //                         ...n,
// // // //                         data: {
// // // //                           ...n.data,
// // // //                           label: (
// // // //                             <div className="flex items-start gap-3">
// // // //                               <div className="rounded-xl bg-zinc-800 p-2">
// // // //                                 {/* icon */}
// // // //                                 {n.data.Icon ? (
// // // //                                   <n.data.Icon className="h-4 w-4 text-zinc-200" />
// // // //                                 ) : null}
// // // //                               </div>
// // // //                               <div className="space-y-1">
// // // //                                 <div className="text-sm font-semibold text-zinc-100">
// // // //                                   {n.data.label}
// // // //                                 </div>
// // // //                                 <div className="text-xs leading-relaxed text-zinc-400">
// // // //                                   {n.data.details}
// // // //                                 </div>
// // // //                               </div>
// // // //                             </div>
// // // //                           ),
// // // //                         },
// // // //                       }))}
// // // //                       edges={edges}
// // // //                       fitView
// // // //                       fitViewOptions={{ padding: 0.2 }}
// // // //                     >
// // // //                       <Background color="#3f3f46" gap={18} />
// // // //                       <MiniMap
// // // //                         maskColor="rgba(24,24,27,0.85)"
// // // //                         nodeColor="#a855f7"
// // // //                       />
// // // //                       <Controls />
// // // //                     </ReactFlow>
// // // //                   ) : (
// // // //                     <div className="flex h-full items-center justify-center text-zinc-500">
// // // //                       Select a field above to view roadmap
// // // //                     </div>
// // // //                   )}
// // // //                 </div>
// // // //               </Card>

// // // //               {/* textual detail fallback */}
// // // //               <Card className="p-6">
// // // //                 <SectionTitle>Phase Details (Text)</SectionTitle>
// // // //                 <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
// // // //                   {selectedField &&
// // // //                     normalizePhases(result.roadmaps?.[selectedField]).map(
// // // //                       (p, i) => {
// // // //                         const Icon = getPhaseIcon(i);
// // // //                         return (
// // // //                           <div
// // // //                             key={p.id}
// // // //                             className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
// // // //                           >
// // // //                             <div className="mb-2 flex items-center gap-2">
// // // //                               <span className="rounded-lg bg-zinc-800 p-2">
// // // //                                 <Icon className="h-4 w-4 text-zinc-200" />
// // // //                               </span>
// // // //                               <div className="text-sm font-semibold text-zinc-100">
// // // //                                 {p.phase}
// // // //                               </div>
// // // //                             </div>
// // // //                             <div className="text-sm leading-relaxed text-zinc-400">
// // // //                               {p.details}
// // // //                             </div>
// // // //                           </div>
// // // //                         );
// // // //                       }
// // // //                     )}
// // // //                   {!selectedField && (
// // // //                     <div className="text-sm text-zinc-500">
// // // //                       Choose a field to show phase details.
// // // //                     </div>
// // // //                   )}
// // // //                 </div>
// // // //               </Card>

// // // //               {/* actions */}
// // // //               <div className="flex justify-center">
// // // //                 <button
// // // //                   onClick={() => {
// // // //                     setStep("start");
// // // //                     setResult(null);
// // // //                     setQuiz(null);
// // // //                     setAnswers({});
// // // //                     setSelectedField(null);
// // // //                   }}
// // // //                   className="rounded-xl bg-white px-8 py-3 font-semibold text-black shadow-2xl transition hover:bg-zinc-200"
// // // //                 >
// // // //                   Retake Quiz
// // // //                 </button>
// // // //               </div>
// // // //             </motion.div>
// // // //           </AnimatePresence>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import React, { useMemo, useState, useEffect } from "react";
// // // import { motion, AnimatePresence } from "framer-motion";
// // // import {
// // //   generateQuiz,
// // //   evaluateAnswers,
// // //   getCareerEvaluation,
// // //   updateIndustryInsight,
// // // } from "@/actions/gemini_res";
// // // import {
// // //   ResponsiveContainer,
// // //   RadarChart,
// // //   Radar,
// // //   PolarGrid,
// // //   PolarAngleAxis,
// // //   PolarRadiusAxis,
// // //   Tooltip,
// // // } from "recharts";
// // // import ReactFlow, {
// // //   Background,
// // //   Controls,
// // //   MiniMap,
// // //   MarkerType,
// // // } from "reactflow";
// // // import "reactflow/dist/style.css";
// // // import {
// // //   BookOpen,
// // //   Cpu,
// // //   FlaskConical,
// // //   Rocket,
// // //   Trophy,
// // //   ArrowLeft,
// // // } from "lucide-react";

// // // /* ------------------------------ helpers ------------------------------ */
// // // function normalizePhases(phases) {
// // //   return (phases || []).map((p, i) => {
// // //     if (typeof p === "string") {
// // //       const [titlePart, ...rest] = p.split(":");
// // //       const title =
// // //         p.toLowerCase().includes("phase") && titlePart ? p : `Phase ${i + 1}`;
// // //       const details =
// // //         p.toLowerCase().includes("phase") && p.includes(":")
// // //           ? p.split(":").slice(1).join(":").trim()
// // //           : p;
// // //       return {
// // //         id: `phase-${i + 1}`,
// // //         phase: title.trim(),
// // //         details: details.trim(),
// // //       };
// // //     }
// // //     return {
// // //       id: p.id || `phase-${i + 1}`,
// // //       phase: p.phase || `Phase ${i + 1}`,
// // //       details: p.details || "",
// // //     };
// // //   });
// // // }

// // // function getPhaseIcon(idx) {
// // //   const icons = [BookOpen, Cpu, FlaskConical, Rocket, Trophy];
// // //   return icons[idx % icons.length];
// // // }

// // // function buildFlowFromPhases(phases) {
// // //   const norm = normalizePhases(phases);
// // //   const gapX = 320;
// // //   const startX = 50;
// // //   const y = 80;

// // //   const nodes = norm.map((p, idx) => {
// // //     const Icon = getPhaseIcon(idx);
// // //     return {
// // //       id: p.id,
// // //       position: { x: startX + idx * gapX, y },
// // //       data: { label: p.phase, details: p.details, Icon },
// // //       type: "default",
// // //       style: {
// // //         padding: 12,
// // //         width: 280,
// // //         borderRadius: 16,
// // //         background:
// // //           "linear-gradient(180deg, rgba(39,39,42,1) 0%, rgba(24,24,27,1) 100%)",
// // //         border: "1px solid #3f3f46",
// // //         color: "#fafafa",
// // //         boxShadow:
// // //           "0 10px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
// // //       },
// // //     };
// // //   });

// // //   const edges = norm.slice(0, -1).map((p, idx) => ({
// // //     id: `e-${p.id}-${norm[idx + 1].id}`,
// // //     source: p.id,
// // //     target: norm[idx + 1].id,
// // //     animated: true,
// // //     type: "smoothstep",
// // //     style: { stroke: "#a855f7" },
// // //     markerEnd: { type: MarkerType.ArrowClosed, color: "#a855f7" },
// // //   }));

// // //   return { nodes, edges, normalized: norm };
// // // }

// // // /* ------------------------------ UI ------------------------------ */
// // // const Loader = ({ text = "Loading..." }) => (
// // //   <div className="flex flex-col items-center justify-center py-16">
// // //     <div className="h-12 w-12 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
// // //     <p className="mt-4 text-zinc-400">{text}</p>
// // //   </div>
// // // );

// // // const Card = ({ children, className = "" }) => (
// // //   <div
// // //     className={`rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl ${className}`}
// // //   >
// // //     {children}
// // //   </div>
// // // );

// // // const SectionTitle = ({ children }) => (
// // //   <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
// // //     {children}
// // //   </h3>
// // // );

// // // /* ------------------------------ main page ------------------------------ */
// // // export default function CareerPage() {
// // //   const [step, setStep] = useState("start"); // start | quiz | result
// // //   const [quiz, setQuiz] = useState(null);
// // //   const [answers, setAnswers] = useState({});
// // //   const [result, setResult] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [selectedField, setSelectedField] = useState(null);
// // //   const [previousResult, setPreviousResult] = useState(null);

// // //   const [currentPart, setCurrentPart] = useState("partA");
// // //   const [currentIndex, setCurrentIndex] = useState(0);

// // //   // Load previous result on mount
// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         const res = await getCareerEvaluation();
// // //         setPreviousResult(res);
// // //       } catch (err) {
// // //         console.error("Failed to fetch previous evaluation:", err);
// // //       }
// // //     })();
// // //   }, []);

// // //   const totalQ = quiz
// // //     ? (quiz.partA?.length || 0) + (quiz.partB?.length || 0)
// // //     : 0;
// // //   const answeredQ =
// // //     (Object.values(answers.partA || {}).length || 0) +
// // //     (Object.values(answers.partB || {}).length || 0);
// // //   const progress = totalQ > 0 ? Math.round((answeredQ / totalQ) * 100) : 0;

// // //   /* ------------------------------ quiz handlers ------------------------------ */
// // //   const handleStart = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const q = await generateQuiz();
// // //       setQuiz(q);
// // //       setStep("quiz");
// // //       setCurrentPart("partA");
// // //       setCurrentIndex(0);
// // //     } catch (e) {
// // //       console.error(e);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleAnswer = (option) => {
// // //     const q =
// // //       currentPart === "partA"
// // //         ? quiz.partA[currentIndex]
// // //         : quiz.partB[currentIndex];
// // //     setAnswers((prev) => ({
// // //       ...prev,
// // //       [currentPart]: { ...(prev[currentPart] || {}), [q.id]: option },
// // //     }));

// // //     setTimeout(() => {
// // //       if (currentPart === "partA" && currentIndex < quiz.partA.length - 1) {
// // //         setCurrentIndex((i) => i + 1);
// // //       } else if (currentPart === "partA") {
// // //         setCurrentPart("partB");
// // //         setCurrentIndex(0);
// // //       } else if (currentIndex < quiz.partB.length - 1) {
// // //         setCurrentIndex((i) => i + 1);
// // //       } else {
// // //         handleSubmit();
// // //       }
// // //     }, 120);
// // //   };

// // //   const handlePrev = () => {
// // //     if (currentPart === "partB" && currentIndex === 0) {
// // //       setCurrentPart("partA");
// // //       setCurrentIndex(quiz.partA.length - 1);
// // //     } else if (currentIndex > 0) {
// // //       setCurrentIndex((i) => i - 1);
// // //     }
// // //   };

// // //   const handleSubmit = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const res = await evaluateAnswers(answers);
// // //       setResult(res);
// // //       setSelectedField(res?.topFields?.[0] || null);
// // //       setStep("result");
// // //     } catch (e) {
// // //       console.error(e);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleSelectPreviousField = async (field) => {
// // //     setSelectedField(field);
// // //     try {
// // //       await updateIndustryInsight(field);
// // //       setPreviousResult((prev) => ({ ...prev, selectedField: field }));
// // //     } catch (err) {
// // //       console.error("Failed to update industry:", err);
// // //     }
// // //   };

// // //   /* ------------------------------ memoized data ------------------------------ */
// // //   const radarData = useMemo(() => {
// // //     if (!result?.topFields && !previousResult?.topFields) return [];
// // //     const base = [92, 86, 80, 74, 68];
// // //     const fields = result?.topFields || previousResult?.topFields || [];
// // //     return fields.map((field, i) => ({ field, score: base[i] ?? 65 }));
// // //   }, [result, previousResult]);

// // //   const { nodes, edges } = useMemo(() => {
// // //     const roadmapSource = result || previousResult;
// // //     const field = selectedField;
// // //     if (!roadmapSource?.roadmaps || !field) return { nodes: [], edges: [] };
// // //     const phases = roadmapSource.roadmaps[field] || [];
// // //     return buildFlowFromPhases(phases);
// // //   }, [result, previousResult, selectedField]);

// // //   const qVariants = {
// // //     enter: { opacity: 0, x: 50 },
// // //     center: { opacity: 1, x: 0 },
// // //     exit: { opacity: 0, x: -50 },
// // //   };

// // //   /* ------------------------------ render ------------------------------ */
// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white">
// // //       <div className="mx-auto max-w-6xl px-4 py-10">
// // //         <motion.h1
// // //           initial={{ opacity: 0, y: 10 }}
// // //           animate={{ opacity: 1, y: 0 }}
// // //           className="mb-8 text-center text-4xl font-bold tracking-tight"
// // //         >
// // //           Career Guidance Quiz <span className="text-zinc-400">🎓</span>
// // //         </motion.h1>

// // //         {/* ---------------- START ---------------- */}
// // //         {step === "start" && (
// // //           <Card className="p-10 text-center space-y-6">
// // //             <motion.p
// // //               initial={{ opacity: 0 }}
// // //               animate={{ opacity: 1 }}
// // //               className="mx-auto max-w-2xl text-zinc-400"
// // //             >
// // //               Discover your ideal IT career path based on your{" "}
// // //               <span className="text-zinc-200">interests</span> and{" "}
// // //               <span className="text-zinc-200">aptitude</span>. Take a short
// // //               two-part quiz and get a personalized roadmap with projects,
// // //               internships, and job-prep steps.
// // //             </motion.p>
// // //             <motion.button
// // //               whileHover={{ scale: 1.03 }}
// // //               whileTap={{ scale: 0.98 }}
// // //               onClick={handleStart}
// // //               disabled={loading}
// // //               className="rounded-xl bg-white px-8 py-3 font-semibold text-black shadow-2xl transition hover:bg-zinc-200"
// // //             >
// // //               {loading ? "Preparing…" : "Start Quiz"}
// // //             </motion.button>

// // //             {/* Previous Result Section */}
// // //             {previousResult && (
// // //               <div className="mt-10 text-left">
// // //                 <SectionTitle>Previous Evaluation</SectionTitle>
// // //                 <div className="mt-4 flex flex-wrap gap-3">
// // //                   {previousResult.topFields?.map((f) => (
// // //                     <button
// // //                       key={f}
// // //                       onClick={() => handleSelectPreviousField(f)}
// // //                       className={`rounded-xl border px-4 py-2 text-sm transition ${
// // //                         selectedField === f
// // //                           ? "border-zinc-200 bg-zinc-200 text-black"
// // //                           : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
// // //                       }`}
// // //                     >
// // //                       {f}
// // //                     </button>
// // //                   ))}
// // //                 </div>
// // //                 <p className="mt-2 text-xs text-zinc-500">
// // //                   Click a field to update your industry and view roadmap.
// // //                 </p>
// // //               </div>
// // //             )}
// // //           </Card>
// // //         )}

// // //         {/* ---------------- QUIZ ---------------- */}
// // //         {step === "quiz" && quiz && (
// // //           <div className="space-y-6">
// // //             {loading && <Loader text="Loading quiz…" />}
// // //             {!loading && (
// // //               <>
// // //                 {/* progress */}
// // //                 <Card className="p-4">
// // //                   <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
// // //                     <span>
// // //                       {currentPart === "partA"
// // //                         ? "Part A — Interest Mapping"
// // //                         : "Part B — Aptitude & Awareness"}
// // //                     </span>
// // //                     <span>
// // //                       {answeredQ}/{totalQ} answered
// // //                     </span>
// // //                   </div>
// // //                   <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
// // //                     <motion.div
// // //                       initial={{ width: 0 }}
// // //                       animate={{ width: `${progress}%` }}
// // //                       transition={{ duration: 0.35 }}
// // //                       className="h-full bg-white"
// // //                     />
// // //                   </div>
// // //                 </Card>

// // //                 {/* question */}
// // //                 <Card className="p-6">
// // //                   <AnimatePresence mode="wait">
// // //                     <motion.div
// // //                       key={`${currentPart}-${currentIndex}`}
// // //                       variants={qVariants}
// // //                       initial="enter"
// // //                       animate="center"
// // //                       exit="exit"
// // //                       transition={{ duration: 0.22 }}
// // //                     >
// // //                       <div className="mb-5 text-sm uppercase tracking-wider text-zinc-400">
// // //                         {currentPart === "partA"
// // //                           ? "Part A: Interest Mapping"
// // //                           : "Part B: Aptitude & Awareness"}
// // //                       </div>
// // //                       <div className="mb-6 text-xl font-medium leading-relaxed text-zinc-100">
// // //                         {currentPart === "partA"
// // //                           ? quiz.partA[currentIndex].question
// // //                           : quiz.partB[currentIndex].question}
// // //                       </div>

// // //                       <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
// // //                         {(currentPart === "partA"
// // //                           ? quiz.partA[currentIndex].options
// // //                           : quiz.partB[currentIndex].options
// // //                         ).map((opt, idx) => (
// // //                           <motion.button
// // //                             key={idx}
// // //                             whileHover={{ scale: 1.02 }}
// // //                             whileTap={{ scale: 0.98 }}
// // //                             onClick={() => handleAnswer(opt)}
// // //                             className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-left text-zinc-200 transition hover:bg-zinc-800"
// // //                           >
// // //                             {opt}
// // //                           </motion.button>
// // //                         ))}
// // //                       </div>

// // //                       <div className="mt-6 flex items-center justify-between">
// // //                         <button
// // //                           onClick={handlePrev}
// // //                           disabled={
// // //                             currentPart === "partA" && currentIndex === 0
// // //                           }
// // //                           className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
// // //                         >
// // //                           <ArrowLeft className="h-4 w-4" /> Previous
// // //                         </button>
// // //                         <div className="text-xs text-zinc-500">
// // //                           auto-advances on selection
// // //                         </div>
// // //                       </div>
// // //                     </motion.div>
// // //                   </AnimatePresence>
// // //                 </Card>
// // //               </>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* ---------------- RESULT ---------------- */}
// // //         {(step === "result" || selectedField) && (result || previousResult) && (
// // //           <AnimatePresence>
// // //             <motion.div
// // //               initial={{ opacity: 0, y: 14 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               exit={{ opacity: 0 }}
// // //               className="space-y-8"
// // //             >
// // //               <Card className="p-6">
// // //                 <h2 className="mb-2 text-2xl font-semibold text-zinc-100">
// // //                   🎯 Your Career Path
// // //                 </h2>
// // //                 <p className="max-w-3xl text-zinc-400">
// // //                   {result?.summary || previousResult?.summary}
// // //                 </p>
// // //               </Card>

// // //               <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
// // //                 <Card className="p-6">
// // //                   <SectionTitle>Top Fields (Radar)</SectionTitle>
// // //                   <div className="mt-4 h-72 w-full">
// // //                     <ResponsiveContainer width="100%" height="100%">
// // //                       <RadarChart data={radarData}>
// // //                         <PolarGrid />
// // //                         <PolarAngleAxis dataKey="field" stroke="#d4d4d8" />
// // //                         <PolarRadiusAxis stroke="#52525b" />
// // //                         <Radar
// // //                           dataKey="score"
// // //                           stroke="#ffffff"
// // //                           fill="#ffffff"
// // //                           fillOpacity={0.35}
// // //                           name="Suitability"
// // //                         />
// // //                         <Tooltip
// // //                           wrapperStyle={{
// // //                             background: "#18181b",
// // //                             border: "1px solid #3f3f46",
// // //                             color: "#fafafa",
// // //                             borderRadius: 12,
// // //                           }}
// // //                           contentStyle={{
// // //                             background: "#18181b",
// // //                             border: "none",
// // //                             color: "#fafafa",
// // //                           }}
// // //                           labelStyle={{ color: "#fafafa" }}
// // //                         />
// // //                       </RadarChart>
// // //                     </ResponsiveContainer>
// // //                   </div>
// // //                 </Card>

// // //                 <Card className="p-6">
// // //                   <SectionTitle>Your Recommended Fields</SectionTitle>
// // //                   <div className="mt-4 flex flex-wrap gap-3">
// // //                     {(result?.topFields || previousResult?.topFields || []).map(
// // //                       (f) => (
// // //                         <button
// // //                           key={f}
// // //                           onClick={() => handleSelectPreviousField(f)}
// // //                           className={`rounded-xl border px-4 py-2 text-sm transition ${
// // //                             selectedField === f
// // //                               ? "border-zinc-200 bg-zinc-200 text-black"
// // //                               : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
// // //                           }`}
// // //                         >
// // //                           {f}
// // //                         </button>
// // //                       )
// // //                     )}
// // //                   </div>
// // //                   <div className="mt-6 text-sm text-zinc-500">
// // //                     Click a field to view its roadmap as a flow.
// // //                   </div>
// // //                 </Card>
// // //               </div>

// // //               <Card className="p-6">
// // //                 <div className="mb-4 flex items-end justify-between">
// // //                   <div>
// // //                     <SectionTitle>
// // //                       {selectedField
// // //                         ? `${selectedField} — Roadmap Flow`
// // //                         : "Roadmap Flow"}
// // //                     </SectionTitle>
// // //                     <p className="mt-1 text-sm text-zinc-400">
// // //                       Drag to pan • Wheel to zoom • Click nodes for details.
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 <div className="h-[380px] w-full rounded-xl border border-zinc-800">
// // //                   {selectedField ? (
// // //                     <ReactFlow
// // //                       nodes={nodes.map((n) => ({
// // //                         ...n,
// // //                         data: {
// // //                           ...n.data,
// // //                           label: (
// // //                             <div className="flex items-start gap-3">
// // //                               <div className="rounded-xl bg-zinc-800 p-2">
// // //                                 {n.data.Icon ? (
// // //                                   <n.data.Icon className="h-4 w-4 text-zinc-200" />
// // //                                 ) : null}
// // //                               </div>
// // //                               <div className="space-y-1">
// // //                                 <div className="text-sm font-semibold text-zinc-100">
// // //                                   {n.data.label}
// // //                                 </div>
// // //                                 <div className="text-xs leading-relaxed text-zinc-400">
// // //                                   {n.data.details}
// // //                                 </div>
// // //                               </div>
// // //                             </div>
// // //                           ),
// // //                         },
// // //                       }))}
// // //                       edges={edges}
// // //                       fitView
// // //                       fitViewOptions={{ padding: 0.2 }}
// // //                     >
// // //                       <Background color="#3f3f46" gap={18} />
// // //                       <MiniMap
// // //                         maskColor="rgba(24,24,27,0.85)"
// // //                         nodeColor="#a855f7"
// // //                       />
// // //                       <Controls />
// // //                     </ReactFlow>
// // //                   ) : (
// // //                     <div className="flex h-full items-center justify-center text-zinc-500">
// // //                       Select a field above to view roadmap
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </Card>
// // //             </motion.div>
// // //           </AnimatePresence>
// // //         )}
        
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // "use client";

// // import React, { useMemo, useState, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   generateQuiz,
// //   evaluateAnswers,
// //   getCareerEvaluation,
// //   updateIndustryInsight,
// // } from "@/actions/gemini_res";
// // import {
// //   ResponsiveContainer,
// //   RadarChart,
// //   Radar,
// //   PolarGrid,
// //   PolarAngleAxis,
// //   PolarRadiusAxis,
// //   Tooltip,
// // } from "recharts";
// // import ReactFlow, {
// //   Background,
// //   Controls,
// //   MiniMap,
// //   MarkerType,
// // } from "reactflow";
// // import "reactflow/dist/style.css";
// // import {
// //   BookOpen,
// //   Cpu,
// //   FlaskConical,
// //   Rocket,
// //   Trophy,
// //   ArrowLeft,
// // } from "lucide-react";

// // /* ------------------------------ helpers ------------------------------ */
// // function normalizePhases(phases) {
// //   return (phases || []).map((p, i) => {
// //     if (typeof p === "string") {
// //       const [titlePart, ...rest] = p.split(":");
// //       const title =
// //         p.toLowerCase().includes("phase") && titlePart ? p : `Phase ${i + 1}`;
// //       const details =
// //         p.toLowerCase().includes("phase") && p.includes(":")
// //           ? p.split(":").slice(1).join(":").trim()
// //           : p;
// //       return {
// //         id: `phase-${i + 1}`,
// //         phase: title.trim(),
// //         details: details.trim(),
// //       };
// //     }
// //     return {
// //       id: p.id || `phase-${i + 1}`,
// //       phase: p.phase || `Phase ${i + 1}`,
// //       details: p.details || "",
// //     };
// //   });
// // }

// // function getPhaseIcon(idx) {
// //   const icons = [BookOpen, Cpu, FlaskConical, Rocket, Trophy];
// //   return icons[idx % icons.length];
// // }

// // function buildFlowFromPhases(phases) {
// //   const norm = normalizePhases(phases);
// //   const gapX = 320;
// //   const startX = 50;
// //   const y = 80;

// //   const nodes = norm.map((p, idx) => {
// //     const Icon = getPhaseIcon(idx);
// //     return {
// //       id: p.id,
// //       position: { x: startX + idx * gapX, y },
// //       data: {
// //         label: (
// //           <div className="flex items-start gap-3">
// //             <div className="rounded-xl bg-zinc-800 p-2">
// //               {Icon && <Icon className="h-4 w-4 text-zinc-200" />}
// //             </div>
// //             <div className="space-y-1">
// //               <div className="text-sm font-semibold text-zinc-100">
// //                 {p.phase}
// //               </div>
// //               <div className="text-xs leading-relaxed text-zinc-400">
// //                 {p.details}
// //               </div>
// //             </div>
// //           </div>
// //         ),
// //         labelText: p.phase,
// //         detailsText: p.details,
// //         Icon,
// //       },
// //       type: "default",
// //       style: {
// //         padding: 12,
// //         width: 280,
// //         borderRadius: 16,
// //         background:
// //           "linear-gradient(180deg, rgba(39,39,42,1) 0%, rgba(24,24,27,1) 100%)",
// //         border: "1px solid #3f3f46",
// //         color: "#fafafa",
// //         boxShadow:
// //           "0 10px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
// //       },
// //     };
// //   });

// //   const edges = norm.slice(0, -1).map((p, idx) => ({
// //     id: `e-${p.id}-${norm[idx + 1].id}`,
// //     source: p.id,
// //     target: norm[idx + 1].id,
// //     animated: true,
// //     type: "smoothstep",
// //     style: { stroke: "#a855f7" },
// //     markerEnd: { type: MarkerType.ArrowClosed, color: "#a855f7" },
// //   }));

// //   return { nodes, edges, normalized: norm };
// // }

// // /* ------------------------------ UI ------------------------------ */
// // const Loader = ({ text = "Loading..." }) => (
// //   <div className="flex flex-col items-center justify-center py-16">
// //     <div className="h-12 w-12 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
// //     <p className="mt-4 text-zinc-400">{text}</p>
// //   </div>
// // );

// // const Card = ({ children, className = "" }) => (
// //   <div
// //     className={`rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl ${className}`}
// //   >
// //     {children}
// //   </div>
// // );

// // const SectionTitle = ({ children }) => (
// //   <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
// //     {children}
// //   </h3>
// // );

// // /* ------------------------------ main page ------------------------------ */
// // export default function CareerPage() {
// //   const [step, setStep] = useState("start"); // start | quiz | result
// //   const [quiz, setQuiz] = useState(null);
// //   const [answers, setAnswers] = useState({});
// //   const [result, setResult] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [selectedField, setSelectedField] = useState(null);
// //   const [previousResult, setPreviousResult] = useState(null);

// //   const [currentPart, setCurrentPart] = useState("partA");
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   // Load previous result on mount
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const res = await getCareerEvaluation();
// //         setPreviousResult(res);
// //       } catch (err) {
// //         console.error("Failed to fetch previous evaluation:", err);
// //       }
// //     })();
// //   }, []);

// //   const totalQ = quiz
// //     ? (quiz.partA?.length || 0) + (quiz.partB?.length || 0)
// //     : 0;
// //   const answeredQ =
// //     (Object.values(answers.partA || {}).length || 0) +
// //     (Object.values(answers.partB || {}).length || 0);
// //   const progress = totalQ > 0 ? Math.round((answeredQ / totalQ) * 100) : 0;

// //   /* ------------------------------ quiz handlers ------------------------------ */
// //   const handleStart = async () => {
// //     setLoading(true);
// //     try {
// //       const q = await generateQuiz();
// //       setQuiz(q);
// //       setStep("quiz");
// //       setCurrentPart("partA");
// //       setCurrentIndex(0);
// //     } catch (e) {
// //       console.error(e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAnswer = (option) => {
// //     const q =
// //       currentPart === "partA"
// //         ? quiz.partA[currentIndex]
// //         : quiz.partB[currentIndex];
// //     setAnswers((prev) => ({
// //       ...prev,
// //       [currentPart]: { ...(prev[currentPart] || {}), [q.id]: option },
// //     }));

// //     setTimeout(() => {
// //       if (currentPart === "partA" && currentIndex < quiz.partA.length - 1) {
// //         setCurrentIndex((i) => i + 1);
// //       } else if (currentPart === "partA") {
// //         setCurrentPart("partB");
// //         setCurrentIndex(0);
// //       } else if (currentIndex < quiz.partB.length - 1) {
// //         setCurrentIndex((i) => i + 1);
// //       } else {
// //         handleSubmit();
// //       }
// //     }, 120);
// //   };

// //   const handlePrev = () => {
// //     if (currentPart === "partB" && currentIndex === 0) {
// //       setCurrentPart("partA");
// //       setCurrentIndex(quiz.partA.length - 1);
// //     } else if (currentIndex > 0) {
// //       setCurrentIndex((i) => i - 1);
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await evaluateAnswers(answers);
// //       setResult(res);
// //       setSelectedField(res?.topFields?.[0] || null);
// //       setStep("result");
// //     } catch (e) {
// //       console.error(e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSelectPreviousField = async (field) => {
// //     setSelectedField(field);
// //     try {
// //       await updateIndustryInsight(field);
// //       setPreviousResult((prev) => ({ ...prev, selectedField: field }));
// //     } catch (err) {
// //       console.error("Failed to update industry:", err);
// //     }
// //   };

// //   /* ------------------------------ memoized data ------------------------------ */
// //   const radarData = useMemo(() => {
// //     if (!result?.topFields && !previousResult?.topFields) return [];
// //     const base = [92, 86, 80, 74, 68];
// //     const fields = result?.topFields || previousResult?.topFields || [];
// //     return fields.map((field, i) => ({ field, score: base[i] ?? 65 }));
// //   }, [result, previousResult]);

// //   const { nodes, edges } = useMemo(() => {
// //     const roadmapSource = result || previousResult;
// //     const field = selectedField;
// //     if (!roadmapSource?.roadmaps || !field) return { nodes: [], edges: [] };
// //     const phases = roadmapSource.roadmaps[field] || [];
// //     return buildFlowFromPhases(phases);
// //   }, [result, previousResult, selectedField]);

// //   const qVariants = {
// //     enter: { opacity: 0, x: 50 },
// //     center: { opacity: 1, x: 0 },
// //     exit: { opacity: 0, x: -50 },
// //   };

// //   /* ------------------------------ render ------------------------------ */
// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white">
// //       <div className="mx-auto max-w-6xl px-4 py-10">
// //         <motion.h1
// //           initial={{ opacity: 0, y: 10 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="mb-8 text-center text-4xl font-bold tracking-tight"
// //         >
// //           Career Guidance Quiz <span className="text-zinc-400">🎓</span>
// //         </motion.h1>

// //         {/* ---------------- START ---------------- */}
// //         {step === "start" && (
// //           <Card className="p-10 text-center space-y-6">
// //             <motion.p
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               className="mx-auto max-w-2xl text-zinc-400"
// //             >
// //               Discover your ideal IT career path based on your{" "}
// //               <span className="text-zinc-200">interests</span> and{" "}
// //               <span className="text-zinc-200">aptitude</span>. Take a short
// //               two-part quiz and get a personalized roadmap with projects,
// //               internships, and job-prep steps.
// //             </motion.p>
// //             <motion.button
// //               whileHover={{ scale: 1.03 }}
// //               whileTap={{ scale: 0.98 }}
// //               onClick={handleStart}
// //               disabled={loading}
// //               className="rounded-xl bg-white px-8 py-3 font-semibold text-black shadow-2xl transition hover:bg-zinc-200"
// //             >
// //               {loading ? "Preparing…" : "Start Quiz"}
// //             </motion.button>

// //             {/* Previous Result Section */}
// //             {previousResult && (
// //               <div className="mt-10 text-left">
// //                 <SectionTitle>Previous Evaluation</SectionTitle>
// //                 <div className="mt-4 flex flex-wrap gap-3">
// //                   {previousResult.topFields?.map((f) => (
// //                     <button
// //                       key={f}
// //                       onClick={() => setSelectedField(f)}
// //                       className={`rounded-xl border px-4 py-2 text-sm transition ${
// //                         selectedField === f
// //                           ? "border-zinc-200 bg-zinc-200 text-black"
// //                           : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
// //                       }`}
// //                     >
// //                       {f}
// //                     </button>
// //                   ))}
// //                 </div>
// //                 <p className="mt-2 text-xs text-zinc-500">
// //                   Click a field to view roadmap.
// //                 </p>
// //               </div>
// //             )}
// //           </Card>
// //         )}

// //         {/* ---------------- QUIZ ---------------- */}
// //         {step === "quiz" && quiz && (
// //           <div className="space-y-6">
// //             {loading && <Loader text="Loading quiz…" />}
// //             {!loading && (
// //               <>
// //                 {/* progress */}
// //                 <Card className="p-4">
// //                   <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
// //                     <span>
// //                       {currentPart === "partA"
// //                         ? "Part A — Interest Mapping"
// //                         : "Part B — Aptitude & Awareness"}
// //                     </span>
// //                     <span>
// //                       {answeredQ}/{totalQ} answered
// //                     </span>
// //                   </div>
// //                   <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
// //                     <motion.div
// //                       initial={{ width: 0 }}
// //                       animate={{ width: `${progress}%` }}
// //                       transition={{ duration: 0.35 }}
// //                       className="h-full bg-white"
// //                     />
// //                   </div>
// //                 </Card>

// //                 {/* question */}
// //                 <Card className="p-6">
// //                   <AnimatePresence mode="wait">
// //                     <motion.div
// //                       key={`${currentPart}-${currentIndex}`}
// //                       variants={qVariants}
// //                       initial="enter"
// //                       animate="center"
// //                       exit="exit"
// //                       transition={{ duration: 0.22 }}
// //                     >
// //                       <div className="mb-5 text-sm uppercase tracking-wider text-zinc-400">
// //                         {currentPart === "partA"
// //                           ? "Part A: Interest Mapping"
// //                           : "Part B: Aptitude & Awareness"}
// //                       </div>
// //                       <div className="mb-6 text-xl font-medium leading-relaxed text-zinc-100">
// //                         {currentPart === "partA"
// //                           ? quiz.partA[currentIndex].question
// //                           : quiz.partB[currentIndex].question}
// //                       </div>

// //                       <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
// //                         {(currentPart === "partA"
// //                           ? quiz.partA[currentIndex].options
// //                           : quiz.partB[currentIndex].options
// //                         ).map((opt, idx) => (
// //                           <motion.button
// //                             key={idx}
// //                             whileHover={{ scale: 1.02 }}
// //                             whileTap={{ scale: 0.98 }}
// //                             onClick={() => handleAnswer(opt)}
// //                             className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-left text-zinc-200 transition hover:bg-zinc-800"
// //                           >
// //                             {opt}
// //                           </motion.button>
// //                         ))}
// //                       </div>

// //                       <div className="mt-6 flex items-center justify-between">
// //                         <button
// //                           onClick={handlePrev}
// //                           disabled={
// //                             currentPart === "partA" && currentIndex === 0
// //                           }
// //                           className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
// //                         >
// //                           <ArrowLeft className="h-4 w-4" /> Previous
// //                         </button>
// //                         <div className="text-xs text-zinc-500">
// //                           auto-advances on selection
// //                         </div>
// //                       </div>
// //                     </motion.div>
// //                   </AnimatePresence>
// //                 </Card>
// //               </>
// //             )}
// //           </div>
// //         )}

// //         {/* ---------------- RESULT ---------------- */}
// //         {(step === "result" || selectedField) && (result || previousResult) && (
// //           <AnimatePresence>
// //             <motion.div
// //               initial={{ opacity: 0, y: 14 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0 }}
// //               className="space-y-8"
// //             >
// //               <Card className="p-6">
// //                 <h2 className="mb-2 text-2xl font-semibold text-zinc-100">
// //                   🎯 Your Career Path
// //                 </h2>
// //                 <p className="max-w-3xl text-zinc-400">
// //                   {result?.summary || previousResult?.summary}
// //                 </p>
// //               </Card>

// //               <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
// //                 <Card className="p-6">
// //                   <SectionTitle>Top Fields (Radar)</SectionTitle>
// //                   <div className="mt-4 h-72 w-full">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <RadarChart data={radarData}>
// //                         <PolarGrid />
// //                         <PolarAngleAxis dataKey="field" stroke="#d4d4d8" />
// //                         <PolarRadiusAxis stroke="#52525b" />
// //                         <Radar
// //                           dataKey="score"
// //                           stroke="#ffffff"
// //                           fill="#ffffff"
// //                           fillOpacity={0.35}
// //                           name="Suitability"
// //                         />
// //                         <Tooltip
// //                           wrapperStyle={{
// //                             background: "#18181b",
// //                             border: "1px solid #3f3f46",
// //                             color: "#fafafa",
// //                             borderRadius: 12,
// //                           }}
// //                           contentStyle={{
// //                             background: "#18181b",
// //                             border: "none",
// //                             color: "#fafafa",
// //                           }}
// //                           labelStyle={{ color: "#fafafa" }}
// //                         />
// //                       </RadarChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                 </Card>

// //                 <Card className="p-6">
// //                   <SectionTitle>Your Recommended Fields</SectionTitle>
// //                   <div className="mt-4 flex flex-wrap gap-3">
// //                     {(result?.topFields || previousResult?.topFields || []).map(
// //                       (f) => (
// //                         <button
// //                           key={f}
// //                           onClick={() => setSelectedField(f)}
// //                           className={`rounded-xl border px-4 py-2 text-sm transition ${
// //                             selectedField === f
// //                               ? "border-zinc-200 bg-zinc-200 text-black"
// //                               : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
// //                           }`}
// //                         >
// //                           {f}
// //                         </button>
// //                       )
// //                     )}
// //                   </div>
// //                   <div className="mt-6 text-sm text-zinc-500">
// //                     Click a field to view its roadmap as a flow.
// //                   </div>
// //                 </Card>
// //               </div>

// //               <Card className="p-6">
// //                 <div className="mb-4 flex items-end justify-between">
// //                   <div>
// //                     <SectionTitle>
// //                       {selectedField
// //                         ? `${selectedField} — Roadmap Flow`
// //                         : "Roadmap Flow"}
// //                     </SectionTitle>
// //                     <p className="mt-1 text-sm text-zinc-400">
// //                       Drag to pan • Wheel to zoom • Click nodes for details.
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="h-[380px] w-full rounded-xl border border-zinc-800">
// //                   {selectedField ? (
// //                     <ReactFlow
// //                       nodes={nodes}
// //                       edges={edges}
// //                       fitView
// //                       fitViewOptions={{ padding: 0.2 }}
// //                     >
// //                       <Background gap={16} size={1} color="#3f3f46" />
// //                       <MiniMap
// //                         nodeStrokeColor={() => "#a855f7"}
// //                         nodeColor={() => "#fafafa"}
// //                         nodeBorderRadius={12}
// //                       />
// //                       <Controls showInteractive={false} />
// //                     </ReactFlow>
// //                   ) : (
// //                     <p className="p-4 text-zinc-400">
// //                       Select a field above to view its roadmap.
// //                     </p>
// //                   )}
// //                 </div>

// //                 {/* Textual Roadmap */}
// //                 {nodes.length > 0 && (
// //                   <div className="mt-6 space-y-4">
// //                     <SectionTitle>Roadmap Details</SectionTitle>
// //                     <ol className="list-decimal list-inside space-y-2 text-zinc-300">
// //                       {nodes.map((n) => (
// //                         <li key={n.id}>
// //                           <span className="font-semibold text-zinc-100">
// //                             {n.data.labelText}
// //                           </span>
// //                           <p className="text-zinc-400 text-sm mt-1">
// //                             {n.data.detailsText}
// //                           </p>
// //                         </li>
// //                       ))}
// //                     </ol>

// //                     <button
// //                       onClick={() => handleSelectPreviousField(selectedField)}
// //                       className="mt-4 rounded-sm bg-purple-600 px-6 py-2 font-semibold text-white hover:bg-purple-700 transition"
// //                     >
// //                       Update Industry Insight
// //                     </button>
// //                   </div>
// //                 )}
// //               </Card>
// //             </motion.div>
// //           </AnimatePresence>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   generateQuiz,
//   evaluateAnswers,
//   getCareerEvaluation,
//   updateIndustryInsight,
// } from "@/actions/gemini_res";
// import {
//   ResponsiveContainer,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Tooltip,
// } from "recharts";
// import ReactFlow, {
//   Background,
//   Controls,
//   MiniMap,
//   MarkerType,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import {
//   BookOpen,
//   Cpu,
//   FlaskConical,
//   Rocket,
//   Trophy,
//   ArrowLeft,
//   ChevronRight,
//   Target,
//   BarChart3,
//   Map,
//   Clock,
//   CheckCircle2,
// } from "lucide-react";

// /* ------------------------------ helpers ------------------------------ */
// function normalizePhases(phases) {
//   return (phases || []).map((p, i) => {
//     if (typeof p === "string") {
//       const [titlePart, ...rest] = p.split(":");
//       const title =
//         p.toLowerCase().includes("phase") && titlePart ? p : `Phase ${i + 1}`;
//       const details =
//         p.toLowerCase().includes("phase") && p.includes(":")
//           ? p.split(":").slice(1).join(":").trim()
//           : p;
//       return {
//         id: `phase-${i + 1}`,
//         phase: title.trim(),
//         details: details.trim(),
//       };
//     }
//     return {
//       id: p.id || `phase-${i + 1}`,
//       phase: p.phase || `Phase ${i + 1}`,
//       details: p.details || "",
//     };
//   });
// }

// function getPhaseIcon(idx) {
//   const icons = [BookOpen, Cpu, FlaskConical, Rocket, Trophy];
//   return icons[idx % icons.length];
// }

// function buildFlowFromPhases(phases) {
//   const norm = normalizePhases(phases);
//   const gapX = 320;
//   const startX = 50;
//   const y = 80;

//   const nodes = norm.map((p, idx) => {
//     const Icon = getPhaseIcon(idx);
//     return {
//       id: p.id,
//       position: { x: startX + idx * gapX, y },
//       data: {
//         label: (
//           <div className="flex items-start gap-3">
//             <div className="rounded-xl bg-blue-100 p-2">
//               {Icon && <Icon className="h-4 w-4 text-blue-600" />}
//             </div>
//             <div className="space-y-1">
//               <div className="text-sm font-semibold text-gray-900">
//                 {p.phase}
//               </div>
//               <div className="text-xs leading-relaxed text-gray-600">
//                 {p.details}
//               </div>
//             </div>
//           </div>
//         ),
//         labelText: p.phase,
//         detailsText: p.details,
//         Icon,
//       },
//       type: "default",
//       style: {
//         padding: 12,
//         width: 280,
//         borderRadius: 16,
//         background: "white",
//         border: "1px solid #e5e7eb",
//         color: "#111827",
//         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//       },
//     };
//   });

//   const edges = norm.slice(0, -1).map((p, idx) => ({
//     id: `e-${p.id}-${norm[idx + 1].id}`,
//     source: p.id,
//     target: norm[idx + 1].id,
//     animated: true,
//     type: "smoothstep",
//     style: { stroke: "#3b82f6" },
//     markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
//   }));

//   return { nodes, edges, normalized: norm };
// }

// /* ------------------------------ UI ------------------------------ */
// const Loader = ({ text = "Loading..." }) => (
//   <div className="flex flex-col items-center justify-center py-16">
//     <div className="h-12 w-12 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
//     <p className="mt-4 text-gray-600">{text}</p>
//   </div>
// );

// const Card = ({ children, className = "" }) => (
//   <div
//     className={`rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
//   >
//     {children}
//   </div>
// );

// const SectionTitle = ({ children, icon: Icon }) => (
//   <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//     {Icon && <Icon className="h-5 w-5 text-blue-600" />}
//     {children}
//   </h3>
// );

// const ProgressBar = ({ progress }) => (
//   <div className="w-full bg-gray-100 rounded-full h-3">
//     <motion.div
//       initial={{ width: 0 }}
//       animate={{ width: `${progress}%` }}
//       transition={{ duration: 0.5 }}
//       className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
//     />
//   </div>
// );

// /* ------------------------------ main page ------------------------------ */
// export default function CareerPage() {
//   const [step, setStep] = useState("start");
//   const [quiz, setQuiz] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedField, setSelectedField] = useState(null);
//   const [previousResult, setPreviousResult] = useState(null);

//   const [currentPart, setCurrentPart] = useState("partA");
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Load previous result on mount
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getCareerEvaluation();
//         setPreviousResult(res);
//       } catch (err) {
//         console.error("Failed to fetch previous evaluation:", err);
//       }
//     })();
//   }, []);

//   const totalQ = quiz
//     ? (quiz.partA?.length || 0) + (quiz.partB?.length || 0)
//     : 0;
//   const answeredQ =
//     (Object.values(answers.partA || {}).length || 0) +
//     (Object.values(answers.partB || {}).length || 0);
//   const progress = totalQ > 0 ? Math.round((answeredQ / totalQ) * 100) : 0;

//   /* ------------------------------ quiz handlers ------------------------------ */
//   const handleStart = async () => {
//     setLoading(true);
//     try {
//       const q = await generateQuiz();
//       setQuiz(q);
//       setStep("quiz");
//       setCurrentPart("partA");
//       setCurrentIndex(0);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAnswer = (option) => {
//     const q =
//       currentPart === "partA"
//         ? quiz.partA[currentIndex]
//         : quiz.partB[currentIndex];
//     setAnswers((prev) => ({
//       ...prev,
//       [currentPart]: { ...(prev[currentPart] || {}), [q.id]: option },
//     }));

//     setTimeout(() => {
//       if (currentPart === "partA" && currentIndex < quiz.partA.length - 1) {
//         setCurrentIndex((i) => i + 1);
//       } else if (currentPart === "partA") {
//         setCurrentPart("partB");
//         setCurrentIndex(0);
//       } else if (currentIndex < quiz.partB.length - 1) {
//         setCurrentIndex((i) => i + 1);
//       } else {
//         handleSubmit();
//       }
//     }, 120);
//   };

//   const handlePrev = () => {
//     if (currentPart === "partB" && currentIndex === 0) {
//       setCurrentPart("partA");
//       setCurrentIndex(quiz.partA.length - 1);
//     } else if (currentIndex > 0) {
//       setCurrentIndex((i) => i - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const res = await evaluateAnswers(answers);
//       setResult(res);
//       setSelectedField(res?.topFields?.[0] || null);
//       setStep("result");
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectPreviousField = async (field) => {
//     setSelectedField(field);
//     try {
//       await updateIndustryInsight(field);
//       setPreviousResult((prev) => ({ ...prev, selectedField: field }));
//     } catch (err) {
//       console.error("Failed to update industry:", err);
//     }
//   };

//   /* ------------------------------ memoized data ------------------------------ */
//   const radarData = useMemo(() => {
//     if (!result?.topFields && !previousResult?.topFields) return [];
//     const base = [92, 86, 80, 74, 68];
//     const fields = result?.topFields || previousResult?.topFields || [];
//     return fields.map((field, i) => ({ field, score: base[i] ?? 65 }));
//   }, [result, previousResult]);

//   const { nodes, edges } = useMemo(() => {
//     const roadmapSource = result || previousResult;
//     const field = selectedField;
//     if (!roadmapSource?.roadmaps || !field) return { nodes: [], edges: [] };
//     const phases = roadmapSource.roadmaps[field] || [];
//     return buildFlowFromPhases(phases);
//   }, [result, previousResult, selectedField]);

//   const qVariants = {
//     enter: { opacity: 0, x: 50 },
//     center: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: -50 },
//   };

//   /* ------------------------------ render ------------------------------ */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
//       <div className="mx-auto max-w-6xl px-4 py-10">
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8 text-center"
//         >
//           <h1 className="text-4xl font-bold text-gray-900">
//             Career Interest Mapping
//           </h1>
//           <p className="mt-3 text-lg text-gray-600">
//             Discover your ideal career path with AI-powered guidance
//           </p>
//         </motion.div>

//         {/* ---------------- START ---------------- */}
//         {step === "start" && (
//           <Card className="p-10 text-center space-y-8">
//             <div className="space-y-4">
//               <div className="mx-auto w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
//                 <Target className="h-10 w-10 text-blue-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900">
//                 Find Your Career Path
//               </h2>
//               <p className="mx-auto max-w-2xl text-gray-600 text-lg leading-relaxed">
//                 Take a short two-part quiz to discover your ideal IT career path
//                 based on your{" "}
//                 <span className="text-blue-600 font-semibold">interests</span>{" "}
//                 and{" "}
//                 <span className="text-blue-600 font-semibold">aptitude</span>.
//                 Get personalized roadmaps with projects, internships, and career
//                 guidance.
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleStart}
//                 disabled={loading}
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Preparing Quiz...
//                   </>
//                 ) : (
//                   <>
//                     Start Career Quiz
//                     <ChevronRight className="h-5 w-5" />
//                   </>
//                 )}
//               </motion.button>

//               <div className="flex items-center gap-3 text-sm text-gray-500">
//                 <Clock className="h-4 w-4" />
//                 <span>10-15 minutes</span>
//               </div>
//             </div>

//             {/* Previous Result Section */}
//             {previousResult && (
//               <div className="mt-12 text-left border-t pt-8">
//                 <SectionTitle icon={BarChart3}>
//                   Previous Evaluation
//                 </SectionTitle>
//                 <div className="mt-4 flex flex-wrap gap-3">
//                   {previousResult.topFields?.map((f) => (
//                     <button
//                       key={f}
//                       onClick={() => setSelectedField(f)}
//                       className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
//                         selectedField === f
//                           ? "border-blue-600 bg-blue-600 text-white shadow-md"
//                           : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:shadow-sm"
//                       }`}
//                     >
//                       {f}
//                     </button>
//                   ))}
//                 </div>
//                 <p className="mt-3 text-sm text-gray-500">
//                   Click a field to view your personalized roadmap
//                 </p>
//               </div>
//             )}
//           </Card>
//         )}

//         {/* ---------------- QUIZ ---------------- */}
//         {step === "quiz" && quiz && (
//           <div className="space-y-6">
//             {loading && <Loader text="Loading quiz…" />}
//             {!loading && (
//               <>
//                 {/* Progress Card */}
//                 <Card className="p-6">
//                   <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
//                     <span className="font-medium">
//                       {currentPart === "partA"
//                         ? "Part A — Interest Mapping"
//                         : "Part B — Aptitude & Awareness"}
//                     </span>
//                     <span className="font-semibold text-blue-600">
//                       {answeredQ}/{totalQ} answered
//                     </span>
//                   </div>
//                   <ProgressBar progress={progress} />
//                 </Card>

//                 {/* Question Card */}
//                 <Card className="p-8">
//                   <AnimatePresence mode="wait">
//                     <motion.div
//                       key={`${currentPart}-${currentIndex}`}
//                       variants={qVariants}
//                       initial="enter"
//                       animate="center"
//                       exit="exit"
//                       transition={{ duration: 0.22 }}
//                     >
//                       <div className="mb-6">
//                         <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
//                           {currentPart === "partA" ? (
//                             <>
//                               <Map className="h-4 w-4" />
//                               Interest Mapping
//                             </>
//                           ) : (
//                             <>
//                               <Cpu className="h-4 w-4" />
//                               Aptitude & Awareness
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       <div className="mb-8">
//                         <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
//                           {currentPart === "partA"
//                             ? quiz.partA[currentIndex].question
//                             : quiz.partB[currentIndex].question}
//                         </h3>
//                       </div>

//                       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                         {(currentPart === "partA"
//                           ? quiz.partA[currentIndex].options
//                           : quiz.partB[currentIndex].options
//                         ).map((opt, idx) => (
//                           <motion.button
//                             key={idx}
//                             whileHover={{ scale: 1.02, y: -2 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={() => handleAnswer(opt)}
//                             className="rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-left text-gray-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
//                           >
//                             <div className="flex items-center gap-3">
//                               <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300">
//                                 <div className="h-3 w-3 rounded-full bg-transparent" />
//                               </div>
//                               <span className="font-medium">{opt}</span>
//                             </div>
//                           </motion.button>
//                         ))}
//                       </div>

//                       <div className="mt-8 flex items-center justify-between">
//                         <button
//                           onClick={handlePrev}
//                           disabled={
//                             currentPart === "partA" && currentIndex === 0
//                           }
//                           className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:opacity-40"
//                         >
//                           <ArrowLeft className="h-4 w-4" />
//                           Previous
//                         </button>
//                         <div className="text-sm text-gray-500 flex items-center gap-2">
//                           <CheckCircle2 className="h-4 w-4 text-green-500" />
//                           Auto-advances on selection
//                         </div>
//                       </div>
//                     </motion.div>
//                   </AnimatePresence>
//                 </Card>
//               </>
//             )}
//           </div>
//         )}

//         {/* ---------------- RESULT ---------------- */}
//         {(step === "result" || selectedField) && (result || previousResult) && (
//           <AnimatePresence>
//             <motion.div
//               initial={{ opacity: 0, y: 14 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="space-y-8"
//             >
//               {/* Summary Card */}
//               <Card className="p-8">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="rounded-2xl bg-green-100 p-3">
//                     <Trophy className="h-6 w-6 text-green-600" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900">
//                       Your Career Path Analysis
//                     </h2>
//                     <p className="text-gray-600">
//                       Personalized recommendations based on your assessment
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 leading-relaxed text-lg">
//                   {result?.summary || previousResult?.summary}
//                 </p>
//               </Card>

//               {/* Charts and Fields */}
//               <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//                 <Card className="p-6">
//                   <SectionTitle icon={Target}>
//                     Career Suitability Radar
//                   </SectionTitle>
//                   <div className="mt-4 h-72 w-full">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <RadarChart data={radarData}>
//                         <PolarGrid stroke="#e5e7eb" />
//                         <PolarAngleAxis dataKey="field" stroke="#6b7280" />
//                         <PolarRadiusAxis stroke="#9ca3af" />
//                         <Radar
//                           dataKey="score"
//                           stroke="#3b82f6"
//                           fill="#3b82f6"
//                           fillOpacity={0.3}
//                           name="Suitability Score"
//                         />
//                         <Tooltip
//                           wrapperStyle={{
//                             background: "white",
//                             border: "1px solid #e5e7eb",
//                             color: "#111827",
//                             borderRadius: 12,
//                             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                           }}
//                           contentStyle={{
//                             background: "white",
//                             border: "none",
//                             color: "#111827",
//                           }}
//                           labelStyle={{ color: "#111827", fontWeight: 600 }}
//                         />
//                       </RadarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </Card>

//                 <Card className="p-6">
//                   <SectionTitle icon={Cpu}>
//                     Recommended Career Fields
//                   </SectionTitle>
//                   <div className="mt-4 flex flex-wrap gap-3">
//                     {(result?.topFields || previousResult?.topFields || []).map(
//                       (f) => (
//                         <button
//                           key={f}
//                           onClick={() => setSelectedField(f)}
//                           className={`rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all duration-200 ${
//                             selectedField === f
//                               ? "border-blue-600 bg-blue-600 text-white shadow-md"
//                               : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:shadow-sm"
//                           }`}
//                         >
//                           {f}
//                         </button>
//                       )
//                     )}
//                   </div>
//                   <div className="mt-6 text-sm text-gray-500 flex items-center gap-2">
//                     <ChevronRight className="h-4 w-4" />
//                     Select a field to explore detailed roadmap
//                   </div>
//                 </Card>
//               </div>

//               {/* Roadmap Flow */}
//               <Card className="p-6">
//                 <div className="mb-6">
//                   <SectionTitle icon={Map}>
//                     {selectedField
//                       ? `${selectedField} Career Roadmap`
//                       : "Career Roadmap"}
//                   </SectionTitle>
//                   <p className="mt-2 text-sm text-gray-600">
//                     Interactive roadmap showing your career progression path
//                   </p>
//                 </div>

//                 <div className="h-[400px] w-full rounded-xl border border-gray-200 bg-white">
//                   {selectedField ? (
//                     <ReactFlow
//                       nodes={nodes}
//                       edges={edges}
//                       fitView
//                       fitViewOptions={{ padding: 0.2 }}
//                     >
//                       <Background gap={20} size={1} color="#e5e7eb" />
//                       <MiniMap
//                         nodeStrokeColor={() => "#3b82f6"}
//                         nodeColor={() => "#ffffff"}
//                         nodeBorderRadius={12}
//                         maskColor="rgba(255, 255, 255, 0.7)"
//                       />
//                       <Controls
//                         showInteractive={false}
//                         position="bottom-left"
//                       />
//                     </ReactFlow>
//                   ) : (
//                     <div className="flex h-full items-center justify-center text-gray-500">
//                       <div className="text-center">
//                         <Target className="h-12 w-12 mx-auto mb-3 text-gray-400" />
//                         <p>Select a career field above to view its roadmap</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Textual Roadmap */}
//                 {nodes.length > 0 && (
//                   <div className="mt-8 space-y-6">
//                     <SectionTitle>Roadmap Breakdown</SectionTitle>
//                     <div className="space-y-4">
//                       {nodes.map((n, index) => (
//                         <div
//                           key={n.id}
//                           className="flex gap-4 p-4 rounded-xl border border-gray-200 bg-white"
//                         >
//                           <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-sm font-semibold text-blue-600">
//                               {index + 1}
//                             </span>
//                           </div>
//                           <div>
//                             <h4 className="font-semibold text-gray-900 mb-1">
//                               {n.data.labelText}
//                             </h4>
//                             <p className="text-gray-600 text-sm">
//                               {n.data.detailsText}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex justify-center pt-4">
//                       <button
//                         onClick={() => handleSelectPreviousField(selectedField)}
//                         className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
//                       >
//                         Update Industry Insight
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </motion.div>
//           </AnimatePresence>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateQuiz,
  evaluateAnswers,
  getCareerEvaluation,
  updateIndustryInsight,
} from "@/actions/gemini_res";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  BookOpen,
  Cpu,
  FlaskConical,
  Rocket,
  Trophy,
  ArrowLeft,
  ChevronRight,
  Target,
  BarChart3,
  Map,
  Clock,
  CheckCircle2,
} from "lucide-react";

/* ------------------------------ helpers ------------------------------ */
function normalizePhases(phases) {
  return (phases || []).map((p, i) => {
    if (typeof p === "string") {
      const [titlePart, ...rest] = p.split(":");
      return {
        id: `phase-${i + 1}`,
        phase: titlePart || `Phase ${i + 1}`,
        details: rest.join(":").trim() || p,
      };
    }
    return {
      id: p.id || `phase-${i + 1}`,
      phase: p.phase || `Phase ${i + 1}`,
      details: p.details || "",
    };
  });
}

function getPhaseIcon(idx) {
  const icons = [BookOpen, Cpu, FlaskConical, Rocket, Trophy];
  return icons[idx % icons.length];
}

function buildFlowFromPhases(phases) {
  const norm = normalizePhases(phases);
  const nodes = norm.map((p, idx) => {
    const Icon = getPhaseIcon(idx);
    return {
      id: p.id,
      position: { x: idx * 320 + 50, y: 80 },
      data: {
        labelText: p.phase,
        detailsText: p.details,
        label: (
          <div className="flex gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-sm">{p.phase}</div>
              <div className="text-xs text-gray-600">{p.details}</div>
            </div>
          </div>
        ),
      },
      style: {
        padding: 12,
        width: 280,
        borderRadius: 16,
        background: "white",
        border: "1px solid #e5e7eb",
      },
    };
  });

  const edges = norm.slice(0, -1).map((p, i) => ({
    id: `e-${p.id}`,
    source: p.id,
    target: norm[i + 1].id,
    type: "smoothstep",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
    style: { stroke: "#3b82f6" },
  }));

  return { nodes, edges };
}

/* ------------------------------ UI ------------------------------ */
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border bg-white shadow-sm hover:shadow-md transition ${className}`}
  >
    {children}
  </div>
);

/* ------------------------------ main ------------------------------ */
export default function CareerPage() {
  const [step, setStep] = useState("start");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [previousResult, setPreviousResult] = useState(null);
  const [currentPart, setCurrentPart] = useState("partA");
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔒 LOCKS (IMPORTANT)
  const answeringRef = useRef(false);
  const submittingRef = useRef(false);

  /* ------------------------------ effects ------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const res = await getCareerEvaluation();
        setPreviousResult(res);
      } catch {}
    })();
  }, []);

  const totalQ =
    (quiz?.partA?.length || 0) + (quiz?.partB?.length || 0);
  const answeredQ =
    Object.keys(answers.partA || {}).length +
    Object.keys(answers.partB || {}).length;

  /* ------------------------------ handlers ------------------------------ */
  const handleStart = async () => {
    setLoading(true);
    try {
      const q = await generateQuiz();
      setQuiz(q);
      setStep("quiz");
      setCurrentIndex(0);
      setCurrentPart("partA");
      setAnswers({});
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    if (answeringRef.current || loading) return;
    answeringRef.current = true;

    const q =
      currentPart === "partA"
        ? quiz.partA[currentIndex]
        : quiz.partB[currentIndex];

    setAnswers((prev) => ({
      ...prev,
      [currentPart]: {
        ...(prev[currentPart] || {}),
        [q.id]: option,
      },
    }));

    setTimeout(() => {
      if (currentPart === "partA" && currentIndex < quiz.partA.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (currentPart === "partA") {
        setCurrentPart("partB");
        setCurrentIndex(0);
      } else if (currentIndex < quiz.partB.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        handleSubmit();
      }
      answeringRef.current = false;
    }, 250);
  };

  const handleSubmit = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    setLoading(true);
    try {
      const res = await evaluateAnswers(answers);
      setResult(res);
      setSelectedField(res?.topFields?.[0] || null);
      setStep("result");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  /* ------------------------------ memo ------------------------------ */
  const radarData = useMemo(() => {
    const fields = result?.topFields || previousResult?.topFields || [];
    return fields.map((f, i) => ({
      field: f,
      score: 90 - i * 6,
    }));
  }, [result, previousResult]);

  const { nodes, edges } = useMemo(() => {
    const src = result || previousResult;
    if (!src || !selectedField) return { nodes: [], edges: [] };
    return buildFlowFromPhases(src.roadmaps?.[selectedField] || []);
  }, [result, previousResult, selectedField]);

  /* ------------------------------ render ------------------------------ */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {step === "start" && (
          <Card className="p-10 text-center space-y-6">
            <h1 className="text-3xl font-bold">Career Interest Mapping</h1>
            <p className="text-gray-600">
              AI-powered quiz to find your ideal IT career
            </p>
            <button
              onClick={handleStart}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Start Quiz
            </button>
          </Card>
        )}

        {step === "quiz" && quiz && (
          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-6">
              {currentPart === "partA"
                ? quiz.partA[currentIndex].question
                : quiz.partB[currentIndex].question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentPart === "partA"
                ? quiz.partA[currentIndex].options
                : quiz.partB[currentIndex].options
              ).map((opt) => (
                <motion.button
                  key={opt}
                  disabled={loading || answeringRef.current}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(opt)}
                  className="border rounded-xl px-6 py-4 text-left hover:bg-blue-50 disabled:opacity-50"
                >
                  {opt}
                </motion.button>
              ))}
            </div>

            <p className="mt-6 text-sm text-gray-500">
              {answeredQ}/{totalQ} answered
            </p>
          </Card>
        )}

        {(step === "result" || selectedField) && (result || previousResult) && (
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">Your Career Analysis</h2>
            <p>{result?.summary || previousResult?.summary}</p>

            <div className="h-72">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="field" />
                  <Radar dataKey="score" fill="#3b82f6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[400px] border rounded-xl">
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background />
                <MiniMap />
                <Controls />
              </ReactFlow>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
