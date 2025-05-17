export interface Countdown {
  id: string;
  name: string;
  duration: number;
  start: number;
  pausedAt: number | null;
  addedTime: number;
}

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}
