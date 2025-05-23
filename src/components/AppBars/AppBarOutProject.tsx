import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import AppBarMenu from "./AppBarMenu";

export default function AppBarOutProject() {
    return (
        <AppBar position="fixed" elevation={1}>
            <Toolbar sx={{ display: "grid", gridTemplateColumns: "70% 30%", backgroundColor: "white", color: "black" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" noWrap component="div">
                        Orion Arquitetura
                    </Typography>
                </Box>

                <AppBarMenu />
            </Toolbar>
        </AppBar>
    );
}
