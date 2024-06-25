export const fetchCameraData = async () => {
    const response = await fetch('http://localhost:8669/cameras');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
};