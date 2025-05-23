import type { FaseType } from "@/types";
import BaseModal from "../BaseModal";
import { Box, Button, LinearProgress, Stack, TextField } from "@mui/material";
import { useEffect, useState, type FormEvent } from "react";
import axiosBase from "@/axios/axios";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function EditFaseModal({ fase, close }: { fase: FaseType | null; close: () => void }) {
    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        banner: null,
    });

    const queryClient = useQueryClient();

    const [waitingRequest, setWaitingRequest] = useState(false);

    useEffect(() => {
        if (fase) {
            setFormData({
                nome: fase.nome,
                descricao: fase.descricao,
                banner: null,
            });
        }
    }, [fase]);

    function handleClose() {
        setFormData({ nome: fase!.nome, descricao: fase!.descricao, banner: null });
        setWaitingRequest(false);
        close();
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        const file = (document.querySelector(".banner-file-input") as HTMLInputElement).files![0];

        setWaitingRequest(true);

        await axiosBase
            .patch("/fase", { ...formData, id: fase?._id })
            .then(async (res) => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                if (res.data.signedUrl) {
                    await axios.put(res.data.signedUrl, file, {
                        headers: { "Content-Type": file.type },
                    });
                }
            })

            .finally(async () => {
                handleClose();
                await queryClient.invalidateQueries({ queryKey: ["projeto"] });
            });
    }

    function handleSetFormData(field: string, value: string | { nome: string; tipo: string }) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    return (
        <BaseModal isOpen={!!fase} close={close} title={`Editar fase ${fase?.nome}`}>
            {!waitingRequest ? (
                <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                    <TextField
                        value={formData.nome}
                        onChange={(ev) => handleSetFormData("nome", ev.target.value)}
                        required
                        label="Nome"
                        size="small"
                        helperText="Máximo 20 caracteres"
                    />
                    <TextField
                        value={formData.descricao}
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
                        slotProps={{ inputLabel: { shrink: true }, htmlInput: { className: "banner-file-input" } }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" type="submit">
                            Enviar
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleClose}>
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
