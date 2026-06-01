"use server"

import { prisma } from "@/lib/prisma"

export async function getAdminStats() {
  try {
    const [
      totalUsers,
      totalCollectors,
      completedWeight,
      productionAgg,
      totalOrders,
      orderRevenue,
      recentLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "COLLECTOR" } }),
      prisma.collectionAssignment.aggregate({
        _sum: { actualWeight: true },
        where: { status: "COMPLETED" },
      }),
      prisma.productionBatch.aggregate({
        _sum: { bricksProduced: true, revenue: true },
      }),
      prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.auditLog.findMany({
        take: 10,
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ])

    const totalCollections = await prisma.collectionRequest.count()

    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const monthlyOrders = await prisma.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    })

    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const monthStr = month.toLocaleString("fr-FR", { month: "short" })
      const revenue = monthlyOrders
        .filter((o: { total: number; createdAt: Date }) => {
          const d = new Date(o.createdAt)
          return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()
        })
        .reduce((sum: number, o: { total: number }) => sum + o.total, 0)
      return { month: monthStr, revenue }
    })

    const monthlyAssignments = await prisma.collectionAssignment.findMany({
      where: { status: "COMPLETED", completedAt: { gte: sixMonthsAgo } },
      select: { actualWeight: true, completedAt: true },
    })

    const wasteCollectionData = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const monthStr = month.toLocaleString("fr-FR", { month: "short" })
      const weight = monthlyAssignments
        .filter((a: { actualWeight: number | null; completedAt: Date | null }) => {
          if (!a.completedAt) return false
          const d = new Date(a.completedAt)
          return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()
        })
        .reduce((sum: number, a: { actualWeight: number | null }) => sum + (a.actualWeight ?? 0), 0)
      return { month: monthStr, weight }
    })

    const monthlyBatches = await prisma.productionBatch.findMany({
      where: { startedAt: { gte: sixMonthsAgo } },
      select: { bricksProduced: true, startedAt: true },
    })

    const productionData = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const monthStr = month.toLocaleString("fr-FR", { month: "short" })
      const bricks = monthlyBatches
        .filter((b: { bricksProduced: number; startedAt: Date }) => {
          const d = new Date(b.startedAt)
          return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()
        })
        .reduce((sum: number, b: { bricksProduced: number }) => sum + b.bricksProduced, 0)
      return { month: monthStr, bricks }
    })

    return {
      success: true,
      data: {
        totalUsers,
        totalCollectors,
        totalCollections,
        totalCollected: completedWeight._sum.actualWeight ?? 0,
        totalBricksProduced: productionAgg._sum.bricksProduced ?? 0,
        totalRevenue: orderRevenue._sum.total ?? 0,
        totalOrders,
        monthlyRevenue,
        wasteCollectionData,
        productionData,
        recentActivities: recentLogs.map((log: { id: string; action: string; user: { name: string | null }; createdAt: Date }) => ({
          id: log.id,
          action: log.action,
          user: log.user.name ?? "Inconnu",
          date: log.createdAt,
        })),
      },
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return { success: false, error: "Erreur lors du chargement des statistiques" }
  }
}

export async function getUsers(role?: string) {
  try {
    const where = role ? { role: role as any } : {}
    const users = await prisma.user.findMany({
      where,
      include: {
        clientProfile: true,
        collectorProfile: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Erreur lors du chargement des utilisateurs" }
  }
}

export async function getAuditLogs() {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: logs }
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return { success: false, error: "Erreur lors du chargement des logs" }
  }
}

export async function getProductionStats() {
  try {
    const batches = await prisma.productionBatch.findMany({
      include: {
        plasticStock: true,
        outputs: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const stats = batches.reduce(
      (acc: { totalBatches: number; totalBricks: number; totalRevenue: number; totalCost: number; totalPlasticUsed: number }, b: { bricksProduced: number; revenue: number; cost: number; plasticUsed: number }) => ({
        totalBatches: acc.totalBatches + 1,
        totalBricks: acc.totalBricks + b.bricksProduced,
        totalRevenue: acc.totalRevenue + b.revenue,
        totalCost: acc.totalCost + b.cost,
        totalPlasticUsed: acc.totalPlasticUsed + b.plasticUsed,
      }),
      { totalBatches: 0, totalBricks: 0, totalRevenue: 0, totalCost: 0, totalPlasticUsed: 0 }
    )

    return { success: true, data: { batches, stats } }
  } catch (error) {
    console.error("Error fetching production stats:", error)
    return { success: false, error: "Erreur lors du chargement des statistiques de production" }
  }
}

export async function getFinancialStats() {
  try {
    const allOrders = await prisma.order.findMany({
      where: { status: { not: "CANCELLED" } },
      select: { total: true, paymentStatus: true, createdAt: true },
    })

    const paidOrders = allOrders.filter((o: { paymentStatus: string; total: number }) => o.paymentStatus === "PAID")
    const totalRevenue = paidOrders.reduce((sum: number, o: { total: number }) => sum + o.total, 0)
    const pendingRevenue = allOrders
      .filter((o: { paymentStatus: string; total: number }) => o.paymentStatus === "PENDING")
      .reduce((sum: number, o: { total: number }) => sum + o.total, 0)

    const productionCosts = await prisma.productionBatch.aggregate({
      _sum: { cost: true },
    })

    const totalCost = productionCosts._sum.cost ?? 0

    return {
      success: true,
      data: {
        totalRevenue,
        pendingRevenue,
        totalCost,
        profit: totalRevenue - totalCost,
        totalOrders: allOrders.length,
        paidOrders: paidOrders.length,
      },
    }
  } catch (error) {
    console.error("Error fetching financial stats:", error)
    return { success: false, error: "Erreur lors du chargement des statistiques financières" }
  }
}
