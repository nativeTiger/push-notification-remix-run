import { Prisma } from "@prisma/client";
import prismadb from "~/db.server";
import webpush from "web-push";

interface PushSubscriptionJSON {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

async function saveSubscriptions({ request }: { request: Request }) {
  const pushSubscription = (await request.json()) as PushSubscriptionJSON;

  const pushSubscriptionCreatePayload: Prisma.PushSubscriptionCreateInput = {
    endpoint: pushSubscription.endpoint,
    keys: {
      create: {
        auth: pushSubscription.keys.auth,
        p256dh: pushSubscription.keys.p256dh,
      },
    },
  };

  return await prismadb.pushSubscription.create({
    data: pushSubscriptionCreatePayload,
  });
}

async function sendSubscriptions() {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const pushSubscription = await prismadb.pushSubscription.findMany({
    where: {
      NOT: {
        keys: null,
      },
    },
    select: {
      keys: { select: { auth: true, p256dh: true } },
      id: true,
      endpoint: true,
      createdAt: true,
    },
  });

  const sentSubscriptions = pushSubscription.map(async (subscription) => {
    try {
      if (subscription.keys) {
        const subscriptions: PushSubscriptionJSON = {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.keys.auth,
            p256dh: subscription.keys.p256dh,
          },
        };
        const payload = JSON.stringify({
          payload: { title: "Hello"}
        })
        await webpush.sendNotification(subscriptions, payload);
      }
    } catch (error: any) {
      if (error.statusCode === 410) {
        await prismadb.pushSubscription.delete({
          where: { id: subscription.id },
        });
      }
    }
  });

  return await Promise.all(sentSubscriptions);
}

export const SubscriptionAPI = {
  saveSubscriptions,
  sendSubscriptions,
};
