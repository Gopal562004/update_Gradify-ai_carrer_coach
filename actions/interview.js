"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function getInternalUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found");
  return user;
}

export async function generateQuiz() {
  const user = await getInternalUser();

  const prompt = `
    Generate 10 technical interview questions for a ${user.industry}${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }. Each should be multiple choice with 4 options. Return ONLY:

  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string",
        "explanation": "string"
      }
    ]
  }
  `;

  try {
    const result = await model.generateContent(prompt);
    const cleaned = result.response
      .text()
      .replace(/```(?:json)?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    return parsed.questions;
  } catch (error) {
    console.error("❌ Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const user = await getInternalUser();

  const questionResults = questions.map((q, i) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[i],
    isCorrect: q.correctAnswer === answers[i],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
  let improvementTip = null;

  if (wrongAnswers.length > 0) {
    const wrongText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical questions wrong:

      ${wrongText}

      Give a short, helpful 2-sentence improvement tip. Avoid repeating mistakes.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);
      improvementTip = tipResult.response.text().trim();
    } catch (error) {
      console.error("⚠️ AI tip generation failed:", error);
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        category: "Technical",
        questions: questionResults,
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("❌ Error saving result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const user = await getInternalUser();

  try {
    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    return assessments.map((a) => ({
      ...a,
      questions: JSON.parse(JSON.stringify(a.questions)), // fix JsonValue issue
    }));
  } catch (error) {
    console.error("❌ Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
