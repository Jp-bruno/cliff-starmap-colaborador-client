import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/projetos")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_auth/projetos"!</div>;
}
