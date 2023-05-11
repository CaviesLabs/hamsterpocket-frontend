import type { NextPage } from "next";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { LayoutSection } from "@/src/components/layout-section";
import { LeftIcon, ShareIcon } from "@/src/components/icons";
import { useDispatch } from "react-redux";
import { getPocketById } from "@/src/redux/actions/pocket/pocket.action";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { utilsProvider } from "@/src/utils";
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

  /** @dev Define pocket entity. */
  const [pocket, setPocket] = useState<PocketEntity>();

  /** @dev Get base token info. */
  const baseToken = useMemo(
    () =>
      whiteLists[pocket?.baseTokenAddress] ||
      findEntityByAddress(pocket?.baseTokenAddress),
    [pocket]
  );

  /** @dev Get target token info. */
  const targetToken = useMemo(
    () =>
      whiteLists[pocket?.targetTokenAddress] ||
      findEntityByAddress(pocket?.targetTokenAddress),
    [pocket]
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
   * @dev Fetch pocket data from hamster server.
   */
  useEffect(() => {
    if (!router?.query?.id || !walletAddress) return;
    syncAndFetch();
  }, [router, walletAddress]);

  if (!walletAddress) return <div></div>;

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="md:pt-[130px] pb-[100px]">
          <section className="md:flex">
            <div className="md:float-left md:w-[80%]">
              <div className="md:flex justify-between items-center">
                <div className="flex items-center">
                  <button onClick={() => router.push("/my-pockets")}>
                    <LeftIcon />
                  </button>
                  <p className="float-left md:text-[32px] text-[20px] text-white ml-[10px]">
                    Pockets Detail
                  </p>
                </div>
              </div>
              <div className="mt-[32px] w-full block pocket-top-item px-[20px] py-[10px]">
                <div className="flow-root items-center">
                  <div className="flex items-center float-left">
                    <div className="w-[30px] md:w-[44px] md:h-[44px] rounded-[100%] bg-dark70 flex justify-center items-center border-solid border-[3px] border-white float-left">
                      <img src={targetToken?.image} className="rounded-[50%]" />
                    </div>
                    <p className="text-white text-[16px] regular-text flex items-center ml-[10px]">
                      {targetToken?.symbol}/{baseToken?.symbol}
                    </p>
                  </div>
                  <a
                    href={`https://solscan.io/account/`}
                    target="_blank"
                    className="ml-[10px] relative top-[4px] float-right"
                  >
                    <ShareIcon color="#ffffff" />
                  </a>
                </div>
                <p className="md:text-[40px] text-white mt-[20px]">100%</p>
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
                    <EndCondition pocket={pocket} handleFetch={syncAndFetch} />
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
          </section>
        </LayoutSection>
      </div>
    </MainLayout>
  );
};

export default PocketDetailPage;
