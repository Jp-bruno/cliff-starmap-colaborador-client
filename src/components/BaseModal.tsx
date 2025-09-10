import { Box, Divider, Modal, Paper, Typography, type SxProps } from "@mui/material";
import type { ReactNode } from "react";

export default function BaseModal({
    isOpen,
    close,
    title,
    children,
    extraStyle,
}: {
    isOpen: boolean;
    close: () => void;
    title: string;
    children: ReactNode;
    extraStyle?: SxProps;
}) {
    return (
        <Modal open={isOpen} onClose={close} sx={{ display: "grid", placeItems: "center" }}>
            <Paper sx={{ ...extraStyle }}>
                <Typography textAlign="center" sx={{ p: 1 }}>
                    {title}
                </Typography>
                <Divider />
                <Box sx={{ p: 2 }}>{children}</Box>
            </Paper>
        </Modal>
    );
}
