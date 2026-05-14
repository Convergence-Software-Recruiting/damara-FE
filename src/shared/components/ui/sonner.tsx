import { Toaster as Sonner, type ToasterProps } from "sonner";

import { cn } from "./utils";
import { APP_TAB_BAR_HEIGHT_PX } from "../layout/appShellConstants";

export type DamaraToasterProps = ToasterProps & {
  /** BottomTabBar가 있을 때 토스트를 탭바 위로 올림 */
  showBottomTab?: boolean;
};

export function Toaster({ showBottomTab = false, className, toastOptions, ...props }: DamaraToasterProps) {
  const bottomOffset = showBottomTab
    ? `max(88px, calc(${APP_TAB_BAR_HEIGHT_PX}px + 24px + env(safe-area-inset-bottom, 0px)))`
    : `max(32px, calc(16px + env(safe-area-inset-bottom, 0px)))`;

  return (
    <Sonner
      {...props}
      theme="light"
      position="bottom-center"
      duration={2400}
      richColors={false}
      expand={false}
      closeButton={false}
      offset={{ bottom: bottomOffset }}
      className={cn("damara-sonner-toaster group", className)}
      icons={{
        success: null,
        error: null,
        info: null,
        warning: null,
        loading: null,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: cn("damara-toast", toastOptions?.classNames?.toast),
          title: cn("damara-toast-title", toastOptions?.classNames?.title),
          description: cn("damara-toast-description", toastOptions?.classNames?.description),
          ...toastOptions?.classNames,
        },
      }}
    />
  );
}
