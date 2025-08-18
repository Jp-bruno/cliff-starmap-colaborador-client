import { Box, LinearProgress, Typography } from "@mui/material";

export default function LinearProgressBar({ progress, showPercentage }: { progress: number; showPercentage?: boolean }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
                <LinearProgress variant="determinate" value={progress} sx={{ width: "100%" }} />
                {showPercentage && (
                    <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>{`${Math.round(progress)}%`}</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
