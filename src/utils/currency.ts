export const formatCurrency = (number: string | number, fractionDigits = 3) => {
  /**
   * @dev round to 3 decimal places and remove trailing zeros
   */
  const roundedNumber = Number(number)
    .toFixed(fractionDigits)
    .replace(/\.?0+$/, "");

  /**
   * @dev split into integer and fractional parts
   */
  const parts = roundedNumber.toString().split(".");

  /**
   * @dev add commas as a thousand separators to integer part
   */
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  /**
   * @dev join integer and fractional parts with a decimal point
   */
  return parts.join(".");
};
