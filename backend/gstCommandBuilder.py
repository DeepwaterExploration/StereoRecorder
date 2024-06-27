import datetime
import os

def build_stereo_gst_command(output_directory, filename, width, framerate, deviceIDX1, deviceIDX2):
    # Generate the timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Construct the output file path
    output_file = os.path.join(output_directory, f'{filename}_{timestamp}.avi')
    
    # Construct the command
    command = (
        "gst-launch-1.0 -v "
        "compositor name=mix "
        "sink_0::xpos=0 sink_0::ypos=0 sink_0::alpha=1 "
        f"sink_1::xpos={width} sink_1::ypos=0 sink_1::alpha=1 "
        f"! jpegenc ! queue ! avimux ! filesink location={output_file} "
        f"v4l2src device=/dev/video{deviceIDX1} ! image/jpeg,width={width},framerate={framerate}/1 ! "
        "jpegdec ! videorate ! mix.sink_0 "
        f"v4l2src device=/dev/video{deviceIDX2} ! image/jpeg,width={width},framerate={framerate}/1 ! "
        "jpegdec ! videorate ! mix.sink_1"
    )
    
    return command
