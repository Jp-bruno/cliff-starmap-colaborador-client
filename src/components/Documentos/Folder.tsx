import { Card, CardActionArea, Grid, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, type MouseEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import type { PastaType } from "types";
import axiosBase from "@/axios/axios";
import { useQueryClient } from "@tanstack/react-query";
import EditFolderModal from "../EditFolderModal";

export default function Folder({ folder }: { folder: PastaType }) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { open: openDeletePrompt } = useDeleteConfirmPrompt();
    const queryClient = useQueryClient();
    const [editFolderModalState, setEditFolderModalState] = useState<PastaType | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleDeleteFolder() {
        await axiosBase.delete(`/pasta/${folder._id}`).then(async () => {
            await queryClient.invalidateQueries({ queryKey: [`projeto`] });
        });
    }

    return (
        <Grid size={4}>
            <Card sx={{ width: "100%", height: "100%", borderRadius: 4, backgroundColor: theme.palette.primary[500], color: "white" }}>
                <Grid
                    container
                    sx={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Grid size={10}>
                        <CardActionArea
                            onClick={() => navigate({ to: `./${folder.slug}`, search: { folderId: folder._id } })}
                            sx={{
                                width: "100%",
                                height: "100%",
                                px: 3,
                                py: 4,
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: "column",
                                alignItems: "flex-start",
                            }}
                        >
                            <Typography variant="h5">{folder.nome}</Typography>
                            <Typography variant="caption">{folder.descricao}</Typography>
                        </CardActionArea>
                    </Grid>
                    <Grid size={2} sx={{ heigth: "100%", display: "flex" }}>
                        <CardActionArea sx={{ width: "100%", heigth: "100%", display: "flex" }} onClick={handleClick}>
                            <MoreVertIcon />
                        </CardActionArea>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    openDeletePrompt({
                                        message: "Tem certeza que deseja excluir esta pasta?",
                                        extraMessage: "Aviso: todos os arquivos desta pasta também serão excluídos",
                                        cb: () => handleDeleteFolder(),
                                    });
                                }}
                            >
                                Excluir
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    setEditFolderModalState(folder);
                                }}
                            >
                                Editar
                            </MenuItem>
                        </Menu>
                        <EditFolderModal folder={editFolderModalState} close={() => setEditFolderModalState(null)} />
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );
}
