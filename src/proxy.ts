import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Next.js 16: usa proxy.ts invece di middleware.ts
export const proxy = withAuth(
  function proxy(req) {
    // Token vuoto = sessione invalidata da passwordChangedAt
    if (!req.nextauth.token?.id) {
      return NextResponse.redirect(
        new URL("/login?sessione=scaduta", req.url)
      );
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token?.id,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
