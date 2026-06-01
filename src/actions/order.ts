"use server"

import { prisma } from "@/lib/prisma"

export async function createOrder(
  data: {
    items: { productId: string; quantity: number }[]
    address: string
    phone?: string
    notes?: string
  },
  userId: string
) {
  try {
    const productIds = data.items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    let total = 0
    const orderItems = data.items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p: { id: string }) => p.id === item.productId)
      if (!product) throw new Error(`Produit ${item.productId} non trouvé`)
      const subtotal = product.price * item.quantity
      total += subtotal
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      }
    })

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        address: data.address,
        phone: data.phone,
        notes: data.notes,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    })

    return { success: true, data: order }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Erreur lors de la création de la commande" }
  }
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, images: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: orders }
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return { success: false, error: "Erreur lors du chargement des commandes" }
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        payments: true,
      },
    })
    if (!order) return { success: false, error: "Commande non trouvée" }
    return { success: true, data: order }
  } catch (error) {
    console.error("Error fetching order:", error)
    return { success: false, error: "Erreur lors du chargement de la commande" }
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as any },
    })
    return { success: true, data: order }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: "Erreur lors de la mise à jour de la commande" }
  }
}

export async function cancelOrder(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    })

    if (!order) return { success: false, error: "Commande non trouvée" }

    if (order.status === "SHIPPED" || order.status === "DELIVERED") {
      return { success: false, error: "Impossible d'annuler une commande déjà expédiée ou livrée" }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED", paymentStatus: "REFUNDED" },
    })
    return { success: true, data: updated }
  } catch (error) {
    console.error("Error cancelling order:", error)
    return { success: false, error: "Erreur lors de l'annulation" }
  }
}
