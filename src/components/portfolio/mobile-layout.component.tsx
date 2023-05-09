import { FC, useMemo, useState } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import { AVATAR_ENDPOINT, utilsProvider } from "@/src/utils";
import { useConnectedWallet } from "@saberhq/use-solana";
import { CopyIcon } from "@/src/components/icons";
import PortfolioController from "@/src/components/portfolio/controller.component";
import TableComponent from "@/src/components/portfolio/table.component";
import DashboardComponentMobile from "@/src/components/portfolio/dashboard-mobile.component";
import classnames from "classnames";

export const PortfolioMobileLayout: FC = () => {
  const [tab, setTab] = useState(0);
  const wallet = useConnectedWallet();
  /**
   * @description Define state of showing profile menu
   */
  const [show, setShow] = useState(false);

  /**
   * @dev Get wallet public key address.
   */
  const walletPublicKey = useMemo(
    () => wallet?.publicKey?.toString(),
    [wallet]
  );

  return (
    <LayoutSection className="pb-[100px]">
      <div className="mt-[70px]">
        <img
          className="w-[95px] h-[95px] mx-auto"
          src={`${AVATAR_ENDPOINT}/${walletPublicKey}.png`}
          alt="Boring avatar"
        />
        <p
          className="text-[16px] text-purple300 flex items-center mx-auto justify-center mt-[16px]"
          onClick={() => setShow(!show)}
        >
          <span>{utilsProvider.makeShort(walletPublicKey, 3)} </span>
          <CopyIcon className="ml-2" />
        </p>
      </div>
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
          {tab === 0 ? (
            <DashboardComponentMobile />
          ) : (
            <>
              <PortfolioController />
              <TableComponent />
            </>
          )}
        </div>
      </div>
    </LayoutSection>
  );
};
