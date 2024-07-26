
# Camera Data API
getCameraDataEndpoint: str = "/getCameraData"

# Folder Data API
getVideoFolderDataEndpoint: str = "/getVideoFilesData"

filenamePlaceHolder: str = "<filename>"

downloadVideoFileEndpointFormat: str = f"/downloadVideoFile/{filenamePlaceHolder}"
deleteVideoFileEndpointFormat: str = f"/deleteVideoFile/{filenamePlaceHolder}"

# Stereo Recording API
getStereoRecordingStatusEndpoint: str = "/getStereoRecordingStatus"
startStereoRecordingEndpoint: str = "/startStereoRecording"
endStereoRecordingEndpoint: str = "/endStereoRecording"