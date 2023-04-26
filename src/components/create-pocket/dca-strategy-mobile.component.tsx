import { FC, useState } from "react";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BuyCondition } from "./buy-condition.component";
import { DepositAmount } from "./deposit-amount.component";

export const DCAStrategyMobileLayout: FC = () => {
  /**
   * @dev Injected context.
   */
  const { setBuyCondition, targetTokenAddress } = useCreatePocketPage();

  /**
   * @dev Buy condition display.
   */
  const [buyConditionDisplayed, setBuyConditionDisplayed] = useState(false);

  return (
    <>
      <section>
        <div className="mt-6">
          <BuyCondition
            buyConditionDisplayed={buyConditionDisplayed}
            disabled={!targetTokenAddress.length}
            toggle={() => {
              setBuyCondition(null);
              setBuyConditionDisplayed(!buyConditionDisplayed);
            }}
          />
        </div>
      </section>
      <DepositAmount />
    </>
  );
};
