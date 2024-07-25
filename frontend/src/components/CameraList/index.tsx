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
import { Device } from "../../api/backend";

// interface Resolution {
//     width: number;
//     height: number;
//     fps: number[];
// }

// interface Format {
//     pixelformat: string;
//     resolutions: Resolution[];
// }

// interface Camera {
//     name: string;
//     device_index: number;
//     formats: Format[];
// }

interface CameraCardProps {
  bus_info: string;
  device: Device;
}

const CameraCard: React.FC<CameraCardProps> = ({ bus_info, device }) => {
  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {device.name.split(":")[0]}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Bus ID: {bus_info}
        </Typography>
        {Object.keys(device.formats).map((devpath) =>
          Object.entries(device.formats[devpath]).map(
            ([pixelformat, format], index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    {pixelformat}: {devpath}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {format.map((resolution, resIndex) => (
                      <ListItem key={resIndex}>
                        <ListItemText
                          primary={`${resolution.width} x ${resolution.height}`}
                          secondary={`FPS: ${resolution.intervals.map((interval) => interval.denominator).join(", ")}`}
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
