import { NextResponse, type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

const protectedRoutes = ["/dashboard", "/doctors", "/patients"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // send api requests to the backend
  if (pathname.startsWith("/api")) {
    return NextResponse.rewrite(new URL(pathname + search, BACKEND_URL));
  }

  const token = request.cookies.get("doctor_tracker_token")?.value;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
