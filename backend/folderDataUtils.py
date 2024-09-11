import os
import datetime
import zipfile
import io

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
        
def getFolderSize(folder_path):
    """
    Calculate the total size of a folder, including all subdirectories and files.
    
    Parameters:
    folder_path (str): The path to the folder.
    
    Returns:
    int: The total size of the folder in bytes.
    """
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(folder_path):
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            total_size += os.path.getsize(file_path)
    return total_size
        
def folderDataList(directory: str):
    items = os.listdir(directory)
    item_info = []
    for item in items:
        item_path = os.path.join(directory, item)
        item_stat = os.stat(item_path)
        creation_time = datetime.datetime.fromtimestamp(item_stat.st_ctime)
        
        if os.path.isdir(item_path):
            item_type = 'folder'
            item_size = getFolderSize(item_path)
        else:
            item_type = 'file'
            item_size = item_stat.st_size
        
        formatted_size = formatSize(item_size)
        item_info.append({
            'name': item, 
            'creation_date': creation_time, 
            'size': formatted_size, 
            'type': item_type
        })
    
    # Sort the list by creation_date
    item_info.sort(key=lambda x: x['creation_date'], reverse=True)
    
    # Format the datetime objects to strings after sorting
    for item in item_info:
        item['creation_date'] = item['creation_date'].strftime('%Y-%m-%d %H:%M:%S')
    
    return item_info

def deleteFileInDirectory(directory: str, filename: str):
    file_path = os.path.join(directory, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return True
        except Exception:
            return False
    return False

def zipFolder(directory: str, foldername: str):
    folder_path = os.path.join(directory, foldername)
    if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
        return None

    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, arcname)

    memory_file.seek(0)
    return memory_file
