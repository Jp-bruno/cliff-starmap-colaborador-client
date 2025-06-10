import { useState, type FormEvent } from "react";
import BaseModal from "../BaseModal";
import { Box, Button, LinearProgress, Stack, TextField } from "@mui/material";
import axiosBase from "@/axios/axios";
import { useProjetoContext } from "@/contexts/projectContext";
import { useQueryClient } from "@tanstack/react-query";

export default function AddItemAgendaModal({ isOpen, close }: { isOpen: boolean; close: () => void }) {
    const [formData, setFormData] = useState({
        titulo: "",
        data: "",
        descricao: "",
    });

    const { faseSelecionada } = useProjetoContext();

    const [loadingApiCall, setLoadingApiCall] = useState(false);

    const queryClient = useQueryClient();

    function handleSetFormData(field: string, value: string) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function handleClose() {
        setFormData({ data: "", titulo: "", descricao: "" });
        close();
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        setLoadingApiCall(true);

        await axiosBase
            .post("/itemAgenda", { ...formData, fase: faseSelecionada?._id, projeto: faseSelecionada?.projeto })
            .then(async () => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                await queryClient.invalidateQueries({ queryKey: [`fase-${faseSelecionada?._id}-agenda`] });
                await queryClient.invalidateQueries({ queryKey: [`projeto`] });
                handleClose();
            })
            .catch((e) => {
                window.alert(e.response.data.message);
            })
            .finally(() => {
                setLoadingApiCall(false);
            });
    }

    return (
        <BaseModal isOpen={isOpen} close={handleClose} title="Adicionar item à agenda da fase">
            <Stack component="form" onSubmit={handleSubmit} spacing={1}>
                <TextField
                    label="Título"
                    size="small"
                    helperText={`Máximo 20 caracteres (${formData.titulo.length})`}
                    onChange={(ev) => handleSetFormData("titulo", ev.target.value)}
                    required
                    disabled={loadingApiCall}
                />
                <TextField
                    label="Data"
                    onChange={(ev) => handleSetFormData("data", ev.target.value)}
                    type="date"
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                    size="small"
                    disabled={loadingApiCall}
                />
                <TextField
                    label="Descrição"
                    size="small"
                    helperText={`Máximo 50 caracteres (${formData.descricao.length})`}
                    onChange={(ev) => handleSetFormData("descricao", ev.target.value)}
                    required
                    disabled={loadingApiCall}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="contained" type="submit" disabled={loadingApiCall}>
                        Enviar
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleClose} disabled={loadingApiCall}>
                        Cancelar
                    </Button>
                </Box>
                {loadingApiCall && <LinearProgress />}
            </Stack>
        </BaseModal>
    );
}
