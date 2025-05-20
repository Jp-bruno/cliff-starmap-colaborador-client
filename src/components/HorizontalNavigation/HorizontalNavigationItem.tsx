import { Chip, useTheme } from "@mui/material";
import { useNavigate, useRouter } from "@tanstack/react-router";

export default function HorizontalNavigationItem({ title, link }: { title: string; link: string }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const { state } = useRouter();

    const isActive = state.location.pathname.includes(link);

    return (
        <Chip
            label={title}
            sx={{
                px: 3,
                py: 2,
                borderRadius: 2,
                color: "#0000009f",
                backgroundColor: isActive ? theme.palette.primary[200] : "#00000000",
                "&.Mui-disabled": {
                    opacity: 1,
                },
            }}
            disabled={isActive}
            onClick={() => navigate({ to: link })}
        />
    );
}
