import { PocketStatus } from "@/src/entities/pocket.entity";
import classnames from "classnames";

type PocketNoteProps = {
  status: PocketStatus;
};
export const PocketNote = (props: PocketNoteProps) => {
  const { status } = props;
  const isActive = status === PocketStatus.ACTIVE;
  const isPaused = status === PocketStatus.PAUSED;
  const isClosed = status === PocketStatus.CLOSED;
  const isEnded = status === PocketStatus.ENDED;
  const noteText = isActive
    ? "If Pool balance is not enough on each batch, the pool will just buy the SOL balance left"
    : isPaused
    ? "Pool is paused, the next batch will not be executed."
    : isClosed
    ? "Pool is closed on dd/mm/yyyy, you can withdraw your fund."
    : isEnded && "ENDED: dd/mm/yyyy";

  return (
    <div className="mt-[24px]">
      <p className="uppercase text-[16px] text-white">NOTE:</p>
      <p
        className={classnames(
          "text-[16px] regular-text",
          isActive ? "text-white" : "text-red-500"
        )}
      >
        {noteText}
      </p>
    </div>
  );
};
