declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      PORT: number;
      APP_URL: string;
    }
  }
}

export {};
