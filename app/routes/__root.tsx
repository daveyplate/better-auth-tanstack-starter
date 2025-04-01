import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import globalsCss from "@/styles/globals.css?url"
import { Providers } from "../providers"

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: "utf-8"
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            {
                title: "Better Auth TanStack Starter"
            }
        ],
        links: [
            { rel: "stylesheet", href: globalsCss },
            { rel: "icon", href: "/favicon.ico" },
            { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
            { rel: "manifest", href: "/manifest.webmanifest" }
        ]
    }),
    component: RootComponent
})

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>

            <body>
                <Providers>
                    <div className="flex min-h-svh flex-col">
                        <Header />

                        {children}
                    </div>
                </Providers>
                <Toaster />
                <Scripts />
            </body>
        </html>
    )
}
