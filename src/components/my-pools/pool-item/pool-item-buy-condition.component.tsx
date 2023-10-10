import { PocketEntity, PriceConditionType } from "@/src/entities/pocket.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { convertHoursToDurationsTime } from "@/src/utils";

type PoolItemBuyConditionComponentProps = {
  data: PocketEntity;
  baseToken: WhitelistEntity;
  targetToken: WhitelistEntity;
};

export const PoolItemBuyConditionComponent = (
  props: PoolItemBuyConditionComponentProps
) => {
  const { data, baseToken, targetToken } = props;
  const { convertDecimalAmount, analyzeDecimals } = useWhiteList();

  const humanBuyConditionType = () => {
    const baseAmount = convertDecimalAmount(
      data?.baseTokenAddress,
      data?.batchVolume
    );
    const targetLeftAmount = convertDecimalAmount(
      data?.targetTokenAddress,
      data?.buyCondition?.value?.[0]
    );
    const targetRightAmount =
      data?.buyCondition?.value?.[1] &&
      convertDecimalAmount(
        data?.targetTokenAddress,
        data?.buyCondition?.value[1]
      );
    const baseSymbol = baseToken?.symbol;
    const targetSymbol = targetToken?.symbol;

    switch (data?.buyCondition?.type?.toLowerCase()) {
      case PriceConditionType.GT:
        return (
          <span>
            {baseAmount} {baseSymbol} {`>`} {analyzeDecimals(targetLeftAmount)}{" "}
            {targetSymbol}
          </span>
        );
      case PriceConditionType.GTE:
        return (
          <span>
            {baseAmount} {baseSymbol} {`>=`} {analyzeDecimals(targetLeftAmount)}{" "}
            {targetSymbol}
          </span>
        );
      case PriceConditionType.LT:
        return (
          <span>
            {baseAmount} {baseSymbol} {`<`} {analyzeDecimals(targetLeftAmount)}{" "}
            {targetSymbol}
          </span>
        );
      case PriceConditionType.LTE:
        return (
          <span>
            {baseAmount} {baseSymbol} {`<=`} {analyzeDecimals(targetLeftAmount)}{" "}
            {targetSymbol}
          </span>
        );
      case PriceConditionType.EQ:
        return (
          <span>
            {baseAmount} {baseSymbol} = {analyzeDecimals(targetLeftAmount)}{" "}
            {targetSymbol}
          </span>
        );
      case PriceConditionType.BW:
        return (
          <div>
            <p>
              {baseAmount} {baseSymbol} {">="}{" "}
              {analyzeDecimals(targetLeftAmount)} {targetSymbol} and
            </p>
            <p>
              {baseAmount} {baseSymbol} {"<="}{" "}
              {analyzeDecimals(targetRightAmount)} {targetSymbol}
            </p>
          </div>
        );
      case PriceConditionType.NBW:
        return (
          <div>
            <p>
              {baseAmount} {baseSymbol} {"<="}{" "}
              {analyzeDecimals(targetLeftAmount)} {targetSymbol} or
            </p>
            <p>
              {baseAmount} {baseSymbol} {">="}{" "}
              {analyzeDecimals(targetRightAmount)} {targetSymbol}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRenderFrequency = () => {
    let convertedHours = data?.frequency?.hours;
    if (data?.frequency?.seconds) {
      convertedHours = (data?.frequency?.seconds || 0) / 3600;
    }

    const res = convertHoursToDurationsTime(convertedHours);
    if (res.hours) {
      if (res.hours === 1) {
        return "hourly";
      } else {
        return `every ${res.hours} hours`;
      }
    } else if (res.days) {
      if (res.days === 1) {
        return "daily";
      } else {
        return `every ${res.days} days`;
      }
    } else if (res.weeks) {
      if (res.weeks === 1) {
        return "weekly";
      } else {
        return `every ${res.weeks} weeks`;
      }
    } else if (res.months) {
      if (res.months === 1) {
        return "monthly";
      } else {
        return `every ${res.months} months`;
      }
    } else if (res.years) {
      if (res.years === 1) {
        return "yearly";
      } else {
        return `every ${res.years} years`;
      }
    }
  };

  return (
    <div className="text-white normal-text text-center mobile:text-[14px]">
      <div>
        {analyzeDecimals(
          convertDecimalAmount(data?.baseTokenAddress, data?.batchVolume)
        )}
        {baseToken?.symbol} {handleRenderFrequency()}
      </div>
      {data?.buyCondition && (
        <div className="mt-[5px] text-[12px] text-dark50">
          {humanBuyConditionType()}
        </div>
      )}
    </div>
  );
};
