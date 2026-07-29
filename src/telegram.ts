type TelegramWebAppEvent =
  | "activated"
  | "viewportChanged"
  | "fullscreenChanged"
  | "fullscreenFailed";

type TelegramWebApp = {
  initData?: string;
  platform?: string;
  version?: string;
  isFullscreen?: boolean;
  ready?: () => void;
  expand?: () => void;
  disableVerticalSwipes?: () => void;
  requestFullscreen?: () => void;
  isVersionAtLeast?: (version: string) => boolean;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  onEvent?: (event: TelegramWebAppEvent, handler: () => void) => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

function getTelegramWebApp() {
  return window.Telegram?.WebApp;
}

export function isTelegramMiniApp() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  const webApp = getTelegramWebApp();

  return Boolean(
    params.has("tgWebAppPlatform") ||
      params.has("tgWebAppVersion") ||
      webApp?.initData ||
      (webApp?.platform && webApp.platform !== "unknown"),
  );
}

function supports(webApp: TelegramWebApp, version: string) {
  return webApp.isVersionAtLeast?.(version) ?? true;
}

function keepExpanded(webApp: TelegramWebApp) {
  webApp.expand?.();

  if (supports(webApp, "7.7")) {
    webApp.disableVerticalSwipes?.();
  }
}

function requestFullscreen(webApp: TelegramWebApp) {
  if (supports(webApp, "8.0") && !webApp.isFullscreen) {
    webApp.requestFullscreen?.();
  }
}

export function initializeTelegramMiniApp() {
  if (!isTelegramMiniApp()) return false;

  const webApp = getTelegramWebApp();
  if (!webApp) return false;

  document.documentElement.dataset.telegramMiniApp = "true";
  document.body.dataset.telegramMiniApp = "true";

  webApp.setHeaderColor?.("#f7fbff");
  webApp.setBackgroundColor?.("#f7fbff");
  webApp.setBottomBarColor?.("#ffffff");
  webApp.ready?.();
  keepExpanded(webApp);
  requestFullscreen(webApp);

  webApp.onEvent?.("activated", () => {
    keepExpanded(webApp);
    requestFullscreen(webApp);
  });
  webApp.onEvent?.("viewportChanged", () => {
    keepExpanded(webApp);
    window.dispatchEvent(new Event("resize"));
  });

  return true;
}
