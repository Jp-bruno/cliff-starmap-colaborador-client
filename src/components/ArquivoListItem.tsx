import { ListItem, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import type { ArquivoType } from "@/types";
import TooltipIconButton from "./TooltipIconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Delete from "@mui/icons-material/Delete";
import Download from "@mui/icons-material/Download";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import axiosBase from "@/axios/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ArquivoListItem({ arquivo }: { arquivo: ArquivoType }) {
    const theme = useTheme();
    const { open } = useDeleteConfirmPrompt();
    const queryClient = useQueryClient();
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState(false);

    async function handleDeleteFile() {
        await axiosBase.delete(`/arquivo/${arquivo._id}`).then(async () => {
            await queryClient.invalidateQueries({ queryKey: [`arquivos-pasta:${arquivo.pasta}`] });
        });
    }

    async function handleUpdateFile() {
        setLoadingUpdate(true);
        await axiosBase.patch("/arquivo", { id: arquivo._id, visivel: arquivo.visivel }).then(async () => {
            await queryClient.invalidateQueries({ queryKey: [`arquivos-pasta:${arquivo.pasta}`] });
            setLoadingUpdate(false);
        });
    }

    async function handleDownloadFile() {
        setLoadingDownload(true);

        await axiosBase(`/arquivo/${arquivo._id}`).then(async (res) => {
            const item = await fetch(res.data.signedUrl);
            const blob = await item.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = arquivo.nome;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
            setLoadingDownload(false);
        });
    }

    return (
        <ListItem sx={{ bgcolor: theme.palette.primary[100], borderRadius: 2 }}>
            <ListItemText>{arquivo.nome}</ListItemText>
            <ListItemIcon>
                <TooltipIconButton
                    action={handleUpdateFile}
                    title={arquivo.visivel ? "Visível (clique para tornar invisível)" : "Invisível (clique para tornar visível)"}
                    icon={arquivo.visivel ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    loading={loadingUpdate}
                />
            </ListItemIcon>
            <ListItemIcon>
                <TooltipIconButton
                    action={() =>
                        open({
                            message: `Tem certeza que deseja excluir o arquivo ${arquivo.nome}?`,
                            extraMessage: "Aviso: esta ação é irreversível",
                            cb: () => handleDeleteFile(),
                        })
                    }
                    title={"Excluir"}
                    icon={<Delete />}
                />
            </ListItemIcon>
            <ListItemIcon>
                <TooltipIconButton action={handleDownloadFile} icon={<Download />} title="Baixar" loading={loadingDownload} />
            </ListItemIcon>
        </ListItem>
    );
}
