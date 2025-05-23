import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Add from "@mui/icons-material/Add";
import BaseModal from "../BaseModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/axios/axios";
import type { ClienteType } from "@/types";
import { useProjetoContext } from "@/contexts/projectContext";

export default function AddClienteModal({ isOpen, close }: { isOpen: boolean; close: () => void }) {
    const { data: clientes, isLoading } = useQuery({
        queryKey: ["clientes"],
        queryFn: async () => {
            return await axiosBase("/cliente").then((res) => res.data);
        },
    });

    const { projeto } = useProjetoContext();

    const queryClient = useQueryClient();

    async function handleAdd(clienteId: string) {
        await axiosBase
            .patch(`/projeto/${projeto!._id}/cliente`, { clienteId, operation: "add" })
            .then(async () => await queryClient.invalidateQueries({ queryKey: ["projeto"] }));
    }

    function handleClose() {
        close();
    }

    if (isLoading) {
        return null;
    }

    const clientesDisponiveis = clientes.filter(
        (cliente: ClienteType) => !projeto!.clientes.some((p_cliente: ClienteType) => p_cliente._id === cliente._id)
    );

    return (
        <BaseModal isOpen={isOpen} close={handleClose} title="Adicionar cliente ao projeto">
            <List>
                {clientesDisponiveis.map((cliente: ClienteType) => {
                    return (
                        <ListItemButton sx={{ display: "flex", justifyContent: "space-between" }} onClick={() => handleAdd(cliente._id)}>
                            {cliente.nome}
                            <ListItemIcon sx={{ width: "10px", display: "flex", justifyContent: "flex-end" }}>
                                <Add />
                            </ListItemIcon>
                        </ListItemButton>
                    );
                })}
                {clientesDisponiveis.length === 0 && (
                    <ListItem>
                        <ListItemText>Nenhum cliente disponível</ListItemText>
                    </ListItem>
                )}
            </List>
        </BaseModal>
    );
}
