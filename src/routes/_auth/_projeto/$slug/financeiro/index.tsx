import AddFolderModal from "@/components/AddFolderModal";
import Folder from "@/components/Documentos/Folder";
import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import TooltipIconButton from "@/components/TooltipIconButton";
import { useProjetoContext } from "@/contexts/projectContext";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FaseType, PastaType } from "@/types";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditIcon from "@mui/icons-material/Edit";
import UpdateDadosFinanceirosModal from "@/components/UpdateDadosFinanceirosModal";
import { Delete } from "@mui/icons-material";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import axiosBase from "@/axios/axios";

export const Route = createFileRoute("/_auth/_projeto/$slug/financeiro/")({
    component: Financeiro,
});

function Financeiro() {
    const [addFolderModalState, setAddFolderModalState] = useState<null | "financeiro">(null);

    const [dadosFinanceirosModalState, setDadosFinanceirosModalState] = useState(false);

    const { projeto, faseSelecionada, refetch } = useProjetoContext();

    const fase = projeto!.fases.find((p_fase: FaseType) => p_fase._id === faseSelecionada?._id);

    const financeiro = fase?.financeiro;

    const { open: openDeletePrompt } = useDeleteConfirmPrompt();

    async function handleDelete() {
        await axiosBase.delete(`/fase/${fase?._id}/financeiro`).then(async () => {
            await refetch();
        });
    }

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
                {financeiro.map((folder: PastaType) => (
                    <Folder key={folder.nome} folder={folder} />
                ))}
            </Grid>

            {financeiro.length === 0 && <Typography variant="caption">Não há pastas, clique no botão acima para adicionar pastas</Typography>}

            <Box sx={{ width: "100%", my: 5 }}>
                <Typography variant="h5" textAlign={"center"}>
                    Comparativo <TooltipIconButton action={() => setDadosFinanceirosModalState(true)} icon={<EditIcon />} title="Editar dados" />
                    <TooltipIconButton
                        title="Excluir imagem atual"
                        icon={<Delete />}
                        disabled={!fase?.financeiroResumo.url}
                        action={() =>
                            openDeletePrompt({
                                message: "Tem certeza que deseja excluir este relatório?",
                                extraMessage: "Esta ação é irreversível",
                                cb: () => handleDelete(),
                                resourceType: "relatorio",
                            })
                        }
                    />
                </Typography>
                <UpdateDadosFinanceirosModal
                    isOpen={dadosFinanceirosModalState}
                    close={() => setDadosFinanceirosModalState(false)}
                    faseSelecionada={fase!}
                />
                <Paper elevation={8} sx={{ p: 2, mt: 2 }}>
                    {fase?.financeiroResumo.url && <img width={"100%"} src={fase.financeiroResumo.url} alt="teste" />}
                </Paper>
            </Box>
        </Container>
    );
}
