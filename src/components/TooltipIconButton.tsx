import { IconButton, Tooltip } from "@mui/material";
import type { ReactNode } from "react";

export default function TooltipIconButton({
    title,
    action,
    icon,
    loading,
}: {
    title: string;
    action: (() => void) | ((event: React.MouseEvent<HTMLButtonElement>) => void);
    icon: ReactNode;
    loading?: boolean;
}) {
    return (
        <Tooltip title={title}>
            <IconButton loading={loading} onClick={action}>
                {icon}
            </IconButton>
        </Tooltip>
    );
}
