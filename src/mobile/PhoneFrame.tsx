import {
  createContext,
  type CSSProperties,
  type DragEvent,
  type PropsWithChildren,
  type RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DevicePicker, useMobileDevice } from "./Device";
import { useMobileCursor } from "./MobileCursor";
import { isTelegramMiniApp } from "../telegram";

type ScreenPortalContextValue = {
  screenRef: RefObject<HTMLDivElement | null>;
  frameless: boolean;
};

const ScreenPortalContext = createContext<ScreenPortalContextValue | null>(null);

function suppressNativeDrag(event: DragEvent<HTMLElement>) {
  if (event.target instanceof Element && event.target.closest('[data-native-drag="true"]')) {
    return;
  }

  event.preventDefault();
}

export function useScreenPortal() {
  const context = useContext(ScreenPortalContext);

  if (!context) {
    throw new Error("useScreenPortal must be used inside PhoneFrame");
  }

  return context;
}

function getDeviceScale(
  deviceWidth: number,
  deviceHeight: number,
  screenWidth: number,
  telegramMiniApp: boolean,
) {
  if (typeof window === "undefined") return 1;

  if (telegramMiniApp) {
    const horizontal = (window.innerWidth - 20) / screenWidth;
    const vertical = (window.innerHeight - 4) / deviceHeight;

    return Math.max(0.42, Math.min(horizontal, vertical, 1));
  }

  const horizontal = (window.innerWidth - 48) / deviceWidth;
  const vertical = (window.innerHeight - 48) / deviceHeight;

  return Math.max(0.42, Math.min(horizontal, vertical, 1));
}

function useDeviceScale(
  deviceWidth: number,
  deviceHeight: number,
  screenWidth: number,
  telegramMiniApp: boolean,
) {
  const [scale, setScale] = useState(() =>
    getDeviceScale(deviceWidth, deviceHeight, screenWidth, telegramMiniApp),
  );

  useEffect(() => {
    const update = () =>
      setScale(getDeviceScale(deviceWidth, deviceHeight, screenWidth, telegramMiniApp));

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [deviceHeight, deviceWidth, screenWidth, telegramMiniApp]);

  return scale;
}

type PhoneFrameProps = PropsWithChildren<{
  frameless?: boolean;
}>;

export function PhoneFrame({ children, frameless = false }: PhoneFrameProps) {
  const { device } = useMobileDevice();
  const { geometry } = device;
  const telegramMiniApp = isTelegramMiniApp();
  const scale = useDeviceScale(
    geometry.device.width,
    geometry.device.height,
    geometry.screen.width,
    telegramMiniApp,
  );
  const screenRef = useRef<HTMLDivElement | null>(null);
  const contextValue = useMemo(() => ({ screenRef, frameless }), [frameless]);
  const mobileCursor = useMobileCursor();

  if (frameless) {
    return (
      <ScreenPortalContext.Provider value={contextValue}>
        <div className="mini-app-stage" data-testid="mini-app-stage">
          <div
            ref={screenRef}
            className="mini-app-screen"
            data-phone-screen
            data-testid="mini-app-screen"
            onDragStartCapture={suppressNativeDrag}
          >
            {children}
          </div>
        </div>
      </ScreenPortalContext.Provider>
    );
  }

  return (
    <ScreenPortalContext.Provider value={contextValue}>
      <div
        className="phone-stage"
        data-telegram-mini-app={telegramMiniApp ? "true" : "false"}
      >
        {telegramMiniApp ? null : <DevicePicker />}
        <div
          className="phone-scale-box"
          style={{
            width: geometry.device.width * scale,
            height: geometry.device.height * scale,
          }}
        >
          <div
            className="phone-device"
            data-device={device.id}
            data-platform={device.platform}
            data-testid="phone-frame"
            onDragStartCapture={suppressNativeDrag}
            style={{
              width: geometry.device.width,
              height: geometry.device.height,
              transform: `scale(${scale})`,
            }}
          >
            <img
              className="phone-bezel"
              src={device.bezel}
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{ zIndex: device.bezelLayer === "above-screen" ? 2 : 1 }}
            />
            <div
              ref={screenRef}
              className="device-screen"
              data-cursor-debug={mobileCursor.cursorDebug ? "true" : "false"}
              data-device={device.id}
              data-phone-screen
              data-testid="device-screen"
              {...mobileCursor.cursorHandlers}
              style={
                {
                  "--device-safe-area-bottom": `${geometry.safeArea.bottom}px`,
                  left: geometry.screen.x,
                  top: geometry.screen.y,
                  width: geometry.screen.width,
                  height: geometry.screen.height,
                  borderRadius: geometry.screen.radius,
                  zIndex: device.bezelLayer === "above-screen" ? 1 : 2,
                } as CSSProperties
              }
            >
              {children}
              {device.camera ? (
                <span
                  className="device-camera"
                  data-testid="device-camera"
                  aria-hidden="true"
                  style={{
                    width: device.camera.size,
                    height: device.camera.size,
                    top: device.camera.top,
                    left: `calc(50% - ${device.camera.size / 2}px)`,
                  }}
                />
              ) : null}
              {mobileCursor.cursorElement}
            </div>
          </div>
        </div>
      </div>
    </ScreenPortalContext.Provider>
  );
}
