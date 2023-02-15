import { FC, useState, useRef } from "react";
import { Input } from "antd";
import { DropdownIcon } from "@/src/components/icons";
import { TokenItem } from "./token-select-item.component";
import { WSOL_ADDRESS } from "@/src/utils/constants";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";

const allowCurrencies = [
  {
    id: "So11111111111111111111111111111111111111112",
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    name: "Solana",
    type: "token",
    decimals: 9,
  },
  {
    id: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    image: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    name: "Bonk",
    type: "token",
    decimals: 5,
  },
  {
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    name: "USD Coin",
    type: "token",
    decimals: 6,
  },
];

export const CurrencyInput: FC = () => {
  /**
   * @dev The condition to display filter for user to select which token want to excute.
   */
  const [dropDown, setDropdown] = useState(false);

  /**
   * @dev The token address which user select.
   */
  const [addressSelected, setAddressSelected] = useState(WSOL_ADDRESS);

  /**
   * @dev reference to the button
   * close the dropdown when user click outside
   */
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    setDropdown(false);
  });

  return (
    <div className="relative">
      <Input
        data-dropdown-toggle="dropdown"
        size="large"
        className="rounded-[16px] p-3 mt-2 bg-dark90 border-none dark-input"
        placeholder="Enter SOL amount"
        prefix={
          <img
            className="w-10 h-10"
            src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
          />
        }
        type="number"
        value={0}
        onChange={(val) => console.log(val)}
      />
      <p
        className="absolute right-[20px] top-[30px] cursor-pointer semi-bold text-white"
        style={{ zIndex: 3 }}
        onClick={() => setDropdown(!dropDown)}
      >
        SOL
        <DropdownIcon className="float-right ml-[5px]" />
      </p>
      {dropDown && (
        <div
          ref={ref}
          className="rounded-3xl mt-2 border absolute w-full z-10 py-[15px] bg-dark90 text-dark50 border-dark80"
        >
          <div className="overflow-y-scroll max-h-64">
            {allowCurrencies.map((item, key) => (
              <TokenItem
                key={`${Math.random()}-${key}`}
                name={item.name}
                iconUrl={item.image}
                address={item.id}
                balance={"0"}
                addInOwner={false}
                onClick={(address) => {
                  setDropdown(false);
                  setAddressSelected(address);
                }}
                check={item.id === addressSelected}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
