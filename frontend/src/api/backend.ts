export interface Resolution {
    width: number;
    height: number;
    fps: number[];
}

export interface Interval {
    numerator: number;
    denominator: number;
}

export interface Format {
    width: number;
    height: number;
    intervals: Interval[];
}

export interface Formats {
    [pixformat: string]: Format[];
}

export interface Device {
    name: string;
    formats: { [cam: string]: Formats };
}

export interface Devices {
    [bus_info: string]: Device;
}

export const BACKEND_URL = "http://localhost:8669"

export const fetchCameraData = async () => {
    const response = await fetch(BACKEND_URL + '/cameras');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const devices = (await response.json()) as Devices;
    return devices;
};

export const fetchVideoFiles = async () => {
    const response = await fetch(BACKEND_URL + '/get_video_files');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
};

interface StartStereoResponse {
    success: boolean;
    error?: string;
}

export const startStereo = async (
    deviceIDX1: string,
    deviceIDX2: string,
    width: string,
    framerate: string
): Promise<StartStereoResponse> => {
    try {
        const response = await fetch(`${BACKEND_URL}/start_stereo/${deviceIDX1.replace("/dev/video", "")}/${deviceIDX2.replace("/dev/video", "")}/${width}/${framerate}`);

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();

        return { success: data.status };
    } catch (error) {
        console.error('Error starting stereo:', error);
        return { success: false };
    }
};

export const stopStereo = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${BACKEND_URL}/stop_stereo`);

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }


        return true;
    } catch (error) {
        console.error('Error stoppin stereo:', error);
        return false;
    }
}