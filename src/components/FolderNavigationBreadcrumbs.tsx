import { Link } from "@tanstack/react-router";
import type { PastaType } from "@/types";
import { Box, Breadcrumbs, Chip, Tooltip } from "@mui/material";

export default function FolderNavigationBreadcrumbs({
    prevFolders,
    pastaAtual,
    section,
    projetoSlug,
}: {
    prevFolders: PastaType[];
    pastaAtual: PastaType;
    section: "documentos" | "financeiro";
    projetoSlug: string;
}) {
    return (
        <Box>
            <Breadcrumbs separator={">"}>
                <Link preload={false} to={`/$slug/${section}`} params={{ slug: projetoSlug }}>
                    <Tooltip title={section === "documentos" ? "Documentos" : "Financeiro"}>
                        <Chip label={section === "documentos" ? "Documentos" : "Financeiro"} color="primary" />
                    </Tooltip>
                </Link>
                {prevFolders.map((folder: PastaType) => (
                    <Link
                        preload={false}
                        to={`/$slug/${section}/$folderSlug`}
                        mask={{ to: `/$slug/${section}`, params: { slug: projetoSlug } }}
                        params={{ folderSlug: folder.slug, slug: projetoSlug }}
                        search={{ folderId: folder._id }}
                    >
                        <Tooltip title={folder.nome}>
                            <Chip label={folder.nome} color="primary" />
                        </Tooltip>
                    </Link>
                ))}
                <Link preload={false} to="." disabled>
                    <Tooltip title={pastaAtual?.nome}>
                        <Chip label={pastaAtual?.nome} color="default" />
                    </Tooltip>
                </Link>
            </Breadcrumbs>
        </Box>
    );
}
