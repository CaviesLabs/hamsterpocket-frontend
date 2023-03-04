import { FC } from "react";
import { useSelector } from "react-redux";
import State from "@/src/redux/entities/state";
import { PoolItem } from "@/src/components/my-pools/pool-item";
import { PocketEntity } from "@/src/entities/pocket.entity";

export const ClosedPockets: FC = () => {
  const closedPockets = useSelector((state: State) => state.closedPockets);

  return (
    <section>
      {closedPockets.map((_: PocketEntity) => (
        <PoolItem data={_} key={_.id} />
      ))}
    </section>
  );
};
