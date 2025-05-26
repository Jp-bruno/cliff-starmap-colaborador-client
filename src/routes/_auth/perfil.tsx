import axiosBase from "@/axios/axios";
import BaseModal from "@/components/BaseModal";
import { Box, Button, Container, Grid, LinearProgress, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/_auth/perfil")({
    component: RouteComponent,
});

function RouteComponent() {
    const theme = useTheme();

    const user = JSON.parse(localStorage.getItem("userData")!);

    const [userModal, setUserModal] = useState(false);

    const [waitingCall, setWaitingCall] = useState(false);

    const [formData, setFormData] = useState({
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
        telefone: user.telefone,
    });

    function handleSetFormData(field: string, value: string) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function handleCancel() {
        setFormData({
            nome: user.nome,
            sobrenome: user.sobrenome,
            email: user.email,
            telefone: user.telefone,
        });
        setUserModal(false);
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        setWaitingCall(true);

        await axiosBase
            .patch("/colaborador", { ...formData, id: user._id })
            .then((res) => {
                //TODO: FEEDBACK DA CALL
                localStorage.setItem("userData", JSON.stringify(res.data));
            })
            .finally(() => {
                setWaitingCall(false);
                setUserModal(false);
            });
    }

    //TODO: Adicionar foto de perfil do usuário
    //TODO: Adicionar telefone do usuário

    return (
        <>
            <Box sx={{ ...theme.mixins.toolbar }}></Box>
            <Container sx={{ pt: 3 }}>
                <Paper sx={{ p: 2 }} elevation={8}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Typography variant="h5">
                                {user.nome} {user.sobrenome}
                            </Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography>E-mail: {user.email}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography>Telefone: {user.telefone}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Button variant="outlined" onClick={() => setUserModal(true)}>
                                Editar dados
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            <BaseModal isOpen={userModal} close={() => setUserModal(false)} title="Editar seus dados">
                <Stack component="form" onSubmit={handleSubmit} spacing={1}>
                    <TextField
                        size="small"
                        onChange={(ev) => handleSetFormData("nome", ev.target.value)}
                        value={formData.nome}
                        required
                        label="Nome"
                        disabled={waitingCall}
                    />
                    <TextField
                        size="small"
                        onChange={(ev) => handleSetFormData("sobrenome", ev.target.value)}
                        value={formData.sobrenome}
                        required
                        label="Sobrenome"
                        disabled={waitingCall}
                    />
                    <TextField
                        size="small"
                        type="email"
                        onChange={(ev) => handleSetFormData("email", ev.target.value)}
                        value={formData.email}
                        required
                        label="Email"
                        disabled={waitingCall}
                    />
                    <TextField
                        size="small"
                        type="text"
                        onChange={(ev) => handleSetFormData("telefone", ev.target.value)}
                        value={formData.telefone}
                        required
                        label="Telefone"
                        disabled={waitingCall}
                    />
                    <Button type="submit" variant="contained" disabled={waitingCall}>
                        Enviar
                    </Button>
                    <Button onClick={handleCancel} variant="outlined" disabled={waitingCall}>
                        Cancelar
                    </Button>

                    {waitingCall && <LinearProgress />}
                </Stack>
            </BaseModal>
        </>
    );
}
