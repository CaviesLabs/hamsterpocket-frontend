import { FC } from "react";
import { useSelector } from "react-redux";
import State from "@/src/redux/entities/state";
import { PoolItem } from "@/src/components/my-pools/pool-item";
import { PocketEntity } from "@/src/entities/pocket.entity";

export const ActivePockets: FC = () => {
  const activePockets = useSelector((state: State) => state.activePockets);

  return (
    <section>
      {activePockets.map((_: PocketEntity) => (
        <PoolItem data={_} key={_.id} />
      ))}
    </section>
  );
};
