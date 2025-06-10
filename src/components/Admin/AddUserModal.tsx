import { Button, Checkbox, FormControlLabel, Grid, LinearProgress, TextField } from "@mui/material";
import { type FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/axios/axios";
import BaseModal from "../BaseModal";

export default function AddUserModal({ isOpen, close, tipo }: { isOpen: boolean; close: () => void; tipo: "funcionário" | "cliente" }) {
    const [formData, setFormData] = useState<{
        nome: string;
        sobrenome: string;
        email: string;
        administrador: number;
        descricao: string;
    }>({
        nome: "",
        sobrenome: "",
        email: "",
        administrador: 0,
        descricao: ""
    });

    const [loadingApiCall, setLoadingApiCall] = useState(false);

    const queryClient = useQueryClient();

    function handleSetFormData(field: string, value: string | number) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleCreateUser(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setLoadingApiCall(true);
        await axiosBase.post(tipo === "funcionário" ? "/colaborador" : "/cliente", JSON.stringify(formData)).then(async () => {
            await queryClient.invalidateQueries({ queryKey: [`${tipo === "cliente" ? "clientes" : "colaboradores"}`] });
            close();
            setLoadingApiCall(false);
        });
    }

    function handleClose() {
        setFormData({
            nome: "",
            sobrenome: "",
            email: "",
            administrador: 0,
            descricao: ""
        });
        close();
    }

    return (
        <BaseModal isOpen={isOpen} close={handleClose} title={`Cadastrar novo ${tipo}`}>
            <Grid container component="form" spacing={2} onSubmit={(ev) => handleCreateUser(ev)}>
                <Grid size={6}>
                    <TextField
                        label="Nome"
                        disabled={loadingApiCall}
                        required
                        onChange={(ev) => handleSetFormData("nome", ev.target.value)}
                        fullWidth
                        size="small"
                    />
                </Grid>

                <Grid size={6}>
                    <TextField
                        label="Sobrenome"
                        disabled={loadingApiCall}
                        onChange={(ev) => handleSetFormData("sobrenome", ev.target.value)}
                        fullWidth
                        size="small"
                    />
                </Grid>

                <Grid size={12}>
                    <TextField
                        label="E-email"
                        required
                        type="email"
                        onChange={(ev) => handleSetFormData("email", ev.target.value)}
                        fullWidth
                        size="small"
                        disabled={loadingApiCall}
                    />
                </Grid>

                {tipo === "funcionário" && (
                    <>
                        <Grid size={12}>
                            <TextField
                                label="Descrição (descrição da função exercida - aparecerá nos contatos)"
                                required
                                onChange={(ev) => handleSetFormData("descricao", ev.target.value)}
                                fullWidth
                                size="small"
                                disabled={loadingApiCall}
                                helperText={`Máximo 50 caracteres (${formData.descricao.length})`}
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormControlLabel
                                control={<Checkbox onChange={(ev) => handleSetFormData("administrador", Number(ev.target.checked))} />}
                                label="Administrador"
                                disabled={loadingApiCall}
                            />
                        </Grid>
                    </>
                )}

                {loadingApiCall ? (
                    <Grid size={12}>
                        <LinearProgress />
                    </Grid>
                ) : (
                    <Grid size={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button type="submit" variant="contained">
                            Enviar
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </Grid>
                )}
            </Grid>
        </BaseModal>
    );
}
