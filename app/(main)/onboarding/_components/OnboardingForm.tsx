// "use client";

// import React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Industry } from "@/data/industries";
// import useFetch from "@/hooks/use-fetch";
// import toast from "react-hot-toast";
// import { updateUser } from "@/actions/user";
// // import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";
// interface OnBoardingFormProps {
//   industries: Industry[];
// }

// const schema = z.object({
//   industryId: z.string().min(1, "Industry is required."),
//   subIndustry: z.string().min(1, "Specialization is required."),
//   experience: z.coerce
//     .number({
//       required_error: "Years of experience is required.",
//       invalid_type_error: "Enter a valid number.",
//     })
//     .nonnegative("Experience must be 0 or more."),
//   skills: z
//     .string()
//     .min(1, "Enter at least one skill.")
//     .refine((val) => val.split(",").length > 0, {
//       message: "Separate multiple skills with commas.",
//     }),
//   bio: z.string().min(1, "Professional bio is required."),
// });

// type FormData = z.infer<typeof schema>;

// const OnBoardingForm: React.FC<OnBoardingFormProps> = ({ industries }) => {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//   });

//   const selectedIndustryId = watch("industryId");
//   const selectedIndustryObject = industries.find(
//     (ind) => ind.id === selectedIndustryId
//   );

//   const { fn: updateUserFn, loading: updateLoading } = useFetch(updateUser);

//   const onSubmit = async (data: FormData) => {
//     const formData = {
//       industry: data.subIndustry,
//       experience: data.experience,
//       bio: data.bio,
//       skills: data.skills.split(",").map((s) => s.trim()),
//     };

//     try {
//       const res = await updateUserFn(formData);
//       if (res) {
//         toast.success("Profile updated!");
//         reset();
//         router.push("/dashboard");
//         // setTimeout(() => {
//         //   redirect("/dashboard");
//         // }, 1500); // 1.5 seconds delay
//       } else {
//         toast.error("Something went wrong.");

//       }
//     } catch (err) {
//       console.error("Failed to update user:", err);
//       toast.error("Something went wrong.");
//     }
//   };

//   const inputClass = (hasError: boolean) =>
//     `w-full px-4 py-2 bg-black border ${
//       hasError ? "border-red-500" : "border-zinc-700"
//     } rounded-lg focus:outline-none focus:ring-2 ${
//       hasError ? "focus:ring-red-500" : "focus:ring-blue-500"
//     }`;

//   return (
//     <div className="min-h-screen bg-black text-white flex justify-center items-center px-4 py-10">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full max-w-2xl bg-black rounded-2xl shadow-xl p-8 space-y-6 border border-zinc-800"
//       >
//         <div>
//           <h2 className="text-3xl font-semibold mb-2">Complete Your Profile</h2>
//           <p className="text-gray-400 text-sm">
//             Select your industry to get personalized career insights and
//             recommendations.
//           </p>
//         </div>

//         {/* Industry */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Industry</label>
//           <select
//             {...register("industryId")}
//             className={inputClass(!!errors.industryId)}
//           >
//             <option value="">-- Select Industry --</option>
//             {industries.map((industry) => (
//               <option key={industry.id} value={industry.id}>
//                 {industry.name}
//               </option>
//             ))}
//           </select>
//           {errors.industryId && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.industryId.message}
//             </p>
//           )}
//         </div>

//         {/* Sub-Industry */}
//         {selectedIndustryObject &&
//           selectedIndustryObject.subIndustries.length > 0 && (
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Specialization
//               </label>
//               <select
//                 {...register("subIndustry")}
//                 className={inputClass(!!errors.subIndustry)}
//               >
//                 <option value="">-- Select Sub-Industry --</option>
//                 {selectedIndustryObject.subIndustries.map((sub) => (
//                   <option key={sub} value={sub}>
//                     {sub}
//                   </option>
//                 ))}
//               </select>
//               {errors.subIndustry && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.subIndustry.message}
//                 </p>
//               )}
//             </div>
//           )}

//         {/* Experience */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Years of Experience
//           </label>
//           <input
//             type="number"
//             min={0}
//             {...register("experience")}
//             className={inputClass(!!errors.experience)}
//             placeholder="Enter your years of experience"
//           />
//           {errors.experience && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.experience.message}
//             </p>
//           )}
//         </div>

//         {/* Skills */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Skills</label>
//           <input
//             type="text"
//             {...register("skills")}
//             placeholder="e.g., JavaScript, React, Node.js"
//             className={inputClass(!!errors.skills)}
//           />
//           {errors.skills && (
//             <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
//           )}
//         </div>

