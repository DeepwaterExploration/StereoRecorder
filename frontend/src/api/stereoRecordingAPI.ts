import { StereoSettings } from "../types/stereoRecordingTypes";
import {
  BackendServerURL,
  endStereoRecordingEndpoint,
  getStereoRecordingStatusEndpoint,
  startStereoRecordingEndpoint,
} from "./backendServerAPI";

// Function to start stereo recording
export const startStereoRecording = async (
  recordingSettings: StereoSettings,
): Promise<{ message: string; filename: string }> => {
  try {
    const response = await fetch(
      BackendServerURL + startStereoRecordingEndpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recordingSettings),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to start stereo recording");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error starting stereo recording:", error);
    throw error;
  }
};

// Function to end stereo recording
export const endStereoRecording = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      BackendServerURL + endStereoRecordingEndpoint,
      {
        method: "GET",
      },
    );

    console.log(response);

    if (response.status == 200) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error fetching stereo recording status:", error);
    return false;
  }
};

// Function to get the stereo recording status
export const fetchStereoRecordingStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      BackendServerURL + getStereoRecordingStatusEndpoint,
      {
        method: "GET",
      },
    );

    console.log(response);

    if (response.status == 200) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error fetching stereo recording status:", error);
    return false;
  }
};
