import { ListItem, ListItemText } from "@mui/material";
import type { ColaboradorType } from "types";
import Delete from "@mui/icons-material/Delete";
import TooltipIconButton from "../TooltipIconButton";
import axiosBase from "@/axios/axios";
import { useProjetoContext } from "@/contexts/projectContext";
import { useQueryClient } from "@tanstack/react-query";

export default function ConfiguracaoContatosListItem({ contato }: { contato: ColaboradorType }) {
    const { projeto } = useProjetoContext();

    const queryClient = useQueryClient();

    async function handleRemoveContato() {
        await axiosBase
            .patch(`/projeto/${projeto._id}/contato`, { colaboradorId: contato._id, operation: "remove" })
            .then(async () => await queryClient.invalidateQueries({ queryKey: ["projeto"] }));
    }

    return (
        <ListItem secondaryAction={<TooltipIconButton action={handleRemoveContato} icon={<Delete />} title="Remover dos contatos do projeto" />}>
            <ListItemText>{contato.nome}</ListItemText>
        </ListItem>
    );
}
