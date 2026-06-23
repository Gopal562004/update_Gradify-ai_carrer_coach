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

// ==================== GET USER NOTIFICATIONS ====================
export async function getUserNotifications(limit = 20) {
  const user = await getInternalUser();

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const unreadCount = await db.notification.count({
    where: { userId: user.id, read: false },
  });

  return { notifications, unreadCount };
}

// ==================== MARK NOTIFICATION READ ====================
export async function markNotificationRead(notificationId) {
  const user = await getInternalUser();

  const notification = await db.notification.findFirst({
    where: { id: notificationId, userId: user.id },
  });

  if (!notification) throw new Error("Notification not found");

  return db.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

// ==================== MARK ALL READ ====================
export async function markAllNotificationsRead() {
  const user = await getInternalUser();

  await db.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  return { success: true };
}

// ==================== CREATE NOTIFICATION ====================
export async function createNotification(userId, type, title, message, link) {
  return db.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link: link || null,
    },
  });
}
