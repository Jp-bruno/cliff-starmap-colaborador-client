import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import OrionAppBar from "@/components/OrionAppBar";
import OrionDrawer from "@/components/Drawer/OrionDrawer";
import ProjectContextProvider from "@/contexts/projectContext";
import DeleteConfirmPromptContextProvider from "@/contexts/deleteConfirmPromptContext";
import DeleteConfirmPrompt from "@/components/DeleteConfirmPrompt";

export const Route = createFileRoute("/_auth")({
    component: RouteComponent,
});

function RouteComponent() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <DeleteConfirmPromptContextProvider>
            <ProjectContextProvider>
                <DeleteConfirmPrompt />
                <Box sx={{ display: "flex" }}>
                    <OrionAppBar open={open} />
                    <OrionDrawer handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} open={open} />
                    <Box component="main" sx={{ width: "100%" }}>
                        <Box sx={{ ...theme.mixins.toolbar }} />
                        <Outlet />
                    </Box>
                </Box>
            </ProjectContextProvider>
        </DeleteConfirmPromptContextProvider>
    );
}
