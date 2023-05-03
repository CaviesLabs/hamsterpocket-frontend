import { useEffect, useMemo, useState } from "react";
import { ShareIcon } from "@/src/components/icons";
import { Button } from "@hamsterbox/ui-kit";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { useWallet } from "@/src/hooks/useWallet";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import {
  DepositModal,
  ClosePocketModal,
  PausePocketModal,
  ResumePocketModal,
  ClaimFeeModal,
} from "@/src/components/home";
import { PoolItemBuyConditionComponent } from "@/src/components/my-pools/pool-item/pool-item-buy-condition.component";
import { utilsProvider } from "@/src/utils";

type PoolItemProps = {
  data: PocketEntity;
  handleFetch(): void;
};
export const PoolItemRow = (props: PoolItemProps) => {
  const { data } = props;
  const { whiteLists } = useWhiteList();
  const { programService } = useWallet();

  /** @dev Condition to show modal to deposit. */
  const [depositedDisplayed, setDepositedDisplayed] = useState(false);

  /** @dev Condition to show modal to close pocket. */
  const [closedDisplayed, setClosedDisplayed] = useState(false);

  /** @dev Condition to show modal to pause pocket. */
  const [pausedDisplayed, setPausedDisplayed] = useState(false);

  /** @dev Condition to show modal to resume pocket. */
  const [resumedDisplayed, setResumedDisplayed] = useState(false);

  /** @dev Condition to show modal to claim fee create pocket. */
  const [claimFeeDisplayed, setClaimFeeDisplayed] = useState(false);

  /** @dev Get target token database on address. */
  const targetToken = useMemo<WhitelistEntity>(
    () => whiteLists[data.targetTokenAddress],
    [data]
  );

  /** @dev Get base token database on address. */
  const baseToken = useMemo<WhitelistEntity>(
    () => whiteLists[data.baseTokenAddress],
    [data]
  );

  /** @dev Condition whether pocket account is closed completedly  before. */
  const [isClaimed, setClaimed] = useState(false);

  /** @dev Condition filter pockets which is paused only. */
  const isActive = useMemo(() => data.status === PocketStatus.ACTIVE, [data]);
  const isPaused = useMemo(() => data.status === PocketStatus.PAUSED, [data]);
  const isClosed = useMemo(() => data.status === PocketStatus.CLOSED, [data]);
  const isEnded = useMemo(() => data.status === PocketStatus.ENDED, [data]);
  const isWithdrawed = useMemo(() => !isEnded && isClosed, [isEnded, isClosed]);

  useEffect(() => {
    (async () => {
      try {
        programService && (await programService.getPocketAccount(data._id));
        setClaimed(false);
      } catch (err) {
        console.log(err);
        setClaimed(true);
      }
    })();
  }, [data, programService]);

  return (
    <div className="w-full min-h-[100px] rounded-[8px] bg-[#121320] py-[32px] px-[20px] mt-[40px] overflow-hidden">
      <div className="md:grid md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="flex items-center">
            <div className="w-[30px] md:w-[44px] md:h-[44px] rounded-[100%] bg-dark70 flex justify-center items-center border-solid border-[5px] border-dark70">
              {targetToken?.image && (
                <img
                  src={targetToken?.image}
                  className="rounded-[50%]"
                  alt={data.targetTokenAddress}
                />
              )}
            </div>
            <p className="text-white text-[16px] regular-text flex items-center ml-[10px]">
              {targetToken?.symbol}/SOL
              <a
                href={`https://solscan.io/account/${data.address}`}
                target="_blank"
                className="ml-[10px] relative top-[-3px]"
              >
                <ShareIcon />
              </a>
            </p>
          </div>
          <p className="text-dark50 text-[12px] regular-text relative top-[3px] md:top-[6px] flex items-center mt-[5px]">
            #{utilsProvider.makeShort(data.id)}
          </p>
        </div>
        <div className="md:col-span-2 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-dark50  mobile:py-[12px]">
          <p className="md:hidden float-left text-dark50">Strategy</p>
          <div className="mobile:float-right">
            <PoolItemBuyConditionComponent
              data={data}
              baseToken={baseToken}
              targetToken={targetToken}
            />
          </div>
        </div>
        <div className="md:col-span-1 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-dark50  mobile:py-[12px]">
          <p className="md:hidden float-left text-dark50">Total invested</p>
          <p className="md:text-center text-white normal-text mobile:float-right">
            120 USDC
          </p>
        </div>
        <div className="md:col-span-2 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-dark50  mobile:py-[12px]">
          <p className="md:hidden float-left text-dark50">APL(ROI)</p>
          <div className="mobile:float-right mobile:flex mobile:items-center">
            <p className="md:text-center text-green300 normal-text">
              + 0.00 USDC
            </p>
            <p className="md:text-center md:mt-[5px] text-[12px] text-green300 mobile:ml-[5px]">
              (0.00%)
            </p>
          </div>
        </div>
        <div className="md:col-span-2 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-dark50  mobile:py-[12px]">
          <p className="md:hidden float-left text-dark50">Average price</p>
          <div className="mobile:float-right mobile:flex mobile:items-center">
            <p className="text-center text-white normal-text">1 USDC</p>
            <p className="text-center md:mt-[5px] md:text-[12px] text-white">
              = 1000.491 BLOCK
            </p>
          </div>
        </div>
        <div className="md:col-span-2 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-dark50  mobile:py-[12px]">
          <p className="md:hidden float-left text-dark50">Next batch time</p>
          <div className="mobile:float-right mobile:flex mobile:items-center">
            <div className="px-[10px] bg-[#4ADE801F] rounded-[8px] inline-block mx-auto">
              <p className="text-center text-green300 normal-text">On going</p>
            </div>
            <p className="text-center md:mt-[5px] text-[12px] text-dark50 mobile:ml-[5px]">
              16/02/2023 16:00 (+07)
            </p>
          </div>
        </div>
      </div>
      <div className="mt-[10px] flow-root">
        {!isWithdrawed && !(isEnded && !isClaimed) && (
          <div className="md:float-right flex mt-[20px] md:mt-0 md:w-auto mobile:grid mobile:grid-cols-3 mobile:gap-3">
            <div className="md:float-right mobile:col-span-1">
              {(isActive || isPaused) && (
                <Button
                  className="!px-[50px] md:w-auto !w-full pool-control-btn"
                  theme={{
                    backgroundColor: "#735CF7",
                    color: "#FFFFFF",
                  }}
                  text="Deposit"
                  width="100%"
                  onClick={() => setDepositedDisplayed(true)}
                />
              )}
            </div>
            <div className="md:float-right md:ml-[10px] md:mt-0 md:w-auto mobile:col-span-1">
              {!isClosed &&
                !isEnded &&
                (isPaused ? (
                  <Button
                    className="!px-[50px] md:w-auto pool-control-btn"
                    theme={{
                      backgroundColor: "#735CF7",
                      color: "#FFFFFF",
                    }}
                    text="Continue"
                    width="100%"
                    onClick={() => setResumedDisplayed(true)}
                  />
                ) : (
                  <Button
                    className="!px-[50px] md:w-auto pool-control-btn"
                    theme={{
                      backgroundColor: "#735CF7",
                      color: "#FFFFFF",
                    }}
                    text="Pause"
                    width="100%"
                    onClick={() => setPausedDisplayed(true)}
                  />
                ))}
            </div>
            <div className="md:float-right md:ml-[10px] md:mt-0 md:w-auto mobile:col-span-1">
              {!isEnded && (
                <Button
                  className="!px-[50px] !border-solid !border-purple300 !border-[2px] pool-control-btn"
                  theme={{
                    backgroundColor: "transparent",
                    color: "#735CF7",
                    hoverColor: "#735CF7",
                  }}
                  text={isClosed ? "Withdraw" : "Close"}
                  width="100%"
                  onClick={() => setClosedDisplayed(true)}
                />
              )}
              {isEnded && !isClaimed && (
                <Button
                  className="!px-[50px] !border-solid !border-purple300 !border-[2px] pool-control-btn"
                  theme={{
                    backgroundColor: "transparent",
                    color: "#735CF7",
                    hoverColor: "#735CF7",
                  }}
                  text="Claim fee"
                  width="100%"
                  onClick={() => setClaimFeeDisplayed(true)}
                />
              )}
            </div>
          </div>
        )}
        {isWithdrawed && (
          <div className="md:float-right md:ml-[10px] md:mt-0 mt-[20px] md:w-auto mobile:col-span-1">
            {!isEnded && (
              <Button
                className="!px-[50px] !border-solid !border-purple300 !border-[2px] pool-control-btn text-center mx-auto"
                theme={{
                  backgroundColor: "transparent",
                  color: "#735CF7",
                  hoverColor: "#735CF7",
                }}
                text="Withdraw"
                width="100%"
                onClick={() => setClosedDisplayed(true)}
              />
            )}
          </div>
        )}
        {isEnded && !isClaimed && (
          <div className="md:float-right md:ml-[10px] md:mt-0 mt-[20px] md:w-auto mobile:col-span-1">
            <Button
              className="!px-[50px] !border-solid !border-purple300 !border-[2px] pool-control-btn text-center mx-auto mobile:!max-w-[150px]"
              theme={{
                backgroundColor: "transparent",
                color: "#735CF7",
                hoverColor: "#735CF7",
              }}
              text="Claim fee"
              width="100%"
              onClick={() => setClaimFeeDisplayed(true)}
            />
          </div>
        )}
      </div>
      {depositedDisplayed && (
        <DepositModal
          isModalOpen={depositedDisplayed}
          handleOk={() => {
            setDepositedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setDepositedDisplayed(false)}
          pocket={data}
        />
      )}
      {closedDisplayed && (
        <ClosePocketModal
          isModalOpen={closedDisplayed}
          handleOk={() => {
            setClosedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setClosedDisplayed(false)}
          pocket={data}
          closed={!isEnded && isClosed}
        />
      )}
      {resumedDisplayed && (
        <ResumePocketModal
          isModalOpen={resumedDisplayed}
          handleOk={() => {
            setResumedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setResumedDisplayed(false)}
          pocket={data}
        />
      )}
      {pausedDisplayed && (
        <PausePocketModal
          isModalOpen={pausedDisplayed}
          handleOk={() => {
            setPausedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setPausedDisplayed(false)}
          pocket={data}
        />
      )}
      {claimFeeDisplayed && (
        <ClaimFeeModal
          isModalOpen={claimFeeDisplayed}
          handleOk={() => {
            setClaimFeeDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setClaimFeeDisplayed(false)}
          pocket={data}
        />
      )}
    </div>
  );
};
