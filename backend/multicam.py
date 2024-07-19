import time
import os
import signal
import subprocess
import threading

class multiCamManager:
    def __init__(self):
        self.paths = []
        self.recordingInstances: list[recording] = []
        self.recording = False
        self._interval_thread = None
        self.count = 0
        self.name = ""
        self.duration = 0
        self.interval = 0

        self._recording_thread = threading.Thread(target=self._recording_cycle)
        self._recording_thread.start()

    def stop_camera(self):
        for recording in self.recordingInstances:
            recording.stop()
        self.paths = []
        self.recordingInstances = []
        self.recording = False
        

    def _recording_cycle(self):
        self.count+=1
        while True:
            if self.recording:
                duration = self.duration
                interval = self.interval
                for rec in self.recordingInstances:
                    rec.name=self.name.replace("$count",str(self.count))
                    rec.start()
                time.sleep(duration * 60)
                for rec in self.recordingInstances:
                    rec.stop()
                time.sleep(interval * 60)

    def start_cameras(self, paths_format_zip, width, fps, name, save_dir, duration, interval):
        self.duration=duration
        self.interval=interval
        if self.recording: return # Can't start an existing stream
        self.name = name
        for path, format in paths_format_zip:
            self.paths.append(path)
            rec = recording(path, name, format, width, fps, save_dir)
            self.recordingInstances.append(rec)
        self.recording = True

class recording:
    def __init__(self, path, name, type, width, fps, save_path):
        self.path = path
        self.name = name
        self.type = type
        self.width = width
        self.fps = fps
        self.save_path = save_path
        self.isH264 = self.type == "H264"
        self.started = False
        self._process = None

    def _start(self):
        pipeline = self._construct_pipeline()
        self._process = subprocess.Popen(pipeline.split(" "), stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def start(self):
        if self.started:
            self.stop()
        if not os.path.exists(self.path):
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
            self._process.communicate(timeout=10)
        except subprocess.TimeoutExpired:
            self._process.kill()
            self._process.communicate()
        self._process = None
        time.sleep(0.01)

    def _construct_pipeline(self):
        return f'gst-launch-1.0 -e {self._build_source()} ! {self._build_payload()} ! {self._build_sink()}'

    def _build_source(self):
        return f'v4l2src device={self.path}'

    def _get_format(self):
        if self.isH264:
            return 'video/x-h264'
        else:
            return 'image/jpeg'

    def _get_extension(self):
        if self.isH264:
            return 'mp4'
        else:
            return 'avi'

    def _build_payload(self):
        base = f"{self._get_format()},width={self.width},height={round(self.width // (16 / 9))},framerate={self.fps}/1"
        if self.isH264:
            return f"{base} ! h264parse ! queue ! mp4mux"
        else:
            return f"{base} ! queue ! avimux"

    def _build_sink(self):
        final_path = os.path.join(self.save_path, f'{self.name.replace("$id", self.path.split("/")[-1]).replace("$format", self.type)}.{self._get_extension()}'.replace(" ", ""))
        if os.path.exists(final_path):
            final_path=final_path+"."+str(round(time.time()))
        return f"filesink location={final_path}"
