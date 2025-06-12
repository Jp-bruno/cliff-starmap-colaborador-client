import { IconButton, Tooltip } from "@mui/material";
import type { ReactNode } from "react";

export default function TooltipIconButton({
    title,
    action,
    icon,
    loading,
    disabled = false
}: {
    title: string;
    action: (() => void) | ((event: React.MouseEvent<HTMLButtonElement>) => void);
    icon: ReactNode;
    loading?: boolean;
    disabled?: boolean
}) {
    return (
        <Tooltip title={title}>
            <IconButton loading={loading} onClick={action} disabled={disabled}>
                {icon}
            </IconButton>
        </Tooltip>
    );
}
