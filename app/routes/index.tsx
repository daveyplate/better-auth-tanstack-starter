import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="flex grow flex-col text-center">
      <p>
        New Company? <a href="/company-signup">Sign up your Company</a>
      </p>
    </div>
  );
}
