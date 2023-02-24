import { FC, useState, useRef, useEffect } from "react";
import { Input } from "antd";
import { DropdownIcon } from "@/src/components/icons";
import { TokenItem } from "./token-select-item.component";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";
import classNames from "classnames";
import { WSOL_ADDRESS } from "@/src/utils";

const allowCurrencies = [
  {
    id: "So11111111111111111111111111111111111111112",
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    name: "Solana",
    type: "token",
    decimals: 9,
    symbol: "SOL",
  },
  {
    id: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    image: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    name: "Bonk",
    type: "token",
    decimals: 5,
    symbol: "BONK",
  },
  {
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    name: "USD Coin",
    type: "token",
    decimals: 6,
    symbol: "USDC",
  },
];

export type CurrencyInputProps = {
  onAddressSelect?: (address: string) => void;
  onAmountChange?: (amount: number) => void;
  placeholder?: string;
  addressSelected?: string;

  /**
   * @dev Overwrite style.
   */
  className?: string;
  dropdownBadgeClassname?: string;

  /**
   * @dev This props equal True if user want show currency badge only.
   */
  currencyBadgeOnly?: boolean | false;

  /**
   * @dev Restrict disable dropdown to select token.
   */
  disableDropdown?: boolean;
};

export const CurrencyInput: FC<CurrencyInputProps> = (props) => {
  /**
   * @dev The condition to display filter for user to select which token want to excute.
   */
  const [dropDown, setDropdown] = useState(false);

  /**
   * @dev The token address which user select.
   */
  const [addressSelected, setAddressSelected] = useState(
    !props.currencyBadgeOnly ? WSOL_ADDRESS : ""
  );

  /**
   * @dev reference to the button
   * close the dropdown when user click outside
   */
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    setDropdown(false);
  });

  useEffect(
    () => props.addressSelected && setAddressSelected(props.addressSelected),
    [props.addressSelected]
  );

  return (
    <div className="relative">
      <Input
        data-dropdown-toggle="dropdown"
        size="large"
        className={classNames(
          "rounded-[16px] p-3 mt-2 bg-dark90 border-none dark-input text-white placeholder-white",
          props.className
        )}
        placeholder={
          props.currencyBadgeOnly
            ? addressSelected
              ? ""
              : props.placeholder
            : props.placeholder
        }
        prefix={
          <img
            className={classNames("w-10 h-10", {
              invisible: !addressSelected,
            })}
            src={
              allowCurrencies.find((item) => item.id === addressSelected)?.image
            }
          />
        }
        type="number"
        onChange={(val) => {
          props.onAmountChange &&
            props.onAmountChange(parseFloat(val.target.value));
        }}
        disabled={props.currencyBadgeOnly}
      />
      <p
        className={classNames(
          "absolute right-[20px] top-[30px] cursor-pointer semi-bold text-white",
          props.dropdownBadgeClassname
        )}
        style={{ zIndex: 3 }}
        onClick={() => setDropdown(!dropDown)}
      >
        {allowCurrencies.find((item) => item.id === addressSelected)?.symbol}
        {!props.disableDropdown && (
          <DropdownIcon className="float-right ml-[5px]" />
        )}
      </p>
      {!props?.disableDropdown && dropDown && (
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
                  props.onAddressSelect && props.onAddressSelect(address);
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
