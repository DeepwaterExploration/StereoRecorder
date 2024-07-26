import { StereoSettings } from "../types/stereoRecordingTypes";
import { endStereoRecordingEndpoint, getStereoRecordingStatusEndpoint, startStereoRecordingEndpoint } from "./backendServerAPI";

// Function to start stereo recording
export const startStereoRecording = async (cameraSettings: StereoSettings): Promise<{ message: string; filename: string }> => {
  try {
    const response = await fetch(startStereoRecordingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cameraSettings),
    });

    if (!response.ok) {
      throw new Error('Failed to start stereo recording');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error starting stereo recording:', error);
    throw error;
  }
};

// Function to end stereo recording
export const endStereoRecording = async (): Promise<{ message: string }> => {
  try {
    const response = await fetch(endStereoRecordingEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to end stereo recording');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error ending stereo recording:', error);
    throw error;
  }
};

// Function to get the stereo recording status
export const fetchStereoRecordingStatus = async (): Promise<{ status: string }> => {
  try {
    const response = await fetch(getStereoRecordingStatusEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get stereo recording status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stereo recording status:', error);
    throw error;
  }
};
