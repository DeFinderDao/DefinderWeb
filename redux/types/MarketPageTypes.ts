import { Action } from 'redux';
import { Response } from 'redux/types';
import { MarketPageDetailAction } from './MarketPageDetailTypes';

export interface ResponseBodyList<T> {
  endDate: string | number,
  startDate: string | number,
  totalSize: number,
  list: T;
}


export interface MarketPageState {
  optionalListLoading: boolean,
  allListLoading: boolean,
  marketOptionalList: ResponseBodyList<MarketPageDataList[]>,
  marketAllList: ResponseBodyList<MarketPageDataList[]>,
  paginationOptionalInfo: paginationOptionalList,
  paginationAllInfo: paginationOptionalList,
  filterFilled: FilterFilledList,
  menuType: string,
  marketDetail: MarketPageDetailAction,
  e: Error | null,
}

export interface paginationOptionalList {
  pageNo: number,
  pageSize: number,
  sortFiled: string | undefined,
  sort: number | string | undefined,
}

export interface FilterFilledList {
  startTime: number | null,
  endTime: number | null,
  minSymbolTurnover: number | null,
  minHoldCount: number | null,
  minNetBuyCount: number | null,
  minAddHoldCount: number | null,
  minLpValue: number | null,
}

export interface MarketPageDataList {
  contract: string,
  exchange: string,
  id: number,
  isStar: boolean
  logo: string,
  lpVolume: number,
  pair: string,
  price: string,
  priceIncrease: string,
  symbol: string,
  symbol1Addr: null | string,
  symbolAddr: string,
  symbolName: null | string,
  symbolVolume: number,
  trendPic: string,
  symbolTurnover: number,
  holdAddressCount: number,
  netBuyCount: number,
  holdIncreaseCount: number,
  onlineTime: number,
  symbolTurnoverIncrease: number,
  holdAddressCountIncrease: number,
  netBuyCountIncrease: number,
  holdCountIncrease: number,
  trendList: TrendListItem[],   
}

export interface TrendListItem {
  date: string,   
  value: string | number,   
}

export interface MarketPageSimpleAction extends Action<string> {
  payload: boolean
}
export interface MarketPageErrorAction extends Action<string> {
  payload: Error
}

export interface MarketPagePaginationInfo extends Action<string> {
  payload: {
    pageNo: number,
    pageSize: number,
    sortFiled: string | undefined,
    sort: number | string | undefined,
  },
}

export interface MarketPageFilterFilled extends Action<string> {
  payload: FilterFilledList,
}

export interface MarketPageMenuType extends Action<string> {
  payload: string
}

export interface MarketPageDataAction extends Action<string> {
  payload: MarketPageDataList
}

export interface MarketPageDataListAction extends Action<string> {
  payload: Response<ResponseBodyList<MarketPageDataList[]>>
}

export interface GetMarketDetailSuccessAction extends Action<string> {
  payload: MarketPageDetailAction
}


export type MarketPageActions = MarketPageSimpleAction |
  MarketPageErrorAction |
  MarketPagePaginationInfo |
  MarketPageFilterFilled |
  MarketPageMenuType |
  MarketPageDataAction |
  MarketPageDataListAction | GetMarketDetailSuccessAction
