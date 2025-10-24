// import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import devtoolsJson from "vite-plugin-devtools-json"
import viteTsConfigPaths from "vite-tsconfig-paths"

const config = defineConfig({
    plugins: [
        viteTsConfigPaths({
            projects: ["./tsconfig.json"]
        }),
        tailwindcss(),
        tanstackStart(),
        nitro(),
        viteReact(),
        devtoolsJson()
    ]
})

export default config
