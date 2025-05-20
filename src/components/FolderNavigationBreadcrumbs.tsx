import { Box, Breadcrumbs, Chip, Tooltip } from "@mui/material";
import { Link } from "@tanstack/react-router";

export default function FolderNavigationBreadcrumbs({ prevPageName, currentPageName }: { prevPageName: string; currentPageName: string }) {
    return (
        <Box>
            <Breadcrumbs separator={">"}>
                <Link to="..">
                    <Tooltip title="Voltar para página anterior">
                        <Chip label={prevPageName} color="primary" />
                    </Tooltip>
                </Link>
                <Link to="." disabled>
                    <Chip label={currentPageName} />
                </Link>
            </Breadcrumbs>
        </Box>
    );
}
