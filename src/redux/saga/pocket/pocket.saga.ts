import { call, put } from "redux-saga/effects";
import { SagaPayload } from "@/src/redux/entities";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import { poolService } from "@/src/services";
import {
  setActivePockets,
  setClosedPockets,
} from "@/src/redux/actions/pocket/pocket.action";
import { portfolioService } from "@/src/services/portfolio.service";
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
      statuses: [PocketStatus.ACTIVE],
      ...payload,
    });

    yield put(
      setActivePockets(pockets.map((item) => ({ ...item, id: item?._id })))
    );
    callback && callback(pockets);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}

/**
 * @param callback
 * @description
 * Fetch pocket data by id.
 */
export function* getPocketById({
  payload,
  callback,
}: SagaPayload<{ pocketId: string }, PocketEntity[]>) {
  try {
    const pocket: PocketEntity[] = yield call(
      poolService.getPocketById,
      payload
    );

    callback && callback(pocket);
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

    yield put(
      setClosedPockets(pockets.map((item) => ({ ...item, id: item?._id })))
    );
    callback && callback(pockets);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}

/**
 * @param callback
 * @description
 * Sync all pocckets owned by a wallet.
 */
export function* syncWalletPockets({
  payload,
  callback,
}: SagaPayload<
  { walletAddress: string; evm?: boolean; aptos?: boolean; chainId?: string },
  boolean
>) {
  try {
    yield call(
      poolService.syncWalletPockets,
      payload.walletAddress,
      payload.evm,
      payload.aptos,
      payload.chainId
    );
    yield call(portfolioService.syncWalletPortfolio, payload.walletAddress);
    callback && callback(true);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}
