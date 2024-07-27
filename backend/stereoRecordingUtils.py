import os
from dataclasses import dataclass
from processHandler import ProcessHandler

@dataclass
class StereoSettings:
    leftCameraDevicePath: str
    rightCameraDevicePath: str
    cameraFramerate: int
    cameraFrameWidth: int

class StereoRecordingManager:
    def __init__(self):
        self.commandHandler = ProcessHandler()

    def stereoGSTCompositedVideoCommand(self, leftCameraDevicePath, rightCameraDevicePath, cameraFrameWidth, cameraFramerate, outputDirectory, filename):
        # Construct the output file path
        outputFilePath = os.path.join(outputDirectory, f'{filename}.avi')

        # Construct the command
        command = (
            "gst-launch-1.0 -v "
            "compositor name=mix "
            "sink_0::xpos=0 sink_0::ypos=0 sink_0::alpha=1 "
            f"sink_1::xpos={cameraFrameWidth} sink_1::ypos=0 sink_1::alpha=1 "
            f"! jpegenc ! queue ! avimux ! filesink location={outputFilePath} "
            f"v4l2src device={leftCameraDevicePath} ! image/jpeg,width={cameraFrameWidth},framerate={cameraFramerate}/1 ! "
            "jpegdec ! videorate ! queue2 ! mix.sink_0 "
            f"v4l2src device={rightCameraDevicePath} ! image/jpeg,width={cameraFrameWidth},framerate={cameraFramerate}/1 ! "
            "jpegdec ! videorate ! queue2 ! mix.sink_1"
        )
        
        return command

    def startRecording(self, settings: StereoSettings, outputDirectory: str, filename: str) -> bool:
        command = self.stereoGSTCompositedVideoCommand(
            settings.leftCameraDevicePath,
            settings.rightCameraDevicePath,
            settings.cameraFrameWidth,
            settings.cameraFramerate,
            outputDirectory,
            filename
        )
        return self.commandHandler.initiateProcess(command)

    def endRecording(self) -> bool:
        return self.commandHandler.endProcess()

    def recordingStatus(self) -> bool:
        return self.commandHandler.isRunning()