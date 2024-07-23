import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";
import { checkStereo, startStereo, stopStereo } from "../../api/backend";

interface Stitchedprops {
  paths: string[];
  leftOptions: { fps: number[]; width: number[] };
  rightOptions: { fps: number[]; width: number[] };
  leftPath: string | null;
  rightPath: string | null;
  setLeftPath: (x: string) => void;
  setRightPath: (x: string) => void;
}
const StitchedComponent: React.FC<Stitchedprops> = (props) => {
  const paths = props.paths;

  const [leftPath, setLeftPath] = [props.leftPath, props.setLeftPath];
  const [rightPath, setRightPath] = [props.rightPath, props.setRightPath];

  const validFPS = props.leftOptions.fps.filter((n) =>
    props.rightOptions.fps.includes(n),
  );
  const validWidth = props.leftOptions.width.filter((n) =>
    props.rightOptions.width.includes(n),
  );

  const [fps, setFPS] = useState<number>(validFPS[0] ? validFPS[0] : 0);
  const [width, setWidth] = useState<number>(validWidth[0] ? validWidth[0] : 0);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  useState(() => {
    checkStereo().then((x) => {
      console.log("Stereo Recording: ", x), setIsRecording(x);
    });
  });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        rowGap: "10px",
      }}
    >
      <Typography>Stitched Stereo Setup</Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          columnGap: "5px",
        }}
      >
        <FormControl sx={{ width: "50%" }}>
          <InputLabel id="left-label">Left Camera Path</InputLabel>
          <Select
            value={leftPath ? leftPath : ""}
            onChange={(e) => setLeftPath(e.target.value)}
            labelId="left-label"
          >
            {paths
              .filter((e) => e !== rightPath)
              .map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: "50%" }}>
          <InputLabel id="right-label">Right Camera Path</InputLabel>
          <Select
            value={rightPath ? rightPath : ""}
            onChange={(e) => setRightPath(e.target.value)}
            labelId="right-label"
          >
            {paths
              .filter((e) => e !== leftPath)
              .map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
      <FormControl fullWidth>
        <InputLabel id="compression-label">Compression Format</InputLabel>
        <Select value="MJPG" labelId="compression-label" disabled>
          <MenuItem value="MJPG">MJPG</MenuItem>
        </Select>
      </FormControl>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          columnGap: "5px",
        }}
      >
        <FormControl sx={{ width: "50%" }}>
          <InputLabel id="fps-label">Frame Rate</InputLabel>
          <Select
            labelId="fps-label"
            value={fps != 0 ? fps : ""}
            onChange={(e) => setFPS(() => parseInt(e.target.value as string))}
          >
            {validFPS.map((fps) => (
              <MenuItem key={fps} value={fps.toString()}>
                {fps}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: "50%" }}>
          <InputLabel id="fw-label">Frame Width</InputLabel>
          <Select
            labelId="fw-label"
            value={width != 0 ? width : ""}
            onChange={(e) => setWidth(() => parseInt(e.target.value as string))}
          >
            {validWidth.map((fw) => (
              <MenuItem key={fw} value={fw.toString()}>
                {fw}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          columnGap: "5px",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={() => {
            if (
              leftPath != null &&
              rightPath != null &&
              width != 0 &&
              fps != 0
            ) {
              startStereo(
                leftPath,
                rightPath,
                width.toString(),
                fps.toString(),
              ).then((data) => setIsRecording(data.success));
            }
          }}
          disabled={isRecording}
        >
          Start
        </Button>
        <Button
          onClick={() => {
            stopStereo().then(() => setIsRecording(false));
          }}
          disabled={!isRecording}
        >
          Stop
        </Button>
      </div>
    </Box>
  );
};

export default StitchedComponent;
