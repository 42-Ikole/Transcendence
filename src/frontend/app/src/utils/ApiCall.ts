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
  // sleep(500);
  return await fetch(`${prefix}${uri}`, init);
}

// Change this if you need more methods with a JSON body
type MethodWithBody = "POST" | "PATCH";

export async function makeApiCallJson(
  uri: string,
  method: MethodWithBody,
  body: Record<string, unknown>
) {
  return await makeApiCall(uri, {
    method: method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export default makeApiCall;
