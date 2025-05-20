import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_projeto")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            layout
            <Outlet />
        </div>
    );
}
