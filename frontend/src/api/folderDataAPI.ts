import {
  BackendServerURL,
  deleteVideoFileEndpoint,
  downloadVideoFileEndpoint,
  getVideoFolderDataEndpoint,
} from "./backendServerAPI";

export const fetchVideoFolderData = async () => {
  const response = await fetch(BackendServerURL + getVideoFolderDataEndpoint);
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  return response.json();
};

export const downloadVideoFile = (filename: string): string => {
  return BackendServerURL + downloadVideoFileEndpoint(filename);
};

export const deleteVideoFile = async (filename: string) => {
  if (
    window.confirm(`Are you sure you want to delete the file: ${filename}?`)
  ) {
    try {
      const response = await fetch(
        BackendServerURL + deleteVideoFileEndpoint(filename),
        {
          method: "GET",
        },
      );
      if (response.ok) {
        alert(`File ${filename} deleted successfully.`);
        window.location.reload(); // Reload the page to update the file list
      } else {
        alert(`Failed to delete file ${filename}.`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert(`Error deleting file ${filename}.`);
    }
  }
};
