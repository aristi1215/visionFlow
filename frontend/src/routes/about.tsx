import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="page">
      <h1>About</h1>
      <p>
        Example route at <code>/about</code>. Add more files under{" "}
        <code>src/routes/</code> and the route tree will regenerate on dev.
      </p>
    </section>
  );
}
