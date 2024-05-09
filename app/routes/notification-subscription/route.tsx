import { ActionFunctionArgs, json } from "@remix-run/node";
import { SubscriptionAPI } from "~/routes/notification-subscription/subscription.server"

export async function loader() {
  try {
    const subscription = await SubscriptionAPI.sendSubscriptions();

    if (!subscription) throw new Error("couldn't send subscription");

    return json({
      status: true,
      message: "push subscription send successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return json({ status: false, message: error.message });
    }
    return json({ status: false, message: "something went wrong" });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const subscription = await SubscriptionAPI.saveSubscriptions({ request });
    
    if (!subscription) throw new Error("couldn't save subscription");

    return json({
      status: true,
      message: "push subscription saved successfully",
    });
  } catch (error) {
    console.log("error", error);
    
    if (error instanceof Error) {
      return json({ status: false, message: error.message });
    }
    return json({ status: false, message: "something went wrong" });
  }
}
