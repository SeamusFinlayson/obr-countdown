import {
  Close,
  PlayArrowRounded,
  PauseRounded,
  RestartAltRounded,
  VisibilityRounded,
  VisibilityOffRounded,
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
import Orb from "./components/Orb";
import OBR from "@owlbear-rodeo/sdk";
import PartiallyControlledInput from "./components/PartiallyControlledInput";
import CircularProgress from "./components/CircularProgress";
import usePlayerRole from "./usePlayerRole";

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

  if (timerState.millisecondsRemaining <= 0) {
    OBR.action.getBadgeText().then((text) => {
      if (!text) OBR.action.setBadgeText("");
    });
  } else {
    OBR.action.getBadgeText().then((text) => {
      if (text !== undefined) OBR.action.setBadgeText(undefined);
    });
  }

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
  const displayString = countdown.hideTimeText ? "" : timeToString(displayTime);

  const playerRole = usePlayerRole();

  return (
    <div className="space-y-3 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <PartiallyControlledInput
          className="w-full truncate text-lg outline-none"
          onUserConfirm={(target) =>
            setCountdown({
              ...countdown,
              name: target.value,
            })
          }
          parentValue={countdown.name}
        />
        {(playerRole === "GM" || timerState.millisecondsRemaining <= 0) && (
          <IconButton
            sx={{ p: 0.5 }}
            onClick={() => {
              OBR.action.setBadgeText(undefined);
              onDelete();
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="flex w-full gap-2">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            {playerRole === "GM" && (
              <>
                <TimeButton
                  change={-oneMinute}
                  timerState={timerState}
                  countdown={countdown}
                  setCountdown={setCountdown}
                />
                <TimeButton
                  change={-5 * oneMinute}
                  timerState={timerState}
                  countdown={countdown}
                  setCountdown={setCountdown}
                />
              </>
            )}
          </div>

          {
            {
              FIRE: (
                <Fire
                  progress={progress}
                  text={displayString}
                  paused={countdown.pausedAt !== null}
                />
              ),
              ORB: (
                <Orb
                  progress={progress}
                  text={displayString}
                  paused={countdown.pausedAt !== null}
                />
              ),
              TIMER: (
                <CircularProgress
                  progress={progress}
                  text={displayString}
                  transitionDuration={updatePeriod}
                />
              ),
            }[countdown.variant]
          }

          <div className="flex w-full flex-col items-center justify-center gap-2">
            {playerRole === "GM" && (
              <>
                <TimeButton
                  change={oneMinute}
                  timerState={timerState}
                  countdown={countdown}
                  setCountdown={setCountdown}
                />
                <TimeButton
                  change={5 * oneMinute}
                  timerState={timerState}
                  countdown={countdown}
                  setCountdown={setCountdown}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex min-h-5 gap-2">
          {playerRole === "GM" && (
            <>
              <IconButton
                onClick={() =>
                  setCountdown({
                    ...countdown,
                    hideTimeText: !countdown.hideTimeText,
                  })
                }
              >
                {countdown.hideTimeText ? (
                  <VisibilityOffRounded />
                ) : (
                  <VisibilityRounded />
                )}
              </IconButton>
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
            </>
          )}
          {(playerRole === "GM" || timerState.millisecondsRemaining <= 0) && (
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
          )}
        </div>
      </div>
    </div>
  );
}

function TimeButton({
  change,
  timerState,
  countdown,
  setCountdown,
}: {
  change: number;
  timerState: TimerState;
  countdown: Countdown;
  setCountdown: (countdown: Countdown) => void;
}) {
  return (
    <button
      className="size-10 rounded-full text-base font-semibold text-black/65 transition-colors duration-150 hover:bg-black/[0.08] dark:text-white dark:hover:bg-white/[0.08]"
      onClick={
        change > 0
          ? () =>
              setCountdown({
                ...countdown,
                ...(timerState.millisecondsRemaining < 0
                  ? {
                      start: Date.now(),
                      pausedAt: Date.now(),
                      addedTime: -countdown.duration + change,
                    }
                  : {
                      addedTime:
                        countdown.addedTime +
                        (timerState.millisecondsElapsed < change
                          ? timerState.millisecondsElapsed
                          : change),
                    }),
              })
          : () =>
              setCountdown({
                ...countdown,
                addedTime:
                  countdown.addedTime +
                  (timerState.millisecondsRemaining <= 0 ? 0 : change),
              })
      }
    >
      {(change > 0 ? "+" : "") +
        timeToString(millisecondsToTime(change), {
          hoursSuffix: "h",
          minutesSuffix: "",
          secondsSuffix: "s",
          stringSuffix: "",
          addLeadingZeroes: false,
          omitZeroUnits: true,
        })}
    </button>
  );
}
