// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// تعریف مسیرهای عمومی که نیاز به احراز هویت ندارند
const publicPaths = ["/", "/auth/login", "/auth/register"];

// تعریف مسیرهای محافظت شده که نیاز به احراز هویت دارند
const protectedPaths = ["/dashboard"];

export async function middleware(request: NextRequest) {
  // دریافت توکن با تنظیمات کامل
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
    cookieName: "next-auth.session-token", // اضافه کردن نام دقیق کوکی
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

// تعریف دقیق‌تر matcher برای بهینه‌سازی عملکرد
export const config = {
  matcher: [
    // مسیرهای محافظت شده
    "/dashboard/:path*",
    // مسیرهای احراز هویت
    "/auth/:path*",
    // صفحه اصلی
    "/",
  ],
};
