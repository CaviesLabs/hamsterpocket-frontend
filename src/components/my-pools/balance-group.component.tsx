import { FC, useEffect } from "react";
import { Button } from "@hamsterbox/ui-kit";
import { useDispatch } from "react-redux";
import { UserBalanceComponent } from "@/src/components/my-pools/user-balance.component";
import { PocketBalanceComponent } from "@/src/components/my-pools/pocket-balance.component";
import { getPortfolios } from "@/src/redux/actions/portfolio/portfolio.action";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";

export const BalanceGroup: FC = () => {
  /**
   * @dev Inject router module to use.
   */
  const dispatch = useDispatch();
  const { walletAddress } = useAppWallet();
  const { pushRouterWithChainId } = usePlatformConfig();

  /**
   * @dev Fetch
   */
  useEffect(() => {
    if (!walletAddress) return;
    dispatch(
      getPortfolios({
        ownerAddress: walletAddress,
        sortBy: ["VALUE_DESC"],
        search: "",
      })
    );
  }, [walletAddress]);

  return (
    <section>
      <p className="text-[18px] md:text-[24px] text-white">Your balance</p>
      <section className="md:flex justify-between items-center mt-[20px]">
        <div className="w-full">
          <div className="md:w-[315px] w-full">
            <div className="bg-dark90 flex items-center px-[20px] py-[10px] rounded-[8px] justify-center">
              <UserBalanceComponent />
              <div className="px-[16px]">
                <div className="h-[56px] w-[1px] bg-[#4D5A66]" />
              </div>
              <PocketBalanceComponent />
            </div>
            <Button
              className="mx-auto mt-[20px] !rounded-[8px] vpbutton !text-[14px] md:!text-[16px]"
              width="100%"
              theme={{
                backgroundColor: "#20242D",
                color: "#735CF7",
                hoverColor: "#735CF7",
              }}
              text="View Portfolio"
              onClick={() => pushRouterWithChainId("/profile")}
            />
          </div>
        </div>
        <div className="w-full md:w-[253px] block md:mt-0 mt-[20px]">
          <Button
            className="float-right !px-[50px] !border-solid !border-purple300 !border-[2px] md:w-auto !w-full !text-[14px] md:!text-[16px]"
            theme={{
              backgroundColor: "transparent",
              color: "#735CF7",
              hoverColor: "#735CF7",
            }}
            text="View history"
            width="100%"
            onClick={() => pushRouterWithChainId("/history")}
          />
        </div>
      </section>
    </section>
  );
};
