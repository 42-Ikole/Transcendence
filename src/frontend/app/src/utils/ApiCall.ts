function sleep(milliseconds: number) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

export async function makeApiCall(uri: string, init?: RequestInit) {
  const prefix = "http://localhost:8080/api";
  // for testing loading and async handling
  // sleep(1000);
  return await fetch(`${prefix}${uri}`, init);
}

export default makeApiCall;
