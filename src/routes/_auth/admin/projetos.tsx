import axiosBase from "@/axios/axios";
import AddProjetoModal from "@/components/Admin/AddProjetoModal";
import Add from "@mui/icons-material/Add";
import { Container, Paper, Typography, List, ListSubheader, IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ProjetoType } from "@/types";
import ProjetosListItem from "@/components/Admin/ProjetosListItem";

export const Route = createFileRoute("/_auth/admin/projetos")({
    component: RouteComponent,
});

function RouteComponent() {
    const [addProjectModalState, setAddProjectModalState] = useState(false);

    const { data: projetos, isLoading } = useQuery({
        queryKey: ["projetos"],
        queryFn: async () => {
            const projetos = await axiosBase(`/projeto`).then((res) => res.data);

            return projetos;
        },
    });

    if (isLoading) {
        return null;
    }

    return (
        <Container sx={{ py: 12 }}>
            <AddProjetoModal isOpen={addProjectModalState} close={() => setAddProjectModalState(false)} />

            <Paper sx={{ p: 2 }}>
                <Typography sx={{ mb: 2 }}>Administrador - Projetos</Typography>
                <List>
                    <ListSubheader sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        Projetos
                        <IconButton size="small" onClick={() => setAddProjectModalState(true)}>
                            <Add fontSize="small" />
                        </IconButton>
                    </ListSubheader>
                    {projetos.map((projeto: ProjetoType) => {
                        return <ProjetosListItem projeto={projeto} key={projeto._id} />;
                    })}
                </List>
            </Paper>
        </Container>
    );
}
