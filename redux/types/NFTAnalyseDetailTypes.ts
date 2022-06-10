export interface NFTAnalyseDetailAction {
    symbol: string,   
    marketRanking: number,
    tradingVolumeRanking: number,
    holdAddressRanking: number,
    id?: number,
    symbolAddress: string,   
    logo: string,   
    nftNum: string,
    onLine: string,   
    chainUrl: string,   
    marketValueEth: string,   
    marketValueDollar: string,   
    marketValueIncrease: string,   
    tradingVolumeEth24H: string,   
    tradingVolumeDollar24H: string,   
    tradingVolumeIncrease24H: string,   
    holdAddressCount: number,   
    whaleHoldAddressCount: number,   
    whaleLogo: string,    
    holdAddressCountIncrease: string,   
    floorPriceEth: string,   
    floorPriceDollar: string,   
    floorPriceIncrease: string,   
    isStar: boolean,
    communityList: CommunityListProps[]
}

interface CommunityListProps {
    name: string,
    communityName: string,
    url: string
}