import { FC, useMemo } from "react";
import { PoolItemBuyConditionComponent } from "@/src/components/my-pools/pool-item/pool-item-buy-condition.component";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";

export const PocketStrategy: FC<{ pocket: PocketEntity }> = (props) => {
  const pocket = props.pocket;

  /** @dev Inject needed modules to get token account. */
  const { whiteLists, findEntityByAddress } = useWhiteList();

  /** @dev Get base token info. */
  const baseToken = useMemo(
    () =>
      whiteLists[pocket?.baseTokenAddress] ||
      findEntityByAddress(pocket?.baseTokenAddress),
    [pocket]
  );

  /** @dev Get target token info. */
  const targetToken = useMemo(
    () =>
      whiteLists[pocket?.targetTokenAddress] ||
      findEntityByAddress(pocket?.targetTokenAddress),
    [pocket]
  );

  return (
    <div className="flow-root">
      <p className="float-left text-dark45 normal-text text-[20px]">Strategy</p>
      <div className="text-white normal-text float-right relative top-[3px]">
        <PoolItemBuyConditionComponent
          data={pocket}
          baseToken={baseToken}
          targetToken={targetToken}
        />
      </div>
    </div>
  );
};
