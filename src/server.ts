import express, { type Express, type Request, type Response } from "express";
import "dotenv/config";

const app: Express = express();
export const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
export const APP_URL = process.env.APP_URL;
console.log(PORT);

// actual values are string, but they are null if not filled in right. this will let me check if it was filled in later
type AuthCapture = { code: string | null; state: string | null };

// real object stays priv bc if exposed and other things change it it would mutate behind the monitor's back
const captured: AuthCapture = {
  code: null,
  state: null,
};

type CaptureListener = (key: keyof AuthCapture, value: string | null) => void;

let listener: CaptureListener | null = null;

/**
 * register the callback fired whenever a captured value actually changes
 */
export const onCapture = (fn: CaptureListener): void => {
  listener = fn;
};

export const stuff: AuthCapture = new Proxy(captured, {
  set(target, property, value: string | null) {
    const key = property as keyof AuthCapture;
    const oldVal = target[key];
    target[key] = value;

    if (oldVal !== value) {
      listener?.(key, value);
    }
    return true;
  },
});

app.get("/", (req: Request, res: Response) => {
  const state = crypto.randomUUID();

  // attatch search params to the auth link to get auth code and return state
  const url = new URL("https://api.prod.whoop.com/oauth/oauth2/auth");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", `${APP_URL}/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set(
    "scope",
    "offline read:recovery read:sleep read:workout read:profile read:cycles", // recovery, sleep, and workout most important for functionality, other two can help with extra stuff i will add if i feel like it
  );
  url.searchParams.set("state", state);

  res.redirect(url.toString()); // redirect user straight to the login, this app doesnt run on web, so no need to keep user on a website
});

app.get("/callback", (req: Request, res: Response) => {
  const { code, state } = req.query;

  console.log({ code, state });

  // send our code to the exported object at the top of the file
  stuff.code = typeof code === "string" ? code : null;
  stuff.state = typeof state === "string" ? state : null;

  res.send("authorized you can close this tab now");
});

export default app;
