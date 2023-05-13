import { ReactNode } from "react";

/**
 * @dev Option for filter.
 */
export type OptionProps = {
  value: string;
  label?: string;
  image?: string;
  description?: string;
};

/**
 * @dev Expose interface of props for select component.
 */
export type SelectProps = {
  options: OptionProps[];
  className?: string;
  placeholder?: ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  mode?: "multiple";
  values?: string[];
  showLabelOnly?: boolean;
  onChange?: (v: any) => void;
  onSearch?: (v: any) => void;
};

/**
 * @dev Expose interface of props for dropdown component.
 */
export type DropdownSelectProps = {
  handleSelectValue(value: string): void;
  format?: (value: string) => string;
  className?: string;
  value?: string;
  options: string[] | OptionProps[];

  /**
   * @dev Auto update value in component scope without ganting value outside.
   */
  autoValue?: boolean;
};
