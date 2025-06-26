import { createFileRoute } from "@tanstack/react-router"
import logo from "../logo.svg"

export const Route = createFileRoute("/")({
    component: App
})

function App() {
    return (
        <div className="flex grow flex-col text-center">
            <header className="flex grow flex-col items-center justify-center text-[calc(10px+2vmin)]">
                <img
                    src={logo}
                    className="pointer-events-none h-[40vmin] animate-[spin_20s_linear_infinite]"
                    alt="logo"
                />

                <p>
                    Edit <code>app/routes/index.tsx</code> and save to reload.
                </p>

                <a
                    className="text-[#61dafb] hover:underline"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>

                <a
                    className="text-[#61dafb] hover:underline"
                    href="https://tanstack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn TanStack
                </a>
            </header>
        </div>
    )
}
