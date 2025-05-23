import { useState, type FormEvent } from "react";
import BaseModal from "./BaseModal";
import type { FaseType } from "@/types";
import { Box, Button, Stack, TextField } from "@mui/material";
import axiosBase from "@/axios/axios";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdateDadosFinanceirosModal({
    isOpen,
    close,
    faseSelecionada,
}: {
    isOpen: boolean;
    close: () => void;
    faseSelecionada: FaseType;
}) {
    const [formData, setFormData] = useState({
        valorProjetado: faseSelecionada.valorProjetado,
        valorOrcado: faseSelecionada.valorOrcado,
        valorReal: faseSelecionada.valorReal,
    });

    const queryClient = useQueryClient();

    function handleSetFormData(field: string, value: string) {
        setFormData((prev) => ({
            ...prev,
            [field]: Number(value),
        }));
    }

    function handleClose() {
        close();
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        await axiosBase
            .patch(`/fase/${faseSelecionada._id}/financeiro`, formData)
            .then(async () => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                await queryClient.invalidateQueries({ queryKey: ["projeto"] });
            })
            .finally(() => {
                handleClose();
            });
    }

    return (
        <BaseModal isOpen={isOpen} close={close} title="Editar dados financeiros">
            <Stack component="form" onSubmit={handleSubmit} spacing={1}>
                <TextField
                    required
                    type="number"
                    onChange={(ev) => handleSetFormData("valorProjetado", ev.target.value)}
                    label="Valor projetado"
                    size="small"
                    value={formData.valorProjetado}
                />
                <TextField
                    required
                    type="number"
                    onChange={(ev) => handleSetFormData("valorOrcado", ev.target.value)}
                    label="Valor orçado"
                    size="small"
                    value={formData.valorOrcado}
                />
                <TextField
                    required
                    type="number"
                    onChange={(ev) => handleSetFormData("valorReal", ev.target.value)}
                    label="Valor real"
                    size="small"
                    value={formData.valorReal}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="contained" type="submit">
                        Enviar
                    </Button>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Box>
            </Stack>
        </BaseModal>
    );
}
