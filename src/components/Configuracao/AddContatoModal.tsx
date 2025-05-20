import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Add from "@mui/icons-material/Add";
import BaseModal from "../BaseModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/axios/axios";
import type { ColaboradorType } from "types";
import { useProjetoContext } from "@/contexts/projectContext";

export default function AddContatoModal({ isOpen, close }: { isOpen: boolean; close: () => void }) {
    const { data: colaboradores, isLoading } = useQuery({
        queryKey: ["colaboradores"],
        queryFn: async () => {
            return await axiosBase("/colaborador").then((res) => res.data);
        },
    });

    const { projeto } = useProjetoContext();

    const queryClient = useQueryClient();

    async function handleAdd(colaboradorId: string) {
        await axiosBase
            .patch(`/projeto/${projeto._id}/contato`, { colaboradorId, operation: "add" })
            .then(async () => await queryClient.invalidateQueries({ queryKey: ["projeto"] }));
    }

    function handleClose() {
        close();
    }

    if (isLoading) {
        return null;
    }

    const colaboradoresDisponiveis = colaboradores.filter(
        (colaborador: ColaboradorType) => !projeto.contatos.some((contato: ColaboradorType) => contato._id === colaborador._id)
    );

    return (
        <BaseModal isOpen={isOpen} close={handleClose} title="Adicionar contato ao projeto">
            <List>
                {colaboradoresDisponiveis.map((colaborador: ColaboradorType) => {
                    return (
                        <ListItemButton sx={{ display: "flex", justifyContent: "space-between" }} onClick={() => handleAdd(colaborador._id)}>
                            {colaborador.nome}
                            <ListItemIcon sx={{ width: "10px", display: "flex", justifyContent: "flex-end" }}>
                                <Add />
                            </ListItemIcon>
                        </ListItemButton>
                    );
                })}
                {colaboradoresDisponiveis.length === 0 && (
                    <ListItem>
                        <ListItemText>Nenhum colaborador disponível</ListItemText>
                    </ListItem>
                )}
            </List>
        </BaseModal>
    );
}
