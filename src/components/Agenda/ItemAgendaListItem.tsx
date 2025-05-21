import { IconButton, ListItem, ListItemText, Menu, MenuItem } from "@mui/material";
import type { ItemAgendaType } from "types";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState, type MouseEvent } from "react";
import axiosBase from "@/axios/axios";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import { useQueryClient } from "@tanstack/react-query";
import EditItemAgendaModal from "./EditItemAgendaModal";

export default function ItemAgendaListItem({ itemAgenda }: { itemAgenda: ItemAgendaType }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const [editItemAgendaModalState, setEditItemAgendaModalState] = useState<null | ItemAgendaType>(null);

    const queryClient = useQueryClient();

    const { open: openDeletePrompt } = useDeleteConfirmPrompt();

    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleDeleteItemAgenda() {
        await axiosBase.delete(`/itemAgenda/${itemAgenda._id}`).then(async () => {
            await queryClient.invalidateQueries({ queryKey: [`fase-${itemAgenda.fase}-agenda`] });
            await queryClient.invalidateQueries({ queryKey: [`projeto`] });
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
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        openDeletePrompt({
                            message: "Tem certeza que deseja excluir este item de sua agenda?",
                            cb: () => handleDeleteItemAgenda(),
                        });
                    }}
                >
                    Excluir
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        setEditItemAgendaModalState(itemAgenda);
                    }}
                >
                    Editar
                </MenuItem>
            </Menu>
            <ListItemText secondary={itemAgenda.data}>
                {itemAgenda.titulo} - {itemAgenda.descricao}
            </ListItemText>
            <EditItemAgendaModal itemAgenda={editItemAgendaModalState} close={() => setEditItemAgendaModalState(null)} />
        </ListItem>
    );
}
