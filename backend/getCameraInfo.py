def get_camera_info():
    cameras = {}
    for device in iter_devices():
        cam = Device.from_id(device.index)
        try:
            cam.open()
            formats = []
            for fmt in cam.info.formats:
                print(frame_size.width if (fmt.description == "H.264") else "sss")
                resolutions = {}
                for frame_size in cam.info.frame_sizes:
                    if frame_size.pixel_format == fmt.pixel_format:
                        resolution_key = f"{frame_size.width}x{frame_size.height}"
                        if resolution_key not in resolutions:
                            resolutions[resolution_key] = {
                                "width": frame_size.width,
                                "height": frame_size.height,
                                "fps": []
                            }
                        resolutions[resolution_key]["fps"].append(
                            frame_size.max_fps.numerator // frame_size.max_fps.denominator
                        )
                formats.append({
                    "pixelformat": fmt.description,
                    "resolutions": list(resolutions.values())
                })
            cameras[cam.info.bus_info] = {
                "name": cam.info.card,
                "device_index": cam.index,
                "formats": formats
            }
        except Exception as e:
            print(f"Error accessing camera {device.index}: {e}")
    return cameras