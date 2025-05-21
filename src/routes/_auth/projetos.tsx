import axiosBase from "@/axios/axios";
import { AppBar, Box, Typography, Stack, Toolbar, useTheme, Container, List, ListItemButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ProjetoType } from "types";

export const Route = createFileRoute("/_auth/projetos")({
    component: RouteComponent,
});

function RouteComponent() {
    const theme = useTheme();

    const { data: projetos, isLoading } = useQuery({
        queryKey: ["projetos"],
        queryFn: async () => {
            return await axiosBase("/projeto").then((res) => res.data);
        },
    });

    const navigate = useNavigate();

    return (
        <>
            <AppBar position="fixed" elevation={1}>
                <Toolbar sx={{ display: "grid", gridTemplateColumns: "70% 30%", backgroundColor: "white", color: "black" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="h6" noWrap component="div">
                            Bem-vindo!
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems={"center"} spacing={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography>User</Typography>
                        <img src="/profileDefault.png" alt="User" width="30" />
                    </Stack>
                </Toolbar>
            </AppBar>

            <Box sx={{ ...theme.mixins.toolbar }}></Box>

            <Container sx={{ mt: 2 }}>
                <Typography variant="h5">Projetos</Typography>
                {isLoading && <Typography>Carregando projetos...</Typography>}
                {!isLoading && (
                    <>
                        <List>
                            {projetos.map((projeto: ProjetoType) => (
                                <ListItemButton onClick={() => navigate({ to: "/$slug/home", params: { slug: projeto.slug }, })}>
                                    {projeto.nome}
                                </ListItemButton>
                            ))}
                        </List>
                    </>
                )}
            </Container>
        </>
    );
}
