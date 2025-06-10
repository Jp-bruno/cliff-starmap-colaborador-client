import axiosBase from "@/axios/axios";
import type { ProjetoType } from "@/types";
import { Grid, TextField, LinearProgress, Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import BaseModal from "../BaseModal";

export default function UpdateProjetoNameModal({ isOpen, close, projeto }: { isOpen: boolean; close: () => void; projeto: ProjetoType }) {
    const [formData, setFormData] = useState({
        nome: projeto.nome,
    });

    const queryClient = useQueryClient();

    const [loadingApiCall, setLoadingApiCall] = useState(false);

    function handleSetFormData(field: string, value: string) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleCreateProjeto(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setLoadingApiCall(true);
        await axiosBase
            .patch("/projeto", { ...formData, id: projeto._id })
            .then(async () => {
                await queryClient.invalidateQueries({ queryKey: ["projetos"] });
                window.alert("Alterado com sucesso");
                close();
            })
            .catch((e) => {
                console.log(e);
                window.alert("Erro: " + e.response.data.message);
            })
            .finally(() => {
                setLoadingApiCall(false);
            });
    }

    return (
        <BaseModal isOpen={isOpen} close={close} title={`Alterar nome de ${projeto.nome}`}>
            <Grid container component="form" sx={{ p: 2 }} spacing={2} onSubmit={(ev) => handleCreateProjeto(ev)}>
                <Grid size={12}>
                    <TextField
                        label="Nome"
                        value={formData.nome}
                        disabled={loadingApiCall}
                        onChange={(ev) => handleSetFormData("nome", ev.target.value)}
                        fullWidth
                        size="small"
                    />
                </Grid>

                {loadingApiCall ? (
                    <Grid size={12}>
                        <LinearProgress />
                    </Grid>
                ) : (
                    <Grid size={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button type="submit" variant="contained" disabled={!formData.nome}>
                            Enviar
                        </Button>
                        <Button variant="outlined" color="error" onClick={close}>
                            Cancelar
                        </Button>
                    </Grid>
                )}
            </Grid>
        </BaseModal>
    );
}
