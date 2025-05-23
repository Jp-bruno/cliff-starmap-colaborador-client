import { Add } from "@mui/icons-material";
import { List, ListSubheader, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import type { ColaboradorType } from "@/types";
import TooltipIconButton from "../TooltipIconButton";
import AddColaboradorModal from "./AddColaboradorModal";
import ConfiguracaoColaboradoresListItem from "./ConfiguracaoColaboradoresListItem";

export default function ColaboradoresList({ colaboradors }: { colaboradors: ColaboradorType[] }) {
    const [addColaboradorModalState, setAddColaboradorModalState] = useState(false);

    return (
        <List>
            <ListSubheader sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                Colaboradores
                <TooltipIconButton title="Adicionar colaborador" action={() => setAddColaboradorModalState(true)} icon={<Add />} />
            </ListSubheader>
            {colaboradors.map((colaborador: ColaboradorType) => (
                <ConfiguracaoColaboradoresListItem key={colaborador._id} colaborador={colaborador} />
            ))}
            {colaboradors.length === 0 && (
                <ListItem>
                    <ListItemText secondary="Sem colaboradors. Adicione colaboradores clicando no botao acima" />
                </ListItem>
            )}
            <AddColaboradorModal isOpen={addColaboradorModalState} close={() => setAddColaboradorModalState(false)} />
        </List>
    );
}
