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
    formats: {[cam: string]: Formats};
}

export interface Devices {
    [bus_info: string]: Device;
}

export const BACKEND_URL = "http://localhost:8669"

export const fetchCameraData = async () => {
    const response = await fetch(BACKEND_URL+'/cameras');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    var devices = (await response.json()) as Devices;
    return devices;
};

export const fetchVideoFiles = async () => {
    const response = await fetch(BACKEND_URL+'/get_video_files');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
};

