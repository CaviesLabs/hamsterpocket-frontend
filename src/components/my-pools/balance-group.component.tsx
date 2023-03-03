import { FC, useEffect } from "react";
import { Button } from "@hamsterbox/ui-kit";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useConnectedWallet } from "@saberhq/use-solana";
import { getPortfolioStatistic } from "@/src/redux/actions/portfolio/portfolio.action";
import State from "@/src/redux/entities/state";

export const BalanceGroup: FC = () => {
  /**
   * @dev Inject router module to use.
   */
  const router = useRouter();
  const dispatch = useDispatch();
  const wallet = useConnectedWallet()?.publicKey.toString();

  useEffect(() => {
    if (!wallet) return;
    dispatch(
      getPortfolioStatistic({
        ownerAddress: wallet,
      })
    );
  }, [wallet]);

  const statisticData = useSelector((state: State) => state.portfolioStatistic);

  return (
    <section>
      <p className="text-[24px] text-white">Your balance</p>
      <section className="md:flex items-center mt-[20px]">
        <div className="md:w-[70%] w-full">
          <div className="md:w-[315px] w-full">
            <div className="bg-dark90 flex items-center px-[20px] py-[10px] rounded-[8px] justify-center">
              <div>
                <p className="text-center text-green normal-text text-[20px]">
                  16.78 SOL
                </p>
                <p className="text-center text-green normal-text text-[16px]">
                  ~$350,20
                </p>
                <p className="text-center text-dark40 normal-text text-[14px]">
                  Wallet Balance
                </p>
              </div>
              <div className="px-[16px]">
                <div className="h-[56px] w-[1px] bg-[#4D5A66]"></div>
              </div>
              <div>
                <p className="text-center text-green normal-text text-[20px]">
                  {statisticData.totalPoolsBalance} SOL
                </p>
                <p className="text-center text-green normal-text text-[16px]">
                  ~${statisticData.totalPoolsBalanceValue}
                </p>
                <p className="text-center text-dark40 normal-text text-[14px]">
                  Est Pocket balance
                </p>
              </div>
            </div>
            <Button
              className="mx-auto mt-[20px] !rounded-[8px] vpbutton"
              width="100%"
              theme={{
                backgroundColor: "#20242D",
                color: "#B998FB",
                hoverColor: "#B998FB",
              }}
              text="View Portfolio"
              onClick={() => router.push("/portfolio")}
            />
          </div>
        </div>
        <div className="md:w-[20%] w-full block md:mt-0 mt-[20px]">
          <div className="md:float-right">
            <div className="md:w-[253px] w-full">
              <Button
                className="float-right !px-[50px] !border-solid !border-purple !border-[2px] md:w-auto !w-full"
                theme={{
                  backgroundColor: "transparent",
                  color: "#B998FB",
                  hoverColor: "#B998FB",
                }}
                text="View history"
                width="100%"
                onClick={() => router.push("/history")}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
