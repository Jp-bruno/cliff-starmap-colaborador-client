import { Box, Grid, Typography, useTheme } from "@mui/material";

export default function CompromissoItem({ titulo, dia, mes }: { titulo: string; dia: string; mes: string }) {
    const theme = useTheme();

    console.log({ titulo, dia, mes });

    return (
        <Grid
            size={6}
            sx={{
                aspectRatio: "1/1",
                borderRadius: "16px",
                backgroundColor: theme.palette.primary[100],
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Typography sx={{ fontSize: "0.8rem", width: "100%", textWrap: "wrap", color: theme.palette.common.compromissoFontColor }}>
                {titulo}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Typography sx={{ fontSize: "1.9rem", color: theme.palette.primary.main, fontWeight: 600 }}>{dia}</Typography>
                <Typography sx={{ fontSize: "1.9rem", color: theme.palette.primary.main }}>{mes}</Typography>
            </Box>
        </Grid>
    );
}
