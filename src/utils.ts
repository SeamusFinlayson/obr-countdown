import type { Time } from "./types";

export const oneHour = 1000 * 60 * 60; // milliseconds
export const oneMinute = 1000 * 60; // milliseconds
export const oneSecond = 1000; // milliseconds

export function millisecondsToTime(milliseconds: number): Time {
  const hours = Math.trunc(milliseconds / oneHour);
  milliseconds -= hours * oneHour;
  const minutes = Math.trunc(milliseconds / oneMinute);
  milliseconds -= minutes * oneMinute;
  const seconds = Math.trunc(milliseconds / oneSecond);

  return { hours, minutes, seconds };
}

export function timeToMilliseconds(time: Time) {
  return (
    time.hours * oneHour + time.minutes * oneMinute + time.seconds * oneSecond
  );
}

export function timeToString(
  time: Time,
  format = {
    hoursSuffix: ":",
    minutesSuffix: ":",
    secondsSuffix: "",
    stringSuffix: "",
    addLeadingZeroes: true,
    omitZeroUnits: false,
  },
) {
  const hoursString = time.hours.toString();
  const minutesString = time.minutes.toString();
  const secondsString = time.seconds.toString();

  return (
    (time.hours === 0 ? "" : hoursString + format.hoursSuffix) +
    (time.minutes === 0 && (time.hours === 0 || format.omitZeroUnits)
      ? ""
      : (format.addLeadingZeroes &&
        minutesString.length === 1 &&
        time.hours !== 0
          ? "0" + minutesString
          : minutesString) + format.minutesSuffix) +
    (time.seconds === 0 && format.omitZeroUnits
      ? ""
      : (format.addLeadingZeroes &&
        secondsString.length === 1 &&
        (time.minutes !== 0 || time.hours !== 0)
          ? "0" + secondsString
          : secondsString) + format.secondsSuffix) +
    format.stringSuffix
  );
}

export function parseStringForNumber(
  string: string,
  settings?: { min?: number; max?: number; fallback?: number },
): number {
  const newValue = parseFloat(string);
  if (Number.isNaN(newValue)) return settings?.fallback ? settings.fallback : 0;

  if (settings !== undefined) {
    if (settings.max !== undefined && newValue > settings.max)
      return settings.max;
    if (settings.min !== undefined && newValue < settings.min)
      return settings.min;
  }

  return newValue;
}

export function getRandomArray(length: number) {
  const randomArray: number[] = [];
  for (let i = 0; i < length; i++) {
    randomArray.push(Math.random());
  }
  return randomArray;
}

export function getParticleCount(
  progress: number,
  initialParticles = 30,
  timeConstant = 70,
) {
  const yScaling = initialParticles / (Math.pow(10, -100 / timeConstant) - 1);
  const particles = yScaling * (Math.pow(10, -progress / timeConstant) - 1);
  return Math.ceil(particles);
}
