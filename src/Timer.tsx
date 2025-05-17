import {
  Close,
  PlayArrowRounded,
  PauseRounded,
  RestartAltRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import type { Countdown } from "./types";
import {
  oneSecond,
  millisecondsToTime,
  timeToString,
  oneMinute,
} from "./utils";
import Fire from "./components/Fire";

interface TimerState {
  now: number;
  millisecondsElapsed: number;
  millisecondsRemaining: number;
}

function getTimerState(now: number, countdown: Countdown): TimerState {
  const millisecondsElapsed =
    (countdown.pausedAt ? countdown.pausedAt : now) -
    countdown.start -
    countdown.addedTime;
  const millisecondsRemaining = countdown.duration - millisecondsElapsed;

  return {
    now,
    millisecondsElapsed,
    millisecondsRemaining,
  };
}

export function Timer({
  countdown,
  setCountdown,
  onDelete,
}: {
  countdown: Countdown;
  setCountdown: (countdown: Countdown) => void;
  onDelete: () => void;
}) {
  const [timerState, setTimerState] = useState<TimerState>(
    getTimerState(Date.now(), countdown),
  );

  const [finishedNotificationFired, setFinishedNotificationFired] =
    useState(false);

  useEffect(() => {
    if (!finishedNotificationFired) {
      if (timerState.millisecondsRemaining <= 0) {
        // OBR.notification.show(`${countdown.name} Done`);
        setFinishedNotificationFired(true);
      }
    } else {
      if (timerState.millisecondsRemaining > 0) {
        setFinishedNotificationFired(false);
      }
    }
  }, [timerState, countdown, finishedNotificationFired]);

  const updatePeriod = Math.max(Math.min(countdown.duration / 200, 1000), 200); // Update time between 1 and 5Hz

  useEffect(() => {
    const update = () => {
      const timerState = getTimerState(Date.now(), countdown);
      setTimerState(timerState);
    };
    update();

    if (countdown.pausedAt) return;

    const interval = setInterval(update, updatePeriod);
    return () => clearInterval(interval);
  }, [countdown, updatePeriod]);

  let displayMillisecondsRemaining =
    Math.ceil(timerState.millisecondsRemaining / oneSecond) * oneSecond;
  if (displayMillisecondsRemaining < 0) displayMillisecondsRemaining = 0;

  let progress = (timerState.millisecondsRemaining / countdown.duration) * 100;
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  const displayTime = millisecondsToTime(displayMillisecondsRemaining);
  const displayString = timeToString(displayTime);

  return (
    <div className="space-y-3 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="truncate text-lg">{countdown.name}</div>
        <IconButton sx={{ p: 0.5 }} onClick={onDelete}>
          <Close fontSize="small" />
        </IconButton>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex w-full gap-2">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <button
              className="size-10 rounded-full text-lg font-semibold text-black/65 transition-colors duration-150 hover:bg-black/[0.08] dark:text-white dark:hover:bg-white/[0.08]"
              onClick={() =>
                setCountdown({
                  ...countdown,

                  addedTime:
                    countdown.addedTime +
                    (timerState.millisecondsRemaining <= 0 ? 0 : -oneMinute),
                })
              }
            >
              <div>{"-1"}</div>
            </button>
            <button
              className="size-10 rounded-full text-lg font-semibold text-black/65 transition-colors duration-150 hover:bg-black/[0.08] dark:text-white dark:hover:bg-white/[0.08]"
              onClick={() =>
                setCountdown({
                  ...countdown,

                  addedTime:
                    countdown.addedTime +
                    (timerState.millisecondsRemaining <= 0
                      ? 0
                      : -5 * oneMinute),
                })
              }
            >
              <div>{"-5"}</div>
            </button>
          </div>
          {/* <CircularProgress
            progress={progress}
            transitionDuration={updatePeriod}
            text={displayString}
          /> */}
          <Fire progress={progress} text={displayString} />
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <button
              className="size-10 rounded-full text-lg font-semibold text-black/65 transition-colors duration-150 hover:bg-black/[0.08] dark:text-white dark:hover:bg-white/[0.08]"
              onClick={() =>
                setCountdown({
                  ...countdown,
                  ...(timerState.millisecondsRemaining < 0
                    ? {
                        start: Date.now(),
                        pausedAt: Date.now(),
                        addedTime: -countdown.duration + 1 * oneMinute,
                      }
                    : {
                        addedTime:
                          countdown.addedTime +
                          (timerState.millisecondsElapsed < 1 * oneMinute
                            ? timerState.millisecondsElapsed
                            : 1 * oneMinute),
                      }),
                })
              }
            >
              <div>{"+1"}</div>
            </button>
            <button
              className="size-10 rounded-full text-lg font-semibold text-black/65 transition-colors duration-150 hover:bg-black/[0.08] dark:text-white dark:hover:bg-white/[0.08]"
              onClick={() =>
                setCountdown({
                  ...countdown,
                  ...(timerState.millisecondsRemaining < 0
                    ? {
                        start: Date.now(),
                        pausedAt: Date.now(),
                        addedTime: -countdown.duration + 5 * oneMinute,
                      }
                    : {
                        addedTime:
                          countdown.addedTime +
                          (timerState.millisecondsElapsed < 5 * oneMinute
                            ? timerState.millisecondsElapsed
                            : 5 * oneMinute),
                      }),
                })
              }
            >
              <div>{"+5"}</div>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <IconButton
            disabled={displayMillisecondsRemaining <= 0}
            onClick={() => {
              if (countdown.pausedAt)
                setCountdown({
                  ...countdown,
                  pausedAt: null,
                  addedTime:
                    countdown.addedTime + (Date.now() - countdown.pausedAt),
                });
              else setCountdown({ ...countdown, pausedAt: Date.now() });
            }}
          >
            {countdown.pausedAt || timerState.millisecondsRemaining <= 0 ? (
              <PlayArrowRounded />
            ) : (
              <PauseRounded />
            )}
          </IconButton>
          <IconButton
            onClick={() =>
              setCountdown({
                ...countdown,
                start: Date.now(),
                pausedAt: Date.now(),
                addedTime: 0,
              })
            }
          >
            <RestartAltRounded />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
