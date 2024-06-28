export interface Resolution {
width: number;
height: number;
fps: number[];
}
  
export interface Format {
pixelformat: string;
resolutions: Resolution[];
}

export interface Device {
    name: string;
    formats: Format[];
}

export const BACKEND_URL = "http://localhost:8669"

export const fetchCameraData = async () => {
    const response = await fetch(BACKEND_URL+'/cameras');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
};

export const fetchVideoFiles = async () => {
    const response = await fetch(BACKEND_URL+'/get_video_files');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
};

