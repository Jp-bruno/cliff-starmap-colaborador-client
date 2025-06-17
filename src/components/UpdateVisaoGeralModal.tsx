import { useState, type FormEvent } from "react";
import BaseModal from "./BaseModal";
import type { FaseType } from "@/types";
import { Box, Button, Stack, styled, Typography } from "@mui/material";
import axiosBase from "@/axios/axios";
import { useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import LinearProgressBar from "./LinearProgressBar";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export default function UpdateVisaoGeralModal({
    isOpen,
    close,
    faseSelecionada,
}: {
    isOpen: boolean;
    close: () => void;
    faseSelecionada: FaseType;
}) {
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | null>(null);
    const [fileUploadProgress, setFileUploadProgress] = useState<null | number>(null);

    function handleClose() {
        close();
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        setFileUploadProgress(1);

        await axiosBase
            .patch(`/fase/${faseSelecionada._id}/visaoGeral`, { nome: file?.name, mimetype: file?.type })
            .then(async (res) => {
                //TODO: dar feedback do request (sucesso, falha, etc)
                if (res.data.signedUrl) {
                    await axios.put(res.data.signedUrl, file, {
                        headers: { "Content-Type": file?.type },
                        onUploadProgress(progressEvent) {
                            let progress: number = Math.round((progressEvent.loaded * 100) / progressEvent.total!);

                            setFileUploadProgress(progress);
                        },
                    });
                }
                await queryClient.invalidateQueries({ queryKey: ["projeto"] });
            })
            .finally(() => {
                handleClose();
                setFileUploadProgress(null)
            });
    }

    return (
        <BaseModal isOpen={isOpen} close={close} title="Editar dados da visão geral">
            <Stack component="form" onSubmit={handleSubmit} spacing={1}>
                <Button component="label" variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
                    Anexar arquivo
                    <VisuallyHiddenInput required type="file" onChange={(event) => setFile(event.target.files![0] ?? null)} />
                </Button>
                {file && <Typography>Arquivo anexado: {file.name}</Typography>}
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Button variant="contained" type="submit">
                        Enviar
                    </Button>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Box>
                {fileUploadProgress && <LinearProgressBar progress={fileUploadProgress} showPercentage />}
            </Stack>
        </BaseModal>
    );
}
