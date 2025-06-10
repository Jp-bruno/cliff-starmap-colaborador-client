import axiosBase from "@/axios/axios";
import { Box, Typography, useTheme, Container, List, ListItemButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ProjetoType } from "@/types";
import { useState } from "react";

export const Route = createFileRoute("/_auth/projetos")({
    component: Projetos,
});

function Projetos() {
    const theme = useTheme();

    const { data: projetos, isLoading } = useQuery({
        queryKey: ["projetos"],
        queryFn: async () => {
            return await axiosBase("/projeto").then((res) => res.data);
        },
    });

    const navigate = useNavigate();

    const [loadingPage, setLoadingPage] = useState(false);

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
                                    disabled={loadingPage}
                                    key={projeto._id}
                                    onClick={() => {
                                        setLoadingPage(true);
                                        navigate({ to: "/$slug/home", params: { slug: projeto.slug } });
                                    }}
                                >
                                    {projeto.nome}
                                </ListItemButton>
                            ))}
                        </List>
                    </>
                )}
                {loadingPage && <Typography>Carregando projeto, aguarde...</Typography>}
            </Container>
        </>
    );
}
