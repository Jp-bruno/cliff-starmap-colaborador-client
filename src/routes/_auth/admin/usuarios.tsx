import axiosBase from "@/axios/axios";
import AddUserModal from "@/components/Admin/AddUserModal";
import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import { Add, Delete } from "@mui/icons-material";
import { Container, Paper, Typography, List, ListSubheader, IconButton, ListItem, ListItemText, Grid } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ClienteType, ColaboradorType } from "types";

export const Route = createFileRoute("/_auth/admin/usuarios")({
    component: Usuarios,
});

function Usuarios() {
    const [addUserModalState, setAddUserModalState] = useState<null | "funcionário" | "cliente">(null);
    const { open: openConfirmDeleteModal } = useDeleteConfirmPrompt();

    const queryClient = useQueryClient();

    const { data: colaboradores, isLoading: loadingColaboradores } = useQuery({
        queryKey: ["colaboradores"],
        queryFn: async () => {
            const colaboradores = await axiosBase(`/colaborador`).then((res) => res.data);

            return colaboradores;
        },
    });

    const { data: clientes, isLoading: loadingClientes } = useQuery({
        queryKey: ["clientes"],
        queryFn: async () => {
            const clientes = await axiosBase(`/cliente`).then((res) => res.data);

            return clientes;
        },
    });

    async function handleDelete(userId: string, tipo: "funcionario" | "cliente") {
        return await axiosBase
            .delete(tipo === "funcionario" ? `/colaborador/${userId}` : `/cliente/${userId}`)
            .then(async () => {
                await queryClient.invalidateQueries({ queryKey: [`${tipo === "funcionario" ? "colaboradores" : "clientes"}`] });
            })
            .catch((e) => {
                window.alert(e.response.data.message);
            });
    }

    if (loadingColaboradores || loadingClientes) {
        return null;
    }

    // const user = JSON.parse(localStorage.getItem("userData")!);

    return (
        <Container sx={{ py: 12 }}>
            <AddUserModal isOpen={Boolean(addUserModalState)} close={() => setAddUserModalState(null)} tipo={addUserModalState!} />

            <Paper sx={{ p: 2 }} elevation={8}>
                <Typography sx={{ mb: 2 }}>Administrador - Usuários</Typography>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Paper sx={{ p: 1 }} elevation={8}>
                            <List>
                                <ListSubheader sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                    Funcionários
                                    <IconButton size="small" onClick={() => setAddUserModalState("funcionário")}>
                                        <Add fontSize="small" />
                                    </IconButton>
                                </ListSubheader>
                                {colaboradores.map((colaborador: ColaboradorType) => {
                                    return (
                                        <ListItem key={colaborador._id}>
                                            <ListItemText primary={colaborador.nome + " " + colaborador.sobrenome} />

                                            <IconButton
                                                onClick={() =>
                                                    openConfirmDeleteModal({
                                                        cb: () => handleDelete(colaborador._id, "funcionario"),
                                                        message: `Tem certeza que deseja excluir o usuário ${colaborador.nome} ${colaborador.sobrenome}?`,
                                                    })
                                                }
                                                // disabled={user._id === colaborador._id}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </ListItem>
                                    );
                                })}
                                {colaboradores.length === 0 && (
                                    <ListItem>
                                        <ListItemText secondary="Sem funcionários cadastrados" />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid size={6}>
                        <Paper sx={{ p: 1 }} elevation={8}>
                            <List>
                                <ListSubheader sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                    Clientes
                                    <IconButton size="small" onClick={() => setAddUserModalState("cliente")}>
                                        <Add fontSize="small" />
                                    </IconButton>
                                </ListSubheader>
                                {clientes.map((cliente: ClienteType) => {
                                    return (
                                        <ListItem key={cliente._id}>
                                            <ListItemText primary={cliente.nome + " " + cliente.sobrenome} />
                                            <IconButton
                                                onClick={() =>
                                                    openConfirmDeleteModal({
                                                        cb: () => handleDelete(cliente._id, "cliente"),
                                                        message: `Tem certeza que deseja excluir o usuário ${cliente.nome} ${cliente.sobrenome}?`,
                                                    })
                                                }
                                                // disabled={user._id === cliente._id}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </ListItem>
                                    );
                                })}
                                {clientes.length === 0 && (
                                    <ListItem>
                                        <ListItemText secondary="Sem clientes cadastrados" />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
