import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user as any

  if (!user) redirect("/login")

  switch (user.role) {
    case "ADMIN":
      redirect("/dashboard/admin")
    case "COLLECTOR":
      redirect("/dashboard/collector")
    case "CLIENT":
    default:
      redirect("/dashboard/client")
  }
}
