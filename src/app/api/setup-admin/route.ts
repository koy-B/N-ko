import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const adminPassword = await hash("Admin123!", 12)

    const admin = await prisma.user.upsert({
      where: { email: "admin@nekogreen.com" },
      update: {
        role: "ADMIN",
        isActive: true,
      },
      create: {
        name: "Admin Neko Green",
        email: "admin@nekogreen.com",
        password: adminPassword,
        role: "ADMIN",
        isActive: true,
      },
    })

    return NextResponse.json({
      message: "Admin user created/updated successfully",
      email: admin.email,
      password: "Admin123! (Please change it after first login)"
    })
  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to create admin",
      details: error.message
    }, { status: 500 })
  }
}
