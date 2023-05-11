import { FC, useState, useEffect } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import { AVATAR_ENDPOINT, utilsProvider } from "@/src/utils";
import { CopyIcon } from "@/src/components/icons";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { ToolTip } from "@/src/components/tooltip";
import PortfolioController from "@/src/components/portfolio/controller.component";
import TableComponent from "@/src/components/portfolio/table.component";
import DashboardComponentMobile from "@/src/components/portfolio/dashboard.component";

export const PortfolioDesktopLayout: FC = () => {
  /**
   * @description Define state of showing profile menu
   */
  const [show, setShow] = useState(false);
  const { walletAddress } = useAppWallet();

  /** @dev Auto hide tooltip. */
  useEffect(() => {
    show &&
      setTimeout(() => {
        setShow(false);
      }, 1000);
  }, [show]);

  return (
    <LayoutSection className="!pt-[130px] pb-[100px]">
      <p className="md:text-[32px] text-[20px] text-white mt-[22px] mt-20">
        Profile
      </p>
      <div className="mt-[20px]">
        <img
          className="w-[95px] h-[95px] mx-auto"
          src={`${AVATAR_ENDPOINT}/${walletAddress}.png`}
          alt="Boring avatar"
        />
        <ToolTip message="Copied" open={show}>
          <p
            className="text-[20px] text-purple300 flex items-center mx-auto justify-center mt-[16px] cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(walletAddress);
              setShow(!show);
            }}
          >
            <span>{utilsProvider.makeShort(walletAddress, 3)} </span>
            <CopyIcon className="ml-2" />
          </p>
        </ToolTip>
      </div>
      <DashboardComponentMobile />
      <PortfolioController />
      <TableComponent />
    </LayoutSection>
  );
};
