import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = ["/", "/auth/login", "/auth/register"];
const protectedPaths = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
    cookieName: "next-auth.session-token",
  });

  const { pathname } = request.nextUrl;
  const isAuthenticated = !!token;
  const isAuthPage = pathname.startsWith("/auth");
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // console.log("Middleware Check:", {
  //   pathname,
  //   isAuthenticated,
  //   isAuthPage,
  //   token: token ? "exists" : "none",
  // });

  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated && isProtectedPath) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/"],
};
