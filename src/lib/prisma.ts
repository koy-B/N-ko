import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

// Configuration nécessaire pour les WebSockets dans l'environnement Node.js (Vercel)
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the environment variables. Please check your .env.local or Vercel settings.")
}

const pool = new Pool({ connectionString })
// On utilise 'any' ici pour éviter l'erreur de type spécifique au driver adapter dans certaines versions de TS/Prisma
const adapter = new PrismaNeon(pool as any)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
