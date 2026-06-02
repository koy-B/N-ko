import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

// Configuration WebSockets pour Node.js
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws
}

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error("CRITICAL: DATABASE_URL is missing from environment variables.")
    return new PrismaClient()
  }

  // Si c'est une URL Neon (contient neon.tech)
  if (connectionString.includes("neon.tech")) {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool as any)
    return new PrismaClient({ adapter })
  }

  // Fallback standard (pour le dev local avec SQLite par exemple)
  return new PrismaClient()
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
