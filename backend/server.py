# external imports
from flask import Flask, jsonify, send_from_directory, request, send_file, abort
from flask_cors import CORS
import datetime
import os
import shutil
import tempfile

# local imports
import globalUtils
import cameraDataUtils
import folderDataUtils
import stereoRecordingUtils
import serverEndpoints as endpoints

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
folderDataUtils.directoryExists(globalUtils.VIDEO_DIRECTORY)

stereoRecorder = stereoRecordingUtils.StereoRecordingManager()

# Camera Data API
@app.route(endpoints.getCameraDataEndpoint, methods=['GET'])
def getCameraData():
    return jsonify(cameraDataUtils.get_devices()), 200

# Folder Data API
@app.route(endpoints.getVideoFolderDataEndpoint, methods=['GET'])
def getVideoFolderData():
    return jsonify(folderDataUtils.folderDataList(globalUtils.VIDEO_DIRECTORY)), 200

@app.route(endpoints.downloadVideoFileEndpointFormat)
def download_file_or_folder(filename):
    full_path = os.path.join(globalUtils.VIDEO_DIRECTORY, filename)

    if os.path.isdir(full_path):
        # Create a temporary ZIP file
        temp_dir = tempfile.mkdtemp()
        zip_path = os.path.join(temp_dir, f"{filename}.zip")
        shutil.make_archive(zip_path[:-4], 'zip', full_path)

        return send_file(zip_path, as_attachment=True, download_name=f"{os.path.basename(filename)}.zip")

    elif os.path.isfile(full_path):
        return send_from_directory(globalUtils.VIDEO_DIRECTORY, filename)

    else:
        abort(404, description="Resource not found")

@app.route(endpoints.deleteVideoFileEndpointFormat, methods=['GET'])
def delete_file(filename):
    full_path = os.path.join(globalUtils.VIDEO_DIRECTORY, filename)

    if os.path.exists(full_path):
        try:
            if os.path.isfile(full_path):
                os.remove(full_path)
            elif os.path.isdir(full_path):
                shutil.rmtree(full_path)
            return "", 200
        except Exception as e:
            print(f"Error deleting {full_path}: {e}")
            return "", 500
    else:
        abort(404, description="Resource not found")


# Stereo Recording API
@app.route(endpoints.getStereoRecordingStatusEndpoint, methods=['GET'])
def getStereoRecordingStatus():
    if(stereoRecorder.recordingStatus()):
        return "", 200
    return "", 404

# POST REQUEST
@app.route(endpoints.startStereoRecordingEndpoint, methods=['POST'])
def startStereoRecording():
    try:
        # Parse incoming camera settings
        data = request.get_json()
        cameraSettings = stereoRecordingUtils.StereoSettings(**data)
        
        # generate output filename
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        outputFilename = f"{timestamp}__{cameraSettings.cameraFrameWidth}p{cameraSettings.cameraFramerate}"
        
        # start recording
        stereoRecorder.startRecording(
            settings=cameraSettings,
            outputDirectory=globalUtils.VIDEO_DIRECTORY,
            filename=outputFilename
        )
        
        return jsonify({"message": "Recording started", "filename": outputFilename}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route(endpoints.endStereoRecordingEndpoint, methods=['GET'])
def endStereoRecording():
    if (stereoRecorder.endRecording()):
        return "", 200
    return "", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8669)
