import { createFileRoute, redirect } from "@tanstack/react-router";
import axiosBase from "@/axios/axios";
import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import { type FormEvent, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export const Route = createFileRoute("/resetPassword")({
    component: ResetPassword,
    beforeLoad: async ({ search }) => {
        if (!Object.hasOwn(search, "token")) {
            throw redirect({ to: "/", replace: true });
        }
    },
});

function ResetPassword() {
    const { token, user } = Route.useSearch() as { token: string; user: string };

    const [novaSenha, setNovaSenha] = useState("");
    const [visualize, setVisualize] = useState(false);

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if (novaSenha.length < 8) {
            window.alert("Mínimo 8 caracteres");
            return;
        }

        await axiosBase
            .patch("/colaborador/resetPassword", JSON.stringify({ token: token, userID: user, newPassword: novaSenha }))
            .then((res) => {
                if (res.status === 200) {
                    window.alert("Senha alterada com sucesso");
                }
            })
            .catch((e) => {
                window.alert(e.response.data.message);
            });
    }

    return (
        <Box sx={{ height: "100vh", display: "grid", placeItems: "center" }}>
            <Box component="form" onSubmit={(ev) => handleSubmit(ev)}>
                <TextField
                    size="small"
                    type={visualize ? "text" : "password"}
                    label="Nova senha"
                    value={novaSenha}
                    fullWidth
                    onChange={(ev) => setNovaSenha(ev.target.value)}
                    helperText="Mínimo de 8 caracteres"
                    slotProps={{
                        input: {
                            endAdornment: visualize ? (
                                <Tooltip title="Ocultar senha">
                                    <IconButton onClick={() => setVisualize((prev) => !prev)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Visualizar senha">
                                    <IconButton onClick={() => setVisualize((prev) => !prev)}>
                                        <VisibilityOffIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                        },
                    }}
                />
                <Button type="submit" variant="contained">
                    Enviar
                </Button>
            </Box>
        </Box>
    );
}
