import axiosBase from "@/axios/axios";
import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import TooltipIconButton from "@/components/TooltipIconButton";
import UpdateVisaoGeralModal from "@/components/UpdateVisaoGeralModal";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import { useProjetoContext } from "@/contexts/projectContext";
import type { FaseType } from "@/types";
import { Delete, Edit } from "@mui/icons-material";
import { Box, Container, Paper, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_auth/_projeto/$slug/visao-geral")({
    component: RouteComponent,
});

function RouteComponent() {
    const [visaoGeralModalState, setVisaoGeralModalState] = useState(false);

    const { projeto, faseSelecionada, refetch } = useProjetoContext();

    const { open: openDeletePrompt } = useDeleteConfirmPrompt();

    const fase = projeto!.fases.find((p_fase: FaseType) => p_fase._id === faseSelecionada?._id);

    async function handleDelete() {
        await axiosBase.delete(`/fase/${fase?._id}/visaoGeral`).then(async () => {
            await refetch();
        });
    }

    return (
        <Container sx={{ pb: 10 }}>
            <HorizontalNavigation />
            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center" }}>
                    Visão geral
                    <TooltipIconButton title="Enviar imagem" icon={<Edit />} action={() => setVisaoGeralModalState(true)} />
                    <TooltipIconButton
                        title="Excluir imagem atual"
                        icon={<Delete />}
                        disabled={!fase?.visaoGeral.url}
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
            </Box>
            <UpdateVisaoGeralModal close={() => setVisaoGeralModalState(false)} faseSelecionada={fase!} isOpen={visaoGeralModalState} />
            <Paper elevation={8} sx={{ p: 2, mt: 2 }}>
                {fase?.visaoGeral.nomeR2 && <img width={"100%"} src={fase.visaoGeral.url} alt="teste" />}
            </Paper>
        </Container>
    );
}
