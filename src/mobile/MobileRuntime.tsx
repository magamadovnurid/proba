import { useEffect, type PropsWithChildren } from "react";
import { MobileDeviceProvider, useMobileDevice } from "./Device";
import { KeyboardDock, KeyboardProvider, useKeyboard } from "./Keyboard";
import { PhoneFrame } from "./PhoneFrame";
import { HomeIndicator, StatusBar } from "./components";

type MobileRuntimeProps = PropsWithChildren<{
  previewFrame?: boolean;
}>;

export function MobileRuntime({ children, previewFrame = false }: MobileRuntimeProps) {
  return (
    <MobileDeviceProvider>
      <PhoneFrame frameless={!previewFrame}>
        <KeyboardProvider nativeKeyboard={!previewFrame}>
          {previewFrame ? <KeyboardPreview /> : null}
          {previewFrame ? <StatusBar /> : null}
          <MobileAppViewport>{children}</MobileAppViewport>
          {previewFrame ? <HomeIndicator /> : null}
          {previewFrame ? <KeyboardDock /> : null}
        </KeyboardProvider>
      </PhoneFrame>
    </MobileDeviceProvider>
  );
}

function MobileAppViewport({ children }: PropsWithChildren) {
  const { device } = useMobileDevice();
  const keyboard = useKeyboard();

  return (
    <div
      className="mobile-app-viewport"
      data-keyboard-visible={keyboard.visible ? "true" : "false"}
      data-platform={device.platform}
      data-testid="mobile-app-viewport"
    >
      {children}
    </div>
  );
}

function KeyboardPreview() {
  const keyboard = useKeyboard();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("keyboard") === "1") {
      keyboard.show();
    }
  }, [keyboard]);

  return null;
}
