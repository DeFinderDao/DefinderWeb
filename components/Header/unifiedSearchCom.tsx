import React, { useState } from 'react'
import 'styles/unified-search.less'
import { Spin, message, Empty, AutoComplete, Input } from 'antd'
import { RefSelectProps } from 'antd/lib/select'
import { SearchOutlined, DownOutlined, UpOutlined,WarningFilled } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import ApiClient from 'utils/ApiClient'
import { CODE_SUCCESS } from 'utils/ApiServerError'
import Global from 'utils/Global'
import { useRouter } from 'next/router'
import { trackAction, UNIFIED_SEARCH } from 'utils/analyse/YMAnalyse'
import { OptionGroupData } from 'rc-select/lib/interface'
import DefinEmpty from './definEmpty'
import { TokenLogo } from 'components/TokenLogo'

interface UnifiedSearchComProps {
    placeholder: string;
    onSearch?: () => void;
}

interface Market {
    contract: string;
    exchange: string;
    logo: string;
    pair: string;
    symbol: string;
    symbol1Addr: string;
    symbolAddr: string;
    symbolName: string;
    lpVolume: string;
    price: string;
    priceIncrease: string;
    symbolVolume: number;
    isHoneypot: boolean | null
}

interface Project {
    logo: string;
    name: string;
}

interface Nft {
    logo: string,
    symbol: string,
    exchange: string,
    symbolAddr: string,
    nftNum: number,
    holdNum: number,
    symbolVolume: number
}

interface SearchResult {
    project: Project[] | null;
    market: Market[] | null;
    address: SearchResultItem[] | null,
    assets: SearchResultItem[] | null,
    nftMarket: Nft[] | null,
}
interface SearchResultItem {
    address: string,
    groupId: number | null
}

