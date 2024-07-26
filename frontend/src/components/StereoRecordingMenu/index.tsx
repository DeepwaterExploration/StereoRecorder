import {
  Box,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Typography,
  Tooltip,
} from "@mui/material";
import { Devices } from "../../types/cameraTypes";
import { useEffect, useState } from "react";
import {
  getCameraSettingsLocalStorage,
  getDevicePathsWithName,
  getMJPEGDevicePaths,
  getPossibleResolutionSpecs,
  saveCameraSettingsLocalStorage,
} from "../../utils/cameraDataHelper";
import { StereoSettings } from "../../types/stereoRecordingTypes";

const MJPEG = "MJPEG";

interface StereoRecordingMenuProps {
  cameraData: Devices;
  recordingStatus: boolean;
  recordingStatusHandler: () => void;
  startRecordingHandler: (recordingSettings: StereoSettings) => void;
  endRecordingHandler: () => void;
}

const StereoRecordingMenu: React.FC<StereoRecordingMenuProps> = ({
  cameraData,
  recordingStatus,
  recordingStatusHandler,
  startRecordingHandler,
  endRecordingHandler
}) => {
  const [availableDevices, setAvailableDevices] = useState<string[]>([]);

  const [leftCameraSelection, setLeftCameraSelection] = useState<string>("");
  const [rightCameraSelection, setRightCameraSelection] = useState<string>("");

  const [framerateSelection, setFramerateSelection] = useState<string>("");
  const [frameWidthSelection, setFrameWidthSelection] = useState<string>("");

  const getUnusedDeviceSelectionsLeft = (): string[] => {
    if (availableDevices.length < 1) {
      return [""];
    }

    return availableDevices.filter((device) => device !== rightCameraSelection);
  };

  const getUnusedDeviceSelectionsRight = (): string[] => {
    if (availableDevices.length < 1) {
      return [""];
    }

    return availableDevices.filter((device) => device !== leftCameraSelection);
  };

  const getFramerateSelections = (): number[] => {
    if (!leftCameraSelection || !rightCameraSelection) {
      return [];
    }

    return getPossibleResolutionSpecs(cameraData, leftCameraSelection).fps;
  };

  const getFrameWidthSelections = (): number[] => {
    if (!leftCameraSelection || !rightCameraSelection) {
      return [];
    }

    return getPossibleResolutionSpecs(cameraData, leftCameraSelection).width;
  };

  const onLeftSelectionChange = (selection: string) => {
    setLeftCameraSelection(selection);
  };

  const onRightSelectionChange = (selection: string) => {
    setRightCameraSelection(selection);
  };

  const onFramerateSelectionChange = (selection: string) => {
    setFramerateSelection(selection);
  };

  const onFrameWidthSelectionChange = (selection: string) => {
    setFrameWidthSelection(selection);
  };

  const startRecordingButtonOnClick = async () => {
    if (leftCameraSelection && rightCameraSelection && framerateSelection && frameWidthSelection) {
      const settings: StereoSettings = {
        leftCameraDevicePath: leftCameraSelection,
        rightCameraDevicePath: rightCameraSelection,
        cameraFramerate: framerateSelection,
        cameraFrameWidth: frameWidthSelection
      };

      saveCameraSettingsLocalStorage(framerateSelection, frameWidthSelection)

      await startRecordingHandler(settings);
      await recordingStatusHandler();
    }
  }

  const endRecordingButtonOnClick = async () => {
    await endRecordingHandler();
    await recordingStatusHandler();
  }

  // useEffects

  useEffect(() => {
    if(framerateSelection !== "" && frameWidthSelection !== "") {
      saveCameraSettingsLocalStorage(framerateSelection, frameWidthSelection)
    }
  }, [frameWidthSelection, framerateSelection])

  // set selection defaults
  useEffect(() => {
    const leaderCam = getDevicePathsWithName(cameraData, "leader")
    if(leaderCam.length > 0) {
      setLeftCameraSelection(leaderCam[0])
    }

    const followerCam = getDevicePathsWithName(cameraData, "follow")
    if(followerCam.length > 0) {
      setRightCameraSelection(followerCam[0])
    }

    // use local storage to save user settings for framerate and framewidth
    if(leaderCam.length > 0 && followerCam.length > 0) {
      const localStorageSettings = getCameraSettingsLocalStorage();
      setFramerateSelection(localStorageSettings.framerate);
      setFrameWidthSelection(localStorageSettings.framewidth);
    }

  }, [cameraData, frameWidthSelection, framerateSelection]);

  // get available paths
  useEffect(() => {
    setAvailableDevices(getMJPEGDevicePaths(cameraData));
  }, [cameraData]);

  return (
    <>
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          margin: "1rem",
          width: "100%",
          maxHeight: "40px",
        }}
      >
        {"Recording"}
      </Typography>
      {/* Container */}
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
        {/* First row of controls - Camera Selection and Compression Method */}
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
          {/* Left Camera Device Path Selection */}
          <Tooltip placement="top" title='Typically the "Leader" device.'>
            <Select
              disabled={recordingStatus}
              value={leftCameraSelection}
              startAdornment={
                <InputAdornment position="start">
                  Left Camera Device
                </InputAdornment>
              }
              onChange={(event) => {
                onLeftSelectionChange(event.target.value);
              }}
            >
              <MenuItem value={"None"}>
                {"None"}
              </MenuItem>
              {getUnusedDeviceSelectionsLeft().map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>

          {/* Right Camera Device Path Selection */}
          <Tooltip placement="top" title='Typically the "Follower" device.'>
            <Select
              disabled={recordingStatus}
              value={rightCameraSelection}
              startAdornment={
                <InputAdornment position="start">
                  Right Camera Device
                </InputAdornment>
              }
              onChange={(event) => {
                onRightSelectionChange(event.target.value);
              }}
            >
              <MenuItem value={"None"}>
                {"None"}
              </MenuItem>
              {getUnusedDeviceSelectionsRight().map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>

          {/* Compression Method Selection - Only MJPEG for now */}
          <Tooltip placement="top" title="Only MJPEG is available.">
            <Select
              disabled
              value={MJPEG}
              labelId="compression-label"
              startAdornment={
                <InputAdornment position="start">Compression</InputAdornment>
              }
            >
              <MenuItem value={MJPEG}>{MJPEG}</MenuItem>
            </Select>
          </Tooltip>
        </Box>

        {/* Second row of controls - Frame Width and Framerate*/}
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
          {/* Framerate Selection */}
          <Tooltip placement="left" title="Framerate of each camera.">
            <Select
              value={framerateSelection}
              disabled={recordingStatus}
              startAdornment={
                <InputAdornment position="start">Framerate</InputAdornment>
              }
              onChange={(event) => {
                onFramerateSelectionChange(event.target.value);
              }}
            >
              {getFramerateSelections().map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>

          {/* Frame Width Selection */}
          <Tooltip
            placement="right"
            title="Width of each camera. Height is automatically selected."
          >
            <Select
              value={frameWidthSelection}
              disabled={recordingStatus}
              startAdornment={
                <InputAdornment position="start">Frame Width</InputAdornment>
              }
              onChange={(event) => {
                onFrameWidthSelectionChange(event.target.value);
              }}
            >
              {getFrameWidthSelections().map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>
        </Box>

        {/* Third row of controls - Start/End Recording */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            columnGap: "5px",
            justifyContent: "center",
          }}
        >
          <Button disabled={recordingStatus} onClick={startRecordingButtonOnClick}>Start</Button>
          <Button disabled={!recordingStatus} onClick={endRecordingButtonOnClick}>Stop</Button>
        </Box>
      </Box>
    </>
  );
};

export default StereoRecordingMenu;
