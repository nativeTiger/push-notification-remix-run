const PUBLIC_VAPID_KEY =
  "BEYti6YuNcWHOTXuuZgFzIcdr2eZZ8m2YMmtIsxWRT-m_rUBcXGK3JaLCIZacYVmoBBu-l2KsNDA9Vyly2EhZSI";

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
