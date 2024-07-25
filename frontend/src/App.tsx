import "./App.css";
import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import {
  Box,
  Button,
  CssBaseline,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CameraCard from "./components/CameraList";
import {
  BACKEND_URL,
  Devices,
  fetchCameraData,
  fetchVideoFiles,
  Format,
  Interval,
} from "./api/backend";
import FolderList, { FileDetail } from "./components/FolderList";
import StitchedComponent from "./components/Stitched";

// Extracted constants
const TAB_PANEL_STITCHED = 1;
const TAB_PANEL_MULTI_CAM = 2;
const CAMERA_NAMES_TO_INCLUDE = ["explorehd", "stellar"];
const FORMATS_TO_INCLUDE = ["MJPG", "H264"];
const HEADER_TITLE_CAMERAS = "Cameras";
const HEADER_TITLE_RECORDING = "Recording";
const HEADER_TITLE_FILE_LIST = "File List";
const BUTTON_LABEL_REFRESH = "Refresh";
const BUTTON_LABEL_DOWNLOAD_ALL = "Download All";
const TAB_LABEL_STITCHED = "Stitched";
const TAB_LABEL_MULTI_CAM_INTERVAL = "Multi-Cam interval";
const BOX_BORDER_COLOR = "#46bae7";
const MARGIN_TOP = "1rem";
const BOX_HEIGHT_HALF = "50%";
const BOX_WIDTH_FULL = "100%";
const BOX_WIDTH_SIXTY = "60%";
const BOX_WIDTH_FORTY = "40%";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const App: React.FC = () => {
  const [cameraData, setCameraData] = useState<Devices>({});
  const [videoFiles, setVideoFiles] = useState<FileDetail[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [mjpgPaths, setMjpgPaths] = useState<string[]>([]);
  const [leftPath, setLeftPath] = useState<string | null>(null);
  const [rightPath, setRightPath] = useState<string | null>(null);
  const [leftOptions, setLeftOptions] = useState<{
    fps: number[];
    width: number[];
  }>({ fps: [], width: [] });
  const [rightOptions, setRightOptions] = useState<{
    fps: number[];
    width: number[];
  }>({ fps: [], width: [] });

  const [tabPanel, setTabPanel] = useState(TAB_PANEL_STITCHED);

  const refreshVideoFiles = async () => {
    try {
      const data = await fetchVideoFiles();
      setVideoFiles(data);
    } catch (error) {
      console.error("Error fetching video files:", error);
    }
  };

  const getPaths = (fmts: string[] = FORMATS_TO_INCLUDE) => {
    const paths: string[] = [];

    Object.keys(cameraData).forEach((cam) => {
      const device = cameraData[cam];
      if (
        CAMERA_NAMES_TO_INCLUDE.some((name) =>
          device.name.toLowerCase().includes(name),
        )
      ) {
        Object.keys(device.formats).forEach((path) => {
          const formats = Object.keys(device.formats[path]);

          if (fmts.some((fmt) => formats.includes(fmt))) {
            paths.push(path);
          }
        });
      }
    });

    return paths.sort();
  };

  useEffect(() => {
    if (rightPath !== null) {
      setRightOptions(() => getPossibleOptions(rightPath));
    }
    if (leftPath !== null) {
      setLeftOptions(() => getPossibleOptions(leftPath));
    }
  }, [leftPath, rightPath]);

  const getPossibleOptions = (device: string) => {
    const options: { fps: number[]; width: number[] } = {
      width: [],
      fps: [],
    };
    Object.keys(cameraData).forEach((cam) => {
      const curDevice = cameraData[cam];

      if (
        CAMERA_NAMES_TO_INCLUDE.some((name) =>
          curDevice.name.toLowerCase().includes(name),
        )
      ) {
        Object.keys(curDevice.formats).forEach((path) => {
          if (path === device) {
            const fmts = curDevice.formats[path];
            if (Object.keys(fmts).includes("MJPG")) {
              options.fps = options.fps.concat(
                fmts["MJPG"].flatMap((fmt: Format) =>
                  fmt.intervals.map((int: Interval) => int.denominator),
                ),
              );
              options.width = options.width.concat(
                fmts["MJPG"].map((fmt: Format) => fmt.width),
              );
            }

            if (Object.keys(fmts).includes("H264")) {
              options.fps = options.fps.concat(
                fmts["H264"].flatMap((fmt: Format) =>
                  fmt.intervals.map((int: Interval) => int.denominator),
                ),
              );
              options.width = options.width.concat(
                fmts["H264"].map((fmt: Format) => fmt.width),
              );
            }
          }
        });
      }
    });
    options.fps = [...new Set(options.fps)];
    options.width = [...new Set(options.width)];
    return options;
  };

  useEffect(() => {
    setPaths(() => getPaths(FORMATS_TO_INCLUDE));
    setMjpgPaths(() => getPaths(["MJPG"]));
  });

  // fetch camera data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCameraData();
        console.log(data);
        setCameraData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // fetch video files data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshVideoFiles();
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <CssBaseline>
      <NavBar />
      <Box
        sx={{
          width: BOX_WIDTH_FULL,
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            width: BOX_WIDTH_SIXTY,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: BOX_WIDTH_FULL,
              height: BOX_HEIGHT_HALF,
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Grid
              container
              alignItems="baseline"
              flexWrap="wrap"
              style={{
                justifyContent: "space-evenly",
                overflowY: "scroll",
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginTop: MARGIN_TOP, width: BOX_WIDTH_FULL }}
              >
                {HEADER_TITLE_CAMERAS}
              </Typography>
              {cameraData &&
                Object.entries(cameraData).map(([bus_info, device], index) => (
                  <CameraCard key={index} bus_info={bus_info} device={device} />
                ))}
            </Grid>
          </Box>

          <Box
            sx={{
              width: BOX_WIDTH_FULL,
              height: BOX_HEIGHT_HALF,
              display: "flex",
              flexWrap: "wrap",
              borderTop: `solid ${BOX_BORDER_COLOR}`,
              flexDirection: "row",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginTop: MARGIN_TOP,
                width: BOX_WIDTH_FULL,
                maxHeight: "40px",
              }}
            >
              {HEADER_TITLE_RECORDING}
            </Typography>
            <StitchedComponent
              paths={mjpgPaths}
              leftPath={leftPath}
              rightPath={rightPath}
              setRightPath={setRightPath}
              setLeftPath={setLeftPath}
              leftOptions={leftOptions}
              rightOptions={rightOptions}
            />
            {/* <Tabs
              value={tabPanel}
              onChange={(_event: React.SyntheticEvent, newValue: number) => {
                setTabPanel(newValue);
              }}
              sx={{ width: BOX_WIDTH_FULL, maxHeight: "40px" }}
            >
              <Tab label={TAB_LABEL_STITCHED} value={TAB_PANEL_STITCHED} />
              <Tab
                label={TAB_LABEL_MULTI_CAM_INTERVAL}
                value={TAB_PANEL_MULTI_CAM}
              />
            </Tabs>
            <TabPanel value={tabPanel} index={TAB_PANEL_STITCHED}>

            </TabPanel>
            <TabPanel value={tabPanel} index={TAB_PANEL_MULTI_CAM}>
              <MultiCamComponent paths={paths} />
            </TabPanel> */}
          </Box>
        </Box>

        <Box
          sx={{
            width: BOX_WIDTH_FORTY,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            borderLeft: `solid ${BOX_BORDER_COLOR}`,
            overflow: "scroll",
          }}
        >
          <Typography variant="h6" sx={{ marginTop: MARGIN_TOP }}>
            {HEADER_TITLE_FILE_LIST}
          </Typography>

          <Box
            sx={{
              width: BOX_WIDTH_FULL,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                refreshVideoFiles();
              }}
            >
              {BUTTON_LABEL_REFRESH}
            </Button>
            <Button variant="contained">{BUTTON_LABEL_DOWNLOAD_ALL}</Button>
          </Box>
          <FolderList files={videoFiles} backendUrl={BACKEND_URL} />
        </Box>
      </Box>
    </CssBaseline>
  );
};

export default App;
