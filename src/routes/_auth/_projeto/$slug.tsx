import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_projeto/$slug")({
    component: RouteComponent,
});

function RouteComponent() {
    const { slug } = useParams({ from: "/_auth/_projeto/$slug" });

    console.log({ slug });
    return <div>children</div>;
}
