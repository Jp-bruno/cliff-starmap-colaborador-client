import axiosBase from "@/axios/axios";
import { Stack, TextField, Box, Button, LinearProgress } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import BaseModal from "../BaseModal";
import type { ItemAgendaType } from "@/types";

export default function EditItemAgendaModal({ itemAgenda, close }: { itemAgenda: ItemAgendaType | null; close: () => void }) {
    const [formData, setFormData] = useState({
        titulo: "",
        data: "",
        descricao: "",
    });

    const queryClient = useQueryClient();

    const [loadingApiCall, setLoadingApiCall] = useState(false);

    useEffect(() => {
        if (itemAgenda) {
            setFormData({
                titulo: itemAgenda.titulo,
                descricao: itemAgenda.descricao,
                data: itemAgenda.data,
            });
        }
    }, [itemAgenda]);

    function handleSetFormData(field: string, value: string) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function handleClose() {
        setFormData({ data: itemAgenda!.data, titulo: itemAgenda!.titulo, descricao: itemAgenda!.descricao });
        close();
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        setLoadingApiCall(true);

        await axiosBase
            .patch(`/itemAgenda/${itemAgenda!._id}`, formData)
            .then(async () => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                await queryClient.invalidateQueries({ queryKey: [`fase-${itemAgenda!.fase}-agenda`] });
                await queryClient.invalidateQueries({ queryKey: [`projeto`] });
                handleClose();
            })
            .finally(() => setLoadingApiCall(false));
    }

    return (
        <BaseModal isOpen={!!itemAgenda} close={handleClose} title="Adicionar item à agenda da fase">
            <Stack component="form" onSubmit={handleSubmit} spacing={1}>
                <TextField
                    value={formData.titulo}
                    helperText={`Máximo 20 caracteres (${formData.titulo.length})`}
                    label="Título"
                    size="small"
                    onChange={(ev) => handleSetFormData("titulo", ev.target.value)}
                    required
                    disabled={loadingApiCall}
                />
                <TextField
                    value={formData.data.slice(0, 10)}
                    label="Data"
                    size="small"
                    onChange={(ev) => handleSetFormData("data", ev.target.value)}
                    type="date"
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                    disabled={loadingApiCall}
                />
                <TextField
                    value={formData.descricao}
                    size="small"
                    label="Descrição"
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
