import { IconButton, ListItem, ListItemText, Menu, MenuItem } from "@mui/material";
import { useProjetoContext } from "@/contexts/projectContext";
import { useQueryClient } from "@tanstack/react-query";
import type { FaseType } from "@/types";
import axiosBase from "@/axios/axios";
import { useState, type MouseEvent } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import EditFaseModal from "./EditFaseModal";

export default function FaseListItem({ fase }: { fase: FaseType }) {
    const { faseSelecionada, handleSetFaseSelecionada, projeto } = useProjetoContext();
    const queryClient = useQueryClient();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [editFaseModalState, setEditFaseModalState] = useState<FaseType | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { open: openDeletePrompt } = useDeleteConfirmPrompt();

    async function handleDeleteFase(faseId: string) {
        if (faseId === faseSelecionada!._id) {
            handleSetFaseSelecionada(projeto!.fases.length > 0 ? projeto!.fases[0]._id : null);
        }

        await axiosBase.delete(`/fase/${faseId}`).then(async () => {
            await queryClient.invalidateQueries({ queryKey: ["projeto"] });
        });
    }

    return (
        <ListItem
            secondaryAction={
                <IconButton onClick={handleClick}>
                    <MoreHorizIcon />
                </IconButton>
            }
        >
            <ListItemText>{fase.nome}</ListItemText>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        openDeletePrompt({
                            message: "Tem certeza que deseja excluir esta fase?",
                            extraMessage: "Aviso: todos os arquivos, pastas e itens de agenda também serão excluídos",
                            cb: () => handleDeleteFase(fase._id),
                            resourceType: "fase"
                        });
                    }}
                >
                    Excluir
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        setEditFaseModalState(fase);
                    }}
                >
                    Editar
                </MenuItem>
            </Menu>
            <EditFaseModal fase={editFaseModalState} close={() => setEditFaseModalState(null)} />
        </ListItem>
    );
}
