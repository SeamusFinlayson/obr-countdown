import { useEffect, useState } from "react";
import type { Countdown } from "./types";
import { Timer } from "./Timer";
import { NewTimer } from "./NewTimer";
import { parseRoomMetadata, updateRoomCountdowns } from "./roomMetadataHelpers";
import OBR, { type Metadata } from "@owlbear-rodeo/sdk";

function App() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);

  useEffect(() => {
    const handleRoomMetadata = (roomMetadata: Metadata) => {
      setCountdowns(parseRoomMetadata(roomMetadata));
    };

    OBR.room.getMetadata().then(handleRoomMetadata);
    return OBR.room.onMetadataChange(handleRoomMetadata);
  }, []);

  return (
    <>
      <div className="dark p-4">
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
            <NewTimer
              onCreate={(countdown) => {
                setCountdowns((prev) => {
                  const newCountdowns = [...prev, countdown];
                  updateRoomCountdowns(newCountdowns);
                  return newCountdowns;
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
