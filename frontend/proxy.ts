
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const visitorToken =
    request.cookies.get("visitorAccessToken")?.value;

  const staffToken =
    request.cookies.get("staffAccessToken")?.value;

  const isVisitorDashboard = pathname.startsWith("/dashboard");
  const isVisitorLogin = pathname === "/login";
  const isVisitorSignup = pathname.startsWith("/signup");

  const isManagementPage = pathname.startsWith("/management");
  const isStaffLogin = pathname === "/management/login";

  // Protect visitor dashboard
  if (isVisitorDashboard && !visitorToken) {
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }

  // Redirect logged-in visitors away from visitor login/signup
  if (
    (isVisitorLogin || isVisitorSignup) &&
    visitorToken
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  // Protect staff management pages, except staff login
  if (isManagementPage && !isStaffLogin && !staffToken) {
    return NextResponse.redirect(
      new URL("/management/login", request.url),
    );
  }

  // Redirect logged-in staff away from staff login
  if (isStaffLogin && staffToken) {
    return NextResponse.redirect(
      new URL("/management/dashboard", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/management/:path*",
  ],
};
