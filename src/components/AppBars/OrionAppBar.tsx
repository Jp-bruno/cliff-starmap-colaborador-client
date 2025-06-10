import { Toolbar, Typography, styled, Box, MenuItem, Select, Grid } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import TooltipIconButton from "../TooltipIconButton";
import Add from "@mui/icons-material/Add";
import { useState } from "react";
import AddFaseModal from "../AddFaseModal";
import { useProjetoContext } from "@/contexts/projectContext";
import type { FaseType } from "@/types";
import AppBarMenu from "./AppBarMenu";
import { useNavigate, useRouterState } from "@tanstack/react-router";

interface AppBarProps {
    open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                width: `calc(100% - 64px)`,
                transition: theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

export default function OrionAppBar({ open }: { open: boolean }) {
    const [addFaseModalState, setAddFaseModalState] = useState(false);

    const { projeto, setFaseSelecionada, faseSelecionada } = useProjetoContext();

    const { location } = useRouterState();

    const navigate = useNavigate();

    function handleSetFaseSelecionada(_id: string) {
        if (location.searchStr) {
            const paths = location.pathname.split("/");
            navigate({ to: `/${paths[1]}/${paths[2]}` });
        }

        setFaseSelecionada(() => {
            return projeto!.fases.find((p_fase: FaseType) => p_fase._id === _id);
        });
    }

    return (
        <AppBar position="fixed" open={open} elevation={1}>
            <Toolbar component={Grid} container sx={{ backgroundColor: "white", color: "black" }}>
                <Grid size={6} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" noWrap component="div">
                        {projeto!.nome}
                    </Typography>
                </Grid>

                <Grid size={6} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", columnGap: 1 }}>
                        {projeto?.fases.length! > 0 && faseSelecionada && (
                            <>
                                <Select value={faseSelecionada._id} onChange={(ev) => handleSetFaseSelecionada(ev.target.value)} size="small">
                                    {projeto?.fases.map((fase: FaseType) => (
                                        <MenuItem value={fase?._id} key={fase.nome}>
                                            {fase.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TooltipIconButton title="Adicionar nova fase" action={() => setAddFaseModalState(true)} icon={<Add />} />
                                {addFaseModalState && <AddFaseModal isOpen={addFaseModalState} close={() => setAddFaseModalState(false)} />}
                            </>
                        )}

                        {projeto?.fases.length === 0 && (
                            <>
                                <Select value={"Sem fases disponíveis"} size="small">
                                    <MenuItem disabled value="Sem fases disponíveis">
                                        Sem fases disponíveis
                                    </MenuItem>
                                </Select>
                                <TooltipIconButton title="Adicionar nova fase" action={() => setAddFaseModalState(true)} icon={<Add />} />
                                {addFaseModalState && <AddFaseModal isOpen={addFaseModalState} close={() => setAddFaseModalState(false)} />}
                            </>
                        )}
                    </Box>

                    <AppBarMenu />
                </Grid>
            </Toolbar>
        </AppBar>
    );
}
