import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

export default function DrawerMenuItem({ icon, title, link }: { icon: ReactNode; title: string; link: string }) {
    const navigate = useNavigate();
    return (
        <ListItem sx={{ p: 0, mb: 1 }}>
            <ListItemButton sx={{ marginLeft: "2px" }} onClick={() => navigate({ to: link })}>
                <ListItemIcon sx={{ color: "#ffffff9b" }}>{icon}</ListItemIcon>
                <ListItemText sx={{ color: "white" }}>{title}</ListItemText>
            </ListItemButton>
        </ListItem>
    );
}
