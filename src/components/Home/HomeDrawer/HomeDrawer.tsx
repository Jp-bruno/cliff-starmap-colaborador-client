import { Stack, Icon, Typography, useTheme, Grid } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CompromissoItem from "./CompromissoItem";
import ContatosItem from "./ContatosItem";
import { useProjetoContext } from "@/contexts/projectContext";
import type { ColaboradorType } from "@/types";

// const drawerWidth = 340;

// const openedMixin = (theme: Theme): CSSObject => ({
//     width: drawerWidth,
//     transition: theme.transitions.create("width", {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.enteringScreen,
//     }),
//     overflowX: "hidden",
// });

// const closedMixin = (theme: Theme): CSSObject => ({
//     transition: theme.transitions.create("width", {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//     }),
//     overflowX: "hidden",
//     width: `calc(${theme.spacing(8)} + 1px)`,
//     [theme.breakpoints.up("sm")]: {
//         width: `calc(${theme.spacing(8)} + 1px)`,
//     },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
// }));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme }) => ({
//     width: drawerWidth,
//     flexShrink: 0,
//     whiteSpace: "nowrap",
//     zIndex: 0,
//     StackSizing: "border-Stack",
//     "& .MuiDrawer-paper": { backgroundColor: theme.palette.common.white },
//     variants: [
//         {
//             props: ({ open }) => open,
//             style: {
//                 ...openedMixin(theme),
//                 "& .MuiDrawer-paper": openedMixin(theme),
//             },
//         },
//         {
//             props: ({ open }) => !open,
//             style: {
//                 ...closedMixin(theme),
//                 "& .MuiDrawer-paper": closedMixin(theme),
//             },
//         },
//     ],
// }));

// const compromissos = [
//     { title: "REUNIÃO - CLÍNICA 14H", day: "25", month: "abr" },
//     { title: "VENCIMENTO MESAS FASE 1", day: "30", month: "abr" },
//     { title: "DIA DE CONCRETAGEM", day: "4", month: "mai" },
//     { title: "VENCIMENTO MARCENARIA FASE 5", day: "30", month: "mai" },
// ];

// const contatos = [
//     {
//         name: "Kátia Fugazza",
//         role: "Arquiteta titular e Responsável técnica",
//         email: "email@email.com",
//         phone: "(21) 99999-9999",
//         image: "/profileDefault.png",
//     },
//     {
//         name: "Marcos Marques",
//         role: "Engenheiro Civil e responsável técnico",
//         email: "email@email.com",
//         phone: "(21) 99999-9999",
//         image: "/profileDefault.png",
//     },
//     { name: "André Barbosa",
//         role: "Técnico de edificações",
//         email: "email@email.com",
//         phone: "(21) 99999-9999",
//         image: "/profileDefault.png"
//     },
// ];

export default function HomeDrawer() {
    const theme = useTheme();

    const { projeto } = useProjetoContext();

    const proximosEventos = projeto!.proximosEventos.map((evento) => {
        return {
            titulo: evento.titulo,
            dia: (new Date(evento.data).getDate() + 1).toString(),
            mes: new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(evento.data)),
        };
    });

    return (
        // <Drawer anchor="right" open={true} variant="permanent">
        //     <DrawerHeader />
        <Stack sx={{ p: 3, backgroundColor: theme.palette.common.white, minHeight: "100vh" }} spacing={2}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems={"center"}>
                    <Icon
                        sx={{
                            background: theme.palette.primary[200],
                            borderRadius: "50px",
                            width: "30px",
                            height: "30px",
                            display: "grid",
                            placeItems: "center",
                            zoom: 0.8,
                        }}
                    >
                        <ArrowForwardIosRoundedIcon fontSize="small" sx={{ color: "white" }} />
                    </Icon>

                    <Typography fontSize="1.3rem">Próximos compromissos</Typography>
                </Stack>

                <Grid container spacing={2}>
                    {proximosEventos.map((compromisso) => (
                        <CompromissoItem key={compromisso.titulo} {...compromisso} />
                    ))}
                    {proximosEventos.length === 0 && <Typography>Sem compromissos adicionados</Typography>}
                </Grid>
            </Stack>

            <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems={"center"}>
                    <Icon
                        sx={{
                            background: theme.palette.primary[200],
                            borderRadius: "50px",
                            width: "30px",
                            height: "30px",
                            display: "grid",
                            placeItems: "center",
                            zoom: 0.8,
                        }}
                    >
                        <ArrowForwardIosRoundedIcon fontSize="small" sx={{ color: "white" }} />
                    </Icon>

                    <Typography fontSize="1.3rem">Contatos</Typography>
                </Stack>

                <Grid container spacing={2}>
                    {projeto!.contatos.map((contato: ColaboradorType) => (
                        <ContatosItem key={contato.nome} {...contato} />
                    ))}
                    {projeto!.contatos.length === 0 && <Typography>Sem contatos adicionados</Typography>}
                </Grid>
            </Stack>
        </Stack>
        // </Drawer>
    );
}
