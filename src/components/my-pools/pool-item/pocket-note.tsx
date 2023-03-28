import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import classnames from "classnames";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/src/utils";

type PocketNoteProps = {
  data: PocketEntity;
};
export const PocketNote = (props: PocketNoteProps) => {
  const {
    data: { status, closedAt, endedAt },
  } = props;
  const isActive = status === PocketStatus.ACTIVE;
  const isPaused = status === PocketStatus.PAUSED;
  const isClosed = status === PocketStatus.CLOSED;
  const isEnded = status === PocketStatus.ENDED;
  const noteText = isActive
    ? "If the pool balance is not enough for a batch, the strategy will be executed using the remaining balance."
    : isPaused
    ? "Pool is paused, the next batch will not be executed."
    : isClosed
    ? `Pool is closed on ${dayjs(closedAt).format(
        DATE_TIME_FORMAT
      )}, you can withdraw your fund.`
    : isEnded && `ENDED: ${dayjs(endedAt).format(DATE_TIME_FORMAT)}`;

  return (
    <div className="mt-[24px]">
      <p className="uppercase text-[14px] md:text-[16px] text-white">NOTE:</p>
      <p
        className={classnames(
          "text-[14px] regular-text",
          isActive ? "text-white" : "text-red-500"
        )}
      >
        {noteText}
      </p>
    </div>
  );
};
