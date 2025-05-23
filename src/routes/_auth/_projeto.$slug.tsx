import OrionDrawer from "@/components/Drawer/OrionDrawer";
import OrionAppBar from "@/components/AppBars/OrionAppBar";
import ProjectContextProvider from "@/contexts/projectContext";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_auth/_projeto/$slug")({
    component: RouteComponent,
});

function RouteComponent() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const { slug } = Route.useParams();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <ProjectContextProvider slug={slug}>
            <Box sx={{ display: "flex" }}>
                {/* TODO: ADICIONAR TELA DE LOAD PARA PROJETO CARREGANDO */}
                <OrionAppBar open={open} />
                <OrionDrawer handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} open={open} />
                <Box component="main" sx={{ width: "100%" }}>
                    <Box sx={{ ...theme.mixins.toolbar }} />
                    <Outlet />
                </Box>
            </Box>
        </ProjectContextProvider>
    );
}
