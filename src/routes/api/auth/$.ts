import { createServerFileRoute } from "@tanstack/react-start/server"
import { auth } from "@/lib/auth";

export const ServerRoute = createServerFileRoute("/api/auth/$").methods({
  GET: ({ request }) => auth.handler(request),
  POST: ({ request }) => auth.handler(request),
});
