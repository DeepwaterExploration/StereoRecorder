import os


def fourcc2s(fourcc: int):
    res = ''
    res += chr(fourcc & 0x7f)
    res += chr((fourcc >> 8) & 0x7f)
    res += chr((fourcc >> 16) & 0x7f)
    res += chr((fourcc >> 24) & 0x7f)
    if fourcc & (1 << 31):
        res += '-BE'
    return res

def list_diff(listA, listB):
    # find the difference between lists
    diff = []
    for element in listA:
        if element not in listB:
            diff.append(element)
    return diff

def format_size(size_in_bytes):
    """
    Convert a file size in bytes to a human-readable string.
    
    Parameters:
    size_in_bytes (int): The file size in bytes.
    
    Returns:
    str: The human-readable file size string.
    """
    if size_in_bytes < 1024:
        return f"{size_in_bytes} B"
    elif size_in_bytes < 1024**2:
        size_kb = size_in_bytes / 1024
        return f"{size_kb:.2f} KB"
    elif size_in_bytes < 1024**3:
        size_mb = size_in_bytes / 1024**2
        return f"{size_mb:.2f} MB"
    else:
        size_gb = size_in_bytes / 1024**3
        return f"{size_gb:.2f} GB"

def dir_exists(dir: str):
    if not os.path.exists(dir):
        os.makedirs(dir)
        print(f"Created video directory: {dir}")
    else:
        print(f"Video directory already exists: {dir}")
