import Add from "@mui/icons-material/Add";
import { List, ListSubheader, ListItem, ListItemText } from "@mui/material";
import type { ColaboradorType } from "types";
import TooltipIconButton from "../TooltipIconButton";
import ConfiguracaoContatosListItem from "./ConfiguracaoContatosListItem";
import AddContatoModal from "./AddContatoModal";
import { useState } from "react";

export default function ContatosList({ contatos }: { contatos: ColaboradorType[] }) {
    const [addContatoModalState, setAddContatoModalState] = useState(false);

    return (
        <List>
            <ListSubheader sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                Contatos
                <TooltipIconButton title="Adicionar contato" action={() => setAddContatoModalState(true)} icon={<Add />} />
            </ListSubheader>
            {contatos.map((contato: ColaboradorType) => (
                <ConfiguracaoContatosListItem key={contato._id} contato={contato} />
            ))}
            {contatos.length === 0 && (
                <ListItem>
                    <ListItemText secondary="Sem contatos, adicione contatos clicando no botao acima" />
                </ListItem>
            )}
            <AddContatoModal isOpen={addContatoModalState} close={() => setAddContatoModalState(false)} />
        </List>
    );
}
