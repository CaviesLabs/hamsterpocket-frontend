import { FC, ReactNode } from "react";
import { useMobileBreakpoint } from "@/src/utils";

/** @dev Wrapper layout to condition which component will be rendered match for its screen version. */
export const LayoutWrapper: FC<{
  layout: ReactNode;
  mobileLayout?: ReactNode;
}> = ({ layout, mobileLayout }) => {
  const isMobile = useMobileBreakpoint();

  /**
   * @dev
   * Render normal layout when screen is desktop and render desktop layout when do not have mobile layout for its version.
   */
  if (!isMobile || !mobileLayout) {
    return <>{layout}</>;
  }

  return <>{mobileLayout}</>;
};
