"use server"

import { prisma } from "@/lib/prisma"
import { calculateCO2Saved, calculateLandfillDiverted, calculateEnergySaved } from "@/lib/utils"

export async function getImpactStats() {
  try {
    const completed = await prisma.collectionAssignment.aggregate({
      _sum: { actualWeight: true },
      where: { status: "COMPLETED" },
    })

    const totalPlasticRecycled = completed._sum.actualWeight ?? 0

    return {
      success: true,
      data: {
        totalPlasticRecycled,
        totalCO2Saved: calculateCO2Saved(totalPlasticRecycled),
        totalLandfillDiverted: calculateLandfillDiverted(totalPlasticRecycled),
        totalEnergySaved: calculateEnergySaved(totalPlasticRecycled),
      },
    }
  } catch (error) {
    console.error("Error fetching impact stats:", error)
    return { success: false, error: "Erreur lors du chargement des statistiques d'impact" }
  }
}

export async function getMonthlyImpact() {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)

    const assignments = await prisma.collectionAssignment.findMany({
      where: {
        status: "COMPLETED",
        completedAt: { gte: sixMonthsAgo },
      },
      select: { actualWeight: true, completedAt: true },
      orderBy: { completedAt: "asc" },
    })

    const now = new Date()

    const monthlyBreakdown = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const monthStr = month.toLocaleString("fr-FR", { month: "short" })

      const monthAssignments = assignments.filter((a: { actualWeight: number | null; completedAt: Date | null }) => {
        if (!a.completedAt) return false
        const d = new Date(a.completedAt)
        return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()
      })

      const monthWeight = monthAssignments.reduce((sum: number, a: { actualWeight: number | null }) => sum + (a.actualWeight ?? 0), 0)

      return {
        month: monthStr,
        plasticRecycled: monthWeight,
        co2Saved: calculateCO2Saved(monthWeight),
        landfillDiverted: calculateLandfillDiverted(monthWeight),
        energySaved: calculateEnergySaved(monthWeight),
      }
    })

    return { success: true, data: monthlyBreakdown }
  } catch (error) {
    console.error("Error fetching monthly impact:", error)
    return { success: false, error: "Erreur lors du chargement des données mensuelles" }
  }
}
