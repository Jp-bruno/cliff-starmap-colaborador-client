import axiosBase from "@/axios/axios";
import AddFileModal from "@/components/AddFileModal";
import ArquivoListItem from "@/components/ArquivoListItem";
import FolderNavigationBreadcrumbs from "@/components/FolderNavigationBreadcrumbs";
import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import TooltipIconButton from "@/components/TooltipIconButton";
import { Container, List, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import type { ArquivoType } from "@/types";
import NoteAddIcon from '@mui/icons-material/NoteAdd';

export const Route = createFileRoute("/_auth/_projeto/$slug/documentos/$folderSlug/")({
    component: RouteComponent,
    validateSearch: ({ folderId }: { folderId: string }): { folderId: string } => {
        return { folderId };
    },
});

function RouteComponent() {
    const { folderSlug } = useParams({ from: "/_auth/_projeto/$slug/documentos/$folderSlug/" });

    const { folderId } = useSearch({ from: "/_auth/_projeto/$slug/documentos/$folderSlug/" });

    const [addFileModalState, setAddFileModalState] = useState(false);

    const { data: arquivos, isLoading } = useQuery({
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
            </Paper>

            <FolderNavigationBreadcrumbs currentPageName={folderSlug} prevPageName="Documentos" />

            <List sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
                {arquivos.map((arquivo: ArquivoType) => (
                    <ArquivoListItem key={arquivo._id} arquivo={arquivo} />
                ))}
            </List>
        </Container>
    );
}
