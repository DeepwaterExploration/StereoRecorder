import "./App.css";
import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import CameraCard from "./components/CameraCard";
import { Devices } from "./types/cameraTypes";
import { fetchCameraData } from "./api/cameraDataAPI";
import FolderList from "./components/FolderList";
import { FileDetail } from "./types/folderTypes";
import {
  deleteVideoFile,
  downloadVideoFile,
  fetchVideoFolderData,
} from "./api/folderDataAPI";

// Extracted constants
const BOX_BORDER_COLOR = "#46bae7";
const MARGIN_TOP = "1rem";
const BOX_WIDTH_FULL = "100%";
const BOX_WIDTH_SIXTY = "60%";
const BOX_HEIGHT_HALF = "50%";
const BOX_WIDTH_FORTY = "40%";

const App: React.FC = () => {
  const [cameraData, setCameraData] = useState<Devices>({});
  const [videoFiles, setVideoFiles] = useState<FileDetail[]>([]);

  /** First page load useEffects: **/

  // update camera cards data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCameraData();
        setCameraData(data);
      } catch (error) {
        console.error("Error fetching camera data:\n" + error);
      }
    };

    fetchData();
  }, []);

  // update video folder data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchVideoFolderData();
        setVideoFiles(data);
      } catch (error) {
        console.error("Error fetching video files:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <CssBaseline>
      {/* DEEPWATER EXPLORATION TOP BAR */}
      <NavBar />

      {/* CONTAINER FOR THE REST OF THE APP */}
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
        {/* CONTAINER FOR THE LEFT SIDE */}
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
          {/* LEFT SIDE TOP HALF - CAMERA CARDS */}
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
                {"Cameras"}
              </Typography>
              {cameraData &&
                Object.entries(cameraData).map(([bus_info, device], index) => (
                  <CameraCard key={index} bus_info={bus_info} device={device} />
                ))}
            </Grid>
          </Box>

          {/* LEFT SIDE BOTTOM HALF - RECORDING FUNCTIONS */}
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
              {"Recording"}
            </Typography>
          </Box>
        </Box>

        {/* RIGHT SIDE - LIST OF FILES IN FOLDER */}
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
            {"File List"}
          </Typography>
          <FolderList
            files={videoFiles}
            downloadButtonHandler={downloadVideoFile}
            deleteButtonHandler={deleteVideoFile}
          />
        </Box>
      </Box>
    </CssBaseline>
  );
};

export default App;
