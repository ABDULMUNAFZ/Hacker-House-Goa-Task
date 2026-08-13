import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-goa-green px-4">
      <div className="max-w-md text-center">
        <h1 className="display-xl text-7xl text-goa-yellow">404</h1>
        <h2 className="label-cond mt-4 text-sm text-goa-cream">THIS PAGE ISN'T IN GOA</h2>
        <p className="mt-2 font-body text-sm text-goa-cream/75">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="hh-btn hh-btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-goa-green px-4">
      <div className="max-w-md text-center">
        <h1 className="display-xl text-4xl text-goa-yellow">THIS PAGE DIDN'T LOAD</h1>
        <p className="mt-2 font-body text-sm text-goa-cream/80">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="hh-btn hh-btn-primary"
          >
            Try again
          </button>
          <a href="/" className="hh-btn hh-btn-ghost">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "HH Goa 2026 — Frame Your Goa" },
      {
        name: "description",
        content:
          "Create your HH Goa 2026 Builder Card, frame your selfie, and share your Goa identity with #FrameInGoa.",
      },
      { name: "author", content: "Team Tech Mavericks" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Imbue:opsz,wght@10..100,100..900&family=Victor+Mono:ital,wght@0,100..700;1,100..700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" theme="dark" richColors closeButton />
    </QueryClientProvider>
  );
}
