import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

async function requestPermission() {
  try {
    if (!("Notification" in window)) {
      throw new Error("Notification not supported");
    }

    const permission = await window.Notification.requestPermission();

    if (permission !== "granted") {
      throw new Error("Permission not granted for Notification");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error", error.message);
    }

    console.log("Something went wrong!");
  }
}

export default function App() {
  useEffect(() => {
    requestPermission();
  }, [])
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
