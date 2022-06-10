import { Key } from "react";
import { Action } from "redux";
import { Response } from ".";

export interface InvestmentDetailsState {
  investmentDetails: InvestmentDetailsItem,
  e: Error | null,
}

export interface InvestmentDetailsParams {
  addrName?: string,
  groupId?: string | null,
  symbolAddr: string,
  type: string | number,
}

export interface InvestmentDetailsItem {
  addressList: string[],
  addrTagList: AddrTag[],
  symbolInfo: Symbolinfo,
  holdAmount: string,
  holdAmountValue: string,
  holdCost: string,
  inAvgPrice: string,
  price: string,
  profit: string,
  profitRate: string,
  holdRank: string,
  addrName: string | null,
  groupId: string | null,
  updateTime: number,
  showTip: boolean
}
export interface AddrTag {
  addrTag: string,
  groupId: number,
  isSubAddr: boolean
}
export interface Community {
  name: string,
  url: string,
}
export interface Symbolinfo {
  symbol: string,
  symbolAddr: string,
  contract: string,
  communityList: Community[],
}

export interface InvestmentDetailsErrorAction extends Action<string> {
  payload: Error
}

export interface InvestmentDetailsListSuccess extends Action<string> {
  payload: Response<InvestmentDetailsItem>
}

export type InvestmentDetailsActions =
  InvestmentDetailsListSuccess |
  InvestmentDetailsErrorAction;
