import OrionDrawer from "@/components/Drawer/OrionDrawer";
import OrionAppBar from "@/components/OrionAppBar";
import ProjectContextProvider from "@/contexts/projectContext";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import axiosBase from "@/axios/axios";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_auth/_projeto/$slug")({
    component: RouteComponent,
});

function RouteComponent() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const { slug } = Route.useParams();

    const { data: projeto, isLoading } = useQuery({
        queryKey: ["projeto"],
        queryFn: async () => {
            return await axiosBase(`/projeto/${slug}`).then((res) => res.data);
        },
    });

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <ProjectContextProvider projeto={projeto}>
            <Box sx={{ display: "flex" }}>
                {/* TODO: ADICIONAR TELA DE LOAD PARA PROJETO CARREGANDO */}
                {!isLoading && (
                    <>
                        <OrionAppBar open={open} />
                        <OrionDrawer handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} open={open} />
                        <Box component="main" sx={{ width: "100%" }}>
                            <Box sx={{ ...theme.mixins.toolbar }} />
                            <Outlet />
                        </Box>
                    </>
                )}
            </Box>
        </ProjectContextProvider>
    );
}
