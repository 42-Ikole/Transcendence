import { useSocketStore } from "@/stores/SocketStore";

const socketStore = useSocketStore();
const SUBSCRIBE_EVENT = 'subscribeStatusUpdate'
const UNSUBSCRIBE_EVENT = 'unsubscribeStatusUpdate'

function eventName(id: number) {
	return `statusUpdate_${id}`;
}

export function trackUserStatus(id: number, listener: (...args: any[]) => void) {
	socketStore.status!.on(eventName(id), listener);
	socketStore.status!.emit(SUBSCRIBE_EVENT, { id });
}

export function stopTrackingUserStatus(id: number, listener: (...args: any[]) => void) {
	socketStore.status!.removeListener(eventName(id), listener);
	socketStore.status!.emit(UNSUBSCRIBE_EVENT, { id });
}
