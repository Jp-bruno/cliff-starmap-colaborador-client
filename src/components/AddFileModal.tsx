import { Box, Button, Grid, List, ListItem, ListItemText, Stack, Tooltip } from "@mui/material";
import BaseModal from "./BaseModal";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useProjetoContext } from "@/contexts/projectContext";
import axiosBase from "@/axios/axios";
import axios from "axios";
import LinearProgressBar from "./LinearProgressBar";
import { useQueryClient } from "@tanstack/react-query";
import { Close, CloudUpload, Visibility, VisibilityOff } from "@mui/icons-material";
import TooltipIconButton from "./TooltipIconButton";

type UploadFile = {
    uploadProgress: number;
    done: boolean;
    file: File;
    visivel: boolean;
    nome: string;
    error: boolean;
};

export default function AddFileModal({ isOpen, close, folderId }: { isOpen: boolean; close: () => void; folderId: string }) {
    const [arquivos, setArquivos] = useState<null | UploadFile[]>(null);

    const [waitCb, setWaitCb] = useState(false);

    const { faseSelecionada } = useProjetoContext();

    const queryClient = useQueryClient();

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        setWaitCb(true);

        await axiosBase
            .post(
                "/arquivo",
                arquivos?.map((arquivo) => ({
                    projeto: faseSelecionada?.projeto,
                    fase: faseSelecionada?._id,
                    pasta: folderId,
                    nome: arquivo.nome,
                    mimetype: arquivo.file.type,
                    visivel: Number(arquivo.visivel),
                }))
            )
            .then(async (res) => {
                const files: { nome: string; mimetype: string; signedUrl: string }[] = res.data.files;

                const promises: Promise<void>[] = [];

                files.forEach((file) => {
                    if (!file.signedUrl) {
                        setArquivos((prev) => {
                            return prev!.map((arquivo) => (arquivo.nome === file.nome ? { ...arquivo, error: true } : arquivo));
                        });
                        return;
                    }

                    promises.push(
                        (async () => {
                            await axios.put(file.signedUrl, arquivos?.find((arquivo) => arquivo.nome === file.nome)?.file, {
                                headers: { "Content-Type": file.mimetype },
                                onUploadProgress(progressEvent) {
                                    let progress: number = Math.round((progressEvent.loaded * 100) / progressEvent.total!);

                                    setArquivos((prev) => {
                                        return prev!.map((arquivo) =>
                                            arquivo.nome === file.nome ? { ...arquivo, uploadProgress: progress, done: progress === 100 } : arquivo
                                        );
                                    });
                                },
                            });
                        })()
                            .then(async () => {
                                //TODO: set pending to false
                            })
                            .catch(() => {
                                setArquivos((prev) => {
                                    return prev!.map((arquivo) =>
                                        arquivo.nome === file.nome ? { ...arquivo, uploadProgress: 0, error: true } : arquivo
                                    );
                                });
                            })
                    );
                });

                await Promise.allSettled(promises);
            })
            .finally(async () => {
                await queryClient.invalidateQueries({ queryKey: [`arquivos-pasta:${folderId}`] });
                setWaitCb(false);
            });
    }

    function handleCancel() {
        if (waitCb) {
            return;
        }
        setArquivos(null);
        close();
    }

    return (
        <BaseModal isOpen={isOpen} close={handleCancel} title="Adicionar arquivos" extraStyle={{ width: "600px" }}>
            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    sx={{ maxWidth: "fit-content", alignSelf: "center" }}
                    onClick={() => document.getElementById("file-upload-input")?.click()}
                    disabled={waitCb}
                >
                    Selecionar arquivos
                </Button>

                <input
                    type="file"
                    hidden
                    multiple
                    required
                    disabled={waitCb}
                    onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                        setArquivos(
                            Array.from(ev.target.files!).map((file) => ({
                                file,
                                uploadProgress: 0,
                                done: false,
                                visivel: true,
                                nome: file.name,
                                error: false,
                            }))
                        )
                    }
                    id="file-upload-input"
                />

                <List sx={{ maxHeight: "350px", overflowY: "scroll", border: "solid 1px #00000050", borderRadius: 2, p: 0 }}>
                    {arquivos &&
                        arquivos.map((arquivo: UploadFile, index1) => (
                            <ListItem
                                sx={{
                                    backgroundColor: arquivo.error ? "#ffb9b9" : "white",
                                    "&:not(&:first-of-type)": { borderTop: "solid 1px #00000020" },
                                }}
                                key={arquivo.file.name}
                            >
                                <Grid container sx={{ width: "100%" }} spacing={1}>
                                    <Grid size={10}>
                                        <Box sx={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                                            <Tooltip title={arquivo.file.name}>
                                                <ListItemText
                                                    sx={{ textWrap: "nowrap", textOverflow: "ellipsis" }}
                                                    secondary={arquivo.done ? "Concluído" : ""}
                                                >
                                                    {arquivo.file.name}
                                                </ListItemText>
                                            </Tooltip>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {!arquivo.error && <LinearProgressBar progress={arquivo.uploadProgress} showPercentage={true} />}
                                            {arquivo.error && <ListItemText secondary="Erro ao realizar upload"></ListItemText>}
                                        </Box>
                                    </Grid>
                                    <Grid
                                        size={2}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderLeft: "solid 1px #00000020",
                                            pl: 2,
                                        }}
                                        spacing={1}
                                    >
                                        {!arquivo.done && !arquivo.error && (
                                            <TooltipIconButton
                                                disabled={!!arquivo.uploadProgress}
                                                title={arquivo.visivel ? "Visível" : "Invisível"}
                                                icon={arquivo.visivel ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                                action={() =>
                                                    setArquivos((prev) => {
                                                        return prev!.map((arquivo2, index2) =>
                                                            index1 === index2 ? { ...arquivo2, visivel: !arquivo2.visivel } : arquivo2
                                                        );
                                                    })
                                                }
                                            />
                                        )}
                                        <TooltipIconButton
                                            title={"Remover da lista"}
                                            icon={<Close />}
                                            action={() =>
                                                setArquivos((prev) => {
                                                    return prev!.filter((arquivo2) => !(arquivo.nome === arquivo2.nome));
                                                })
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    {(!arquivos || arquivos.length === 0) && (
                        <ListItem>
                            <ListItemText secondary="Nenhum arquivo selecionado" />
                        </ListItem>
                    )}
                </List>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="contained" type="submit" disabled={waitCb} loading={waitCb}>
                        Enviar
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleCancel} disabled={waitCb}>
                        Cancelar
                    </Button>
                </Box>
            </Stack>
        </BaseModal>
    );
}
