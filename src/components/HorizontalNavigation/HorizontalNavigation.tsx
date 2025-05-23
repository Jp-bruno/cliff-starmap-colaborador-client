import { Box, Breadcrumbs } from "@mui/material";
import HorizontalNavigationItem from "./HorizontalNavigationItem";
import { useProjetoContext } from "@/contexts/projectContext";

export default function HorizontalNavigation() {
    const { projeto } = useProjetoContext();

    const items = [
        { title: "Início", link: `/${projeto?.slug}/home` },
        { title: "Visão geral", link: `/${projeto?.slug}/visao-geral` },
        { title: "Documentos", link: `/${projeto?.slug}/documentos` },
        { title: "Financeiro", link: `/${projeto?.slug}/financeiro` },
        { title: "Atualizações", link: `/${projeto?.slug}/atualizacoes` },
        { title: "Agenda", link: `/${projeto?.slug}/agenda` },
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
