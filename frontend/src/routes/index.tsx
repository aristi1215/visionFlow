import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <section className="page">
      <h1>Home</h1>
      <p>
        TanStack Router file-based routes. Edit{" "}
        <code>src/routes/index.tsx</code> to customize this page.
      </p>
    </section>
  );
}
