import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { startStereo, stopStereo } from "../../api/backend";

interface camProps {
    paths: string[]
}

const MultiCamComponent: React.FC<camProps> = (props) => {

    const [fps, setFPS] = useState(0);
    const [width, setWidth] = useState(0);

    const [filename, setFilename] = useState("multicam-$id");

    const [isRecording, setIsRecording] = useState<boolean>(false);


    const validFPS = [10, 20, 30];
    const validWidth = [1920];
    function startMultiCam(paths: string[]) {
        throw new Error("Function not implemented.");
    }

    function stopMultiCam() {
        throw new Error("Function not implemented.");
    }

    return (<Box sx={{
        width: "100%",
        height: "calc(100% - 1px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        rowGap: "10px",
        justifyContent: "start"
    }}>
        <Typography>
            Multi-cam recording
        </Typography>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", columnGap: "5px" }}>
            <FormControl sx={{ width: "50%" }}>
                <InputLabel id="fps-label">Frame Rate</InputLabel>
                <Select labelId='fps-label' value={fps != 0 ? fps : ""} onChange={(e) => setFPS(() => parseInt(e.target.value as string))}>
                    {validFPS.map((fps) => <MenuItem key={fps} value={fps.toString()}>{fps}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl sx={{ width: "50%" }}>
                <InputLabel id="fw-label">Frame Width</InputLabel>
                <Select labelId='fw-label' value={width != 0 ? width : ""} onChange={(e) => setWidth(() => parseInt(e.target.value as string))}>
                    {validWidth.map((fw) => <MenuItem key={fw} value={fw.toString()}>{fw}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
        <TextField
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            sx={{ width: "100%" }}
        />

        <Typography>
            Camera to record: {props.paths.length}
        </Typography>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", columnGap: "5px", justifyContent: "center" }}>

            <Button
                onClick={() => {
                    startMultiCam(props.paths)
                    // .then(() => setIsRecording(false))
                }}
                disabled={isRecording}
            >
                Start
            </Button>
            <Button
                onClick={() => {
                    stopMultiCam()
                    // .then(() => setIsRecording(false));
                }}
                disabled={!isRecording}
            >
                Stop
            </Button>
        </div>
    </Box>)
}

export default MultiCamComponent;