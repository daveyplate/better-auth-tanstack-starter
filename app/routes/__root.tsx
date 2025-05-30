import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Header } from "@/components/header";
import globalsCss from "@/styles/globals.css?url";
import { Providers } from "../providers";

function NotFound() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Better Auth TanStack Starter",
      },
    ],
    links: [
      { rel: "stylesheet", href: globalsCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="initial-scale=1, viewport-fit=cover, width=device-width"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="oklch(1 0 0)"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="oklch(0.145 0 0)"
        />

        <HeadContent />
      </head>

      <body>
        <Providers>
          <div className="flex min-h-svh flex-col">
            <Header />

            {children}
          </div>
        </Providers>

        <Scripts />
      </body>
    </html>
  );
}
