import { useDeleteConfirmPrompt } from "@/contexts/deleteConfirmPromptContext";
import { Box, Button, Divider, LinearProgress, Modal, Paper, Typography } from "@mui/material";
import { useState } from "react";

export default function DeleteConfirmPrompt() {
    const [disable, setDisable] = useState(false);

    const { state, close } = useDeleteConfirmPrompt();

    async function handleCallback() {
        setDisable(true);
        await state?.cb!().then(() => {
            setDisable(false);
            close()
        });
    }

    return (
        <Modal open={!!state} onClose={close} sx={{ display: "grid", placeItems: "center" }}>
            <Paper sx={{ textAlign: "center", maxWidth: "500px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
                    <Typography>{state?.message}</Typography>
                    {state?.extraMessage && (
                        <Typography sx={{ textAlign: "center" }} variant="caption">
                            {state?.extraMessage}
                        </Typography>
                    )}
                </Box>

                <Divider />

                {disable ? (
                    <Box>
                        <LinearProgress />
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                        <Button variant="contained" color="error" onClick={handleCallback}>
                            Sim, excluir
                        </Button>
                        <Button variant="outlined" color="error" onClick={close}>
                            Cancelar
                        </Button>
                    </Box>
                )}
            </Paper>
        </Modal>
    );
}
