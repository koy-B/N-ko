"use server"

import { prisma } from "@/lib/prisma"

export type ProductFormData = {
  name: string
  slug: string
  description?: string
  price: number
  categoryId: string
  images?: string[]
  stock?: number
  weight?: number
  dimensions?: string
  colors?: string[]
}

export async function getProducts(categorySlug?: string) {
  try {
    const where = categorySlug
      ? { category: { slug: categorySlug }, isActive: true }
      : { isActive: true }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: products }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { success: false, error: "Erreur lors du chargement des produits" }
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!product) return { success: false, error: "Produit non trouvé" }
    return { success: true, data: product }
  } catch (error) {
    console.error("Error fetching product:", error)
    return { success: false, error: "Erreur lors du chargement du produit" }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    })
    return { success: true, data: categories }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: "Erreur lors du chargement des catégories" }
  }
}

export async function createProduct(data: ProductFormData) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        images: JSON.stringify(data.images ?? []),
        stock: data.stock ?? 0,
        weight: data.weight,
        dimensions: data.dimensions,
        colors: JSON.stringify(data.colors ?? []),
      },
    })
    return { success: true, data: product }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, error: "Erreur lors de la création du produit" }
  }
}

export async function updateProduct(id: string, data: Partial<ProductFormData>) {
  try {
    const updateData: Record<string, unknown> = { ...data }
    if (data.images) updateData.images = JSON.stringify(data.images)
    if (data.colors) updateData.colors = JSON.stringify(data.colors)

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })
    return { success: true, data: product }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, error: "Erreur lors de la mise à jour du produit" }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Erreur lors de la suppression du produit" }
  }
}
