import { Box, Typography, styled, useTheme } from "@mui/material";

const StyledBox = styled(Box)`
    display: grid;
    grid-template-columns: 40% calc(60% - 40px);
    gap: 40px;
    width: 100%;
    padding: 30px;
    border-radius: 10px;
    color: white;

    img {
        width: 100%;
        border-radius: 10px;
        aspect-ratio: 2/1;
        object-fit: cover;
    }
`;

export default function HomeBanner({ fase_name, fase_description, fase_image }: { fase_name: string; fase_description: string; fase_image: string }) {
    const theme = useTheme();
    return (
        <StyledBox sx={{ backgroundColor: theme.palette.primary[300] }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <Typography variant="h4" sx={{ alignSelf: "baseline" }}>
                    {fase_name}
                </Typography>
                <Typography>{fase_description}</Typography>
            </Box>
            <img src={fase_image} alt={fase_name} />
        </StyledBox>
    );
}
