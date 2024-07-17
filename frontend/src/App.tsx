import './App.css'
import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { Box, Button, CssBaseline, Grid, Typography } from '@mui/material';
import CameraCard from './components/CameraList';
import { BACKEND_URL, Devices, fetchCameraData, fetchVideoFiles, Format, Interval } from './api/backend';
import FolderList, { FileDetail } from './components/FolderList';
import StitchedComponent from './components/StitchedComponent';
const App: React.FC = () => {

  const [cameraData, setCameraData] = useState<Devices>({});
  const [videoFiles, setVideoFiles] = useState<FileDetail[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [mjpgPaths, setMjpgPaths] = useState<string[]>([]);
  const [leftPath, setLeftPath] = useState<string | null>(null);
  const [rightPath, setRightPath] = useState<string | null>(null);
  const [leftOptions, setLeftOptions] = useState<{ fps: number[], width: number[] }>({ fps: [], width: [] });
  const [rightOptions, setRightOptions] = useState<{ fps: number[], width: number[] }>({ fps: [], width: [] });
  const refreshVideoFiles = async () => {
    try {
      const data = await fetchVideoFiles();
      setVideoFiles(data);
    } catch (error) {
      console.error('Error fetching video files:', error);
    }
  };
  const getPaths = (fmts: string[] = ["MJPG", "H264"]) => {
    var paths: string[] = [];

    Object.keys(cameraData).forEach((cam) => {

      const device = cameraData[cam];
      if (device.name.toLowerCase().includes("explorehd") || device.name.toLowerCase().includes("stellar")) {
        Object.keys(device.formats).forEach((path) => {
          const formats = Object.keys(device.formats[path]);

          if (fmts.some((fmt) => formats.includes(fmt))) {
            paths.push(path);
          }
        })
      }
    });

    return paths.sort();
  }
  useEffect(() => {
    if (rightPath !== null) {
      setRightOptions(() => getPossibleOptions(rightPath))
    }
    if (leftPath !== null) {
      setLeftOptions(() => getPossibleOptions(leftPath))
    }
  }, [leftPath, rightPath])
  const getPossibleOptions = (device: string) => {
    let options: { fps: number[], width: number[] } = {
      width: [],
      fps: []
    }
    Object.keys(cameraData).forEach((cam) => {

      const curDevice = cameraData[cam];

      if (curDevice.name.toLowerCase().includes("explorehd") || curDevice.name.toLowerCase().includes("stellar")) {
        Object.keys(curDevice.formats).forEach((path) => {
          if (path === device) {
            const fmts = curDevice.formats[path];
            if (Object.keys(fmts).includes("MJPG")) {

              options.fps = options.fps.concat(
                fmts['MJPG'].flatMap((fmt: Format) => fmt.intervals.map(((int: Interval) => int.denominator)))
              )
              options.width = options.width.concat(
                fmts["MJPG"].map((fmt: Format) => fmt.width)
              )
            }

            if (Object.keys(fmts).includes("H264")) {

              options.fps = options.fps.concat(
                fmts['H264'].flatMap((fmt: Format) => fmt.intervals.map(((int: Interval) => int.denominator)))
              )
              options.width = options.width.concat(
                fmts["H264"].map((fmt: Format) => fmt.width)
              )
            }
          }
        })
      }
    })
    options.fps = [...new Set(options.fps)]
    options.width = [...new Set(options.width)]
    return options;
  }
  useEffect(() => { setPaths(getPaths); setMjpgPaths(() => getPaths(["MJPG"])) })
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
      <Box sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "start"
      }}>
        <Box sx={{
          width: "60%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center"
        }}>
          <Box sx={{
            width: "100%",
            height: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            flexWrap: 'wrap',
          }}>
            <Grid
              container
              alignItems='baseline'
              flexWrap='wrap'
              style={{
                justifyContent: "space-evenly",
                overflowY: "scroll"
              }}
            >
              <Typography variant="h6" sx={{ marginTop: "1rem", width: "100%" }}>
                Cameras
              </Typography>
              {cameraData &&
                Object.entries(cameraData).map(([bus_info, device], index) => (
                  <CameraCard key={index} bus_info={bus_info} device={device} />
                ))}
            </Grid>
          </Box>

          <Box sx={{
            width: "100%",
            height: "50%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "start",
            alignItems: "center",
            borderTop: "solid #46bae7"
          }}>
            <Typography variant="h6" sx={{ marginTop: "1rem", width: "100%" }}>
              Recording
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
            <Box sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
              <Typography>
                Multi-cam recording
              </Typography>
            </Box>
          </Box>

        </Box>

        <Box sx={{
          width: "40%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          borderLeft: "solid #46bae7"
        }}>
          <Typography variant="h6" sx={{ marginTop: "1rem" }}>
            File List
          </Typography>

          <Box sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}>
            <Button variant='contained' color='success' onClick={() => {
              refreshVideoFiles()
            }}>
              Refresh
            </Button>
            <Button variant='contained'>
              Download All
            </Button>
          </Box>
          <FolderList files={videoFiles} backendUrl={BACKEND_URL} />
        </Box>

      </Box>
    </CssBaseline>
  );
};

export default App
