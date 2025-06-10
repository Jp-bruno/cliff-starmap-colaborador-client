import BaseModal from "@/components/BaseModal";
import type { ItemAgendaType } from "@/types";
import { Button, Typography } from "@mui/material";

export default function VisualizadorCompromisso({
    compromisso,
    close,
}: {
    compromisso: Pick<ItemAgendaType, "data" | "titulo" | "descricao"> | null;
    close: () => void;
}) {

    if (!compromisso) {
        return null;
    }

    return (
        <BaseModal isOpen={!!compromisso} close={close} title="Detalhes do compromisso">
            <Typography>Título: {compromisso.titulo}</Typography>
            <Typography>Descrição: {compromisso.descricao}</Typography>
            <Typography>Data: {compromisso.data}</Typography>
            <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={close}>
                Fechar
            </Button>
        </BaseModal>
    );
}
