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
  const { convertDecimalAmount } = useWhiteList();

  const humanBuyConditionType = () => {
    const baseAmount = convertDecimalAmount(
      data.baseTokenAddress,
      data.batchVolume
    );
    const targetLeftAmount = convertDecimalAmount(
      data.targetTokenAddress,
      data.buyCondition?.value?.[0]
    );
    const targetRightAmount =
      data.buyCondition?.value?.[1] &&
      convertDecimalAmount(data.targetTokenAddress, data.buyCondition.value[1]);
    const baseSymbol = baseToken?.symbol;
    const targetSymbol = targetToken?.symbol;

    switch (data?.buyCondition?.type?.toLowerCase()) {
      case PriceConditionType.GT:
        return `${baseAmount} ${baseSymbol} > ${targetLeftAmount} ${targetSymbol}`;
      case PriceConditionType.GTE:
        return `${baseAmount} ${baseSymbol} >= ${targetLeftAmount} ${targetSymbol}`;
      case PriceConditionType.LT:
        return `${baseAmount} ${baseSymbol} < ${targetLeftAmount} ${targetSymbol}`;
      case PriceConditionType.LTE:
        return `${baseAmount} ${baseSymbol} <= ${targetLeftAmount} ${targetSymbol}`;
      case PriceConditionType.EQ:
        return `${baseAmount} ${baseSymbol} = ${targetLeftAmount} ${targetSymbol}`;
      case PriceConditionType.BW:
        return (
          <div>
            <p>
              {baseAmount} {baseSymbol} {">="} {targetLeftAmount} {targetSymbol}{" "}
              and
            </p>
            <p>
              {baseAmount} {baseSymbol} {"<="} {targetRightAmount}{" "}
              {targetSymbol}
            </p>
          </div>
        );
      case PriceConditionType.NBW:
        return (
          <div>
            <p>
              {baseAmount} {baseSymbol} {"<="} {targetLeftAmount} {targetSymbol}{" "}
              or
            </p>
            <p>
              {baseAmount} {baseSymbol} {">="} {targetRightAmount}{" "}
              {targetSymbol}
            </p>
          </div>
        );
      default:
        return "";
    }
  };

  const handleRenderFrequency = () => {
    const res = convertHoursToDurationsTime(data?.frequency?.hours);
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
    <div className="text-white text-[14px] md:text-[18px] normal-text">
      <p>
        {convertDecimalAmount(data.baseTokenAddress, data.batchVolume)}{" "}
        {baseToken?.symbol} {handleRenderFrequency()}
      </p>
      <p className="mt-4">{humanBuyConditionType()}</p>
    </div>
  );
};
