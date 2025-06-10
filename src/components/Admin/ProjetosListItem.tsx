import axiosBase from "@/axios/axios";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import type { ProjetoType } from "@/types";
import { Delete, Edit } from "@mui/icons-material";
import { ListItem, ListItemText } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import TooltipIconButton from "../TooltipIconButton";
import { useState } from "react";
import UpdateProjetoNameModal from "./UpdateProjetoNameModal";

export default function ProjetosListItem({ projeto }: { projeto: ProjetoType }) {
    const queryClient = useQueryClient();
    const [updateNameModalState, setUpdateNameModal] = useState(false);
    const { open: openDeleteConfirmPrompt } = useDeleteConfirmPrompt();

    async function handleDelete(projetoId: string) {
        return await axiosBase.delete(`/projeto/${projetoId}`).then(async () => {
            window.alert("Projeto excluído com sucesso");
            await queryClient.invalidateQueries({ queryKey: ["projetos"] });
        });
    }

    return (
        <ListItem key={projeto._id}>
            <UpdateProjetoNameModal isOpen={updateNameModalState} projeto={projeto} close={() => setUpdateNameModal(false)} />
            <ListItemText primary={projeto.nome} />
            <TooltipIconButton title="Editar nome" action={() => setUpdateNameModal(true)} icon={<Edit />} />
            <TooltipIconButton
                title="Deletar projeto"
                action={() =>
                    openDeleteConfirmPrompt({
                        cb: () => handleDelete(projeto._id),
                        message: `Tem certeza que deseja excluir o projeto ${projeto.nome}?`,
                        extraMessage: "Todos os arquivos também serão excluídos!",
                        resourceType: "projeto"
                    })
                }
                icon={<Delete />}
            />
        </ListItem>
    );
}
