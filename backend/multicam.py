import time
import os
import signal
import subprocess

class multiCamManager:
    def __init__(self):
        self.paths = []
        self.recordingInstances: list[recording] = []

    def stop_camera(self):
        for recording in self.recordingInstances:
            recording.stop()
        self.paths=[]
        self.recordingInstances=[]
    def start_cameras(self, paths_format_zip, width, fps, name, save_dir):
        self.stop_camera()
        for path, format in paths_format_zip:
            self.paths.append(path)
            rec=recording(path, name, format, width, fps, save_dir)
            rec.start()
            self.recordingInstances.append(
                rec
            )
            
    
class recording:
    def __init__(self, path, name, type, width, fps, save_path):
        self.path = path
        self.name = name
        self.type = type
        self.width = width
        self.fps = fps
        self.save_path = save_path
        self.isH264 = self.type == "H264"

        self.started: bool = False

        self._process: subprocess.Popen = None

    def _start(self):
        pipeline = self._construct_pipeline()
        print(pipeline)
        self._process = subprocess.Popen(pipeline.split(" "), stdout=subprocess.DEVNULL)

        
    def start(self):
        if self.started:
            self.stop()
        if not os.path.exists(path=self.path):
            self.stop()
            return
        self.started = True
        self._start()
        return self._process
    def stop(self):
        if not self.started:
            return
        self.started = False
        

        if self._process and self._process.poll() is None:
            self._process.send_signal(signal.SIGINT)
        try:
            self._process.communicate(timeout=10)  # Wait for the process to end cleanly
        except subprocess.TimeoutExpired:
            self._process.kill()
            self._process.communicate()
        del self._process
        self._time = 0
        time.sleep(0.01)

    def _construct_pipeline(self):
        print(self.type, self.path)
        return (f'gst-launch-1.0 -e {self._build_source()} ! {self._build_payload()} ! {self._build_sink()}')
    def _build_source(self):
        '''Set the video4linux device'''
        return f'v4l2src device={self.path}'
    def _get_format(self):
        '''Convert an enum to the corresponding encode type'''

        if self.isH264:
            return 'video/x-h264'
        else:
            return 'image/jpeg'

    def _get_extension(self):
        '''Create the file extension based on the format'''
        if self.isH264:
            return 'mp4'
        else:
            return 'avi'

    def _build_payload(self):
        '''Add values like format, width, height, and FPS to the pipeline as well as the conversion parameters'''
        base = f"{self._get_format()},width={self.width},height={round(self.width//(16/9)) },framerate={self.fps}/1"
        if self.isH264:
            return f"{base} ! h264parse ! queue ! mp4mux"
        else:
            return f"{base} ! queue ! avimux"
    def _build_sink(self):
        '''Create final file location'''
        final_path = os.path.join(self.save_path, f'{self.name.replace("$id",self.path.split("/")[-1]).replace("$format",self.type)}.{self._get_extension()}'.replace(" ",""))
        return f"filesink location={final_path}"