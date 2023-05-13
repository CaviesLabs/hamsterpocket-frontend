import { FC } from "react";
import { SelectProps, OptionProps } from "@/src/components/select/types";
import classnames from "classnames";
import { CheckIcon, FilterIcon } from "@/src/components/icons";
import SearchInput from "@/src/components/search";
import { useEffect, useRef, useState } from "react";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";
import useDebounce from "@/src/hooks/useDebounce";

export const FilterSelect: FC<SelectProps> = (props) => {
  /**
   * @dev reference to the button
   * close the dropdown when user click outside
   */
  const ref = useRef(null);

  const [search, setSearch] = useState<string>("");

  const { showSearch, values = [], onChange, onSearch, mode } = props;
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const renderItemInfo = (option: OptionProps, inList?: boolean) => {
    if (!option) return;
    const { image } = option;
    return (
      <>
        <div
          className={classnames(
            image && "w-1/6 mr-3",
            inList ? "max-w-[36px]" : "max-w-[48px]"
          )}
        >
          <img className="rounded-[50%] aspect-square" src={option.image} />
        </div>
        <div className="w-full h-18 flex flex-col justify-between">
          <p className="text-[12px] md:text-[14px] regular-text">
            {option.label || option.value}
          </p>
          <p className="text-[12px] text-gray-400">{option.description}</p>
        </div>
      </>
    );
  };

  useOnClickOutside(ref, () => {
    setIsOpenDropdown(false);
  });

  const debouncedSearch: string = useDebounce<string>(search, 500);
  // Only call effect if debounced search term changes
  useEffect(() => {
    onSearch && onSearch(search);
  }, [debouncedSearch]);

  /**
   * @description
   * validate if dropdown closed, clear search text
   */
  useEffect(() => {
    if (!isOpenDropdown) setSearch("");
  }, [isOpenDropdown]);

  const handleSelect = (v: string) => {
    setIsOpenDropdown(false);

    if (!onChange) return;
    const newValues = [...values];
    if (mode === "multiple") {
      if (values.indexOf(v) > -1) {
        onChange(newValues.filter((_) => _ !== v));
      } else {
        newValues.push(v);
        onChange(newValues);
      }
    } else {
      onChange([v]);
    }
  };

  return (
    <div className="relative">
      <div
        className={classnames(
          props.className,
          "py-[3px] md:py-[10px] px-3 text-[14px] regular-text rounded-3xl cursor-pointer flex justify-between items-center bg-dark90 text-dark50"
        )}
        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
      >
        <div className="flex items-center mx-auto md:w-[160px]">
          {mode === "multiple" || !values || !values[0]
            ? props.placeholder
            : renderItemInfo(
                props.options.find((_) => _.value === values[0]),
                true
              )}
          <FilterIcon className="relative ml-[5px]" />
        </div>
      </div>
      {isOpenDropdown && (
        <div
          ref={ref}
          className="rounded-3xl mt-2 border absolute w-full z-10 py-[20px] bg-dark90 text-dark50 border-dark80"
          style={{
            boxShadow: "0px 25px 40px -10px rgba(28, 39, 49, 0.08)",
          }}
        >
          {showSearch && (
            <div className="p-4">
              <SearchInput
                className="rounded-3xl p-3"
                placeholder={props.searchPlaceholder}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          <div className="overflow-y-scroll max-h-64">
            {props.options.map((option, i) => (
              <div
                className="cursor-pointer hover:bg-dark90 px-6"
                key={`${option.value}${i}`}
                onClick={() => handleSelect(option.value)}
              >
                <div className="flex items-center border-b py-4 border-dark50 hover:text-purple">
                  {renderItemInfo(option)}
                  {values?.indexOf(option.value) > -1 && (
                    <CheckIcon color="#735CF7" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
