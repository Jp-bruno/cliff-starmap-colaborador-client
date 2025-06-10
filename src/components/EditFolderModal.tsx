import { Box, Button, LinearProgress, Stack, TextField } from "@mui/material";
import BaseModal from "./BaseModal";
import axiosBase from "@/axios/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import type { PastaType } from "@/types";

export default function EditFolderModal({ folder, close }: { folder: PastaType | null; close: () => void }) {
    const [formData, setFormData] = useState<{ nome: string; descricao: string }>({
        nome: "",
        descricao: "",
    });

    useEffect(() => {
        if (folder) {
            setFormData({
                nome: folder.nome,
                descricao: folder.descricao,
            });
        }
    }, [folder]);

    function handleClose() {
        close();
    }
    const [waitingRequest, setWaitingRequest] = useState(false);

    const queryClient = useQueryClient();

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        setWaitingRequest(true);

        await axiosBase
            .patch(`/pasta/${folder?._id}`, formData)
            .then(async () => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                await queryClient.invalidateQueries({ queryKey: ["projeto"] });
            })
            .finally(() => {
                setWaitingRequest(false)
                handleClose();
            });
    }

    function handleSetFormData(field: string, value: string | { nome: string; tipo: string }) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    return (
        <BaseModal isOpen={!!folder} close={handleClose} title={`Editar pasta ${folder?.nome}`}>
            {!waitingRequest ? (
                <Stack component="form" spacing={1} onSubmit={handleSubmit}>
                    <TextField
                        value={formData.nome}
                        onChange={(ev) => handleSetFormData("nome", ev.target.value)}
                        required
                        label="Nome"
                        size="small"
                        helperText={`Máximo 25 caracteres (${formData.nome.length})`}
                    />
                    <TextField
                        value={formData.descricao}
                        onChange={(ev) => handleSetFormData("descricao", ev.target.value)}
                        label="Descrição"
                        size="small"
                        helperText={`Máximo 30 caracteres (${formData.descricao.length})`}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button type="submit" variant="contained">
                            Enviar
                        </Button>
                        <Button variant="contained" color="warning" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </Box>
                </Stack>
            ) : (
                <LinearProgress />
            )}
        </BaseModal>
    );
}
