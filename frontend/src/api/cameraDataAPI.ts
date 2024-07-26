import { Devices } from "../types/cameraTypes";
import { BackendServerURL, getCameraDataEndpoint } from "./backendServerAPI";

export const fetchCameraData = async () => {
  const response = await fetch(BackendServerURL + getCameraDataEndpoint);
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  const devices = (await response.json()) as Devices;
  return devices;
};
