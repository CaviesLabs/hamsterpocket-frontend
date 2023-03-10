import { FC, useEffect } from "react";
import { Button } from "@hamsterbox/ui-kit";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useWallet } from "@/src/hooks/useWallet";
import { UserBalanceComponent } from "@/src/components/my-pools/user-balance.component";
import { PocketBalanceComponent } from "@/src/components/my-pools/pocket-balance.component";
import { getPortfolios } from "@/src/redux/actions/portfolio/portfolio.action";

export const BalanceGroup: FC = () => {
  /**
   * @dev Inject router module to use.
   */
  const router = useRouter();
  const { solanaWallet } = useWallet();
  const dispatch = useDispatch();

  /**
   * @dev Fetch
   */
  useEffect(() => {
    if (!solanaWallet) return;
    dispatch(
      getPortfolios({
        ownerAddress: solanaWallet?.publicKey?.toBase58()?.toString(),
        sortBy: ["VALUE_DESC"],
        search: "",
      })
    );
  }, [solanaWallet]);

  return (
    <section>
      <p className="text-[24px] text-white">Your balance</p>
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
        <div className="w-full md:w-[253px] block md:mt-0 mt-[20px]">
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
      </section>
    </section>
  );
};
