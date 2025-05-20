import { Box, Button, FormControlLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import BaseModal from "./BaseModal";
import { useState, type FormEvent } from "react";
import { useProjetoContext } from "@/contexts/projectContext";
import axiosBase from "@/axios/axios";
import axios from "axios";
import LinearProgressBar from "./LinearProgressBar";
import { useQueryClient } from "@tanstack/react-query";

export default function AddFileModal({ isOpen, close, folderId }: { isOpen: boolean; close: () => void; folderId: string }) {
    const [visivel, setVisibilidade] = useState(1);

    const [fileUploadProgress, setFileUploadProgress] = useState<null | number>(null);
    const [waitCb, setWaitCb] = useState(false);

    const { faseSelecionada } = useProjetoContext();

    const queryClient = useQueryClient();

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        const file = (document.querySelector(".file-input") as HTMLInputElement).files![0];

        console.log(file.name, file.type);

        setWaitCb(true);

        await axiosBase
            .post("/arquivo", {
                nome: file.name,
                tipo: file.type,
                visivel,
                fase: faseSelecionada?._id,
                projeto: faseSelecionada?.projeto,
                pasta: folderId,
            })
            .then(async (res) => {
                await axios.put(res.data.signedUrl, file, {
                    headers: { "Content-Type": file.type },
                    onUploadProgress(progressEvent) {
                        let progress: number = Math.round((progressEvent.loaded * 100) / progressEvent.total!);

                        setFileUploadProgress(progress);
                    },
                });

                await queryClient.invalidateQueries({ queryKey: [`arquivos-pasta:${folderId}`] });
            })
            .finally(() => {
                setWaitCb(false);
                setFileUploadProgress(null);
                //TODO: Feedback de sucesso ou falha
            });
    }

    return (
        <BaseModal isOpen={isOpen} close={close} title="Adicionar arquivo">
            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                <TextField
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { className: "file-input" } }}
                    required
                    type="file"
                    label="Arquivo"
                    disabled={waitCb}
                />

                <RadioGroup onChange={(ev) => setVisibilidade(Number(ev.target.value))} value={visivel}>
                    <FormControlLabel value={1} defaultChecked control={<Radio />} label="Visível" disabled={waitCb} />
                    <FormControlLabel value={0} control={<Radio />} label="Invisível" disabled={waitCb} />
                </RadioGroup>

                {!waitCb && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" type="submit">
                            Enviar
                        </Button>
                        <Button variant="outlined" color="error" onClick={close}>
                            Cancelar
                        </Button>
                    </Box>
                )}

                {fileUploadProgress && <LinearProgressBar progress={fileUploadProgress} showPercentage />}
            </Stack>
        </BaseModal>
    );
}
