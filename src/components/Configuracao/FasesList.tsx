import { List, ListSubheader } from "@mui/material";
import type { FaseType } from "@/types";
import FaseListItem from "./FaseListItem";
import TooltipIconButton from "../TooltipIconButton";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import AddFaseModal from "../AddFaseModal";

export default function FasesList({ fases }: { fases: FaseType[] }) {
    const [addFaseModalState, setAddFaseModalState] = useState(false);

    return (
        <List>
            <ListSubheader sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                Fases do projeto
                <TooltipIconButton title="Adicionar fase" action={() => setAddFaseModalState(true)} icon={<Add />} />
            </ListSubheader>
            {fases.map((fase) => (
                <FaseListItem key={fase._id} fase={fase} />
            ))}
            <AddFaseModal isOpen={addFaseModalState} close={() => setAddFaseModalState(false)} />
        </List>
    );
}
