import OBR, { type Metadata } from "@owlbear-rodeo/sdk";
import type { Countdown } from "./types";
import { getPluginId } from "./getPluginId";

export function updateRoomCountdowns(countdowns: Countdown[]) {
  console.log("sending update...");
  OBR.room.setMetadata({ [getPluginId("metadata")]: countdowns });
}

export function parseRoomMetadata(roomMetadata: Metadata) {
  console.log("parsing room metadata...");
  const countdowns: unknown = roomMetadata[getPluginId("metadata")];
  if (!Array.isArray(countdowns))
    throw new Error("Invalid countdowns retrieved from room.");
  return countdowns as Countdown[];
}
