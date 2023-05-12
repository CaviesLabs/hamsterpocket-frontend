import { FC, useState, useEffect, useMemo } from "react";
import { ToolTip } from "@/src/components/tooltip";
import { LayoutSection } from "@/src/components/layout-section";
import { AVATAR_ENDPOINT, utilsProvider } from "@/src/utils";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { CopyIcon } from "@/src/components/icons";
import { PocketBalance } from "./pocket-balance.component";
import PortfolioController from "@/src/components/portfolio/controller.component";
import TableComponent from "@/src/components/portfolio/table.component";
import DashboardComponentMobile from "@/src/components/portfolio/dashboard-mobile.component";
import classnames from "classnames";

export const PortfolioMobileLayout: FC = () => {
  const [tab, setTab] = useState(0);

  /**
   * @description Define state of showing profile menu
   */
  const [show, setShow] = useState(false);
  const { walletAddress, chain } = useAppWallet();

  /** @dev Auto hide tooltip. */
  useEffect(() => {
    show &&
      setTimeout(() => {
        setShow(false);
      }, 1000);
  }, [show]);

  return (
    <LayoutSection className="pb-[100px]">
      <div className="mt-[70px]">
        <div className="my-[20px]">
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
      </div>
      <PocketBalance />
      <div className="mt-[20px]">
        <div className="grid grid-cols-2">
          <div
            onClick={() => tab !== 0 && setTab(0)}
            className={classnames(
              "col-span-1 text-center text-dark50 cursor-pointer border-b-[1px] border-b-solid border-dark50 pb-[10px]",
              {
                "text-purple300": tab === 0,
                "border-purple300": tab === 0,
              }
            )}
          >
            Details
          </div>
          <div
            onClick={() => tab !== 1 && setTab(1)}
            className={classnames(
              "col-span-1 text-center text-dark50 cursor-pointer border-b-[1px] border-b-solid border-dark50",
              {
                "text-purple300": tab === 1,
                "border-purple300": tab === 1,
              }
            )}
          >
            Statistics
          </div>
        </div>
        <div>
          {tab === 0
            ? useMemo(() => <TableComponent />, [walletAddress, tab, chain])
            : useMemo(
                () => (
                  <>
                    <PortfolioController />
                    <DashboardComponentMobile />
                  </>
                ),
                [walletAddress, tab, chain]
              )}
        </div>
      </div>
    </LayoutSection>
  );
};
