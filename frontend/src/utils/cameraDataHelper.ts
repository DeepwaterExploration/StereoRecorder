import { Devices, Format, Interval } from "../types/cameraTypes";

const CAMERA_NAMES_TO_INCLUDE = ["explore", "stellar"];
const DEFAULT_FRAMERATE = 60;
const DEFAULT_FRAMEWIDTH = 1600;

export function saveCameraSettingsLocalStorage(
  framerate: string,
  framewidth: string,
) {
  localStorage.setItem("framerate", framerate);
  localStorage.setItem("framewidth", framewidth);
  console.log(getCameraSettingsLocalStorage());
}

export function getCameraSettingsLocalStorage() {
  const defaultFramerate = DEFAULT_FRAMERATE;
  const defaultFramewidth = DEFAULT_FRAMEWIDTH;

  const framerate = localStorage.getItem("framerate") || defaultFramerate;
  const framewidth = localStorage.getItem("framewidth") || defaultFramewidth;

  // Save default values back to localStorage if they were not already set
  if (!localStorage.getItem("framerate")) {
    localStorage.setItem("framerate", defaultFramerate.toString());
  }
  if (!localStorage.getItem("framewidth")) {
    localStorage.setItem("framewidth", defaultFramewidth.toString());
  }

  return {
    framerate: framerate.toString(),
    framewidth: framewidth.toString(),
  };
}

export function getDevicePathsWithName(cameraData: Devices, name: string) {
  const paths: string[] = [];
  const fmts = ["MJPG"];

  Object.keys(cameraData).forEach((cam) => {
    const device = cameraData[cam];
    if ([name].some((name) => device.name.toLowerCase().includes(name))) {
      Object.keys(device.formats).forEach((path) => {
        const formats = Object.keys(device.formats[path]);

        if (fmts.some((fmt) => formats.includes(fmt))) {
          paths.push(path);
        }
      });
    }
  });

  return paths.sort();
}

export function getMJPEGDevicePaths(cameraData: Devices) {
  const paths: string[] = [];
  const fmts = ["MJPG"];

  Object.keys(cameraData).forEach((cam) => {
    const device = cameraData[cam];
    if (
      CAMERA_NAMES_TO_INCLUDE.some((name) =>
        device.name.toLowerCase().includes(name),
      )
    ) {
      Object.keys(device.formats).forEach((path) => {
        const formats = Object.keys(device.formats[path]);

        if (fmts.some((fmt) => formats.includes(fmt))) {
          paths.push(path);
        }
      });
    }
  });

  return paths.sort();
}

export const getPossibleResolutionSpecs = (
  cameraData: Devices,
  devicePath: string,
) => {
  const options: { fps: number[]; width: number[] } = {
    width: [],
    fps: [],
  };

  Object.keys(cameraData).forEach((cam) => {
    const curDevice = cameraData[cam];

    if (
      CAMERA_NAMES_TO_INCLUDE.some((name) =>
        curDevice.name.toLowerCase().includes(name),
      )
    ) {
      Object.keys(curDevice.formats).forEach((path) => {
        if (path === devicePath) {
          const fmts = curDevice.formats[path];
          if (Object.keys(fmts).includes("MJPG")) {
            options.fps = options.fps.concat(
              fmts["MJPG"].flatMap((fmt: Format) =>
                fmt.intervals.map((int: Interval) => int.denominator),
              ),
            );
            options.width = options.width.concat(
              fmts["MJPG"].map((fmt: Format) => fmt.width),
            );
          }

          if (Object.keys(fmts).includes("H264")) {
            options.fps = options.fps.concat(
              fmts["H264"].flatMap((fmt: Format) =>
                fmt.intervals.map((int: Interval) => int.denominator),
              ),
            );
            options.width = options.width.concat(
              fmts["H264"].map((fmt: Format) => fmt.width),
            );
          }
        }
      });
    }
  });
  options.fps = [...new Set(options.fps)];
  options.width = [...new Set(options.width)];
  return options;
};
