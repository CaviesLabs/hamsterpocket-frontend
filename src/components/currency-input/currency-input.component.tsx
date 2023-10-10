import { FC, useState, useRef, useEffect } from "react";
import { Avatar, Input } from "antd";
import { DropdownIcon } from "@/src/components/icons";
import { TokenItem } from "./token-select-item.component";
import { WSOL_ADDRESS } from "@/src/utils";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";
import classNames from "classnames";
import styles from "./currency-input.module.scss";

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
  disabledInput?: boolean;

  /**
   * @dev List of allowed tokens.
   */
  allowedTokens?: string[];

  /**
   * @dev Condition to show dropdown icon.
   */
  dropdownIconDisplayed?: boolean | false;

  /**
   * @dev Force to show right prefix.
   */
  rightPrefixLabel?: string;

  /**
   * @dev Callback function for on click event.
   */
  onClick?: () => void;
};

export const CurrencyInput: FC<CurrencyInputProps> = (props) => {
  /**
   * @dev handle value
   */
  const [value, setValue] = useState<string>("");

  /**
   * @dev Inject allow currencies which have been whitelisted in Hamster server.
   */
  const { whiteLists: allowCurrencies, findEntityByAddress } = useWhiteList();

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
    <div className="relative" ref={ref} onClick={props.onClick}>
      <Input
        size="large"
        className={classNames(
          "rounded-[16px] p-3 mt-2 bg-dark100 border-none dark-input text-white placeholder-gray-500 h-[63px] mobile:!h-[45px] mobile:!text-[14px]",
          styles.myInput,
          props.inputClassName
        )}
        placeholder={
          props.currencyBadgeOnly
            ? addressSelected
              ? ""
              : props.placeholder
            : props.placeholder
        }
        prefix={
          addressSelected === "BATCH" ? null : (
            <Avatar
              className={classNames(
                "rounded-full",
                addressSelected
                  ? "w-10 h-10 mr-4 mobile:!w-[24px] mobile:!h-[24px]"
                  : "invisible"
              )}
              src={
                (
                  allowCurrencies?.[addressSelected] ||
                  findEntityByAddress(addressSelected)
                )?.image
              }
            >
              {
                (
                  allowCurrencies?.[addressSelected] ||
                  findEntityByAddress(addressSelected)
                )?.symbol
              }
            </Avatar>
          )
        }
        onChange={(e) => {
          const value = e.target.value;
          const validator = /^[+]?([.]\d+|\d+[.]?\d*)$/;
          if (value !== "" && !validator.exec(value)) return;
          if (value?.toString()?.split(".")[1]?.length > 8) return; // 8 is max decimal
          props.onAmountChange && props.onAmountChange(parseFloat(value));
          setValue(e.target.value);
        }}
        disabled={props.currencyBadgeOnly || props.disabledInput}
        value={value}
      />
      <p
        className={classNames(
          "absolute right-[20px] top-[30px] mobile:top-[20px] cursor-pointer semi-bold text-white mobile:!text-[14px]",
          props.dropdownBadgeClassname
        )}
        style={{ zIndex: 3 }}
        onClick={() => setDropdown(!dropDown)}
      >
        {props.rightPrefixLabel
          ? props.rightPrefixLabel
          : addressSelected === "BATCH"
          ? "BATCH"
          : allowCurrencies?.[addressSelected]?.symbol}
        {!props.disableDropdown && (
          <DropdownIcon className="float-right ml-[5px]" />
        )}
        {props.dropdownIconDisplayed && (
          <DropdownIcon className="float-right ml-[5px]" />
        )}
      </p>
      {!props?.disableDropdown && dropDown && (
        <div className="rounded-3xl mt-2 border absolute w-full z-10 py-[15px] bg-dark90 text-dark50 border-dark80">
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
