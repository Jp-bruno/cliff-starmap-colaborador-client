import { ListItem, ListItemText } from "@mui/material";
import type { ClienteType } from "@/types";
import Delete from "@mui/icons-material/Delete";
import TooltipIconButton from "../TooltipIconButton";
import axiosBase from "@/axios/axios";
import { useProjetoContext } from "@/contexts/projectContext";
import { useQueryClient } from "@tanstack/react-query";

export default function ConfiguracaoClientesListItem({ cliente }: { cliente: ClienteType }) {
    const { projeto } = useProjetoContext();

    const queryClient = useQueryClient();

    async function handleRemoveCliente() {
        await axiosBase
            .patch(`/projeto/${projeto!._id}/cliente`, { clienteId: cliente._id, operation: "remove" })
            .then(async () => await queryClient.invalidateQueries({ queryKey: ["projeto"] }));
    }

    return (
        <ListItem secondaryAction={<TooltipIconButton action={handleRemoveCliente} icon={<Delete />} title="Remover dos clientes do projeto" />}>
            <ListItemText>{cliente.nome}</ListItemText>
        </ListItem>
    );
}
