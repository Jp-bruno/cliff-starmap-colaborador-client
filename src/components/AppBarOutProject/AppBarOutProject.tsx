import { AppBar, Box, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import TooltipIconButton from "../TooltipIconButton";
import { useState } from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useNavigate } from "@tanstack/react-router";
import { Home } from "@mui/icons-material";

export default function AppBarOutProject() {
    const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState<null | HTMLElement>(null);

    const adminMenuOpen = Boolean(adminMenuAnchorEl);

    const handleClickAdminMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAdminMenuAnchorEl(event.currentTarget);
    };

    const handleCloseAdminMenu = () => {
        setAdminMenuAnchorEl(null);
    };

    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<null | HTMLElement>(null);

    const profileMenuOpen = Boolean(profileMenuAnchorEl);

    const handleClickProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setProfileMenuAnchorEl(event.currentTarget);
    };

    const handleCloseProfileMenu = () => {
        setProfileMenuAnchorEl(null);
    };

    const navigate = useNavigate();

    function goTo(path: string) {
        handleCloseAdminMenu();
        handleCloseProfileMenu();
        navigate({ to: path });
    }

    return (
        <AppBar position="fixed" elevation={1}>
            <Toolbar sx={{ display: "grid", gridTemplateColumns: "70% 30%", backgroundColor: "white", color: "black" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" noWrap component="div">
                        Orion Arquitetura
                    </Typography>

                    <Menu
                        anchorEl={adminMenuAnchorEl}
                        anchorOrigin={{ horizontal: -50, vertical: "bottom" }}
                        open={adminMenuOpen}
                        onClose={handleCloseAdminMenu}
                    >
                        <MenuItem onClick={() => goTo("/admin/usuarios")}>Usuários</MenuItem>
                        <MenuItem onClick={() => goTo("/admin/projetos")}>Projetos</MenuItem>
                    </Menu>

                    <Menu
                        anchorEl={profileMenuAnchorEl}
                        anchorOrigin={{ horizontal: 0, vertical: "bottom" }}
                        open={profileMenuOpen}
                        onClose={handleCloseProfileMenu}
                    >
                        <MenuItem onClick={handleCloseProfileMenu}>Perfil</MenuItem>
                        <MenuItem onClick={handleCloseProfileMenu}>Sair</MenuItem>
                    </Menu>
                </Box>

                <Stack direction="row" alignItems={"center"} spacing={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <TooltipIconButton action={() => navigate({ to: "/projetos" })} icon={<Home />} title="Ir para projetos" />
                    <TooltipIconButton action={handleClickAdminMenu} icon={<AdminPanelSettingsIcon />} title="Área do administrador" />
                    <TooltipIconButton action={handleClickProfileMenu} icon={<AccountCircleOutlinedIcon />} title="" />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
