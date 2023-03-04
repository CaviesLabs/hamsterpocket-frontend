import { call, put } from "redux-saga/effects";
import { SagaPayload } from "@/src/redux/entities";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import { poolService } from "@/src/services";
import {
  setActivePockets,
  setClosedPockets,
} from "@/src/redux/actions/pocket/pocket.action";
import { GetPocketsDto } from "@/src/dto/pocket.dto";

/**
 * @param callback
 * @description
 * Fetch active pockets data
 */
export function* getActivePockets({
  payload,
  callback,
}: SagaPayload<GetPocketsDto, PocketEntity[]>) {
  try {
    const pockets: PocketEntity[] = yield call(poolService.getPockets, {
      statuses: [PocketStatus.ACTIVE, PocketStatus.CREATED],
      ...payload,
    });

    yield put(setActivePockets(pockets));
    callback && callback(pockets);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}

/**
 * @param callback
 * @description
 * Fetch closed pockets data
 */
export function* getClosedPockets({
  payload,
  callback,
}: SagaPayload<GetPocketsDto, PocketEntity[]>) {
  try {
    const pockets: PocketEntity[] = yield call(poolService.getPockets, {
      statuses: [PocketStatus.ENDED, PocketStatus.CLOSED],
      ...payload,
    });

    yield put(setClosedPockets(pockets));
    callback && callback(pockets);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}
