const PUBLIC_VAPID_KEY = "YOUR PUBLIC VAPID KEY";

/**
 * convert a base64 string to a Uint8Array
 * @param {*} base64String
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Save the subscription to the server
 * @param {*} subscription
 */
async function saveSubscription(subscription) {
  try {
    const response = await fetch(
      "http://localhost:3000/notification-subscription",
      {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(subscription),
      }
    );
    if (!response.ok) {
      throw new Error("Error on saving the token");
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error", error.message);
    }
    console.log("Something went wrong");
  }
}

self.addEventListener("install", (event) => {
  console.log("installing…", event);
  // Skip waiting to activate the service worker immediately
  self.skipWaiting();
});

self.addEventListener("activate", async (event) => {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
  });

  const response = await saveSubscription(subscription);
});

self.addEventListener("push", (event) => {
  const res = JSON.parse(event.data.text());
  const { title } = res.payload;
  const options = {
    vibrate: [100],
  };
  self.registration.showNotification(title, options);
});
