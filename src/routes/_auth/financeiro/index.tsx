import AddFolderModal from "@/components/AddFolderModal";
import Folder from "@/components/Documentos/Folder";
import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import TooltipIconButton from "@/components/TooltipIconButton";
import { useProjetoContext } from "@/contexts/projectContext";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { PastaType } from "types";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { BarChart } from "@mui/x-charts/BarChart";
import EditIcon from "@mui/icons-material/Edit";
import UpdateDadosFinanceirosModal from "@/components/UpdateDadosFinanceirosModal";

export const Route = createFileRoute("/_auth/financeiro/")({
    component: Financeiro,
});

function Financeiro() {
    const [addFolderModalState, setAddFolderModalState] = useState<null | "financeiro">(null);

    const [dadosFinanceirosModalState, setDadosFinanceirosModalState] = useState(false);

    const { faseSelecionada } = useProjetoContext();

    if (!faseSelecionada) {
        return null;
    }

    return (
        <Container>
            <HorizontalNavigation />
            <Paper sx={{ mt: 3, p: 1 }} elevation={8}>
                <TooltipIconButton action={() => setAddFolderModalState("financeiro")} icon={<CreateNewFolderIcon />} title="Adicionar pasta" />
                <AddFolderModal folderSection={addFolderModalState} close={() => setAddFolderModalState(null)} />
            </Paper>

            <Grid container spacing={2} sx={{ pt: 5 }}>
                {faseSelecionada?.financeiro.map((folder: PastaType) => <Folder key={folder.nome} folder={folder} />)}
            </Grid>

            {faseSelecionada?.financeiro.length === 0 && (
                <Typography variant="caption">Não há pastas, clique no botão acima para adicionar pastas</Typography>
            )}

            <Box sx={{ width: "100%", my: 5 }}>
                <Typography variant="h5" textAlign={"center"}>
                    Comparativo <TooltipIconButton action={() => setDadosFinanceirosModalState(true)} icon={<EditIcon />} title="Editar dados" />
                </Typography>
                <BarChart
                    title="Comparativo"
                    xAxis={[{ data: ["Valor projetado", "Valor orçado", "Valor real"] }]}
                    series={[{ data: [faseSelecionada!.valorProjetado, faseSelecionada!.valorOrcado, faseSelecionada!.valorReal] }]}
                    height={300}
                    borderRadius={8}

                />
                <UpdateDadosFinanceirosModal
                    isOpen={dadosFinanceirosModalState}
                    close={() => setDadosFinanceirosModalState(false)}
                    faseSelecionada={faseSelecionada}
                />
            </Box>
        </Container>
    );
}
