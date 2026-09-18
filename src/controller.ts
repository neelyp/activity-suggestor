import app, { PORT, APP_URL } from "./server.js";
import { Server } from "http";

let running: Server | null = null;

/**
 * turn on the server
 */
export const startServer = () => {
  if (running) {
    console.log("Can't start server: running already");
    return;
  }
  running = app.listen(PORT, () => console.log(`listening on ${APP_URL}`));
};

/**
 * turn off server
 */
export const stopServer = () => {
  if (running) {
    running.close();
  } else {
    console.error("Can't stop server: Server isn't running");
  }
};
