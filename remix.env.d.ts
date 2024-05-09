/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

declare global {
       namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL : string;
            VAPID_PUBLIC_KEY : string;
            VAPID_PRIVATE_KEY : string;
            VAPID_EMAIL : string;
        }
    }
}

export {}

