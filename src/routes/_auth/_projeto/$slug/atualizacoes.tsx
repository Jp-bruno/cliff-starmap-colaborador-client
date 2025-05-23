import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import { useProjetoContext } from "@/contexts/projectContext";
import { Box, Container, Divider, List, ListItem, ListItemText, ListSubheader, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import type { AtualizacaoType } from "@/types";

export const Route = createFileRoute("/_auth/_projeto/$slug/atualizacoes")({
    component: RouteComponent,
});

function RouteComponent() {
    const { faseSelecionada } = useProjetoContext();

    return (
        <Container>
            <HorizontalNavigation />
            <Box>
                <Typography variant="h5" textAlign={"center"} sx={{ my: 5 }}>
                    Atualizações
                </Typography>

                <Divider />

                <List>
                    {faseSelecionada?.atualizacoes.length === 0 && <ListSubheader sx={{ textAlign: "center" }}>Sem atualizações</ListSubheader>}
                    {faseSelecionada?.atualizacoes.map((atualizacao: AtualizacaoType) => (
                        <ListItem>
                            <ListItemText>
                                {atualizacao.data} {atualizacao.descricao}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
}
