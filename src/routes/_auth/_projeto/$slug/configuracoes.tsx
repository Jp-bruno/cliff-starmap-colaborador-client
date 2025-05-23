import { useProjetoContext } from "@/contexts/projectContext";
import { Container, Grid, Paper } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import ContatosList from "@/components/Configuracao/ContatosList";
import ClientesList from "@/components/Configuracao/ClientesList";
import ColaboradoresList from "@/components/Configuracao/ColaboradoresList";
import FasesList from "@/components/Configuracao/FasesList";

export const Route = createFileRoute("/_auth/_projeto/$slug/configuracoes")({
    component: RouteComponent,
});

const PaperStyles = { p: 2, pt: 0 };

function RouteComponent() {
    const { isLoading, projeto } = useProjetoContext();

    if (isLoading) {
        return null;
    }

    return (
        <Container sx={{ py: 10 }}>
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Paper sx={PaperStyles} elevation={8}>
                        <FasesList fases={projeto!.fases} />
                    </Paper>
                </Grid>
                <Grid size={6}>
                    <Paper sx={PaperStyles} elevation={8}>
                        <ContatosList contatos={projeto!.contatos} />
                    </Paper>
                </Grid>
                <Grid size={6}>
                    <Paper sx={PaperStyles} elevation={8}>
                        <ClientesList clientes={projeto!.clientes} />
                    </Paper>
                </Grid>
                <Grid size={6}>
                    <Paper sx={PaperStyles} elevation={8}>
                        <ColaboradoresList colaboradors={projeto!.colaboradores} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
