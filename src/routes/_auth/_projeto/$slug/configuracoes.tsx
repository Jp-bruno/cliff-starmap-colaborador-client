import { useProjetoContext } from "@/contexts/projectContext";
import { Box, Container, List, ListSubheader, Paper } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import FaseListItem from "@/components/Configuracao/FaseListItem";
import ContatosList from "@/components/Configuracao/ContatosList";

export const Route = createFileRoute("/_auth/_projeto/$slug/configuracoes")({
    component: RouteComponent,
});

function RouteComponent() {
    const { isLoading, projeto } = useProjetoContext();

    if (isLoading) {
        return null;
    }

    return (
        <Container>
            <Box sx={{ pt: 3 }}>
                <Paper sx={{ p: 2, pt: 0 }} elevation={8}>
                    <List>
                        <ListSubheader>Fases do projeto</ListSubheader>
                        {projeto.fases.map((fase) => (
                            <FaseListItem key={fase._id} fase={fase} />
                        ))}
                    </List>
                </Paper>
            </Box>
            <Box sx={{ pt: 3 }}>
                <Paper sx={{ p: 2, pt: 0 }} elevation={8}>
                    <ContatosList contatos={projeto.contatos} />
                </Paper>
            </Box>
        </Container>
    );
}
