import { Box, Breadcrumbs } from "@mui/material";
import HorizontalNavigationItem from "./HorizontalNavigationItem";

export default function HorizontalNavigation() {
    const items = [
        { title: "Início", link: "/home" },
        { title: "Visão geral", link: "/visao-geral" },
        { title: "Documentos", link: "/documentos" },
        { title: "Financeiro", link: "/financeiro" },
        { title: "Atualizações", link: "/atualizacoes" },
        { title: "Agenda", link: "/agenda" },
    ];

    return (
        <Box sx={{ mt: 4, display: "grid", placeItems: "center" }}>
            <Breadcrumbs separator="">
                {items.map((item) => (
                    <HorizontalNavigationItem key={item.title} {...item} />
                ))}
            </Breadcrumbs>
        </Box>
    );
}
