import { Box, Select, MenuItem, Button, InputAdornment } from "@mui/material";
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
        justifyContent: "start",
        rowGap: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: "5px",
        }}
      >
        <Select
          value={leftPath ? leftPath : ""}
          onChange={(e) => setLeftPath(e.target.value)}
          startAdornment={
            <InputAdornment position="start">Left Camera Path</InputAdornment>
          }
        >
          {paths
            .filter((e) => e !== rightPath)
            .map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
        </Select>
        <Select
          value={rightPath ? rightPath : ""}
          onChange={(e) => setRightPath(e.target.value)}
          startAdornment={
            <InputAdornment position="start">Right Camera Path</InputAdornment>
          }
        >
          {paths
            .filter((e) => e !== leftPath)
            .map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
        </Select>
        <Select
          value="MJPG"
          labelId="compression-label"
          disabled
          startAdornment={
            <InputAdornment position="start">Compression</InputAdornment>
          }
        >
          <MenuItem value="MJPG">MJPG</MenuItem>
        </Select>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: "5px",
        }}
      >
        <Select
          value={fps != 0 ? fps : ""}
          onChange={(e) => setFPS(() => parseInt(e.target.value as string))}
          startAdornment={
            <InputAdornment position="start">Frame Rate</InputAdornment>
          }
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
      </Box>
    </Box>
  );
};

export default StitchedComponent;
