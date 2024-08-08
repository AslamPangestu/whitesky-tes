import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "src/config";
import type { JWTPayloadType } from "src/dto/UserDTO";

export const middleware = (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/profile")) {
    try {
      const tokenCookies = request.cookies.get("token");
      const token = tokenCookies?.value || "";
      jwt.verify(token, JWT_SECRET) as JWTPayloadType;
    } catch (error) {
      console.error("Middleware Page Error", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/auth/profile")) {
    try {
      const headersList = headers();
      const token = headersList.get("Authorization") || "";
      jwt.verify(token, JWT_SECRET) as JWTPayloadType;
    } catch (error) {
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
  matcher: ["/api/auth/profile", "/profile"],
};
