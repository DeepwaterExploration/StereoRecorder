import './App.css'
import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { Box, CircularProgress, Container, CssBaseline, Grid, Tab, Tabs, Typography } from '@mui/material';
import CameraCard from './components/CameraList';
import { fetchCameraData } from './api/camera';

interface Resolution {
  width: number;
  height: number;
  fps: number[];
}

interface Format {
  pixelformat: string;
  resolutions: Resolution[];
}

interface Camera {
  name: string;
  device_index: number;
  formats: Format[];
}

const App: React.FC = () => {

  const [cameraData, setCameraData] = useState<Record<string, Camera> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const data = await fetchCameraData();
              setCameraData(data);
              setLoading(false);
          } catch (error) {
              setError('Failed to fetch camera data');
              setLoading(false);
          }
      };

      fetchData();
  }, []);

  if (loading) {
      return (
          <Container>
              <CircularProgress />
          </Container>
      );
  }

  if (error) {
      return (
          <Container>
              <Typography color="error">{error}</Typography>
          </Container>
      );
  }

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
                Object.entries(cameraData).map(([cameraName, camera], index) => (
                    <CameraCard key={index} cameraName={cameraName} camera={camera} />
              ))} 
            </Grid>
          </Box>

          <Box sx={{
            width: "100%",
            height: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center"
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
          alignItems: "center"
        }}>
          
        </Box>
        
      </Box>
    </CssBaseline>
  );
};

export default App
