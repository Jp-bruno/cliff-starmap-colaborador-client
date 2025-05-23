import { Add } from "@mui/icons-material";
import { List, ListSubheader, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import type { ClienteType } from "@/types";
import TooltipIconButton from "../TooltipIconButton";
import AddClienteModal from "./AddClienteModal";
import ConfiguracaoClientesListItem from "./ConfiguracaoClientesListItem";

export default function ClientesList({ clientes }: { clientes: ClienteType[] }) {
    const [addClienteModalState, setAddClienteModalState] = useState(false);

    return (
        <List>
            <ListSubheader sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                Clientes
                <TooltipIconButton title="Adicionar cliente" action={() => setAddClienteModalState(true)} icon={<Add />} />
            </ListSubheader>
            {clientes.map((cliente: ClienteType) => (
                <ConfiguracaoClientesListItem key={cliente._id} cliente={cliente} />
            ))}
            {clientes.length === 0 && (
                <ListItem>
                    <ListItemText secondary="Sem clientes. Adicione clientes clicando no botao acima" />
                </ListItem>
            )}
            <AddClienteModal isOpen={addClienteModalState} close={() => setAddClienteModalState(false)} />
        </List>
    );
}
