export interface Resolution {
  width: number;
  height: number;
  fps: number[];
}

export interface Interval {
  numerator: number;
  denominator: number;
}

export interface Format {
  width: number;
  height: number;
  intervals: Interval[];
}

export interface Formats {
  [pixformat: string]: Format[];
}

export interface Device {
  name: string;
  formats: { [cam: string]: Formats };
}

export interface Devices {
  [bus_info: string]: Device;
}
