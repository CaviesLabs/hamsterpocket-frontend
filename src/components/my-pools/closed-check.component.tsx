import { UpdatedIcon } from "@/src/components/icons/updated";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getClosedPockets } from "@/src/redux/actions/pocket/pocket.action";
import { PocketStatus } from "@/src/entities/pocket.entity";
import { useDispatch, useSelector } from "react-redux";
import { useConnectedWallet } from "@saberhq/use-solana";
import State from "@/src/redux/entities/state";
import { useRouter } from "next/router";
import classnames from "classnames";

export const ClosedCheckComponent = () => {
  /** @dev Router injected */
  const router = useRouter();

  /** @dev dispatch Injected */
  const dispatch = useDispatch();

  /** @dev */
  const [isClosed, setIsClosed] = useState(false);

  /** @dev wallet Injected */
  const wallet = useConnectedWallet()?.publicKey.toString();

  /** @dev Call API to get closed pockets */
  useEffect(() => {
    if (!wallet) return;

    dispatch(
      getClosedPockets({
        ownerAddress: wallet,
        statuses: [PocketStatus.CLOSED],
      })
    );
  }, [wallet]);

  /** @dev Get fetched closed pools. */
  const closedPockets = useSelector((state: State) => state.closedPockets);

  /** @dev Only display popup when client has the closed pockets */
  return (
    <section
      className={classnames("mt-14", {
        hidden: closedPockets.length === 0 || isClosed,
      })}
    >
      <div className="w-full rounded-2xl bg-[#FFF9D8] px-5 py-4 md:flex md:items-center justify-between mobile:text-[14px] relative">
        <CloseOutlined
          className="ml-4 cursor-pointer md:hidden absolute right-[15px] top-[15px]"
          onClick={() => setIsClosed(true)}
        />
        <div className="flex items-center">
          <UpdatedIcon className="mr-4" />
          <p className="normal-text text-[#835C00]">
            You have {closedPockets.length} closed{" "}
            {closedPockets.length > 1 ? "pockets" : "pocket"}, you can withdraw
            your funds.
          </p>
        </div>
        <div className="flex items-center">
          <div
            onClick={() => router.push("/ended-pockets")}
            className="cursor-pointer md:px-6 py-1 rounded-full border border-2 border-[#B998FB] text-[#B998FB] mobile:px-[5px] mobile:text-[14px] mobile:w-full text-center mobile:mt-[10px]"
          >
            View pockets
          </div>
          <CloseOutlined
            className="ml-4 cursor-pointer mobile:hidden"
            onClick={() => setIsClosed(true)}
          />
        </div>
      </div>
    </section>
  );
};
