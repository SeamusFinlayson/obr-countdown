import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

type PlayerRole = "PLAYER" | "GM";

export default function usePlayerRole() {
  const [playerRole, setPlayerRole] = useState<PlayerRole>("PLAYER");
  useEffect(() => {
    const handleRole = (role: PlayerRole) => {
      setPlayerRole(role);
    };

    OBR.player.getRole().then(handleRole);
    return OBR.player.onChange((player) => handleRole(player.role));
  }, []);

  return playerRole;
}
