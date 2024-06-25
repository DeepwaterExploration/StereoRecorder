import React from 'react';
import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

interface CameraCardProps {
    cameraName: string;
    camera: Camera;
}

const CameraCard: React.FC<CameraCardProps> = ({ cameraName, camera }) => {
    return (
        <Card sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {camera.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Bus ID: {cameraName}, Device Index: {camera.device_index}
                </Typography>
                {camera.formats.map((format, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                                {format.pixelformat}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {format.resolutions.map((resolution, resIndex) => (
                                    <ListItem key={resIndex}>
                                        <ListItemText 
                                            primary={`${resolution.width} x ${resolution.height}`} 
                                            secondary={`FPS: ${resolution.fps.join(', ')}`} 
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </CardContent>
        </Card>
    );
};

export default CameraCard;
