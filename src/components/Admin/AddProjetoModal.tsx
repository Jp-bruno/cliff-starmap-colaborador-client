import { Button, Grid, LinearProgress, TextField } from "@mui/material";
import { type FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import BaseModal from "../BaseModal";
import axiosBase from "@/axios/axios";

export default function AddProjetoModal({ isOpen, close }: { isOpen: boolean; close: () => void }) {
    const [formData, setFormData] = useState({
        nome: "",
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
            .post("/projeto", JSON.stringify(formData))
            .then(async () => {
                await queryClient.invalidateQueries({ queryKey: ["projetos"] });
                window.alert("Criado com sucesso");
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
        <BaseModal isOpen={isOpen} close={close} title="Criar novo projeto">
            <Grid container component="form" sx={{ p: 2 }} spacing={2} onSubmit={(ev) => handleCreateProjeto(ev)}>
                <Grid size={12}>
                    <TextField
                        label="Nome"
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
