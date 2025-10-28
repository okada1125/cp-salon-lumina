declare global {
  interface Window {
    liff: {
      init: (config: { liffId: string }) => Promise<void>;
      isLoggedIn: () => boolean;
      login: () => void;
      getProfile: () => Promise<{
        userId: string;
        displayName: string;
        pictureUrl?: string;
        statusMessage?: string;
      }>;
      getIDToken: () => Promise<string>;
      closeWindow: () => void;
    };
  }
}

export {};
