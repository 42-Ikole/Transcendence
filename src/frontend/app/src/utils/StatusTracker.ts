import { useSocketStore } from "@/stores/SocketStore";

const socketStore = useSocketStore();
const SUBSCRIBE_EVENT = 'subscribeStatusUpdate'
const UNSUBSCRIBE_EVENT = 'unsubscribeStatusUpdate'

function eventName(id: number) {
	return `statusUpdate_${id}`;
}

export function trackUserStatus(id: number, listener: (...args: any[]) => void) {
	socketStore.status!.emit(SUBSCRIBE_EVENT, { id });
	socketStore.status!.on(eventName(id), listener);
}

export function stopTrackingUserStatus(id: number, listener: (...args: any[]) => void) {
	socketStore.status!.emit(UNSUBSCRIBE_EVENT, { id });
	socketStore.status!.removeListener(eventName(id), listener);
}
