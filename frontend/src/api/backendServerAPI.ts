// ENDPOINTS

export const BackendServerURL = `http://${window.location.hostname}:8669`;

// Camera Data API
export const getCameraDataEndpoint = "/getCameraData";

// Folder Data API
export const getVideoFolderDataEndpoint = "/getVideoFilesData";
const filenamePlaceHolder = "<filename>";
const downloadVideoFileEndpointFormat = `/downloadVideoFile/${filenamePlaceHolder}`;
const deleteVideoFileEndpointFormat = `/deleteVideoFile/${filenamePlaceHolder}`;

export const downloadVideoFileEndpoint = (filename: string): string => {
  return downloadVideoFileEndpointFormat.replace(filenamePlaceHolder, filename);
};

export const deleteVideoFileEndpoint = (filename: string): string => {
  return deleteVideoFileEndpointFormat.replace(filenamePlaceHolder, filename);
};

// Stereo Recording API
export const getStereoRecordingStatusEndpoint: string =
  "/getStereoRecordingStatus";
export const startStereoRecordingEndpoint: string = "/startStereoRecording"; // POST Request
export const endStereoRecordingEndpoint: string = "/endStereoRecording";
