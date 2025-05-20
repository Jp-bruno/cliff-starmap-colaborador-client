import axiosBase from "@/axios/axios";
import { Stack, TextField, Box, Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import BaseModal from "../BaseModal";
import type { ItemAgendaType } from "types";

export default function EditItemAgendaModal({ itemAgenda, close }: { itemAgenda: ItemAgendaType | null; close: () => void }) {
    const [formData, setFormData] = useState({
        titulo: "",
        data: "",
        descricao: "",
    });

    const queryClient = useQueryClient();

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

        await axiosBase
            .patch(`/itemAgenda/${itemAgenda!._id}`, formData)
            .then(async () => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                await queryClient.invalidateQueries({ queryKey: [`fase-${itemAgenda!.fase}-agenda`] });
            })
            .finally(() => handleClose());
    }

    return (
        <BaseModal isOpen={!!itemAgenda} close={handleClose} title="Adicionar item à agenda da fase">
            <Stack component="form" onSubmit={handleSubmit} spacing={1}>
                <TextField value={formData.titulo} label="Título" onChange={(ev) => handleSetFormData("titulo", ev.target.value)} required />
                <TextField
                    value={formData.data.slice(0, 10)}
                    label="Data"
                    onChange={(ev) => handleSetFormData("data", ev.target.value)}
                    type="date"
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField value={formData.descricao} label="Descrição" onChange={(ev) => handleSetFormData("descricao", ev.target.value)} required />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="contained" type="submit">
                        Enviar
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Box>
            </Stack>
        </BaseModal>
    );
}
