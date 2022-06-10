import { Action } from "redux";
import { Response } from ".";

export interface NftDetailsState {
  nftDetails: NftDetailsItem,
  e: Error | null,
}

export interface NftDetailsItem {
  addressList: string[]   
  addrTagList: NftAddrTagListItem[]   
  symbolInfo: NftSymbolinfoItem   
  holdAmount: number   
  holdRank: string   
  totalBuyAmount: string   
  sellAmount: string   
  holdCost: string   
  holdAmountValue: string   
  profit: string   
  profitRate: string   
  chainUrl: string   
  updateTime: number,   
  addrName?: string,
  groupId?: string,
  showTip?: boolean
}

export interface NftAddrTagListItem {
  addrTag: string,   
  groupId: number,
  isSubAddr: boolean,   
}
export interface NftSymbolinfoItem {
  symbol: string,   
  symbolAddr: string,   
  symbolLogo: string,   
  contract: string,   
  communityList: NftCommunityListItem[],
}
export interface NftCommunityListItem {
  name: string,   
  url: string,
}

export interface NftDetailsErrorAction extends Action<string> {
  payload: Error
}

export interface NftDetailsListSuccess extends Action<string> {
  payload: Response<NftDetailsItem>
}


export type NftDetailsActions =
  NftDetailsListSuccess |
  NftDetailsErrorAction;