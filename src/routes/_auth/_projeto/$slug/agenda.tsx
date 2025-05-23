import axiosBase from "@/axios/axios";
import HorizontalNavigation from "@/components/HorizontalNavigation/HorizontalNavigation";
import { useProjetoContext } from "@/contexts/projectContext";
import { Container, List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Add from "@mui/icons-material/Add";
import AddItemAgendaModal from "@/components/Agenda/AddItemAgendaModal";
import { useState } from "react";
import type { ItemAgendaType } from "@/types";
import ItemAgendaListItem from "@/components/Agenda/ItemAgendaListItem";

export const Route = createFileRoute("/_auth/_projeto/$slug/agenda")({
    component: RouteComponent,
    beforeLoad(ctx) {
        return ctx;
    },
});

function RouteComponent() {
    const [addItemAgendaModalState, setAddItemAgendaModalState] = useState(false);

    const { faseSelecionada } = useProjetoContext();

    const { data: itensAgenda, isLoading } = useQuery({
        queryKey: [`fase-${faseSelecionada?._id}-agenda`],
        queryFn: async () => {
            if (!faseSelecionada) {
                return [];
            }
            return await axiosBase(`/itemAgenda/${faseSelecionada?._id}`).then((res) => res.data);
        },
    });

    if (isLoading) {
        return null;
    }

    return (
        <Container>
            <HorizontalNavigation />

            <AddItemAgendaModal isOpen={addItemAgendaModalState} close={() => setAddItemAgendaModalState(false)} />

            <Paper elevation={8} sx={{ mt: 5 }}>
                <List>
                    <ListItemButton onClick={() => setAddItemAgendaModalState(true)}>
                        <ListItemIcon>
                            <Add />
                        </ListItemIcon>
                        <ListItemText>Adicionar item à agenda</ListItemText>
                    </ListItemButton>
                    {itensAgenda.map((itemAgenda: ItemAgendaType) => (
                        <ItemAgendaListItem itemAgenda={itemAgenda} key={itemAgenda._id} />
                    ))}
                </List>
            </Paper>
        </Container>
    );
}
