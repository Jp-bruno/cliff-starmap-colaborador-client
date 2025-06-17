import theme from "@/theme";
import type { PastaType } from "@/types";
import { MoreVert } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemText, Menu, MenuItem } from "@mui/material";
import TooltipIconButton from "../TooltipIconButton";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type MouseEvent } from "react";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import axiosBase from "@/axios/axios";
import { useQueryClient } from "@tanstack/react-query";
import EditFolderModal from "../EditFolderModal";

export default function FolderListItem({ pasta, projetoSlug }: { pasta: PastaType; projetoSlug: string }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [editFolderModalState, setEditFolderModalState] = useState<PastaType | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { open: openDeletePrompt } = useDeleteConfirmPrompt();
    const queryClient = useQueryClient();
    const state = useRouterState();

    async function handleDeleteFolder() {
        await axiosBase.delete(`/pasta/${pasta._id}`).then(async () => {
            await queryClient.invalidateQueries({ queryKey: [`projeto`] });

            if (state.location.searchStr) {
                await queryClient.invalidateQueries({ queryKey: [`arquivos-pasta:${state.location.search.folderId}`] });
            }
        });
    }

    return (
        <ListItem
            secondaryAction={<TooltipIconButton icon={<MoreVert />} title="Opções" action={handleClick} />}
            sx={{ bgcolor: theme.palette.primary[100], borderRadius: 2, p: 0 }}
        >
            <ListItemButton
                sx={{ borderRadius: 2 }}
                key={pasta._id}
                onClick={() =>
                    navigate({
                        to: "/$slug/documentos/$folderSlug",
                        params: { folderSlug: pasta.slug, slug: projetoSlug },
                        search: { folderId: pasta._id },
                        mask: { to: `/$slug/documentos`, params: { slug: projetoSlug } },
                    })
                }
            >
                <ListItemText>{pasta.nome}</ListItemText>
            </ListItemButton>
            <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        setEditFolderModalState(pasta);
                    }}
                >
                    Editar
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        openDeletePrompt({
                            message: "Tem certeza que deseja excluir esta pasta?",
                            extraMessage: "Aviso: todos os arquivos desta pasta também serão excluídos",
                            cb: () => handleDeleteFolder(),
                            resourceType: "pasta",
                        });
                    }}
                >
                    Excluir
                </MenuItem>
            </Menu>
            <EditFolderModal folder={editFolderModalState} close={() => setEditFolderModalState(null)} />
        </ListItem>
    );
}
