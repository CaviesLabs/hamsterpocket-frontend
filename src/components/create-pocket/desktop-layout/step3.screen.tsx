import { FC } from "react";
import { DCAPPair } from "@/src/components/create-pocket";
import { ChainId } from "@/src/entities/platform-config.entity";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import {
  DepositAmount,
  PocketTpSlSumary,
  parseStopConditionHumanValue,
  stopConditionHumanLabelParser,
} from "@/src/components/create-pocket";

export const CreatePocketStep3Desktop: FC = () => {
  /**
   * @dev Injected context.
   */
  const { stopConditions } = useCreatePocketPage();
  const { chainId } = usePlatformConfig();

  return (
    <>
      <DCAPPair />
      <div className="md:grid md:grid-cols-2">
        <div className="md:col-span-1 max-w-[500px]">
          <DepositAmount />
          {stopConditions.length > 0 && (
            <section className="mt-[20px] md:mt-[48px]">
              <p className="text-[18px] md:text-[24px] text-white normal-text font-[600]">
                End Conditions
              </p>
              <div className="mt-[16px] p-[16px] bg-dark100 rounded-[8px]">
                {stopConditions.map((stopCondition, index) => {
                  return (
                    <div
                      key={`sumary-end-conditions-${index}`}
                      className="flow-root items-center normal-text text-[14px] mb-[10px] py-[10px] border-b-[1px]  border-solid border-dark80"
                    >
                      <p className="float-left text-dark45">
                        {index <= 0
                          ? stopConditionHumanLabelParser(
                              Object.keys(stopCondition)[0]
                            )
                          : "OR "}
                      </p>
                      <p className="float-right text-white">
                        {parseStopConditionHumanValue(stopCondition)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
        <div className="md:col-span-1 max-w-[500px]">
          {chainId !== ChainId.sol ? <PocketTpSlSumary /> : null}
        </div>
      </div>
    </>
  );
};
