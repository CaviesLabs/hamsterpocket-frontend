import { HistoryEntity } from "@/src/entities/history.entity";
import dayjs from "dayjs";
import { DATE_DAY_FORMAT } from "@/src/utils";

export const groupHistoryByDate = (
  historyEntities: HistoryEntity[]
): {
  date: string;
  data: HistoryEntity[];
}[] => {
  /** @dev Defined time hashmap. */
  const timeHashMap: { [key: string]: HistoryEntity[] } = {};

  /** @dev Extracting data here. */
  historyEntities.forEach((historyEntity) => {
    const source = new Date(historyEntity.createdAt);
    const hashTime = new Date(
      `${source.getUTCFullYear()}/${source.getUTCMonth()}/${source.getUTCDay()}`
    )
      .getTime()
      .toString();

    if (!timeHashMap[hashTime]) {
      timeHashMap[hashTime] = [historyEntity];
    } else {
      timeHashMap[hashTime].push(historyEntity);
    }
  });

  /** @dev Filter and @return. */
  return Object.keys(timeHashMap)
    .map((key) => ({
      date: key,
      data: timeHashMap[key],
    }))
    .flat(1)
    .sort((a, b) => (parseInt(a.date) <= parseInt(b.date) ? 1 : -1))
    .map((item) => ({
      date: dayjs(new Date(parseInt(item.date))).format(DATE_DAY_FORMAT),
      data: item.data,
    }))
    .filter((item) => item.date !== "Invalid Date");
};
