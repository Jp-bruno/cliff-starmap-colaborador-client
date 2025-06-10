import axiosBase from "@/axios/axios";
import { Button, Grid, LinearProgress, Stack, TextField } from "@mui/material";
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
                .then(async (res) => {
                    if (res.status === 200) {
                        await navigate({ to: "/projetos" }).then(() => setLoadingAuth(false));
                    }
                })
                .catch((e) => {
                    window.alert(e.response.data.message);
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
                <Stack spacing={1} component="form" onSubmit={handleSubmit} sx={{ height: "100vh", justifyContent: "center", p: 2 }}>
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
                            {loadingAuth && <LinearProgress />}
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
                            {loadingAuth && <LinearProgress />}
                        </>
                    )}
                </Stack>
            </Grid>
            <Grid
                size={9}
                sx={{
                    backgroundImage: "url('https://orion-website.b-cdn.net/Painel_Estelar.png')",
                    backgroundSize: "cover",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <img src="https://orion-website.b-cdn.net/orion-logo.png" alt="Orion" width={250} />
            </Grid>
        </Grid>
    );
}
