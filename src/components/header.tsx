import { GitHubIcon, UserButton } from "@daveyplate/better-auth-ui"

import { Link } from "@tanstack/react-router"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/60 px-4 py-3 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <svg
                        className="size-5"
                        fill="none"
                        height="45"
                        viewBox="0 0 60 45"
                        width="60"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            className="fill-black dark:fill-white"
                            clipRule="evenodd"
                            d="M0 0H15V45H0V0ZM45 0H60V45H45V0ZM20 0H40V15H20V0ZM20 30H40V45H20V30Z"
                            fillRule="evenodd"
                        />
                    </svg>
                    BETTER-AUTH. STARTER
                </Link>

                <div className="flex items-center gap-2">
                    <a
                        href="https://github.com/daveyplate/better-auth-tanstack-starter"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Button variant="outline" size="icon" className="size-8 rounded-full">
                            <GitHubIcon />
                        </Button>
                    </a>

                    <ModeToggle />
                    <UserButton />
                </div>
            </div>
        </header>
    )
}
