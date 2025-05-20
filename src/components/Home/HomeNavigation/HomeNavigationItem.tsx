import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

export default function HomeNavigationItem({
    title,
    description,
    icon,
    link,
    backgroundColor,
}: {
    title: string;
    description: string;
    icon: ReactNode;
    link: string;
    backgroundColor: string;
}) {
    const navigate = useNavigate();

    return (
        <Grid size={6}>
            <Card sx={{ width: "100%", height: "100%", borderRadius: 4, backgroundColor, color: "white" }}>
                <CardActionArea
                    sx={{ width: "100%", height: "100%", p: 3, display: "flex", justifyContent: "space-between" }}
                    onClick={() => navigate({ to: link })}
                >
                    <Box>
                        <Typography variant="h4">{title}</Typography>
                        <Typography>{description}</Typography>
                    </Box>

                    <Box sx={{ "& svg": { zoom: 1.5 } }}>{icon}</Box>
                </CardActionArea>
            </Card>
        </Grid>
    );
}
