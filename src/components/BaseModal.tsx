import { Box, Divider, Modal, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";

export default function BaseModal({ isOpen, close, title, children }: { isOpen: boolean; close: () => void; title: string; children: ReactNode }) {
    return (
        <Modal open={isOpen} onClose={close} sx={{ display: "grid", placeItems: "center" }}>
            <Paper>
                <Typography textAlign="center" sx={{p: 1}}>{title}</Typography>
                <Divider />
                <Box sx={{ p: 2 }}>{children}</Box>
            </Paper>
        </Modal>
    );
}
