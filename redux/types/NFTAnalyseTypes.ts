import { Action } from 'redux';
import { Response } from 'redux/types';
import { NFTAnalyseDetailAction } from './NFTAnalyseDetailTypes';

export interface ResponseBodyList<T> {
  endDate: string | number,
  startDate: string | number,
  totalSize: number,
  list: T;
}


export interface NFTAnalyseState {
  menuType: string,
  optionalListLoading: boolean,
  allListLoading: boolean,
  nftOptionalList: ResponseBodyList<NFTAnalyseDataList[]>,
  nftAllList: ResponseBodyList<NFTAnalyseDataList[]>,
  paginationOptionalInfo: paginationOptionalList,
  paginationAllInfo: paginationOptionalList,
  filterFilled: FilterFilledList,
  nftDetail: NFTAnalyseDetailAction | Object,
  e: Error | null,
}

export interface paginationOptionalList {
  pageNo: number,
  pageSize: number,
  sortFiled: string | undefined,
  sort: number | string | undefined,
}

export interface FilterFilledList {
  minMarketValue: number | null,
  minTradingVolume24H: number | null,
  minTradingVolume7d: number | null,
  minHoldAddressCount: number | null,
}

export interface NFTAnalyseDataList {
  id: number | null,
  symbol: string,   
  logo: string,   
  marketValue: string,   
  marketValueIncrease: string,   
  marketValueRate: number,   
  tradingVolume24H: string,   
  tradingVolumeIncrease24H: string,   
  tradingVolumeRate24H: number,   
  tradingVolume7d: string,   
  tradingVolumeIncrease7d: string,   
  tradingVolumeRate7d: number,   
  holdAddressCount: number,   
  holdAddressCountIncrease: string,   
  holdAddressCounRate: number,   
  whaleNum: string, 
  whaleNumRate: number, 
  floorPrice: string,   
  floorPriceIncrease: string,   
  floorPricRate: number,   
  isStar: boolean,   
  symbolAddress: string,   
  trendList: TrendListItem[],   
}

export interface TrendListItem {
  date: string,   
  value: string | number,   
}

export interface NFTAnalyseSimpleAction extends Action<string> {
  payload: boolean
}
export interface NFTAnalyseErrorAction extends Action<string> {
  payload: Error
}

export interface NFTAnalysePaginationInfo extends Action<string> {
  payload: {
    pageNo: number,
    pageSize: number,
    sortFiled: string | undefined,
    sort: number | string | undefined,
  },
}

export interface NFTAnalyseFilterFilled extends Action<string> {
  payload: FilterFilledList,
}

export interface NFTAnalyseMenuType extends Action<string> {
  payload: string
}

export interface NFTAnalyseDataAction extends Action<string> {
  payload: NFTAnalyseDataList
}

export interface NFTAnalyseDataListAction extends Action<string> {
  payload: Response<ResponseBodyList<NFTAnalyseDataList[]>>
}

export interface GetMarketDetailSuccessAction extends Action<string> {
  payload: NFTAnalyseDetailAction
}


export type NFTAnalyseActions = NFTAnalyseSimpleAction |
  NFTAnalyseErrorAction |
  NFTAnalysePaginationInfo |
  NFTAnalyseFilterFilled |
  NFTAnalyseMenuType |
  NFTAnalyseDataAction |
  NFTAnalyseDataListAction | GetMarketDetailSuccessAction
