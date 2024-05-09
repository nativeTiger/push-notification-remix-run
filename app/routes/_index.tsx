import type { MetaFunction } from "@remix-run/node";
import { useFetcher } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
const fecher = useFetcher()
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix World</h1>
      <button onClick={() => {
        fecher.submit({}, {method: "GET", action: "/notification-subscription"})
      } }>Show Notifications</button>
    </div>
  );
}
