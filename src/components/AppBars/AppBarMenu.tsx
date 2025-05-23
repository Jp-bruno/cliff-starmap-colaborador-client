import { Home } from "@mui/icons-material";
import { Menu, MenuItem, Stack } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import axiosBase from "@/axios/axios";
import TooltipIconButton from "../TooltipIconButton";

export default function AppBarMenu() {
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

    async function logout() {
        await axiosBase.post("/auth/logout").then((res) => {
            if (res.status === 200) {
                navigate({ to: "/", replace: true });
            }
        });
    }

    return (
        <>
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
                <MenuItem onClick={() => navigate({to: "/perfil"})}>Perfil</MenuItem>
                <MenuItem onClick={logout}>Sair</MenuItem>
            </Menu>

            <Stack direction="row" alignItems={"center"} spacing={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <TooltipIconButton action={() => navigate({ to: "/projetos" })} icon={<Home />} title="Ir para projetos" />
                <TooltipIconButton action={handleClickAdminMenu} icon={<AdminPanelSettingsIcon />} title="Área do administrador" />
                <TooltipIconButton action={handleClickProfileMenu} icon={<AccountCircleOutlinedIcon />} title="" />
            </Stack>
        </>
    );
}
