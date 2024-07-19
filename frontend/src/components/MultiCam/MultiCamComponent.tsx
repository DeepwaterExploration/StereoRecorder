import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import NumberInput from './NumberInput.tsx';
import { checkMulti, startMultiCam, stopMultiCam } from "../../api/backend";

interface camProps {
    paths: string[]
}

const MultiCamComponent: React.FC<camProps> = (props) => {
    const validFPS = [30, 20, 10];
    const validWidth = [1920];
    const [fps, setFPS] = useState(validFPS[0]);
    const [width, setWidth] = useState(validWidth[0]);

    const [filename, setFilename] = useState("multicam-$id-$format-$count");

    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [compression, setCompression] = useState<"MJPG" | "H264">("MJPG");


    const [duration, setDuration] = useState(1);
    const [interval, setInterval] = useState(1);


    const validFormats = ["MJPG", "H264"]

    useState(() => {
        checkMulti().then(
            (x) => { console.log("SterMultieo Recording: ", x), setIsRecording(x) }
        )
    })

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
            Multi-cam interval recording
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
            <FormControl sx={{ width: "50%" }}>
                <InputLabel id="fw-label">Compression Format</InputLabel>
                <Select labelId='fw-label' value={compression} onChange={(e) => setCompression(() => e.target.value as "H264" | "MJPG")}>
                    {validFormats.map((fmt) => <MenuItem key={fmt} value={fmt}>{fmt}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", columnGap: "5px" }}>
            <Typography sx={{ verticalAlign: "center", height: "100%", display: "block" }}>
                Take a
            </Typography>
            <NumberInput value={duration} onChange={(e, newVal) => setDuration(newVal!)}>

            </NumberInput>
            <Typography>
                Min clip every
            </Typography>
            <NumberInput value={interval} onChange={(e, newVal) => setInterval(newVal!)}>

            </NumberInput>
            <Typography>
                Mins
            </Typography>
        </div>
        <TextField
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            sx={{ width: "100%" }}
        />

        <Typography>
            Total Possible Cameras: {props.paths.length}
        </Typography>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", columnGap: "5px", justifyContent: "center" }}>

            <Button
                onClick={() => {
                    startMultiCam(props.paths, width, fps, filename, duration, interval, compression)
                        .then(() => setIsRecording(true))
                }}
                disabled={isRecording}
            >
                Start
            </Button>
            <Button
                onClick={() => {
                    stopMultiCam()
                        .then(() => setIsRecording(false));
                }}
                disabled={!isRecording}
            >
                Stop
            </Button>
        </div>
    </Box>)
}

export default MultiCamComponent;