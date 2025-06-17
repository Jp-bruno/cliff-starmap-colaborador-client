import axiosBase from "@/axios/axios";
import AddFileModal from "@/components/AddFileModal";
import ArquivoListItem from "@/components/ArquivoListItem";
import FolderNavigationBreadcrumbs from "@/components/FolderNavigationBreadcrumbs";
import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import TooltipIconButton from "@/components/TooltipIconButton";
import { Container, Grid, List, ListItem, ListItemText, ListSubheader, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import type { ArquivoType, PastaType } from "@/types";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddFolderModal from "@/components/AddFolderModal";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderListItem from "@/components/Documentos/FolderListItem";

export const Route = createFileRoute("/_auth/_projeto/$slug/financeiro/$folderSlug/")({
    component: RouteComponent,
    validateSearch: ({ folderId }: { folderId: string }): { folderId: string } => {
        return { folderId };
    },
});

function RouteComponent() {
    const { slug } = useParams({ from: "/_auth/_projeto/$slug/financeiro/$folderSlug/" });


    const { folderId } = useSearch({ from: "/_auth/_projeto/$slug/financeiro/$folderSlug/" });

    const [addFileModalState, setAddFileModalState] = useState(false);

    const [addFolderModalState, setAddFolderModalState] = useState<null | "financeiro">(null);

    const { data, isLoading } = useQuery({
        queryKey: [`arquivos-pasta:${folderId}`],
        queryFn: async () => {
            return await axiosBase(`/pasta/${folderId}`).then((res) => res.data);
        },
    });

    if (isLoading) {
        return null;
    }

    return (
        <Container>
            <HorizontalNavigation />

            <Paper sx={{ my: 3, p: 1 }} elevation={8}>
                <TooltipIconButton action={() => setAddFileModalState(true)} icon={<NoteAddIcon />} title="Adicionar arquivo" />
                <AddFileModal isOpen={addFileModalState} close={() => setAddFileModalState(false)} folderId={folderId} />
                <TooltipIconButton
                    disabled={isLoading}
                    action={() => setAddFolderModalState("financeiro")}
                    icon={<CreateNewFolderIcon />}
                    title="Adicionar pasta"
                />
                <AddFolderModal folderSection={addFolderModalState} close={() => setAddFolderModalState(null)} />
            </Paper>

            <FolderNavigationBreadcrumbs prevFolders={data.pastasPai} pastaAtual={data.pastaAtual} projetoSlug={slug} section="financeiro" />

            <Grid container spacing={2}>
                <Grid size={6}>
                    <Paper sx={{ p: 2, mt: 2, pt: 0 }} elevation={8}>
                        <List sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
                            <ListSubheader>Arquivos</ListSubheader>
                            {data.arquivos.map((arquivo: ArquivoType) => (
                                <ArquivoListItem key={arquivo._id} arquivo={arquivo} />
                            ))}
                            {data.arquivos.length === 0 && (
                                <ListItem>
                                    <ListItemText secondary="Nenhum arquivo nesta pasta"></ListItemText>
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

                <Grid size={6}>
                    <Paper sx={{ p: 2, mt: 2, pt: 0 }} elevation={8}>
                        <List sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
                            <ListSubheader>Pastas</ListSubheader>
                            {data.pastas.map((pasta: PastaType) => (
                                <FolderListItem key={pasta._id} pasta={pasta} projetoSlug={slug} />
                            ))}
                            {data.pastas.length === 0 && (
                                <ListItem>
                                    <ListItemText secondary="Nenhuma subpasta nesta pasta"></ListItemText>
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
