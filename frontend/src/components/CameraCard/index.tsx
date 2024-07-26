import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Device } from "../../types/cameraTypes";

interface CameraCardProps {
  bus_info: string;
  device: Device;
}

const CameraCard: React.FC<CameraCardProps> = ({ bus_info, device }) => {
  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        {/* Camera Name */}
        <Typography variant="h5" component="div">
          {device.name.split(":")[0]}
        </Typography>
        {/* Bus ID */}
        <Typography variant="subtitle1" color="textSecondary">
          Bus ID: {bus_info}
        </Typography>

        {/* Formats and Resolutions */}
        {Object.keys(device.formats).map((devpath) =>
          Object.entries(device.formats[devpath]).map(
            ([pixelformat, format], index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  {/* Pixel Format and Device Path */}
                  <Typography>
                    {pixelformat}: {devpath}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {/* List of Resolutions */}
                    {format.map((resolution, resIndex) => (
                      <ListItem key={resIndex}>
                        <ListItemText
                          primary={`${resolution.width} x ${resolution.height}`}
                          secondary={`FPS: ${resolution.intervals
                            .map((interval) => interval.denominator)
                            .join(", ")}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ),
          ),
        )}
      </CardContent>
    </Card>
  );
};

export default CameraCard;
