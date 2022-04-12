import { useSocketStore } from "@/stores/SocketStore";

const SUBSCRIBE_EVENT = 'subscribeStatusUpdate'
const UNSUBSCRIBE_EVENT = 'unsubscribeStatusUpdate'

function eventName(id: number) {
	return `statusUpdate_${id}`;
}

export function trackUserStatus(id: number, listener: (...args: any[]) => void) {
	const socketStore = useSocketStore();
	socketStore.status!.on(eventName(id), listener);
	socketStore.status!.emit(SUBSCRIBE_EVENT, { id });
}

export function stopTrackingUserStatus(id: number, listener: (...args: any[]) => void) {
	const socketStore = useSocketStore();
	socketStore.status!.removeListener(eventName(id), listener);
	socketStore.status!.emit(UNSUBSCRIBE_EVENT, { id });
}
