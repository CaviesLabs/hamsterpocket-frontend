import { FC, useState, useRef, useEffect } from "react";
import { Avatar, Input } from "antd";
import { DropdownIcon } from "@/src/components/icons";
import { WSOL_ADDRESS } from "@/src/utils";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import type { CurrencyInputProps } from "./currency-input.component";
import { splService } from "@/src/services/spl.service";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";
import { useWallet } from "@/src/hooks/useWallet";
import classNames from "classnames";
import styles from "./currency-input.module.scss";
import { useConnectedWallet } from "@saberhq/use-solana";

export const CurrencyInputBadge: FC<CurrencyInputProps> = (props) => {
  /**
   * @dev handle value
   */
  const [value, setValue] = useState<string>("");
  const { solBalance } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const wallet = useConnectedWallet();

  /**
   * @dev Inject allow currencies which have been whitelisted in Hamster server.
   */
  const { whiteLists: allowCurrencies, analyzeDecimals } = useWhiteList();

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

  useEffect(() => {
    (async () => {
      if (!props.addressSelected) return;
      if (props.addressSelected === WSOL_ADDRESS) {
        return setTokenBalance(solBalance / Math.pow(10, 9));
      }

      /** @dev Get balance of token. */
      const balance = await splService.getBalance(
        wallet?.publicKey?.toString(),
        props.addressSelected
      );
      setTokenBalance(balance);
    })();
  }, [props.addressSelected, solBalance]);

  return (
    <div className="relative" ref={ref} onClick={props.onClick}>
      <Input
        size="large"
        className={classNames(
          "rounded-[16px] p-3 mt-2 bg-dark90 border-none dark-input text-white placeholder-gray-500 h-[63px] mobile:!h-[66px] mobile:!text-[14px]",
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
            <div className="flex items-center relative">
              <Avatar
                className={classNames(
                  "rounded-full",
                  addressSelected
                    ? "w-10 h-10 mr-4 mobile:!w-[30px] mobile:!h-[30px]"
                    : "invisible"
                )}
                src={allowCurrencies?.[addressSelected]?.image}
              >
                {allowCurrencies?.[addressSelected]?.symbol}
              </Avatar>
              <p
                className={classNames(
                  "cursor-pointer semi-bold text-white mobile:!text-[14px]",
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
                {props.dropdownIconDisplayed && (
                  <DropdownIcon className="float-right ml-[5px]" />
                )}
              </p>
            </div>
          )
        }
        onChange={(e) => {
          const value = e.target.value;
          const validator = /^[+]?([.]\d+|\d+[.]?\d*)$/;
          if (value !== "" && !validator.exec(value)) return;
          props.onAmountChange && props.onAmountChange(parseFloat(value));
          setValue(e.target.value);
        }}
        disabled={props.currencyBadgeOnly || props.disabledInput}
        value={value}
      />
      <div
        className="absolute top-0 right-[20px] h-full items-center flex"
        style={{ zIndex: 2 }}
      >
        <p className="text-dark50 mobile:text-[12px] normal-text">
          Balance: {analyzeDecimals(tokenBalance)}
        </p>
      </div>
    </div>
  );
};
