import { FC, useState, useRef, useEffect } from "react";
import { DropdownIcon } from "@/src/components/icons";
import { TokenItem } from "./token-select-item.component";
import { WSOL_ADDRESS } from "@/src/utils";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";
import classNames from "classnames";
import { Avatar } from "antd";

export type CurrencyPage = {
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

export const CurrencyBage: FC<CurrencyPage> = (props) => {
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
    <div className="relative max-w-[170px]" ref={ref} onClick={props.onClick}>
      <Avatar
        className={
          "mx-auto w-[64px] h-[64px] bg-dark70 flex justify-center items-center border-solid border-[3px] border-white"
        }
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
      <div
        className="max-w-[200px] mx-auto mt-[20px] flow-root border-solid border-[2px] border-dark50 px-[10px] py-[10px] rounded-[12px] cursor-pointer"
        onClick={() => setDropdown(!dropDown)}
      >
        <p
          className={classNames(
            "cursor-pointer semi-bold text-white mobile:!text-[14px] float-left",
            props.dropdownBadgeClassname
          )}
          style={{ zIndex: 3 }}
        >
          {props.rightPrefixLabel
            ? props.rightPrefixLabel
            : addressSelected === "BATCH"
            ? "BATCH"
            : allowCurrencies?.[addressSelected]?.symbol || "Select Token"}
        </p>
        {!props.disableDropdown && (
          <DropdownIcon className="float-right ml-[5px]" />
        )}
        {props.dropdownIconDisplayed && (
          <DropdownIcon className="float-right ml-[5px]" />
        )}
      </div>
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
