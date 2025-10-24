import { AuthView } from "@daveyplate/better-auth-ui"
import { createFileRoute } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

export const Route = createFileRoute("/auth/$path")({
    component: RouteComponent
})

function RouteComponent() {
    const { path } = Route.useParams()

    return (
        <main className="container items-center gap-4 flex flex-col mx-auto my-auto p-4 md:p-6">
            <AuthView path={path} />

            <p
                className={cn(
                    ["callback", "sign-out"].includes(path) && "hidden",
                    "text-muted-foreground text-xs"
                )}
            >
                Powered by{" "}
                <a
                    className="text-warning underline"
                    href="https://better-auth.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    better-auth.
                </a>
            </p>
        </main>
    )
}
