export type TimerVariant = "TIMER" | "ORB" | "FIRE";

export interface Countdown {
  id: string;
  name: string;
  duration: number;
  start: number;
  pausedAt: number | null;
  addedTime: number;
  variant: TimerVariant;
  hideTimeText: boolean;
}

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}
