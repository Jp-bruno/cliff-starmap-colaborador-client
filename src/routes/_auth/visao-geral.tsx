import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import { Container } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/visao-geral")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Container>
            <HorizontalNavigation />
        </Container>
    );
}
