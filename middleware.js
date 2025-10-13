import {
  auth,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/settings(.*)",
  "/profile(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware((req) => {
  // Prevent error if req.nextUrl is undefined
  if (!req.nextUrl) {
    return NextResponse.next();
  }

  const { userId } = auth(req);

  // Check if route is protected
  const pathname = req.nextUrl.pathname;

  if (!userId && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
