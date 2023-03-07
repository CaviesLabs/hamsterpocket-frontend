import { Duration } from "luxon";
import { PocketEntity, PriceConditionType } from "@/src/entities/pocket.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";

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

  console.log("batch volum", data.batchVolume);

  const humanBuyConditionType = () => {
    const baseAmount = convertDecimalAmount(
      data.baseTokenAddress,
      data.batchVolume
    );
    const targetLeftAmount = convertDecimalAmount(
      data.targetTokenAddress,
      data.buyCondition.value[0]
    );
    const targetRightAmount =
      data.buyCondition.value[1] &&
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

  return (
    <div className="text-white text-[18px] normal-text">
      <p>
        {convertDecimalAmount(data.baseTokenAddress, data.batchVolume)}{" "}
        {baseToken?.symbol} every{" "}
        {Duration.fromObject(data.frequency).toHuman()}
      </p>
      <p className="mt-4">{humanBuyConditionType()}</p>
    </div>
  );
};
