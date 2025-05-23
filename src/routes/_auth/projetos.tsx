import axiosBase from "@/axios/axios";
import { Box, Typography, useTheme, Container, List, ListItemButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ProjetoType } from "@/types";

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
            <Box sx={{ ...theme.mixins.toolbar }}></Box>

            <Container sx={{ mt: 2 }}>
                <Typography variant="h5">Projetos</Typography>
                {isLoading && <Typography>Carregando projetos...</Typography>}
                {!isLoading && (
                    <>
                        <List>
                            {projetos.map((projeto: ProjetoType) => (
                                <ListItemButton
                                    key={projeto._id}
                                    onClick={() => {
                                        navigate({ to: "/$slug/home", params: { slug: projeto.slug } });
                                    }}
                                >
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
