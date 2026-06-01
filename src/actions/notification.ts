"use server"

import { prisma } from "@/lib/prisma"

export async function getUserNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return { success: true, data: notifications }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return { success: false, error: "Erreur lors du chargement des notifications" }
  }
}

export async function markAsRead(id: string) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    })
    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: "Erreur lors de la mise à jour" }
  }
}

export async function markAllAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, error: "Erreur lors de la mise à jour" }
  }
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = "INFO",
  link?: string
) {
  try {
    const notification = await prisma.notification.create({
      data: { userId, title, message, type, link },
    })
    return { success: true, data: notification }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { success: false, error: "Erreur lors de la création de la notification" }
  }
}
