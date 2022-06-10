import { Action } from "redux";
import { Response } from ".";

export interface NftSwapHistoryState {
  nftSwapLoading: boolean,
  nftSwapNoMore: boolean,
  nftSwap: NftSwapHistoryItem[],
  nftSwapTotalSize: number,
  e: Error | null,
}

export interface ResponseNftSwapHistory {
  endDate: string | number,
  startDate: string | number,
  totalSize: number,
  list: NftSwapHistoryItem[];
}

export interface NftSwapHistoryParams {
  type: number   
  startTime: number | null
  endTime: number | null
  addressList?: string[]
  symbolAddrList?: string[]   
  pageNo?: number
  pageSize?: number
}

export interface NftSwapHistoryItem {
  type: number	   
  date: string
  txHashUrl: string
  txHash: string
  symbol: string   
  tokenId: string   
  price: string   
  gas: string   
  contractAddress: string   
  logo: string   
  unit: string,
  isContract: boolean,
  uniqueKey: string,
  symbolAddr: string,
}

export interface NftSwapHistoryLoadingAction extends Action<string> {
  payload: Boolean
}

export interface NftSwapHistoryErrorAction extends Action<string> {
  payload: Error
}

export interface NftSwapHistoryListSuccess extends Action<string> {
  payload: Response<ResponseNftSwapHistory>
}


export type NftSwapHistoryActions =
  NftSwapHistoryLoadingAction |
  NftSwapHistoryListSuccess |
  NftSwapHistoryErrorAction;