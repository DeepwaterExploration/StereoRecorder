import datetime
import os
import shutil
from flask import Flask, jsonify, redirect, request, send_from_directory, url_for
from flask_cors import CORS
from commandHandler import CommandHandler
from gstCommandBuilder import build_stereo_gst_command

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

VIDEO_DIRECTORY = "/home/kunal/Videos"

stereoCommandHandler = CommandHandler()

@app.route('/cameras', methods=['GET'])
def camera_info():
    return True
    # return jsonify(get_camera_info())

@app.route('/start_stereo', methods=['POST'])
def start_stereo():
    if(stereoCommandHandler.isRunning()):
        return True
    try:
        data = request.get_json()
        device_idx1 = data.get('deviceIDX1')
        device_idx2 = data.get('deviceIDX2')
        width = data.get('width')
        framerate = data.get('framerate')
        
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = "Stereo" + timestamp
        command = build_stereo_gst_command(
            output_directory=VIDEO_DIRECTORY,
            filename=filename,
            width=width,
            framerate=framerate,
            deviceIDX1=device_idx1,
            deviceIDX2=device_idx2
        )
        return stereoCommandHandler.start_command(command=command)
    except:
        return False
    
@app.route('/stop_stereo', methods=['GET'])
def stop_stereo():
    if(stereoCommandHandler.isRunning()):
        return stereoCommandHandler.stop_command()
    return True

@app.route('/get_video_files')
def get_video_files():
    files = os.listdir(VIDEO_DIRECTORY)
    return jsonify(files)

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(VIDEO_DIRECTORY, filename)

@app.route('/delete/<filename>', methods=['GET'])
def delete_file(filename):
    file_path = os.path.join(VIDEO_DIRECTORY, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return jsonify({"message": f"File {filename} deleted successfully."}), 200
        except Exception as e:
            return jsonify({"error": f"Error deleting file {filename}: {str(e)}"}), 500
    else:
        return jsonify({"error": f"File {filename} not found."}), 404

@app.route('/delete_all', methods=['POST'])
def delete_all():
    for filename in os.listdir(VIDEO_DIRECTORY):
        file_path = os.path.join(VIDEO_DIRECTORY, filename)
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8669)
