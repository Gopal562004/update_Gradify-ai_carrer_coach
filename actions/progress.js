"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// ==================== HELPERS ====================
async function getInternalUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found");
  return user;
}

// ==================== GET ROADMAP PROGRESS ====================
export async function getRoadmapProgress(field) {
  const user = await getInternalUser();

  const progress = await db.roadmapProgress.findMany({
    where: { userId: user.id, field },
    orderBy: { phaseIndex: "asc" },
  });

  return progress;
}

// ==================== TOGGLE PHASE COMPLETION ====================
export async function togglePhaseCompletion(field, phaseIndex, phaseTitle) {
  const user = await getInternalUser();

  // Check if record exists
  const existing = await db.roadmapProgress.findUnique({
    where: {
      userId_field_phaseIndex: {
        userId: user.id,
        field,
        phaseIndex,
      },
    },
  });

  if (existing) {
    // Toggle completion
    const updated = await db.roadmapProgress.update({
      where: { id: existing.id },
      data: {
        completed: !existing.completed,
        completedAt: !existing.completed ? new Date() : null,
      },
    });

    // Create notification on completion
    if (updated.completed) {
      try {
        await db.notification.create({
          data: {
            userId: user.id,
            type: "milestone_complete",
            title: "Milestone Completed! 🎉",
            message: `You completed "${phaseTitle}" in ${field}. Keep up the great progress!`,
            link: "/gemini_res",
          },
        });
      } catch (err) {
        console.warn("Failed to create milestone notification:", err);
      }
    }

    return updated;
  } else {
    // Create new completed record
    const created = await db.roadmapProgress.create({
      data: {
        userId: user.id,
        field,
        phaseIndex,
        phaseTitle,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Create notification
    try {
      await db.notification.create({
        data: {
          userId: user.id,
          type: "milestone_complete",
          title: "Milestone Completed! 🎉",
          message: `You completed "${phaseTitle}" in ${field}. Keep up the great progress!`,
          link: "/gemini_res",
        },
      });
    } catch (err) {
      console.warn("Failed to create milestone notification:", err);
    }

    return created;
  }
}

// ==================== GET OVERALL PROGRESS ====================
export async function getOverallProgress(field) {
  const user = await getInternalUser();

  const allPhases = await db.roadmapProgress.findMany({
    where: { userId: user.id, field },
  });

  const completedPhases = allPhases.filter((p) => p.completed);

  return {
    total: allPhases.length,
    completed: completedPhases.length,
    percentage:
      allPhases.length > 0
        ? Math.round((completedPhases.length / allPhases.length) * 100)
        : 0,
  };
}

// ==================== GET ALL ACTIVE ROADMAPS PROGRESS ====================
export async function getAllRoadmapProgress() {
  const user = await getInternalUser();

  const allProgress = await db.roadmapProgress.findMany({
    where: { userId: user.id },
    orderBy: [{ field: "asc" }, { phaseIndex: "asc" }],
  });

  // Group by field
  const grouped = {};
  for (const p of allProgress) {
    if (!grouped[p.field]) {
      grouped[p.field] = { total: 0, completed: 0, phases: [] };
    }
    grouped[p.field].total++;
    if (p.completed) grouped[p.field].completed++;
    grouped[p.field].phases.push(p);
  }

  // Calculate percentages
  const result = Object.entries(grouped).map(([field, data]) => ({
    field,
    total: data.total,
    completed: data.completed,
    percentage:
      data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    phases: data.phases,
  }));

  return result;
}
