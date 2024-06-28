import datetime
import os
import shutil
from flask import Flask, jsonify, redirect, request, send_from_directory, url_for
from flask_cors import CORS
from commandHandler import CommandHandler
from gstCommandBuilder import build_stereo_gst_command
from enumeration import list_devices
import fcntl
import v4l2
import utils

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

VIDEO_DIRECTORY = f'/home/{os.getlogin()}/Videos'

stereoCommandHandler = CommandHandler()

@app.route('/cameras', methods=['GET'])
def camera_info():
    devices = list_devices()

    setup_devices = {}
    for device in devices:
        setup_devices[device.bus_info] = {
            'name': device.device_name,
            'formats': {}
        }
        for path in device.device_paths:
            setup_devices[device.bus_info]['formats'][path] = {}
            file_object = open(path);
            fd = file_object.fileno()
            for i in range(1000):
                v4l2_fmt = v4l2.v4l2_fmtdesc()
                v4l2_fmt.index = i
                v4l2_fmt.type = v4l2.V4L2_BUF_TYPE_VIDEO_CAPTURE
                try:
                    fcntl.ioctl(fd, v4l2.VIDIOC_ENUM_FMT, v4l2_fmt)
                except:
                    break

                format_sizes = []
                for j in range(1000):
                    frmsize = v4l2.v4l2_frmsizeenum()
                    frmsize.index = j
                    frmsize.pixel_format = v4l2_fmt.pixelformat
                    try:
                        fcntl.ioctl(fd, v4l2.VIDIOC_ENUM_FRAMESIZES, frmsize)
                    except:
                        break
                    if frmsize.type == v4l2.V4L2_FRMSIZE_TYPE_DISCRETE:
                        format_size = {'width': frmsize.discrete.width, 'height': frmsize.discrete.height, 'intervals': []}
                        for k in range(1000):
                            frmival = v4l2.v4l2_frmivalenum()
                            frmival.index = k
                            frmival.pixel_format = v4l2_fmt.pixelformat
                            frmival.width = frmsize.discrete.width
                            frmival.height = frmsize.discrete.height
                            try:
                                fcntl.ioctl(
                                    fd, v4l2.VIDIOC_ENUM_FRAMEINTERVALS, frmival)
                            except:
                                break
                            if frmival.type == v4l2.V4L2_FRMIVAL_TYPE_DISCRETE:
                                format_size['intervals'].append({'numerator': frmival.discrete.numerator, 'denominator': frmival.discrete.denominator})
                        format_sizes.append(format_size)
                setup_devices[device.bus_info]['formats'][path][utils.fourcc2s(v4l2_fmt.pixelformat)] = format_sizes


    print(setup_devices)
    return jsonify(setup_devices)

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