export default function unifiedSearchCom({ placeholder, onSearch }: UnifiedSearchComProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const [inputAddr, setInputAddr] = useState<string>('')
    //const [seeFlag, setSeeFlag] = useState<boolean>(false)
    const router = useRouter()

    const selectRef: React.RefObject<RefSelectProps> | null = React.useRef(null)
    const [data, setData] = useState<SearchResult>({
        project: null,
        market: null,
        address: null,
        assets: null,
        nftMarket: null,
    })
    const [loading, setLoading] = useState(false)
    const apiClient = new ApiClient<SearchResult>()
    let timeout
    const [timer, setTimer] = useState<number | null>(null)
    const getSearchData = (value: string, callback: (data: SearchResult) => void) => {
        if (timer) {
            clearTimeout(timer)
            timeout = null
            setTimer(null)
        }
        const getData = async () => {
            if (value) {
                try {
                    const data = await apiClient.get(`/search/all?keyword=${value}`)
                    if (data.code === CODE_SUCCESS) {
                        callback(data.data)
                    } else {
                        setData({
                            project: null,
                            market: null,
                            address: null,
                            assets: null,
                            nftMarket: null,
                        })
                        setLoading(false)
                        message.error(data.message)
                    }
                } catch (e) {
                    setData({
                        project: null,
                        market: null,
                        address: null,
                        assets: null,
                        nftMarket: null,
                    })
                    setLoading(false)
                    message.error((e as unknown as Error).message)
                }
            } else {
                setLoading(false)
                setProjectMore(false)
                setMarketMore(false)
                setAddressMore(false)
                setAssetsMore(false)
                setData({
                    project: null,
                    market: null,
                    address: null,
                    assets: null,
                    nftMarket: null,
                })
            }
        }
        timeout = window.setTimeout(getData, 800)
        setTimer(timeout)
    }

    const onSelect = (value: string) => {
        setProjectMore(false)
        setMarketMore(false)
        setAddressMore(false)
        setAssetsMore(false)
        setData({
            project: null,
            market: null,
            address: null,
            assets: null,
            nftMarket: null,
        })
    };
    const handleSearch = (value: string) => {
        setProjectMore(false)
        setMarketMore(false)
        setAddressMore(false)
        setAssetsMore(false)
        setInputAddr(value)
        setLoading(true)
        getSearchData(value, (data: SearchResult) => {
            setData(data)
            setLoading(false)
        })
    }

    const [projectMore, setProjectMore] = useState(false)
    const [marketMore, setMarketMore] = useState(false)
    const [addressMore, setAddressMore] = useState(false)
    const [assetsMore, setAssetsMore] = useState(false)
    const [nftMore, setNftMore] = useState(false);
    const optionsItem: OptionGroupData[] = []

    const searchTitle = (title: string, length: number, type: string, pMore: boolean, mMore: boolean, adMore: boolean, asMore: boolean, nftMore: boolean, more: boolean) => {
        return (<div
            className="unified-search-grid unified-search-box-padding"
            key={type}
        >
            <span className="unified-search-label">
                {title}
            </span>
            {length > 3 ? (
                <span
                    className="unified-search-action"
                    onClick={() => {
                        setProjectMore(pMore)
                        setMarketMore(mMore)
                        setAddressMore(adMore)
                        setAssetsMore(asMore)
                        setNftMore(nftMore)
                    }}
                >
                    {more ? (
                        <span>
                            {f('unifiedSearchClose')}
                            <UpOutlined />
                        </span>
                    ) : (
                        <span>
                            {f('unifiedSearchOpen')}
                            <DownOutlined />
                        </span>
                    )}
                </span>
            ) : null}
        </div>)
    }
    // 
    if (data.market && data.market.length > 0) {
        const marketArr: { value: string; label: JSX.Element }[] = []
        data.market.forEach((item, index) => {
            if (index < 3 || marketMore) {
                marketArr.push(
                    {
                        value: 'marketItem' + index,
                        label: (<div
                            className={`unified-search-content unified-search-table-body${index % 2} unified-search-box-padding`}
                            style={{
                                display: index > 2 && !marketMore ? 'none' : 'flex',
                            }}
                            key={'marketItem' + index}
                            onClick={(e) => {
                                searchItemClick('market', item, e)
                            }}
                        >
                            <span className="contect-text" style={{ flex: 3 }}>
                                <TokenLogo
                                    className="contect-logo"
                                    src={item.logo}
                                    alt=''
                                />
                                {item.symbol}
                            </span>
                            <span className="contect-text" style={{ flex: 4 }}>
                                {`$${item.price}`} &nbsp;
                                {Global.formatIncreaseNumber(item.priceIncrease)}
                            </span>
                            <span
                                className="contect-text"
                                style={{ flex: 3, textAlign: 'right' }}
                            >
                                $&nbsp;{Global.formatBigNum(item.lpVolume)}
                            </span>
                            <span className="contect-text" style={{ flex: 4 }}>
                                {Global.formatBigNum(item.symbolVolume)}
                            </span>
                            <span className="contect-text" style={{ flex: 4 }}>
                                {Global.abbrSymbolAddress(item.symbolAddr)}
                                {item.isHoneypot !== null && item.isHoneypot ? <WarningFilled style={{marginLeft: 10,color: 'red'}}/> : ''}
                            </span>
                        </div>)
                    }
                )
            }
        })
        if (marketArr.length > 0) {
            optionsItem.push({
                label: searchTitle(f('unifiedSearchMarket'), data.market!.length, 'market', false, !marketMore, false, false, false, marketMore),
                options: []
            })
            optionsItem.push({
                label: <div
                    className="unified-search-content unified-search-table-title unified-search-box-padding"
                    key={'marketTable'}
                >
                    <span className="contect-text" style={{ flex: 3 }}>
                        {f('unifiedSearchSymbol')}
                    </span>
                    <span className="contect-text" style={{ flex: 4 }}>
                        {f('unifiedSearchPrice')}
                    </span>
                    <span className="contect-text" style={{ flex: 3, textAlign: 'right' }}>
                        {f('unifiedSearchLpVolume')}
                    </span>
                    <span className="contect-text" style={{ flex: 4 }}>
                        {f('unifiedSearchVolume24h')}
                    </span>
                    <span className="contect-text" style={{ flex: 4 }}>
                        {f('unifiedSearchSymbolAddr')}
                    </span>
                </div>,
                options: marketArr
            })
            optionsItem.push({
                label: <div className="unified-search-board" key="market-board"></div>,
                options: []
            })
        }
    }
    // 
    if (data.address && data.address.length > 0) {
        const addressArr: { value: string; label: JSX.Element }[] = []
        data.address.forEach((item, index) => {
            if (index < 3 || addressMore) {
                addressArr.push(
                    {
                        value: 'address' + index,
                        label: (<div
                            className="unified-search-content unified-search-box-padding"
                            style={{
                                display:
                                    index > 2 && !addressMore ? 'none' : 'flex',
                            }}
                            key={'address' + index}
                            onClick={(e) => {
                                searchItemClick('address', item, e)
                            }}
                        >
                            <span className="contect-text">{item.address}</span>
                        </div>)
                    }
                )
            }
        })
        if (addressArr.length > 0) {
            optionsItem.push({
                label: searchTitle(f('unifiedSearchAddress'), data.address!.length, 'address', false, false, !addressMore, false, false, addressMore),
                options: addressArr
            })
            optionsItem.push({
                label: <div className="unified-search-board" key="address-board"></div>,
                options: []
            })
        }
    }

    //nft
    if (data.nftMarket && data.nftMarket.length > 0) {
        const nftArr: { value: string; label: JSX.Element }[] = []
        data.nftMarket.forEach((item, index) => {
            if (index < 3 || nftMore) {
                nftArr.push(
                    {
                        value: 'nftItem' + index,
                        label: (<div
                            className={`unified-search-content unified-search-table-body${index % 2} unified-search-box-padding`}
                            style={{
                                display: index > 2 && !nftMore ? 'none' : 'flex',
                            }}
                            key={'nftItem' + index}
                            onClick={(e) => {
                                searchItemClick('nft', item, e)
                            }}
                        >
                            <span className="contect-text" style={{ flex: 3 }}>
                                {item.logo !== null && item.logo.length > 0 ? (<TokenLogo
                                    className="contect-logo"
                                    src={item.logo}
                                    alt=''
                                />) : ''}
                                {item.symbol}
                            </span>
                            <span className="contect-text" style={{ flex: 4 }}>
                                {Global.formatNum(item.nftNum)}
                            </span>
                            <span
                                className="contect-text"
                                style={{ flex: 3, textAlign: 'right' }}
                            >
                                {Global.formatNum(item.holdNum)}
                            </span>
                            <span className="contect-text" style={{ flex: 4 }}>
                                {Global.formatBigNum(item.symbolVolume)}
                            </span>
                            <span className="contect-text" style={{ flex: 4 }}>
                                {Global.abbrSymbolAddress(item.symbolAddr)}
                            </span>
                        </div>)
                    }
                )
            }
        })

        if (nftArr.length > 0) {
            optionsItem.push({
                label: searchTitle('NFT', data.nftMarket!.length, 'nft', false, false, false, false, !nftMore, nftMore),
                options: []
            })
            optionsItem.push({
                label: <div
                    className="unified-search-content unified-search-table-title unified-search-box-padding"
                    key={'nftTable'}
                >
                    <span className="contect-text" style={{ flex: 3 }}>
                        {f('unifiedSearchSymbol')}
                    </span>
                    <span className="contect-text" style={{ flex: 4 }}>
                        {f('nftNums')}
                    </span>
                    <span className="contect-text" style={{ flex: 3, textAlign: 'right' }}>
                        {f('nftHolder')}
                    </span>
                    <span className="contect-text" style={{ flex: 4 }}>
                        {f('nftAnalyseTradingVolume24H')}
                    </span>
                    <span className="contect-text" style={{ flex: 4 }}>
                        {f('unifiedSearchSymbolAddr')}
                    </span>
                </div>,
                options: nftArr
            })
            optionsItem.push({
                label: <div className="unified-search-board" key="nft-board"></div>,
                options: []
            })
        }
    }
    const searchItemClick = (name: string, item: SearchResultItem | Market | Project | Nft, e?: any) => {
        switch (name) {
            case 'project':
                trackAction(
                    UNIFIED_SEARCH.category,
                    UNIFIED_SEARCH.actions.project
                )
                Global.openNewTag(e, router, `/app-detail/project-overview/${(item as Project).name}`)
                break
            case 'market':
                trackAction(
                    UNIFIED_SEARCH.category,
                    UNIFIED_SEARCH.actions.market
                )
                Global.openNewTag(e, router, `/market-detail/market-page/${(item as Market).symbolAddr}`)
                break
            case 'address':
                trackAction(
                    UNIFIED_SEARCH.category,
                    UNIFIED_SEARCH.actions.address
                )
                if ((item as SearchResultItem).groupId) {
                    Global.openNewTag(e, router, `/address-analyse/${(item as SearchResultItem).address}/${(item as SearchResultItem).groupId}`)
                } else {
                    Global.openNewTag(e, router, `/address-analyse/${(item as SearchResultItem).address}`)
                }
                break
            case 'assets':
                trackAction(
                    UNIFIED_SEARCH.category,
                    UNIFIED_SEARCH.actions.assets
                )
                Global.openNewTag(e, router, `/asset-board/${(item as SearchResultItem).address}`)
                break
            case 'nft':
                Global.openNewTag(e, router, `/nft-analyse-detail/nft-analyse/${(item as Nft).symbolAddr}`)
                break;
            default:
                break
        }
        setInputAddr('')
        setData({
            project: null,
            market: null,
            address: null,
            assets: null,
            nftMarket: null,
        })
        if (selectRef.current) {
            selectRef.current.blur()
        }
    }

    const onPressEnter = () => {
        if (!loading && inputAddr) {
            if (data.market && data.market.length > 0) {
                for (let i = 0; i < data.market.length; i++) {
                    const element = data.market[i];
                    if (element.symbol.toLowerCase() === inputAddr.toLowerCase()) {
                        searchItemClick('market', element);
                        return
                    }
                }
            }
            if (data.address && data.address.length > 0) {
                for (let i = 0; i < data.address.length; i++) {
                    const element = data.address[i];
                    if (element.address.toLowerCase() === inputAddr.toLowerCase()) {
                        searchItemClick('address', element);
                        return
                    }
                }
            }
        } else {
            return
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <AutoComplete
                className="unified-search-auto-complete"
                dropdownClassName="unified-search-auto-complete-dropdown"
                dropdownMatchSelectWidth={252}
                style={{ width: 510, height: 48 }}
                value={inputAddr}
                allowClear
                options={optionsItem}
                onSelect={onSelect}
                onSearch={handleSearch}
                notFoundContent={loading ?
                    <div
                        style={{
                            height: '142px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Spin />
                    </div> : inputAddr && optionsItem.length == 0 ? <DefinEmpty /> : null}
            >
                <Input.Search placeholder={placeholder || f('headerSearchTips')} enterButton onPressEnter={onPressEnter} />
            </AutoComplete>
            <div className={`search-icon-holder ${inputAddr ? 'search-icon-value-holder' : ''}`}>
                <SearchOutlined style={{ fontSize: 20, position: 'relative', top: '-3px', color: '#A5B7BE' }} />
            </div>
        </div>
    )
}