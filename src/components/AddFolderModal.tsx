import { Box, Button, LinearProgress, Stack, TextField } from "@mui/material";
import BaseModal from "./BaseModal";
import axiosBase from "@/axios/axios";
import { useState, type FormEvent } from "react";
import { useProjetoContext } from "@/contexts/projectContext";
import { queryClient } from "@/main";

export default function AddFolderModal({ folderSection, close }: { folderSection: "documentos" | "financeiro" | null; close: () => void }) {
    const [formData, setFormData] = useState<{ nome: string; descricao: string }>({
        nome: "",
        descricao: "",
    });

    function handleClose() {
        setFormData({
            nome: "",
            descricao: "",
        });
        setWaitingRequest(false);
        close();
    }
    const [waitingRequest, setWaitingRequest] = useState(false);

    const { faseSelecionada } = useProjetoContext();

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        setWaitingRequest(true);

        await axiosBase
            .post("/pasta", { ...formData, fase: faseSelecionada?._id, projeto: faseSelecionada?.projeto, secao: folderSection })
            .then(async () => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                console.log("to aqui");
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
        <BaseModal isOpen={!!folderSection} close={handleClose} title="Adicionar nova pasta">
            {!waitingRequest ? (
                <Stack component="form" spacing={1} onSubmit={handleSubmit}>
                    <TextField
                        onChange={(ev) => handleSetFormData("nome", ev.target.value)}
                        required
                        label="Nome"
                        size="small"
                        helperText={`Máximo 25 caracteres (${formData.nome.length})`}
                    />
                    <TextField
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
