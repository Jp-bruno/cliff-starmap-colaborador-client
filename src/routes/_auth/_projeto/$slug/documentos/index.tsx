import Folder from "@/components/Documentos/Folder";
import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import TooltipIconButton from "@/components/TooltipIconButton";
import AddFolderModal from "@/components/AddFolderModal";
import { useState } from "react";
import { useProjetoContext } from "@/contexts/projectContext";
import type { FaseType, PastaType } from "@/types";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

export const Route = createFileRoute("/_auth/_projeto/$slug/documentos/")({
    component: Documentos,
});

function Documentos() {
    // const folders = [
    //     { title: "Projetos", description: "Descrição", link: "/" },
    //     { title: "Relatórios", description: "Descrição", link: "/" },
    //     { title: "Contratos", description: "Descrição", link: "/" },
    //     { title: "Fotos", description: "Descrição", link: "/" },
    //     { title: "Memoriais", description: "Descrição", link: "/" },
    // ];

    const [addFolderModalState, setAddFolderModalState] = useState<null | "documentos">(null);

    const { faseSelecionada, projeto } = useProjetoContext();

    const documentos = projeto!.fases.find((p_fase: FaseType) => p_fase._id === faseSelecionada?._id)?.documentos;

    return (
        <Container>
            <HorizontalNavigation />

            <Paper sx={{ mt: 3, p: 1 }} elevation={8}>
                <TooltipIconButton action={() => setAddFolderModalState("documentos")} icon={<CreateNewFolderIcon />} title="Adicionar pasta" />
                <AddFolderModal folderSection={addFolderModalState} close={() => setAddFolderModalState(null)} />
            </Paper>

            <Grid container spacing={2} sx={{ pt: 5 }}>
                {documentos.map((folder: PastaType) => (
                    <Folder key={folder.nome} folder={folder} />
                ))}
            </Grid>

            {documentos.length === 0 && <Typography variant="caption">Não há pastas, clique no botão acima para adicionar pastas</Typography>}
        </Container>
    );
}
