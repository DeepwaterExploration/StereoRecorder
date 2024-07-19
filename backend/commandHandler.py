import subprocess
import signal
import logging

class CommandHandler:
    def __init__(self):
        self.process = None
        
    def isRunning(self) -> bool:
        return self.process is not None

    def start_command(self, command) -> bool:
        logging.debug(f"Starting command: {command}\n\n")
        try:
            process = subprocess.Popen(command.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            self.process = process
        except:
            return False
        return True

    def stop_command(self) -> bool:
        process = self.process
        if process and process.poll() is None:
            logging.debug('Stopping command')
            process.send_signal(signal.SIGINT)
            try:
                process.communicate(timeout=10) # Wait for the process to end cleanly
            except subprocess.TimeoutExpired:
                process.kill()
                process.communicate()
        self.process = None
        return True
