import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import PartiallyControlledInput from "./components/PartiallyControlledInput";
import type { Countdown, Time, TimerVariant } from "./types";
import {
  parseStringForNumber,
  timeToString,
  timeToMilliseconds,
  millisecondsToTime,
} from "./utils";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";

const DEFAULT_TIME = {
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const timerVariants: TimerVariant[] = ["FIRE", "ORB", "TIMER"];

export function NewTimer({
  onCreate: onCreate,
}: {
  onCreate: (countdown: Countdown) => void;
}) {
  const [time, setTime] = useState<Time>(DEFAULT_TIME);
  const [variant, setVariant] = useState(0);

  return (
    <div className="h-full w-full space-y-4 rounded-xl p-4">
      {/* <div className="text-lg leading-8 text-white">{"New Timer"}</div> */}

      <div className="mb-2.5 flex items-stretch gap-2">
        <IconButton
          size="small"
          onClick={() =>
            setVariant(variant > 0 ? variant - 1 : timerVariants.length - 1)
          }
        >
          <ChevronLeftRounded sx={{ fontSize: 28 }} />
        </IconButton>
        <div className="div flex w-full items-center justify-center text-base">
          {timerVariants[variant]}
        </div>
        <IconButton
          size="small"
          onClick={() =>
            setVariant(variant < timerVariants.length - 1 ? variant + 1 : 0)
          }
        >
          <ChevronRightRounded sx={{ fontSize: 28 }} />
        </IconButton>
      </div>

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
                stringSuffix: ["Torch", "Light", "Timer"][variant],
                addLeadingZeroes: false,
                omitZeroUnits: true,
              }),
              duration: durationMilliseconds,
              start: Date.now(),
              pausedAt: null,
              addedTime: 0,
              variant: timerVariants[variant],
              hideTimeText: false,
            });
            // setTime(DEFAULT_TIME);
          }}
        >
          Start
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
    <div className="focus-within:ring-primary dark:focus-within:ring-primary-dark flex items-center rounded-xl border-1 border-black/20 pr-2 outline-none focus-within:ring-2 dark:border-white/20">
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
