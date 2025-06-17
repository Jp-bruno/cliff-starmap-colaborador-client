import axiosBase from "@/axios/axios";
import AddFileModal from "@/components/AddFileModal";
import ArquivoListItem from "@/components/ArquivoListItem";
import FolderNavigationBreadcrumbs from "@/components/FolderNavigationBreadcrumbs";
import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import TooltipIconButton from "@/components/TooltipIconButton";
import { Container, List, ListItemButton, ListItemText, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import type { ArquivoType, PastaType } from "@/types";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddFolderModal from "@/components/AddFolderModal";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

export const Route = createFileRoute("/_auth/_projeto/$slug/documentos/$folderSlug/")({
    component: RouteComponent,
    validateSearch: ({ folderId }: { folderId: string }): { folderId: string } => {
        return { folderId };
    },
});

function RouteComponent() {
    const { slug } = useParams({ from: "/_auth/_projeto/$slug/documentos/$folderSlug/" });

    const { folderId } = useSearch({ from: "/_auth/_projeto/$slug/documentos/$folderSlug/" });

    const navigate = useNavigate();

    const [addFileModalState, setAddFileModalState] = useState(false);

    const [addFolderModalState, setAddFolderModalState] = useState<null | "documentos">(null);

    const { data, isLoading } = useQuery({
        queryKey: [`arquivos-pasta:${folderId}`],
        queryFn: async () => {
            return await axiosBase(`/pasta/${folderId}`).then((res) => res.data);
        },
    });

    console.log(data);

    if (isLoading) {
        return null;
    }

    return (
        <Container>
            <HorizontalNavigation />

            <Paper sx={{ my: 3, p: 1 }} elevation={8}>
                <TooltipIconButton disabled={isLoading} action={() => setAddFileModalState(true)} icon={<NoteAddIcon />} title="Adicionar arquivo" />
                <TooltipIconButton
                    disabled={isLoading}
                    action={() => setAddFolderModalState("documentos")}
                    icon={<CreateNewFolderIcon />}
                    title="Adicionar pasta"
                />
                <AddFileModal isOpen={addFileModalState} close={() => setAddFileModalState(false)} folderId={folderId} />
                <AddFolderModal folderSection={addFolderModalState} close={() => setAddFolderModalState(null)} />
            </Paper>

            <FolderNavigationBreadcrumbs prevFolders={data.pastasPai} pastaAtual={data.pastaAtual} projetoSlug={slug} section="documentos" />

            <List sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
                {data.arquivos.map((arquivo: ArquivoType) => (
                    <ArquivoListItem key={arquivo._id} arquivo={arquivo} />
                ))}
            </List>

            <List>
                {data.pastas.map((pasta: PastaType) => (
                    <ListItemButton
                        key={pasta._id}
                        onClick={() =>
                            navigate({
                                to: "/$slug/documentos/$folderSlug",
                                params: { folderSlug: pasta.slug, slug },
                                search: { folderId: pasta._id },
                                mask: { to: `/$slug/documentos`, params: { slug } },
                            })
                        }
                    >
                        <ListItemText>{pasta.nome}</ListItemText>
                    </ListItemButton>
                ))}
            </List>
        </Container>
    );
}
