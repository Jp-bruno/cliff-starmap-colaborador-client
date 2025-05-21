import { useState, type FormEvent } from "react";
import BaseModal from "../BaseModal";
import { Box, Button, Stack, TextField } from "@mui/material";
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

        await axiosBase
            .post("/itemAgenda", { ...formData, fase: faseSelecionada?._id, projeto: faseSelecionada?.projeto })
            .then(async () => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                await queryClient.invalidateQueries({ queryKey: [`fase-${faseSelecionada?._id}-agenda`] });
                await queryClient.invalidateQueries({ queryKey: [`projeto`] });
            })
            .finally(() => handleClose());
    }

    return (
        <BaseModal isOpen={isOpen} close={handleClose} title="Adicionar item à agenda da fase">
            <Stack component="form" onSubmit={handleSubmit} spacing={1}>
                <TextField label="Título" onChange={(ev) => handleSetFormData("titulo", ev.target.value)} required />
                <TextField
                    label="Data"
                    onChange={(ev) => handleSetFormData("data", ev.target.value)}
                    type="date"
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField label="Descrição" onChange={(ev) => handleSetFormData("descricao", ev.target.value)} required />
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
