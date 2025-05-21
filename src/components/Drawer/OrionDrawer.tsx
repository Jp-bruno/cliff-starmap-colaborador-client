import { List, type Theme, type CSSObject, styled } from "@mui/material";
import DrawerMenuItem from "./DrawerMenuItem";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import EventNoteIcon from "@mui/icons-material/EventNote";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BarChartIcon from "@mui/icons-material/BarChart";
import FolderIcon from "@mui/icons-material/Folder";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MuiDrawer from "@mui/material/Drawer";
import { useProjetoContext } from "@/contexts/projectContext";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(8)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    "& .MuiDrawer-paper": { backgroundColor: theme.palette.primary.main },
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                "& .MuiDrawer-paper": openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                "& .MuiDrawer-paper": closedMixin(theme),
            },
        },
    ],
}));

export default function OrionDrawer({
    open,
    handleDrawerClose,
    handleDrawerOpen,
}: {
    open: boolean;
    handleDrawerClose: () => void;
    handleDrawerOpen: () => void;
}) {
    const { projeto } = useProjetoContext();

    const menuItems = [
        {
            title: "Início",
            icon: <HomeIcon />,
            link: `/${projeto?.slug}/home`,
        },
        {
            title: "Visão Geral",
            icon: <DashboardIcon />,
            link: `/${projeto?.slug}/visao-geral`,
        },
        {
            title: "Documentos",
            icon: <FolderIcon />,
            link: `/${projeto?.slug}/documentos`,
        },
        {
            title: "Financeiro",
            icon: <BarChartIcon />,
            link: `/${projeto?.slug}/financeiro`,
        },
        {
            title: "Atualizações",
            icon: <NotificationsIcon />,
            link: `/${projeto?.slug}/atualizacoes`,
        },
        {
            title: "Agenda",
            icon: <EventNoteIcon />,
            link: `/${projeto?.slug}/agenda`,
        },
        {
            title: "Configurações",
            icon: <SettingsIcon />,
            link: `/${projeto?.slug}/configuracoes`,
        },
        {
            title: "Projetos",
            icon: <ArrowBackRoundedIcon />,
            link: `/projetos`,
        },
    ];

    return (
        <Drawer variant="permanent" open={open} onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose}>
            <DrawerHeader>
                <img src="/icone-orion.png" alt="alt" width={"50px"} style={{ filter: "brightness(0) invert(1)" }} />
            </DrawerHeader>
            <List>
                {menuItems.map((item) => (
                    <DrawerMenuItem key={item.title} {...item} />
                ))}
            </List>
        </Drawer>
    );
}
