import axiosBase from "@/axios/axios";
import { Button, Grid, Stack, TextField } from "@mui/material";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
    component: App,
    beforeLoad: async () => {
        const responseStatus = await axiosBase("/auth/status")
            .then((response) => {
                return response.status;
            })
            .catch((e) => {
                console.log(e);
            });

        if (responseStatus === 200) {
            throw redirect({ to: "/projetos", replace: true });
        }
    },
});

function App() {
    const navigate = useNavigate();

    const [forgotPw, setForgotPw] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        senha: "",
    });

    const [loadingAuth, setLoadingAuth] = useState(false);

    function handleSetFormData(field: string, value: string) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        setLoadingAuth(true);

        if (!forgotPw) {
            await axiosBase
                .post("/auth", formData)
                .then((res) => {
                    if (res.status === 200) {
                        navigate({ to: "/projetos" });
                    }
                })
                .catch((e) => {
                    window.alert(e.response.data.message);
                })
                .finally(() => {
                    setLoadingAuth(false);
                });

            return;
        }

        await axiosBase.post("/colaborador/requestPasswordReset", { email: formData.email }).then((res) => {
            if (res.status === 200) {
                window.alert("Verifique sua caixa de entrada");
                setForgotPw(false);
            }
        });
    }

    return (
        <Grid container>
            <Grid size={3}>
                <Stack spacing={1} component="form" onSubmit={handleSubmit}>
                    {forgotPw ? (
                        <>
                            <TextField
                                disabled={loadingAuth}
                                onChange={(ev) => handleSetFormData("email", ev.target.value)}
                                label="Email"
                                type="email"
                                required
                                size="small"
                            />
                            <Button disabled={loadingAuth} size="small" type="submit" variant="contained">
                                Enviar
                            </Button>
                            <Button disabled={loadingAuth} size="small" variant="outlined" onClick={() => setForgotPw(false)}>
                                Voltar
                            </Button>
                        </>
                    ) : (
                        <>
                            <TextField
                                disabled={loadingAuth}
                                onChange={(ev) => handleSetFormData("email", ev.target.value)}
                                label="Email"
                                type="email"
                                required
                                size="small"
                            />
                            <TextField
                                disabled={loadingAuth}
                                onChange={(ev) => handleSetFormData("senha", ev.target.value)}
                                label="Senha"
                                type="password"
                                required
                                size="small"
                            />
                            <Button disabled={loadingAuth} size="small" type="submit" variant="contained">
                                Entrar
                            </Button>
                            <Button disabled={loadingAuth} size="small" variant="text" onClick={() => setForgotPw(true)}>
                                Esqueci a senha
                            </Button>
                        </>
                    )}
                </Stack>
            </Grid>
            <Grid size={9}>oi</Grid>
        </Grid>
    );
}
