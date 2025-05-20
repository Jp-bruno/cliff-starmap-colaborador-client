import { Box, Collapse, IconButton, ListItem, ListItemIcon, Stack, Typography, styled, useTheme } from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

const TypographyStyled = styled(Typography)`
    text-wrap: wrap;
`;

export default function ContatosItem({
    nome,
    descricao,
    email,
    telefone,
    imagem,
}: {
    nome: string;
    descricao: string;
    email: string;
    telefone: string;
    imagem: string;
}) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    return (
        <>
            <ListItem sx={{ p: 0, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <ListItemIcon>
                        <img src={imagem} alt={nome} width={30} />
                    </ListItemIcon>
                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                        <TypographyStyled>{nome}</TypographyStyled>
                        <TypographyStyled variant="caption" sx={{ lineHeight: 1 }}>
                            {descricao}
                        </TypographyStyled>
                    </Box>
                    <IconButton sx={{ backgroundColor: theme.palette.primary[200] }} size="small" onClick={() => setOpen((prev) => !prev)}>
                        {open ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                    </IconButton>
                </Box>
                <Collapse in={open} sx={{ width: "100%", paddingLeft: "56px", paddingTop: "6px" }}>
                    <Stack>
                        <Typography variant="caption">{email}</Typography>
                        <Typography variant="caption">{telefone}</Typography>
                    </Stack>
                </Collapse>
            </ListItem>
        </>
    );
}
