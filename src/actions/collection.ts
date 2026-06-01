"use server"

import { prisma } from "@/lib/prisma"

export type CollectionFormData = {
  address: string
  latitude?: number
  longitude?: number
  wasteType: string
  estimatedWeight: number
  photos?: string[]
  comment?: string
  scheduledDate?: Date
}

export async function createCollectionRequest(data: CollectionFormData, clientId: string) {
  try {
    const collection = await prisma.collectionRequest.create({
      data: {
        clientId,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        wasteType: data.wasteType,
        estimatedWeight: data.estimatedWeight,
        photos: JSON.stringify(data.photos ?? []),
        comment: data.comment,
        scheduledDate: data.scheduledDate,
      },
    })
    return { success: true, data: collection }
  } catch (error) {
    console.error("Error creating collection request:", error)
    return { success: false, error: "Erreur lors de la création de la demande" }
  }
}

export async function assignCollection(collectionId: string, collectorId: string) {
  try {
    const assignment = await prisma.collectionAssignment.create({
      data: { collectionId, collectorId },
    })

    await prisma.collectionRequest.update({
      where: { id: collectionId },
      data: { status: "ASSIGNED" },
    })

    await prisma.notification.create({
      data: {
        userId: collectorId,
        title: "Nouvelle mission",
        message: "Une nouvelle collecte vous a été assignée",
        type: "ASSIGNMENT",
        link: `/collector/missions/${assignment.id}`,
      },
    })

    return { success: true, data: assignment }
  } catch (error) {
    console.error("Error assigning collection:", error)
    return { success: false, error: "Erreur lors de l'assignation" }
  }
}

export async function startCollection(assignmentId: string) {
  try {
    const assignment = await prisma.collectionAssignment.update({
      where: { id: assignmentId },
      data: { status: "IN_PROGRESS", startedAt: new Date() },
    })

    await prisma.collectionRequest.update({
      where: { id: assignment.collectionId },
      data: { status: "IN_PROGRESS" },
    })

    return { success: true, data: assignment }
  } catch (error) {
    console.error("Error starting collection:", error)
    return { success: false, error: "Erreur lors du démarrage" }
  }
}

export async function completeCollection(
  assignmentId: string,
  data: {
    actualWeight: number
    photoProof?: string
    clientSignature?: string
    notes?: string
  }
) {
  try {
    const assignment = await prisma.collectionAssignment.update({
      where: { id: assignmentId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        actualWeight: data.actualWeight,
        photoProof: data.photoProof,
        clientSignature: data.clientSignature,
        notes: data.notes,
      },
      include: {
        collection: true,
        collector: { include: { collectorProfile: true } },
      },
    })

    await prisma.collectionRequest.update({
      where: { id: assignment.collectionId },
      data: { status: "COMPLETED" },
    })

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: assignment.collection.clientId },
    })

    if (clientProfile) {
      await prisma.clientProfile.update({
        where: { userId: assignment.collection.clientId },
        data: {
          totalCollected: { increment: data.actualWeight },
          totalCollections: { increment: 1 },
          totalSaved: { increment: data.actualWeight * 2 },
        },
      })

      const pointsEarned = Math.floor(data.actualWeight * 10)

      await prisma.user.update({
        where: { id: assignment.collection.clientId },
        data: { points: { increment: pointsEarned } },
      })

      await prisma.notification.create({
        data: {
          userId: assignment.collection.clientId,
          title: "Collecte terminée",
          message: `Votre collecte de ${data.actualWeight}kg a été complétée. Vous avez gagné ${pointsEarned} points !`,
          type: "SUCCESS",
          link: `/client/collections/${assignment.collection.id}`,
        },
      })
    }

    if (assignment.collector.collectorProfile) {
      await prisma.collectorProfile.update({
        where: { userId: assignment.collectorId },
        data: {
          totalCollected: { increment: data.actualWeight },
          totalMissions: { increment: 1 },
          totalEarned: { increment: data.actualWeight * 50 },
        },
      })
    }

    return { success: true, data: assignment }
  } catch (error) {
    console.error("Error completing collection:", error)
    return { success: false, error: "Erreur lors de la validation" }
  }
}

export async function cancelCollection(id: string) {
  try {
    await prisma.collectionAssignment.updateMany({
      where: { collectionId: id, status: { in: ["ASSIGNED", "IN_PROGRESS"] } },
      data: { status: "CANCELLED" },
    })

    await prisma.collectionRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    })

    return { success: true }
  } catch (error) {
    console.error("Error cancelling collection:", error)
    return { success: false, error: "Erreur lors de l'annulation" }
  }
}

export async function getClientCollections(clientId: string) {
  try {
    const collections = await prisma.collectionRequest.findMany({
      where: { clientId },
      include: {
        assignments: {
          include: {
            collector: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: collections }
  } catch (error) {
    console.error("Error fetching client collections:", error)
    return { success: false, error: "Erreur lors du chargement" }
  }
}

export async function getCollectorMissions(collectorId: string) {
  try {
    const missions = await prisma.collectionAssignment.findMany({
      where: { collectorId },
      include: { collection: true },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: missions }
  } catch (error) {
    console.error("Error fetching collector missions:", error)
    return { success: false, error: "Erreur lors du chargement" }
  }
}

export async function getAllCollections() {
  try {
    const collections = await prisma.collectionRequest.findMany({
      include: {
        client: { select: { id: true, name: true, email: true } },
        assignments: {
          include: {
            collector: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: collections }
  } catch (error) {
    console.error("Error fetching all collections:", error)
    return { success: false, error: "Erreur lors du chargement" }
  }
}
