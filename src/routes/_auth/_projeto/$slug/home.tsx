import { createFileRoute } from "@tanstack/react-router";
import Box from "@mui/material/Box";
import { Container, Grid, Typography, useTheme } from "@mui/material";
import HomeDrawer from "@/components/Home/HomeDrawer/HomeDrawer";
import HomeBanner from "@/components/Home/HomeBanner/HomeBanner";
import HomeNavigationItem from "@/components/Home/HomeNavigation/HomeNavigationItem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaidIcon from "@mui/icons-material/Paid";
import UpdateIcon from "@mui/icons-material/Update";
import DescriptionIcon from "@mui/icons-material/Description";
import { useProjetoContext } from "@/contexts/projectContext";
import type { FaseType } from "@/types";

export const Route = createFileRoute("/_auth/_projeto/$slug/home")({
    component: Home,
});

function Home() {
    const theme = useTheme();

    const { faseSelecionada, projeto } = useProjetoContext();

    const links = [
        {
            title: "Documentos",
            description: "Veja todos os arquivos relacionados ao seu projeto",
            icon: <DescriptionIcon />,
            link: `/${projeto?.slug}/documentos`,
            backgroundColor: theme.palette.primary[400],
        },
        {
            title: "Atualizações",
            description: "Acesse as últimas novidades!",
            icon: <UpdateIcon />,
            link: `/${projeto?.slug}/atualizacoes`,
            backgroundColor: theme.palette.primary[600],
        },
        {
            title: "Financeiro",
            description: "Acompanhe aqui o demonstrativos e notas fiscais",
            icon: <PaidIcon />,
            link: `/${projeto?.slug}/financeiro`,
            backgroundColor: theme.palette.primary[300],
        },
        {
            title: "Agenda",
            description: "Acesse o cronograma e os principais compromissos da agenda",
            icon: <CalendarMonthIcon />,
            link: `/${projeto?.slug}/agenda`,
            backgroundColor: theme.palette.primary[500],
        },
    ];

    const fase = projeto!.fases.find((p_fase: FaseType) => p_fase._id === faseSelecionada?._id);

    if (!fase) {
        return (
            <Box sx={{ display: "grid", gridTemplateColumns: "auto 350px", width: "100%" }}>
                <Container sx={{ pt: 3 }}>
                    <Typography variant="caption">Nenhuma fase selecionada</Typography>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "auto 350px", width: "100%" }}>
            <Container sx={{ pt: 3 }}>
                <HomeBanner fase_name={fase!.nome} fase_description={fase!.descricao} fase_image={fase!.banner} />

                <Grid container spacing={3} sx={{ py: 4, maxHeight: "400px" }}>
                    {links.map((link) => (
                        <HomeNavigationItem key={link.title} {...link} />
                    ))}
                </Grid>
            </Container>

            <HomeDrawer />
        </Box>
    );
}
