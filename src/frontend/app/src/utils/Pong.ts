import { useSocketStore } from "@/stores/SocketStore";

export function challengeUser(id: number, mode: boolean) {
  useSocketStore().pong!.emit("requestMatch", {
    type: "challenge",
    targetId: id,
    default: mode,
  });
}
