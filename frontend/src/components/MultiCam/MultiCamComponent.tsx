import { Box, Typography } from "@mui/material";

const MultiCamComponent: React.FC = () => {
    return (<Box sx={{
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }}>
        <Typography>
            Multi-cam recording
        </Typography>
    </Box>)
}

export default MultiCamComponent;