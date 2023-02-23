import { call, put } from "redux-saga/effects";
import { SagaPayload } from "@/src/redux/entities";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import { poolService } from "@/src/services";
import { setActivePockets } from "@/src/redux/actions/pocket/pocket.action";
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
      ownerAddress: payload.ownerAddress,
      statuses: [PocketStatus.ACTIVE, PocketStatus.CREATED],
    });

    yield put(setActivePockets(pockets));

    callback && callback(pockets);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}