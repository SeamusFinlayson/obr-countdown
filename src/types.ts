export interface Countdown {
  id: string;
  name: string;
  duration: number;
  start: number;
  pausedAt: number | null;
  addedTime: number;
  variant: "FIRE" | "ORB";
}

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}
