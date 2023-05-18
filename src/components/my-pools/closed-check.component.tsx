import { CloseIcon } from "@/src/components/icons";
import { FC, useEffect, useState } from "react";
import { getClosedPockets } from "@/src/redux/actions/pocket/pocket.action";
import { PocketStatus } from "@/src/entities/pocket.entity";
import { useDispatch, useSelector } from "react-redux";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import State from "@/src/redux/entities/state";
import classnames from "classnames";

export const ClosedCheckComponent: FC<{
  routeToClosePockets(): void;
  isCloseView: boolean;
}> = (props) => {
  /** @dev dispatch Injected */
  const dispatch = useDispatch();

  /** @dev */
  const [isClosed, setIsClosed] = useState(false);

  /** @dev Inject wallet info. */
  const { walletAddress } = useAppWallet();
  const { chainId } = usePlatformConfig();

  /** @dev Call API to get closed pockets */
  useEffect(() => {
    if (!walletAddress) return;

    dispatch(
      getClosedPockets({
        ownerAddress: walletAddress,
        statuses: [PocketStatus.CLOSED],
        chainId: chainId,
      })
    );
  }, [walletAddress, chainId]);

  /** @dev Get fetched closed pools. */
  const closedPockets = useSelector((state: State) => state.closedPockets);

  /** @dev Only display popup when client has the closed pockets */
  return (
    <section
      className={classnames("mobile:mt-14", {
        hidden: closedPockets.length === 0 || isClosed || props.isCloseView,
      })}
    >
      <div className="w-full rounded-2xl bg-[#2C264F] px-5 py-[20px] mobile:text-[14px] relative">
        <button onClick={() => setIsClosed(true)}>
          <CloseIcon
            className="ml-4 cursor-pointer absolute right-[15px] top-[5px]"
            color="#ffffff"
          />
        </button>
        <div className="flex items-center mt-[10px]">
          {/* <UpdatedIcon className="mr-4" /> */}
          <p className="normal-text text-white text-[12px]">
            You have {closedPockets.length} closed{" "}
            {closedPockets.length > 1 ? "pockets" : "pocket"}, you can withdraw
            your funds.
          </p>
        </div>
        <div className="flex items-center mt-[10px]">
          <div
            onClick={() => props.routeToClosePockets()}
            className="cursor-pointer md:px-6 py-1 rounded-full border border-2 border-purple300 text-purple300 mobile:px-[5px] mobile:text-[14px] mobile:w-full text-center mobile:mt-[10px] w-full text-[14px]"
          >
            Withdraw fund
          </div>
        </div>
      </div>
    </section>
  );
};
