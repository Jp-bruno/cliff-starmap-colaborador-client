import { Box, Button, LinearProgress, Stack, TextField } from "@mui/material";
import BaseModal from "./BaseModal";
import { useState, type FormEvent } from "react";
import axiosBase from "@/axios/axios";
import { useProjetoContext } from "@/contexts/projectContext";
import axios from "axios";

export default function AddFaseModal({ isOpen, close }: { isOpen: boolean; close: () => void }) {
    const [formData, setFormData] = useState<{ nome: string; descricao: string; banner: { nome: string; tipo: string } | null }>({
        nome: "",
        descricao: "",
        banner: null,
    });

    const [waitingRequest, setWaitingRequest] = useState(false);

    const { projeto, refetch } = useProjetoContext();

    function handleClose() {
        setFormData({ nome: "", descricao: "", banner: null });
        setWaitingRequest(false);
        close();
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        const file = (document.querySelector(".banner-file-input") as HTMLInputElement).files![0];

        setWaitingRequest(true);

        await axiosBase
            .post("/fase", { ...formData, projeto: projeto!._id })
            .then(async (res) => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                if (res.data.signedUrl) {
                    await axios.put(res.data.signedUrl, file, {
                        headers: { "Content-Type": file.type },
                    });
                }
            })
            .finally(async () => {
                refetch();
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
                        helperText={`Máximo 20 caracteres (${formData.nome.length})`}
                    />
                    <TextField
                        onChange={(ev) => handleSetFormData("descricao", ev.target.value)}
                        label="Descrição"
                        size="small"
                        helperText={`Máximo 30 caracteres (${formData.descricao.length})`}
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
                        slotProps={{ inputLabel: { shrink: true }, htmlInput: { className: "banner-file-input" } }}
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
