import { Box, Card, CardActionArea, Grid, Tooltip, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import VisualizadorCompromisso from "./VisualizadorCompromisso";

export default function CompromissoItem({
    titulo,
    descricao,
    dia,
    mes,
    ano,
}: {
    titulo: string;
    descricao: string;
    dia: string;
    mes: string;
    ano: string;
}) {
    const theme = useTheme();

    const [visualizerState, setVisualizerState] = useState<null | { titulo: string; descricao: string; data: string }>(null);

    return (
        <Grid size={6}>
            <Card>
                <Tooltip title="Clique para ver mais detalhes">
                    <CardActionArea
                        sx={{
                            aspectRatio: "1/1",
                            backgroundColor: theme.palette.primary[100],
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                        }}
                        onClick={() => setVisualizerState({ titulo, descricao, data: `${dia} de ${mes} de ${ano}` })}
                    >
                        <Typography sx={{ fontSize: "0.8rem", width: "100%", textWrap: "wrap", color: theme.palette.common.compromissoFontColor }}>
                            {titulo}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
                            <Typography sx={{ fontSize: "1rem", color: theme.palette.primary.main, fontWeight: 600 }}>{dia}</Typography>
                            <Typography sx={{ fontSize: "1.2rem", color: theme.palette.primary.main }}>{mes}</Typography>
                        </Box>
                    </CardActionArea>
                </Tooltip>
            </Card>
            <VisualizadorCompromisso compromisso={visualizerState} close={() => setVisualizerState(null)} />
        </Grid>
    );
}
