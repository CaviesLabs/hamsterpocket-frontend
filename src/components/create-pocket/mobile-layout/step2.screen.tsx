import { FC } from "react";
import {
  DCAPPair,
  DepositAmount,
  stopConditionHumanLabelParser,
  parseStopConditionHumanValue,
} from "@/src/components/create-pocket";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

export const CreatePocketStep2: FC = () => {
  /**
   * @dev Injected context.
   */
  const { stopConditions } = useCreatePocketPage();

  return (
    <>
      <DepositAmount />
      <DCAPPair />
      {stopConditions.length > 0 && (
        <section className="mt-[20px] md:mt-[48px]">
          <p className="text-[18px] md:text-[24px] text-white normal-text font-[600]">
            End Conditions
          </p>
          <div className="mt-[16px] p-[16px] bg-[#121320] rounded-[8px]">
            {stopConditions.map((stopCondition, index) => {
              return (
                <div
                  key={`sumary-end-conditions-${index}`}
                  className="flow-root items-center normal-text text-[14px] mb-[10px]"
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
    </>
  );
};
