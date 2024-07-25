import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { checkMulti, startMultiCam, stopMultiCam } from "../../api/backend";

interface camProps {
  paths: string[];
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

  const validFormats = ["MJPG", "H264"];

  useState(() => {
    checkMulti().then((x) => {
      console.log("SterMultieo Recording: ", x), setIsRecording(x);
    });
  });

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100% - 1px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        rowGap: "10px",
        justifyContent: "start",
      }}
    >
      <Typography>
        This mode will record all cameras that are compatible with the specified
        settings.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          width: "100%",
          columnGap: "5px",
        }}
      >
        <Select
          value={fps != 0 ? fps : ""}
          onChange={(e) => setFPS(() => parseInt(e.target.value as string))}
          startAdornment={<InputAdornment position="start">FPS</InputAdornment>}
        >
          {validFPS.map((fps) => (
            <MenuItem key={fps} value={fps.toString()}>
              {fps}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={width != 0 ? width : ""}
          onChange={(e) => setWidth(() => parseInt(e.target.value as string))}
          startAdornment={
            <InputAdornment position="start">Frame Width</InputAdornment>
          }
        >
          {validWidth.map((fw) => (
            <MenuItem key={fw} value={fw.toString()}>
              {fw}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={compression}
          startAdornment={
            <InputAdornment position="start">Compression</InputAdornment>
          }
          onChange={(e) =>
            setCompression(() => e.target.value as "H264" | "MJPG")
          }
        >
          {validFormats.map((fmt) => (
            <MenuItem key={fmt} value={fmt}>
              {fmt}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          width: "100%",
          columnGap: "5px",
        }}
      >
        <TextField
          label="Recording Length"
          type="number"
          value={duration}
          onChange={(e) => {
            setDuration(parseInt(e.target.value));
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">minutes</InputAdornment>
            ),
          }}
        />

        <Typography> Every </Typography>
        <TextField
          label="Interval Length"
          type="number"
          value={interval}
          onChange={(e) => {
            setInterval(parseInt(e.target.value));
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">minutes</InputAdornment>
            ),
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          width: "100%",
          columnGap: "5px",
        }}
      >
        <Tooltip title="$id=Bus ID, $format=compression format, $count=file count">
          <TextField
            label="Output File Format"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            sx={{ width: "80%" }}
          />
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          columnGap: "5px",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={() => {
            startMultiCam(
              props.paths,
              width,
              fps,
              filename,
              duration,
              interval,
              compression,
            ).then(() => setIsRecording(true));
          }}
          disabled={isRecording}
        >
          Start
        </Button>
        <Button
          onClick={() => {
            stopMultiCam().then(() => setIsRecording(false));
          }}
          disabled={!isRecording}
        >
          Stop
        </Button>
      </Box>
    </Box>
  );
};

export default MultiCamComponent;
