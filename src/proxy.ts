import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const user = req.auth?.user as any

  const isAuth = !!user
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")

  const adminRoutes = pathname.startsWith("/dashboard/admin")
  const collectorRoutes = pathname.startsWith("/dashboard/collector")
  const clientRoutes = pathname.startsWith("/dashboard/client")

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (!isAuth && (adminRoutes || collectorRoutes || clientRoutes)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAuth) {
    if (adminRoutes && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    if (collectorRoutes && user.role !== "COLLECTOR") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    if (clientRoutes && user.role !== "CLIENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
