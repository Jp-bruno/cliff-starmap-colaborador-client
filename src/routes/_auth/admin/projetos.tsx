import axiosBase from "@/axios/axios";
import AddProjetoModal from "@/components/Admin/AddProjetoModal";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import { queryClient } from "@/main";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { Container, Paper, Typography, List, ListSubheader, IconButton, ListItem, ListItemText } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ProjetoType } from "@/types";

export const Route = createFileRoute("/_auth/admin/projetos")({
    component: RouteComponent,
});

function RouteComponent() {
    const [addProjectModalState, setAddProjectModalState] = useState(false);

    const { open: openDeleteConfirmPrompt } = useDeleteConfirmPrompt();

    const { data: projetos, isLoading } = useQuery({
        queryKey: ["projetos"],
        queryFn: async () => {
            const projetos = await axiosBase(`/projeto`).then((res) => res.data);

            return projetos;
        },
    });

    async function handleDelete(projetoId: string) {
        return await axiosBase.delete(`/projeto/${projetoId}`).then(async () => {
            window.alert("Projeto excluído com sucesso")
            await queryClient.invalidateQueries({ queryKey: ["projetos"] });
        });
    }

    if (isLoading) {
        return null;
    }

    return (
        <Container sx={{ py: 12 }}>
            <AddProjetoModal isOpen={addProjectModalState} close={() => setAddProjectModalState(false)} />

            <Paper sx={{ p: 2 }}>
                <Typography sx={{ mb: 2 }}>Administrador - Projetos</Typography>
                <List>
                    <ListSubheader sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        Projetos
                        <IconButton size="small" onClick={() => setAddProjectModalState(true)}>
                            <Add fontSize="small" />
                        </IconButton>
                    </ListSubheader>
                    {projetos.map((projeto: ProjetoType) => {
                        return (
                            <ListItem key={projeto._id}>
                                <ListItemText primary={projeto.nome} />
                                <IconButton
                                    onClick={() =>
                                        openDeleteConfirmPrompt({
                                            cb: () => handleDelete(projeto._id),
                                            message: `Tem certeza que deseja excluir o projeto ${projeto.nome}?`,
                                            extraMessage: "Todos os arquivos também serão excluídos!",
                                        })
                                    }
                                >
                                    <Delete />
                                </IconButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>
        </Container>
    );
}
