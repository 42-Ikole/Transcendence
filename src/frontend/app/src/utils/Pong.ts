import { useSocketStore } from "@/stores/SocketStore";

export function challengeUser(id: number) {
    useSocketStore().pong!.emit("requestMatch", {
        type: "challenge",
        targetId: id,
    });
}
