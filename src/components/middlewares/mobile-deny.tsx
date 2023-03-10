import { FC, ReactNode, useEffect, useState } from "react";
import { MobileDeny } from "@/src/components/mobile-deny";

interface Props {
  children: ReactNode;
}

const MobileDenyMiddleware: FC<Props> = ({ children }) => {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window?.innerWidth : undefined
  );

  function handleWindowSizeChange() {
    setWidth(window?.innerWidth);
  }
  useEffect(() => {
    if (!window) return;
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <>
      {isMobile && <MobileDeny />}
      {children}
    </>
  );
};

export default MobileDenyMiddleware;
