import os
import datetime

def formatSize(sizeInBytes):
    """
    Convert a file size in bytes to a human-readable string.
    
    Parameters:
    size_in_bytes (int): The file size in bytes.
    
    Returns:
    str: The human-readable file size string.
    """
    if sizeInBytes < 1024:
        return f"{sizeInBytes} B"
    elif sizeInBytes < 1024**2:
        size_kb = sizeInBytes / 1024
        return f"{size_kb:.2f} KB"
    elif sizeInBytes < 1024**3:
        size_mb = sizeInBytes / 1024**2
        return f"{size_mb:.2f} MB"
    else:
        size_gb = sizeInBytes / 1024**3
        return f"{size_gb:.2f} GB"

def directoryExists(directory: str):
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created video directory: {directory}")
    else:
        print(f"Video directory already exists: {directory}")
        
def folderDataList(directory: str):
    files = os.listdir(directory)
    file_info = []
    for file in files:
        file_path = os.path.join(directory, file)
        file_stat = os.stat(file_path)
        creation_time = datetime.datetime.fromtimestamp(file_stat.st_ctime).strftime('%Y-%m-%d %H:%M:%S')
        file_size = formatSize(file_stat.st_size)
        file_info.append({'name': file, 'creation_date': creation_time, 'size': file_size})
    return file_info

def deleteFileInDirectory(directory: str, filename: str):
    file_path = os.path.join(directory, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return True
        except Exception:
            return False
    return False