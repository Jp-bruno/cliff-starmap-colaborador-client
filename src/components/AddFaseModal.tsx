import { Box, Button, LinearProgress, Stack, TextField } from "@mui/material";
import BaseModal from "./BaseModal";
import { useState, type FormEvent } from "react";
import axiosBase from "@/axios/axios";
import { queryClient } from "@/main";
import { useProjetoContext } from "@/contexts/projectContext";

export default function AddFaseModal({ isOpen, close }: { isOpen: boolean; close: () => void }) {
    const [formData, setFormData] = useState<{ nome: string; descricao: string; banner: { nome: string; tipo: string } | null }>({
        nome: "",
        descricao: "",
        banner: null,
    });

    const [waitingRequest, setWaitingRequest] = useState(false);

    const { projeto } = useProjetoContext();

    function handleClose() {
        setFormData({ nome: "", descricao: "", banner: null });
        setWaitingRequest(false);
        close();
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        setWaitingRequest(true);

        await axiosBase
            .post("/fase", { ...formData, projeto: projeto!._id })
            .then(async () => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                await queryClient.invalidateQueries({ queryKey: ["projeto"] });
            })
            .finally(() => {
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
        <BaseModal isOpen={isOpen} title="Adicionar nova fase" close={handleClose}>
            {!waitingRequest ? (
                <Stack component="form" spacing={1} onSubmit={handleSubmit}>
                    <TextField
                        onChange={(ev) => handleSetFormData("nome", ev.target.value)}
                        required
                        label="Nome"
                        size="small"
                        helperText="Máximo 20 caracteres"
                    />
                    <TextField
                        onChange={(ev) => handleSetFormData("descricao", ev.target.value)}
                        label="Descrição"
                        size="small"
                        helperText="Máximo 30 caracteres"
                    />
                    <TextField
                        onChange={(ev) =>
                            handleSetFormData("banner", {
                                nome: (ev.target as HTMLInputElement).files![0].name,
                                tipo: (ev.target as HTMLInputElement).files![0].type,
                            })
                        }
                        label="Banner"
                        type="file"
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
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
