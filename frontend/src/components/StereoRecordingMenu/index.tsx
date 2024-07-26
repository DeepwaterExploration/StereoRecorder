import { Box, Select, MenuItem, Button, InputAdornment } from "@mui/material";

const StereoRecordingMenu: React.FC = () => {
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
          startAdornment={
            <InputAdornment position="start">Left Camera Path</InputAdornment>
          }
        ></Select>
        <Select
          startAdornment={
            <InputAdornment position="start">Right Camera Path</InputAdornment>
          }
        ></Select>
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
          startAdornment={
            <InputAdornment position="start">Frame Rate</InputAdornment>
          }
        ></Select>
        <Select
          startAdornment={
            <InputAdornment position="start">Frame Width</InputAdornment>
          }
        ></Select>
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
        <Button>Start</Button>
        <Button>Stop</Button>
      </Box>
    </Box>
  );
};

export default StereoRecordingMenu;
