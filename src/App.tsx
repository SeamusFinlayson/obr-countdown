import { useEffect, useRef, useState } from "react";
import type { Countdown } from "./types";
import { Timer } from "./Timer";
import { NewTimer } from "./NewTimer";
import { parseRoomMetadata, updateRoomCountdowns } from "./roomMetadataHelpers";
import OBR, { type Metadata } from "@owlbear-rodeo/sdk";
import { useTheme } from "@mui/material";

const MAX_TIMERS = 4;

function App() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);

  useEffect(() => {
    const handleRoomMetadata = (roomMetadata: Metadata) => {
      setCountdowns(parseRoomMetadata(roomMetadata));
    };

    OBR.room.getMetadata().then(handleRoomMetadata);
    return OBR.room.onMetadataChange(handleRoomMetadata);
  }, []);

  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current && ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const entry = entries[0];
          // Get the height of the border box
          // In the future you can use `entry.borderBoxSize`
          // however as of this time the property isn't widely supported (iOS)
          const borderHeight = entry.contentRect.bottom + entry.contentRect.top;
          // Set a minimum height of 64px
          const divHeight = Math.max(borderHeight, 64);
          // Set the action height to the list height + the card header height + the divider + margin
          OBR.action.setHeight(divHeight);
        }
      });
      resizeObserver.observe(divRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [divRef]);

  const theme = useTheme().palette.mode;

  return (
    <>
      <div ref={divRef} className={`${theme} p-4`}>
        <div className="text-black dark:text-white">
          <div className="space-y-4">
            {countdowns.map((countdown) => (
              <Timer
                key={countdown.id}
                countdown={countdown}
                setCountdown={(newCountdown) =>
                  setCountdowns((prev) => {
                    const newCountdowns = prev.map((val) =>
                      val !== countdown ? val : newCountdown,
                    );
                    updateRoomCountdowns(newCountdowns);
                    return newCountdowns;
                  })
                }
                onDelete={() =>
                  setCountdowns((prev) => {
                    const newCountdowns = prev.filter(
                      (val) => val !== countdown,
                    );
                    updateRoomCountdowns(newCountdowns);
                    return newCountdowns;
                  })
                }
              />
            ))}
            {countdowns.length < MAX_TIMERS && (
              <NewTimer
                onCreate={(countdown) => {
                  setCountdowns((prev) => {
                    const newCountdowns = [...prev, countdown];
                    updateRoomCountdowns(newCountdowns);
                    return newCountdowns;
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
