import type { NextPage } from "next";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { LayoutSection } from "@/src/components/layout-section";
import { LeftIcon, ShareIcon } from "@/src/components/icons";
import { useDispatch, useSelector } from "react-redux";
import { getPocketById } from "@/src/redux/actions/pocket/pocket.action";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { utilsProvider, RADYUM_EXPLORE, UNISWAP_EXPLORE } from "@/src/utils";
import {
  PocketStrategy,
  PocketInfo,
  PocketProgress,
  BoughtTransaction,
  NextBatch,
  EndCondition,
  PocketStatusComponent,
  PocketTpSl,
} from "@/src/components/pocket-details";
import { useWallet } from "@/src/hooks/useWallet";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { evmProgramService } from "@/src/services/evm-program.service";
import { ClosedCheckComponent } from "@/src/components/my-pools/closed-check.component";
import { getActivePockets } from "@/src/redux/actions/pocket/pocket.action";
import { PocketStatus } from "@/src/entities/pocket.entity";
import State from "@/src/redux/entities/state";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";

const PocketDetailPage: NextPage = () => {
  /**
   * @dev Router injected.
   */
  const router = useRouter();
  const dispatch = useDispatch();
  const { whiteLists, findEntityByAddress } = useWhiteList();
  const { walletAddress, chain } = useAppWallet();
  const { programService: solProgram } = useWallet();

  /** @dev Get lastest pockets. */
  const activePockets = useSelector((state: State) => state.activePockets);

  /** @dev Define pocket entity. */
  const [pocket, setPocket] = useState<PocketEntity>();

  /** @dev Get base token info. */
  const baseToken = useMemo(
    () =>
      whiteLists[pocket?.baseTokenAddress] ||
      findEntityByAddress(pocket?.baseTokenAddress),
    [pocket, whiteLists, findEntityByAddress]
  );

  /** @dev Get target token info. */
  const targetToken = useMemo(
    () =>
      whiteLists[pocket?.targetTokenAddress] ||
      findEntityByAddress(pocket?.targetTokenAddress),
    [pocket, whiteLists, findEntityByAddress]
  );

  /** @dev The function to handle sync pockets. */
  const handleSync = useCallback(async () => {
    if (!walletAddress) return;
    if (!pocket) return;
    if (chain === "SOL") {
      await solProgram.sync(pocket?._id);
    } else {
      await evmProgramService.sync(pocket?._id);
    }
  }, [walletAddress, chain, solProgram, pocket]);

  /** @dev The function to sync and refetch. */
  const syncAndFetch = useCallback(async () => {
    /** @dev Sync first. */
    await handleSync();

    /** @dev Now fetch data from hamster server. */
    dispatch(
      getPocketById({ pocketId: router.query?.id as string }, (pocket) => {
        setPocket(pocket);
      })
    );
  }, [router, walletAddress, chain, solProgram, pocket]);

  /**
   * @dev Fetch lastest 5 pockets.
   */
  useEffect(() => {
    if (!walletAddress) return;
    dispatch(
      getActivePockets({
        chainId: chain === "SOL" ? "solana" : "mumbai",
        limit: 5,
        ownerAddress: walletAddress,
        sortBy: "DATE_CREATED_DESC",
        statuses: [PocketStatus.PAUSED, PocketStatus.ACTIVE],
      })
    );
  }, [chain, walletAddress]);

  /**
   * @dev Fetch pocket data from hamster server.
   */
  useEffect(() => {
    if (!router?.query?.id || !walletAddress) return;
    syncAndFetch();
  }, [router, walletAddress]);

  console.log(activePockets);

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="md:pt-[130px] pb-[100px]">
          {walletAddress ? (
            <section className="md:flex">
              <div className="md:float-left md:w-[80%]">
                <div className="md:flex justify-between items-center">
                  <div className="flex items-center">
                    <button onClick={() => router.push("/my-pockets")}>
                      <LeftIcon />
                    </button>
                    <p className="float-left md:text-[32px] text-[20px] text-white ml-[10px]">
                      Pocket Details
                    </p>
                  </div>
                </div>
                <div className="mt-[32px] w-full block pocket-top-item px-[20px] py-[10px]">
                  <div className="flow-root items-center">
                    <div className="flex items-center float-left">
                      <div className="w-[30px] md:w-[44px] md:h-[44px] rounded-[100%] bg-dark70 flex justify-center items-center border-solid border-[3px] border-white float-left">
                        <img
                          src={targetToken?.image}
                          className="rounded-[50%]"
                        />
                      </div>
                      <p className="text-white text-[16px] regular-text flex items-center ml-[10px]">
                        {targetToken?.symbol}/{baseToken?.symbol}
                      </p>
                    </div>
                    <a
                      href={
                        chain === "SOL"
                          ? `${RADYUM_EXPLORE}?inputCurrency=${baseToken?.symbol}&outputCurrency=${targetToken?.symbol}`
                          : `${UNISWAP_EXPLORE}&inputCurrency=${baseToken?.symbol}&outputCurrency=${targetToken?.symbol}`
                      }
                      target="_blank"
                      className="ml-[10px] relative top-[4px] float-right"
                    >
                      <ShareIcon color="#ffffff" />
                    </a>
                  </div>
                  <p className="md:text-[14px] text-white mt-[10px]">
                    #{utilsProvider.makeShort(pocket?._id)}
                  </p>
                </div>
                <div className="md:grid md:grid-cols-2 mt-[20px] md:gap-5">
                  <div className="md:col-span-1">
                    <PocketStrategy pocket={pocket} />
                    <div className="mt-[40px]">
                      <p className="text-dark45 text-[20px]">Pool Info</p>
                      <p className="text-purple300 text-[20px]">
                        Auto-invest DCA
                      </p>
                    </div>
                    <div className="mt-[12px]">
                      <PocketInfo pocket={pocket} handleFetch={syncAndFetch} />
                    </div>
                    <div className="mt-[40px]">
                      <p className="text-dark45 text-[20px]">Progress</p>
                    </div>
                    <div className="mt-[12px]">
                      <PocketProgress pocket={pocket} />
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="mt-[12px]">
                      <NextBatch pocket={pocket} handleFetch={syncAndFetch} />
                    </div>
                    <div className="mt-[12px]">
                      <EndCondition
                        pocket={pocket}
                        handleFetch={syncAndFetch}
                      />
                    </div>
                    <div className="mt-[12px]">
                      <PocketTpSl pocket={pocket} />
                    </div>
                    <div className="mt-[12px]">
                      <PocketStatusComponent
                        pocket={pocket}
                        handleFetch={syncAndFetch}
                      />
                    </div>
                  </div>
                </div>
                <BoughtTransaction pocket={pocket} />
              </div>
              <div className="md:float-left mobile:hidden w-[20%] pt-[80px] pl-[20px]">
                {activePockets?.length ? (
                  <div>
                    <p className="text-dark45 text-[20px] normal-text mb-[10px]">
                      My Pockets
                    </p>
                    {activePockets?.map((pocket) => {
                      const baseTokenPocket =
                        whiteLists[pocket?.baseTokenAddress] ||
                        findEntityByAddress(pocket?.baseTokenAddress);
                      const targetTokenPocket =
                        whiteLists[pocket?.targetTokenAddress] ||
                        findEntityByAddress(pocket?.targetTokenAddress);
                      return (
                        <div
                          className="md:w-full mobile:max-w-[200px] flex px-[10px] py-[10px] border-solid border-[3px] border-dark80 rounded-[12px] md:mb-[20px] cursor-pointer hover:bg-dark80"
                          onClick={() =>
                            router.push(`/pocket/${pocket.id || pocket._id}`)
                          }
                        >
                          <div className="float:left">
                            <div className="w-[30px] md:w-[34px] md:h-[34px] rounded-[100%] bg-dark70 flex justify-center items-center border-solid border-[3px] border-white float-left">
                              <img
                                src={targetTokenPocket?.image}
                                className="rounded-[50%]"
                              />
                            </div>
                          </div>
                          <div className="float-left ml-[10px]">
                            <p className="text-white text-[14px] normal-text">
                              {targetTokenPocket?.symbol}/
                              {baseTokenPocket?.symbol}
                            </p>
                            <p className="text-dark50 text-[12px] normal-text">
                              #{utilsProvider.makeShort(pocket?._id)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                <ClosedCheckComponent
                  routeToClosePockets={() => router.push("/my-pockets")}
                  isCloseView={false}
                />
              </div>
            </section>
          ) : null}
        </LayoutSection>
      </div>
    </MainLayout>
  );
};

export default PocketDetailPage;
