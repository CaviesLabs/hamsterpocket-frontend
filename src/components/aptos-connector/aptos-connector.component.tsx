import { FC, MouseEvent, useMemo } from "react";
import { Modal } from "antd";
import {
  MartianWalletName,
  PontemWalletName,
  FewchaWalletName,
  NightlyWalletName,
  MSafeWalletName,
  WalletName,
} from "@pontem/aptos-wallet-adapter";
import { useWallet } from "@pontem/aptos-wallet-adapter";

export interface IAptosWallet {
  image: string;
  name: WalletName;
  label: string;
}

export const AptosConnector: FC<{
  isModalOpen: boolean;
  handleOk(e?: MouseEvent<HTMLElement>): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
}> = (props) => {
  /** @dev Inject aptos wallet context. */
  const { connect } = useWallet();

  const aptosWallets = useMemo<IAptosWallet[]>(
    () => [
      {
        name: MartianWalletName,
        label: "Martian",
        image: "/assets/images/aptos-connectors/aptos-wallet-martian.svg",
      },
      {
        name: PontemWalletName,
        label: "Pontem",
        image: "/assets/images/aptos-connectors/aptos-wallet-pontem.svg",
      },
      {
        name: FewchaWalletName,
        label: "Fewcha",
        image: "/assets/images/aptos-connectors/aptos-wallet-fewcha.svg",
      },
      {
        name: NightlyWalletName,
        label: "Nightly",
        image: "/assets/images/aptos-connectors/aptos-wallet-nightly.svg",
      },
      {
        name: MSafeWalletName,
        label: "MSafe",
        image: "/assets/images/aptos-connectors/aptos-wallet-msafe.svg",
      },
    ],
    []
  );

  return (
    <Modal
      open={props.isModalOpen}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
      width={400}
      footer={null}
      className="hamster-modal wallet-modal"
    >
      <p className="text-white text-[20px] semi-bold">Connect Wallet</p>
      <div className="wallet-s mt-[20px]">
        {aptosWallets.map((wallet, index) => {
          return (
            <div
              className="wallet flex py-[10px] items-center cursor-pointer hover:bg-dark90 px-[10px] rounded-[20px]"
              key={`wlt-${index}`}
              onClick={() => {
                connect(wallet.name);
                props.handleOk();
              }}
            >
              <img
                src={wallet.image}
                alt="Wallet logo"
                className="float-left h-[40px] w-[40px] rounded-[100%]"
              />
              <p className="float-left text-[16px] text-white normal-text ml-[10px]">
                {wallet.label}
              </p>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
