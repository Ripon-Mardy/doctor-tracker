import { Suspense } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

function PageFallback() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading page">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-100" />
      <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* both read usePathname(), which also needs a Suspense boundary */}
        <Suspense
          fallback={
            <div className="hidden w-60 shrink-0 border-r border-gray-200 bg-white md:block" />
          }
        >
          <Sidebar />
        </Suspense>
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="h-14 border-b border-gray-200 bg-white" />
            }
          >
            <Header />
          </Suspense>
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
            {/* Pages read the current date (date pickers, "today" stats), which
              cacheComponents only allows inside a Suspense boundary. */}
            <Suspense fallback={<PageFallback />}>{children}</Suspense>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
