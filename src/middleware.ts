import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";

import type { NextRequest } from "next/server";

import { verifyToken } from "src/libs/auth";

export const middleware = (request: NextRequest) => {
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register")
  ) {
    const cookieStore = cookies();
    const tokenCookies = cookieStore.get("token");
    const token = tokenCookies?.value || "";
    if (token) {
      const { error } = verifyToken(token);
      if (!error) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/profile")) {
    const cookieStore = cookies();
    const tokenCookies = cookieStore.get("token");

    const token = tokenCookies?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const { error } = verifyToken(token);
    if (error) {
      console.error("Middleware Page Error", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/auth/change-password")) {
    const headersList = headers();
    const token = headersList.get("Authorization");
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", data: null, error: null },
        { status: 401 },
      );
    }

    const { error } = verifyToken(token);
    if (error) {
      console.error("Middleware API Error", error);
      return NextResponse.json(
        { message: "Unauthorized", data: null, error: null },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/api/auth/change-password", "/profile", "/login", "/register"],
};
