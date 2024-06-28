import './App.css'
import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { Box, Button, CssBaseline, Grid, Tab, Tabs, Typography } from '@mui/material';
import CameraCard from './components/CameraList';
import { BACKEND_URL, Devices, fetchCameraData, fetchVideoFiles } from './api/backend';
import FolderList from './components/FolderList';

const App: React.FC = () => {

  const [cameraData, setCameraData] = useState<Devices | null>(null);
  const [videoFiles, setVideoFiles] = useState<string[]>([]);

  const updateVideoFiles = async () => {
    try {
      const data = await fetchVideoFiles();
      setVideoFiles(data);
    } catch (error) {
        console.error('Error fetching video files:', error);
    }
  };

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
        await updateVideoFiles();
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <CssBaseline>
      <NavBar/>
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
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            borderTop: "solid #46bae7"
          }}>
            <Tabs>
              <Tab label="Multi-Cam Recording"/>
              <Tab label="Stereo-Pair Recording "/>
            </Tabs>
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
          <Typography variant="h6" sx={{marginTop:"1rem"}}>
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
                updateVideoFiles()
              }}>
                Refresh
              </Button>
              <Button variant='contained'>
                Download All
              </Button>
          </Box>
          <FolderList files={videoFiles} backendUrl={BACKEND_URL}/>
        </Box>
        
      </Box>
    </CssBaseline>
  );
};

export default App
