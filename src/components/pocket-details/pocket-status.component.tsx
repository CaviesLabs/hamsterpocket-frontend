import { FC, useMemo, useState } from "react";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import {
  ClosePocketModal,
  ResumePocketModal,
  PausePocketModal,
  ReversePocketModal,
} from "@/src/components/home";
import { Button } from "@hamsterbox/ui-kit";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { ChainId } from "@/src/entities/platform-config.entity";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";

export const PocketStatusComponent: FC<{
  pocket: PocketEntity;
  handleFetch(): void;
}> = (props) => {
  const pocket = props.pocket;

  /** @dev Inject chain info. */
  const { chainId } = usePlatformConfig();

  /** @dev Inject whitelist hooks. */
  const { whiteLists, findEntityByAddress } = useWhiteList();

  /** @dev Condition to show modal to close pocket. */
  const [closedDisplayed, setClosedDisplayed] = useState(false);

  /** @dev Condition to show modal to pause pocket. */
  const [pausedDisplayed, setPausedDisplayed] = useState(false);

  /** @dev Condition to show modal to close pocket. */
  const [reversedDisplayed, setReversedDisplayed] = useState(false);

  /** @dev Condition to show modal to resume pocket. */
  const [resumedDisplayed, setResumedDisplayed] = useState(false);

  /** @dev Condition filter pockets which isF paused only. */
  const isActive = useMemo(
    () => pocket?.status === PocketStatus.ACTIVE,
    [pocket]
  );
  const isPaused = useMemo(
    () => pocket?.status === PocketStatus.PAUSED,
    [pocket]
  );
  const isClosed = useMemo(
    () => pocket?.status === PocketStatus.CLOSED,
    [pocket]
  );
  const isEnded = useMemo(() => {
    return pocket?.status === PocketStatus.ENDED;
  }, [pocket]);
  const isWithdrawed = useMemo(() => !isEnded && isClosed, [isEnded, isClosed]);

  /** @dev Get base token database on address. */
  const baseToken = useMemo<WhitelistEntity>(
    () =>
      whiteLists[pocket?.baseTokenAddress] ||
      findEntityByAddress(pocket?.baseTokenAddress),
    [props, pocket]
  );

  const statusComponent = useMemo(() => {
    if (isActive) {
      return (
        <div className="px-[10px] bg-[#4ADE801F] rounded-[8px] inline-block mx-auto">
          <p className="text-center text-green300 normal-text">On going</p>
        </div>
      );
    } else if (isPaused) {
      return (
        <div className="px-[10px] bg-[#FACC151F] rounded-[8px] inline-block mx-auto">
          <p className="text-center text-[#E8AB35] normal-text">Pause</p>
        </div>
      );
    } else if (isClosed) {
      return (
        <div className="px-[10px] bg-[#F755551F] rounded-[8px] inline-block mx-auto">
          <p className="text-center text-red300 normal-text">Closed</p>
        </div>
      );
    } else if (isEnded) {
      return (
        <div className="px-[10px] bg-[#F755551F] rounded-[8px] inline-block mx-auto">
          <p className="text-center text-red300 normal-text">Ended</p>
        </div>
      );
    }
  }, [isActive, isPaused, isClosed, isEnded]);

  return (
    <div className="mt-[30px]">
      <div className="flow-root mt-[12px]">
        <p className="float-left text-dark50 text-[20px]">Status</p>
        <div className="float-right flex items-center md:text-center">
          {statusComponent}
          {!isEnded && !isWithdrawed && !isClosed && (
            <label className="switch ml-[10px]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() =>
                  isActive
                    ? setPausedDisplayed(true)
                    : setResumedDisplayed(true)
                }
              />
              <span className="slider round"></span>
            </label>
          )}
        </div>
      </div>
      <div className="mt-[12px]">
        {pocket?.status !== PocketStatus.ENDED &&
          pocket?.status !== PocketStatus.CLOSED && (
            <Button
              className="!px-[50px] md:w-auto w-full"
              theme={{
                backgroundColor: "#735CF7",
                color: "#FFFFFF",
              }}
              text="Close Pocket"
              width="100%"
              onClick={() => setClosedDisplayed(true)}
            />
          )}
        {pocket?.status !== PocketStatus.ENDED &&
          pocket?.status === PocketStatus.CLOSED && (
            <div className="w-full flex md:grid md:grid-cols-5">
              <div className="md:col-span-2">
                <Button
                  className="!px-[50px] !border-solid !border-purple300 !border-[2px] md:pool-control-btn text-center"
                  theme={{
                    backgroundColor: "transparent",
                    color: "#735CF7",
                    hoverColor: "#735CF7",
                  }}
                  text="Withdraw"
                  onClick={() => {
                    setClosedDisplayed(true);
                  }}
                  width="100%"
                />
              </div>
              {pocket?.currentTargetTokenBalance > 0 &&
              chainId !== ChainId.sol ? (
                <div className="md:col-span-3">
                  <Button
                    className="!border-solid !border-purple300 !border-[2px] md:pool-control-btn ml-[10px] text-center"
                    theme={{
                      backgroundColor: "#735CF7",
                      color: "#ffffff",
                    }}
                    text={`Reverse to ${baseToken?.symbol}`}
                    onClick={() => setReversedDisplayed(true)}
                    width="100%"
                  />
                </div>
              ) : null}
            </div>
          )}
      </div>
      {closedDisplayed && pocket && (
        <ClosePocketModal
          isModalOpen={closedDisplayed}
          handleOk={() => {
            setClosedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setClosedDisplayed(false)}
          pocket={pocket}
          // closed={!isEnded && isClosed}
        />
      )}
      {reversedDisplayed && pocket && (
        <ReversePocketModal
          isModalOpen={reversedDisplayed}
          handleOk={() => {
            setReversedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setReversedDisplayed(false)}
          pocket={pocket}
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
          pocket={pocket}
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
          pocket={pocket}
        />
      )}
    </div>
  );
};
