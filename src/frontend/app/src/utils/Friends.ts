import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";
import type { PublicUser } from "@/types/UserType";

export function sendFriendRequest(user: PublicUser) {
  makeApiCallJson("friend/request", "POST", {
    id: user.id,
  });
}

export function unfriend(user: PublicUser) {
  makeApiCall(`/friend/unfriend/${user.id}`, {
    method: "DELETE",
  });
}

export function unblock(user: PublicUser) {
  makeApiCall(`/friend/unblock/${user.id}`, {
    method: "DELETE",
  });
}

export function block(user: PublicUser) {
  makeApiCallJson("friend/block", "POST", {
    id: user.id,
  });
}
