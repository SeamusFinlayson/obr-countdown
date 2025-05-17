import { Button } from "@mui/material";
import { useState } from "react";
import PartiallyControlledInput from "./components/PartiallyControlledInput";
import type { Countdown, Time } from "./types";
import {
  parseStringForNumber,
  timeToString,
  timeToMilliseconds,
  millisecondsToTime,
} from "./utils";

export function NewTimer({
  onCreate: onCreate,
}: {
  onCreate: (countdown: Countdown) => void;
}) {
  const [time, setTime] = useState<Time>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  return (
    <div className="h-full w-full space-y-3 rounded-xl">
      {/* <div className="text-lg leading-8 text-white">{"New Timer"}</div> */}
      <div className="flex gap-2">
        <Input
          onConfirm={(target) =>
            setTime({
              ...time,
              hours: parseStringForNumber(target.value, { min: 0 }),
            })
          }
          parentValue={time.hours}
          unit="h"
        />
        <Input
          onConfirm={(target) =>
            setTime({
              ...time,
              minutes: parseStringForNumber(target.value, { min: 0 }),
            })
          }
          parentValue={time.minutes}
          unit="m"
        />
        <Input
          onConfirm={(target) =>
            setTime({
              ...time,
              seconds: parseStringForNumber(target.value, { min: 0 }),
            })
          }
          parentValue={time.seconds}
          unit="s"
        />
      </div>

      <div className="flex justify-center">
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={() => {
            const durationMilliseconds = timeToMilliseconds(time);
            if (durationMilliseconds <= 0) return;
            const durationTime = millisecondsToTime(durationMilliseconds);
            onCreate({
              id: Date.now().toString(),
              name: timeToString(durationTime, {
                hoursSuffix: "h ",
                minutesSuffix: "m ",
                secondsSuffix: "s ",
                stringSuffix: "Timer",
                addLeadingZeroes: false,
                omitZeroUnits: true,
              }),
              duration: durationMilliseconds,
              start: Date.now(),
              pausedAt: null,
              addedTime: 0,
            });
          }}
        >
          Start Timer
        </Button>
      </div>
    </div>
  );
}

function Input({
  parentValue,
  onConfirm,
  unit,
}: {
  parentValue: number;
  onConfirm: (target: HTMLInputElement) => void;
  unit: string;
}) {
  return (
    <div className="focus-within:ring-primary dark:focus-within:ring-primary-dark flex items-center rounded-xl border-1 border-white/20 pr-2 outline-none focus-within:ring-2">
      <PartiallyControlledInput
        clearContentOnFocus
        className="w-full p-2 pr-0 outline-none"
        onUserConfirm={onConfirm}
        parentValue={parentValue}
      />
      <div className="opacity-60">{unit}</div>
    </div>
  );
}
