import { startServer, stopServer } from "./controller.js";
import { onCapture } from "./server.js";

const main = (): void => {
  // monitor goes before starting server so the proxy is ready immediatly
  monitorCode();
  startServer();
};

/**
 * houses the onCapture() that runs when the proxy is called from server.ts
 */
const monitorCode = (): void => {
  onCapture((key, value) => {
    console.log(`${key} updated to ${value}`);

    // state arrives in the same request; only the code means we're done
    if (key === "code" && value !== null) {
      stopServer();
    }
  });
};

main();
