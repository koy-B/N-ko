import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

// Configuration WebSockets pour Node.js
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws
}

const createPrismaClient = () => {
  // FORCE DATABASE URL FOR DEBUGGING
  const connectionString = "postgresql://neondb_owner:npg_qaMX29lhgGYV@ep-jolly-paper-aqqds94t-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

  console.log("Using hardcoded connection string for Neon")
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool as any)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
