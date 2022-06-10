export interface MarketPageDetailAction {
    chainUrl?: string,
    logo: string,
    symbol: string,
    symbolFullName: string,
    symbolName: string,
    symbolAddr: string,
    symbol1Addr: string,
    pair: string,
    exchange: string,
    contract: string,
    lpVolume: number | null,
    id: null,
    price: string,
    priceIncrease: string,
    lpBaseSymbolVolume: number,
    lpPriceSymbolVolume: number,
    lpBaseSymbol: string,
    lpPriceSymbol: string,
    volume24h: number,
    volume24hIncrease: string,
    tradeCount: number,
    tradeCountIncrease: string,
    lpValue: number,
    onlineTime: number,
    isStar: boolean,
    symbolTurnover: number,
    holdAddressCount: number
    communityList: CommunityListProps[],
    marketValue: string,
    circulation: string,
    supply: string,
    isHoneypot: boolean | null
}

interface CommunityListProps {
    name: string,
    communityName: string,
    url: string
}