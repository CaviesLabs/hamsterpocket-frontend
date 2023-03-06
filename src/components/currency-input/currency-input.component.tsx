import { FC, useState, useRef, useEffect } from "react";
import { Input } from "antd";
import { DropdownIcon } from "@/src/components/icons";
import { TokenItem } from "./token-select-item.component";
import { WSOL_ADDRESS } from "@/src/utils";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";
import classNames from "classnames";

export type CurrencyInputProps = {
  onAddressSelect?: (address: string, decimals?: number) => void;
  onAmountChange?: (amount: number) => void;
  placeholder?: string;
  addressSelected?: string;

  /**
   * @dev Overwrite style.
   */
  className?: string;
  inputClassName?: string;
  dropdownBadgeClassname?: string;

  /**
   * @dev This props equal True if user want show currency badge only.
   */
  currencyBadgeOnly?: boolean | false;

  /**
   * @dev Restrict disable dropdown to select token.
   */
  disableDropdown?: boolean;

  /**
   * @dev List of allowed tokens.
   */
  allowedTokens?: string[];
};

export const CurrencyInput: FC<CurrencyInputProps> = (props) => {
  /**
   * @dev Inject allow currencies which have been whitelisted in Hamster server.
   */
  const { whiteLists: allowCurrencies } = useWhiteList();

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
        // data-dropdown-toggle="dropdown"
        size="large"
        className={`rounded-[16px] p-3 mt-2 bg-dark90 border-none dark-input text-white placeholder-white h-[63px] ${props.inputClassName}`}
        placeholder={
          props.currencyBadgeOnly
            ? addressSelected
              ? ""
              : props.placeholder
            : props.placeholder
        }
        prefix={
          addressSelected === "BATCH" ? null : (
            <img
              className={classNames("w-10 h-10", {
                invisible: !addressSelected,
              })}
              src={allowCurrencies?.[addressSelected]?.image}
            />
          )
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
        {addressSelected === "BATCH"
          ? "BATCH"
          : allowCurrencies?.[addressSelected]?.symbol}
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
            {(props.allowedTokens
              ? Object.keys(allowCurrencies).filter((item) =>
                  props.allowedTokens.includes(item)
                )
              : Object.keys(allowCurrencies)
            ).map((address, key) => (
              <TokenItem
                key={`${Math.random()}-${key}`}
                name={allowCurrencies?.[address]?.name}
                iconUrl={allowCurrencies?.[address]?.image}
                address={allowCurrencies?.[address]?.address}
                decimal={allowCurrencies?.[address]?.decimals}
                balance={"0"}
                addInOwner={false}
                onClick={(address, decimals) => {
                  setDropdown(false);
                  setAddressSelected(address);
                  props.onAddressSelect &&
                    props.onAddressSelect(address, decimals);
                }}
                check={address === addressSelected}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