//         {/* Bio */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Professional Bio
//           </label>
//           <textarea
//             rows={4}
//             {...register("bio")}
//             placeholder="Tell us about yourself..."
//             className={inputClass(!!errors.bio)}
//           />
//           {errors.bio && (
//             <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
//           )}
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className={`w-full transition py-3 rounded-lg font-semibold ${
//             updateLoading
//               ? "bg-gray-400 text-black cursor-not-allowed"
//               : "bg-white text-black hover:bg-gray-200"
//           }`}
//           disabled={updateLoading}
//         >
//           {updateLoading ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default OnBoardingForm;
// app/onboarding/_components/OnboardingForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Industry } from "@/data/industries";
import useFetch from "@/hooks/use-fetch";
import toast from "react-hot-toast";
import { updateUser } from "@/actions/user";
import { useRouter } from "next/navigation";
import {
  Building2,
  Briefcase,
  Award,
  Code2,
  User,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Sparkles
} from "lucide-react";

interface OnBoardingFormProps {
  industries: Industry[];
}

const schema = z.object({
  industryId: z.string().min(1, "Industry is required."),
  subIndustry: z.string().min(1, "Specialization is required."),
  experience: z.coerce
    .number({
      required_error: "Years of experience is required.",
      invalid_type_error: "Enter a valid number.",
    })
    .nonnegative("Experience must be 0 or more.")
    .max(50, "Experience seems too high."),
  skills: z
    .string()
    .min(1, "Enter at least one skill.")
    .refine((val) => val.split(",").length > 0, {
      message: "Separate multiple skills with commas.",
    }),
  bio: z.string().min(1, "Professional bio is required.").max(500, "Bio must be less than 500 characters."),
});

type FormData = z.infer<typeof schema>;

const OnBoardingForm: React.FC<OnBoardingFormProps> = ({ industries }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const selectedIndustryId = watch("industryId");
  const selectedIndustryObject = industries.find(
    (ind) => ind.id === selectedIndustryId
  );

  const { fn: updateUserFn, loading: updateLoading } = useFetch(updateUser);

  const onSubmit = async (data: FormData) => {
    const formData = {
      industry: data.subIndustry,
      experience: data.experience,
      bio: data.bio,
      skills: data.skills.split(",").map((s) => s.trim()),
    };

    try {
      const res = await updateUserFn(formData);
      if (res) {
        toast.success("Profile updated successfully! Welcome aboard! 🎉");
        reset();
        router.push("/dashboard");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 bg-white border-2 ${
      hasError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
    } rounded-xl focus:outline-none focus:ring-2 ${
      hasError ? "focus:ring-red-200" : "focus:ring-blue-200"
    } transition-all duration-200 text-gray-900 placeholder-gray-400`;

  const iconClass = "text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Complete Your Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Tell us about yourself to personalize your experience and unlock career opportunities
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm font-medium text-blue-600">60%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/5"></div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6"
        >
          {/* Industry */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              Industry
            </label>
            <div className="relative">
              <Building2 className={iconClass} />
              <select
                {...register("industryId")}
                className={`${inputClass(!!errors.industryId)} pl-11`}
              >
                <option value="">Select your industry</option>
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.industryId && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                {errors.industryId.message}
              </p>
            )}
          </div>

          {/* Sub-Industry */}
          {selectedIndustryObject &&
            selectedIndustryObject.subIndustries.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-green-500" />
                  Specialization
                </label>
                <div className="relative">
                  <Briefcase className={iconClass} />
                  <select
                    {...register("subIndustry")}
                    className={`${inputClass(!!errors.subIndustry)} pl-11`}
                  >
                    <option value="">Select your specialization</option>
                    {selectedIndustryObject.subIndustries.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.subIndustry && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

          {/* Experience */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              Years of Experience
            </label>
            <div className="relative">
              <Award className={iconClass} />
              <input
                type="number"
                min={0}
                max={50}
                {...register("experience")}
                className={`${inputClass(!!errors.experience)} pl-11`}
                placeholder="e.g., 3"
              />
            </div>
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-500" />
              Skills
            </label>
            <div className="relative">
              <Code2 className={iconClass} />
              <input
                type="text"
                {...register("skills")}
                placeholder="JavaScript, React, Node.js, TypeScript..."
                className={`${inputClass(!!errors.skills)} pl-11`}
              />
            </div>
            {errors.skills && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                {errors.skills.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-500" />
              Professional Bio
            </label>
            <div className="relative">
              <textarea
                rows={4}
                {...register("bio")}
                placeholder="Tell us about your professional journey, achievements, and aspirations..."
                className={inputClass(!!errors.bio)}
              />
            </div>
            <div className="flex justify-between items-center">
              {errors.bio ? (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  {errors.bio.message}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Share what makes you unique
                </p>
              )}
              <span className="text-xs text-gray-400">
                {watch('bio')?.length || 0}/500
              </span>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
                <p className="text-blue-700 text-sm">
                  Complete your profile to get personalized job recommendations and career insights tailored to your experience.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={updateLoading || !isValid}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              updateLoading || !isValid
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {updateLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up your profile...
              </>
            ) : (
              <>
                Complete Profile
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-center text-gray-500 text-sm">
            You can always update this information later in your profile settings
          </p>
        </form>
      </div>
    </div>
  );
};

export default OnBoardingForm;