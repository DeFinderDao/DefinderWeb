
export interface NFTDiscoverResponse {
  updateTime?: number,
  data: {
    list: HotProjectItem[] | IncreaseProjectItem[]
  }
}

export interface NFTDiscoverBody {
  type: number,   
  isShowNew: number,   
  sortFile: string,   
  sort: number,   
  apiType: number,   
  pageNo: number,
  pageSize: number,
}

export interface HotProjectItem {
  symbol: string,   
  address: string,
  logo: string,   
  whaleLogo: string,
  turnover: string,   
  turnoverIncrease: string,   
  tradeNum: string,   
  tradeNumIncrease: string,   
  firstMintTime: string,   
  mintAddrNum: string,   
  whalesNum: string,   
  mintNum: string,   
  gas: string,   
}

export interface IncreaseProjectItem {
  symbol: string,   
  address: string,
  logo: string,   
  addressNum: string,   
  address24hNum: string,   
  address24hIncrease: string,   
  address4hNum: string,   
  address4hIncrease: string,   
  whales24hNum: string,   
  holdingNum: string,   
  holdNum: string,   
  holdNumRate: string,   
  hold24hRate: string,   
  changRange: string,   
}

