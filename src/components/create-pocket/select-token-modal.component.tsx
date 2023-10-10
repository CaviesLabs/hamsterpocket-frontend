import { FC, MouseEvent, useState, useMemo } from "react";
import { Avatar, Modal } from "antd";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { ShareIcon, SearchIcon } from "@/src/components/icons";
import { utilsProvider, SOL_EXPLORE } from "@/src/utils";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { Input } from "@hamsterbox/ui-kit";

export const TargetSelectTokenModal: FC<{
  isModalOpen: boolean;
  handleOk(
    e?: MouseEvent<HTMLElement>,
    address?: string,
    decimals?: number
  ): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
}> = (props) => {
  /** @dev Inject allowed tokens from hook to render. */
  const { availableTargetTokens } = useCreatePocketPage();

  /** @dev Inject whitelist info. */
  const { whiteLists } = useWhiteList();

  /** @dev Inject wallet account info. */
  const { chainId, platformConfig } = usePlatformConfig();

  /** @dev Search token value. */
  const [search, setSearch] = useState("");

  /** @dev Filter tokens with search. */
  const filterdList = useMemo(() => {
    if (!search) return availableTargetTokens;
    return availableTargetTokens.filter(
      (token) =>
        whiteLists[token]?.name.toLowerCase().includes(search.toLowerCase()) ||
        whiteLists[token]?.symbol
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        whiteLists[token]?.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, availableTargetTokens]);

  return (
    <Modal
      open={props.isModalOpen}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
      width={600}
      footer={null}
      className="hamster-modal"
    >
      <h2 className="mt-4 mb-2 font-bold text-white text-[24px] mobile:text-[18px] text-center absolute top-[20px]">
        Select a token
      </h2>
      <div className="py-6 pt-[70px]">
        <div className="flex flex-col justify-center">
          <Input
            containerClassName="app-input w-full"
            inputClassName="bg-dark80 !text-white !rounded-[100px] w-full"
            placeholder="Search by name, symbol"
            icon={<SearchIcon />}
            onValueChange={(v) => setSearch(v)}
          />
          <div className="flow-root mt-[30px] md:px-[10px]">
            <p className="float-left text-[14px] text-white">Token</p>
            <p className="float-right text-[14px] text-white">Address</p>
          </div>
          <div className="mt-[2px] max-h-[240px] overflow-y-scroll">
            {filterdList
              .filter((token) => whiteLists[token])
              .map((token) => (
                <div
                  className="w-full bg-[transparent] hover:bg-dark80 rounded-[8px] md:px-[22px] py-[20px] mobile:py-[10px] flow-root cursor-pointer"
                  key={`ttiterm-${token}`}
                  onClick={(e) =>
                    props.handleOk(e, token, whiteLists[token].decimals)
                  }
                >
                  <div className="flex items-center float-left">
                    <Avatar
                      className={
                        "w-[44px] h-[44px] bg-dark70 flex justify-center items-center border-solid border-[3px] border-white text-[8px]"
                      }
                      src={whiteLists[token]?.image}
                    >
                      {whiteLists[token]?.symbol}
                    </Avatar>
                    <div className="pl-[20px]">
                      <p className="text-white text-[18px] mobile:!text-[14px] normal-text uppercase">
                        {whiteLists[token]?.symbol}
                      </p>
                      <p className="text-white text-[14px] mobile:!text-[12px] normal-text">
                        {whiteLists[token]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center float-right relative top-[5px]">
                    <div className="py-[5px] px-[30px] border-solid border-[2px] border-dark70 rounded-[8px] w-[170px] mobile:w-[100px] mobile:px-[3px]">
                      <p className="text-dark50 text-[14px] mobile:text-[12px] normal-text">
                        {utilsProvider.makeShort(whiteLists[token]?.address)}
                      </p>
                    </div>
                    <a
                      href={
                        chainId === ChainId.sol
                          ? `${SOL_EXPLORE}/account/${token}`
                          : `${platformConfig?.explorerUrl}token/${whiteLists[token]?.address}`
                      }
                      target="_blank"
                      className="ml-[10px]"
                    >
                      <ShareIcon className="mobile:hidden" />
                      <ShareIcon className="md:hidden" size="14px" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
