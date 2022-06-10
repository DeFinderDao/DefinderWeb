import { Action } from "redux";
import { Response } from ".";

export interface NftPlotsHistoryState {
  nftPlotsLoading: boolean,
  nftPlots: NftPlotsHistoryItem[],
  nftGroupLoading: boolean,
  nftGroup: NftPlotsHistoryItem[],
  nftGroupUpdateTime: number | null
  e: Error | null,
}

export interface NftPlotsHistoryParams {
  addrName: string   
  groupId: string   
  symbolAddr?: string
  type: string	   
}

export interface NftPlotsHistoryItem {
  date: number
  value: number
  finalPrice: number
  symbol: string
  tokenId: string
  category: string
  time: string
}

export interface NftPlotsHistoryLoadingAction extends Action<string> {
  payload: boolean
}

export interface NftPlotsHistoryErrorAction extends Action<string> {
  payload: Error
}

export interface NftPlotsHistoryListSuccess extends Action<string> {
  payload: Response<NftPlotsHistoryItem[]>
}


export type NftPlotsHistoryActions =
  NftPlotsHistoryLoadingAction |
  NftPlotsHistoryListSuccess |
  NftPlotsHistoryErrorAction;