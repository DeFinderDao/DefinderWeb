import { useIntl } from 'react-intl'
import React, { useState, useEffect } from 'react'
import ApiClient from 'utils/ApiClient'
import { useRouter } from 'next/router'
import { Popconfirm, Divider, Tooltip, Button } from 'antd';
import { DownOutlined, UpOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import Global from 'utils/Global'
import { CODE_SUCCESS } from 'utils/ApiServerError'
import { trackAction, trackPage, MARKET_DETAIL } from 'utils/analyse/YMAnalyse'
import moment from 'moment'
// moment.locale('zh-cn')
import { showWalletDialog } from 'redux/actions/UserInfoAction'
import dynamic from 'next/dynamic';
import { AppState } from 'redux/reducers'
import type { TVChartContainer as TVChartContainerType } from '../TVChartContainer';
import { LanguageCode } from 'public/static/charting_library/charting_library'
import { DefaultLocale } from 'utils/env'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { TokenLogo } from 'components/TokenLogo';
import ShareToken from './ShareToken';

type TVChartContainerPropsType = JSX.LibraryManagedAttributes<
    typeof TVChartContainerType,
    React.ComponentProps<typeof TVChartContainerType>
>

const TVChartContainer = dynamic<TVChartContainerPropsType>(
    () =>
        import('../TVChartContainer').then(mod => mod.TVChartContainer as any),
    { ssr: false },
);

interface SymbolChartProps {
    chainUrl?: string,
    contract: string,
    exchange: string,
    id: null | string,
    isStar: boolean,
    logo: string,
    lpBaseSymbol: string,
    lpBaseSymbolVolume: number,
    lpPriceSymbol: string,
    lpPriceSymbolVolume: number,
    lpValue: number,
    lpVolume: null | number,
    onlineTime: number,
    pair: string,
    price: string,
    priceIncrease: string,
    symbol: string,
    symbolFullName: string,
    symbol1Addr: string,
    symbolAddr: string,
    symbolName: string,
    tradeCount: number,
    tradeCountIncrease: string,
    volume24h: number,
    volume24hIncrease: string,
    symbolTurnover: number,
    holdAddressCount?: number | null,
    communityList?: CommunityListProps[],
    marketValue: string,
    circulation: string,
    supply: string,
}

interface CommunityListProps {
    name: string,
    communityName: string,
    url: string
}

interface LpDetaiListProps {
    exchange: string,
    pair: string,
    lpValue: number,
    lpBaseSymbol: string,
    lpPriceSymbol: string,
    lpBaseSymbolVolume: number,
    lpPriceSymbolVolume: number,
    exchangeLogo: string
}

export default function SymbolChart({ data }: { data: SymbolChartProps }) {
    const router = useRouter()
    const { locale = DefaultLocale } = router
    const userInfo = useSelector((state: AppState) => state.userInfo)
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const apiClient = new ApiClient()
    const [starLoading, setStarLoading] = useState(false)
    const [componentData, setComponentData] = useState<SymbolChartProps>(data)
    useEffect(() => {
        setComponentData(data)
        getLpDetaiList(data)
    }, [data])
    const [currentLocale, setCurrentLocale] = useState(locale);
    useEffect(() => {
        setCurrentLocale(locale);
    }, [locale]);
    const [popVisible, setPopVisible] = useState(false)
    const [lpDetaiList, setLpDetaiList] = useState<LpDetaiListProps[]>()
    const getLpDetaiList = async (val: SymbolChartProps) => {
        try {
            const data = await apiClient.get(`/market/detail/lp/list?symbolAddr=${val.symbolAddr}`)
            if (data.code === CODE_SUCCESS) {
                setLpDetaiList(data.data as LpDetaiListProps[]);
            } else {
                message.error(data.message)
            }
        } catch (e) {
            message.error((e as unknown as Error).message)
        }
    }
    const followClick = async (item: SymbolChartProps) => {
        if (!userInfo.address) {
            dispatch(showWalletDialog());
        } else {
            if (starLoading) {
                return
            }
            setStarLoading(true)
            try {
                const data = await apiClient.post(`/market/follow`, {
                    data: {
                        id: item.id,
                        star: item.isStar ? 0 : 1,
                        symbolAddr: item.symbolAddr,
                    },
                })
                if (data.code === CODE_SUCCESS) {
                    setStarLoading(false)
                    if (item.isStar) {
                        message.success(f('marketOptionalCancelSuc'))
                        setComponentData({ ...componentData, isStar: false })
                    } else {
                        message.success(f('marketOptionalConfirmSuc'))
                        setComponentData({ ...componentData, isStar: true })
                    }
                } else {
                    setStarLoading(false)
                    message.error(data.message)
                }
            } catch (e) {
                setStarLoading(false)
                message.error((e as unknown as Error).message)
            }
        }
    }

    const [klineLoaded, setKlineLoaded] = useState(false);

    const onKLineLoaded = () => {
        setKlineLoaded(true);
    }

    const [visibleModal, setVisibleModal] = useState(false)

    const logoArr = ['website', 'twitter', 'telegram', 'discord', 'github', 'reddit', 'facebook']
    const logoIconArr = ['official-website', 'twitter', 'telegram1', 'discord1', 'github', 'reddit', 'facebook']
    const logoNameArr = ['Official Website', 'Twitter', 'Telegram', 'Discord', 'Github', 'Reddit', 'Facebook']
    return (
        <div className="comparison">
            <div className='comparison-box' style={{ display: 'flex', width: '100%', position: 'relative' }}>
                <div style={{ width: '75%', position: 'relative' }}>
                    <div className='symbol-top-box'>
                        <div className="symbol-top defi-padding-RL-24" style={{ paddingTop: 25 }}>
                            <TokenLogo
                                src={componentData.logo}
                                alt=""
                                width="28px"
                                height="28px"
                            />
                            <div className="defi-flex defi-align-center defi-justify-center">
                                <span className="comparison-symbol defi-font-size-24">
                                    {componentData.symbol}
                                </span>
                                <span className="comparison-exchange defi-color0 defi-font-size-16">
                                    <span>{componentData.symbolFullName || 'Uniswap'}</span>
                                </span>
                                <span className="defi-color1 defi-font-size-24">
                                    {componentData.price && componentData.price.toLowerCase().includes('e')
                                        ? `$ ${componentData.price}`
                                        : `$ ${Global.formatNum(componentData.price)}`}
                                </span>
                                <span className="defi-font-size-16" style={{ marginLeft: '13px' }}>24h</span>
                                <span className="defi-font-size-16" style={{ marginLeft: '15px' }}>{Global.formatIncreaseNumber(componentData.priceIncrease)}</span>
                            </div>
                            <div style={{ marginLeft: 16 }}>
                                <svg
                                    className="icon definder-icon"
                                    aria-hidden="true"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        followClick(componentData)
                                        if (!componentData.isStar) {
                                            trackAction(
                                                MARKET_DETAIL.category,
                                                MARKET_DETAIL.actions.symbol_detail_star
                                            )
                                        } else {
                                            trackAction(
                                                MARKET_DETAIL.category,
                                                MARKET_DETAIL.actions.symbol_detail_star_no
                                            )
                                        }
                                    }}>
                                    <title>{!componentData.isStar ? f('marketOptionalConfirm') : f('marketOptionalCancel')}</title>
                                    <use xlinkHref={!componentData.isStar ? '#icon-collect' : '#icon-collect_active'}></use>
                                </svg>
                            </div>
                        </div>
                        <Button type="primary" shape="round" onClick={() => { setVisibleModal(true) }}>
                            <ShareAltOutlined />
                            {f('shareProjectInformation')}
                        </Button>
                    </div>
                    <div className="comparison-symbol-info defi-padding-RL-24 defi-flex" style={{ justifyContent: 'space-between' }}>
                        <div className="defi-color2 defi-flex" style={{ flexDirection: 'column', width: 300 }}>
                            <span className="defi-flex" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                                <span className="defi-color0">{f('dbhy')}</span>
                                <span>
                                    {Global.abbrSymbolAddress(componentData.symbolAddr)}
                                    <textarea
                                        id="copyObj"
                                        readOnly
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            opacity: '0',
                                            zIndex: -10,
                                        }}
                                        value={`${componentData.symbolAddr}`}
                                    />
                                    <svg
                                        className="icon"
                                        aria-hidden="true"
                                        style={{
                                            width: '14px',
                                            height: '14px',
                                            marginLeft: '10px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            let addr = document.querySelector('#copyObj');
                                            (addr as HTMLTextAreaElement).select() 
                                            document.execCommand('Copy')
                                            message.success(f('copySuccess'))
                                            trackAction(
                                                MARKET_DETAIL.category,
                                                MARKET_DETAIL.actions.copy_contract_addr
                                            )
                                        }}>
                                        <title>{f('copyAddress')}</title>
                                        <use xlinkHref="#icon-copy"></use>
                                    </svg>
                                    <svg
                                        className="icon"
                                        aria-hidden="true"
                                        style={{
                                            width: 16, height: 16, marginLeft: 10, cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            window.open(componentData.chainUrl)
                                        }}>
                                        <use xlinkHref='#icon-etherscan'></use>
                                    </svg>
                                </span>
                            </span>
                            <span className="defi-flex" style={{ justifyContent: 'space-between' }}>
                                <span className="defi-color0">
                                    {f('onlineTime')}
                                    <Tooltip
                                        placement="top"
                                        title={
                                            <div>
                                                {`${f('onlineTimeExplain')}${Global.distanceFromCurrent(componentData.onlineTime, currentLocale, true)}`}
                                            </div>
                                        }
                                    >
                                        <QuestionCircleOutlined
                                            style={{
                                                fontSize: '16px',
                                                marginLeft: '10px',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </Tooltip>
                                </span>
                                {componentData.onlineTime ? (
                                    <span> {Global.distanceFromCurrent(componentData.onlineTime, currentLocale, true)}</span>
                                )
                                    :
                                    <span>--:--</span>}
                            </span>
                        </div>
                        <div style={{ borderRight: '1px solid #343D47', flexShrink: 0, width: 20, marginRight: 20 }}></div>
                        <div className="defi-color2 defi-flex" style={{ flexDirection: 'column', width: 300 }}>
                            <span className="defi-flex" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                                <span className="defi-color0">{f('holdAddrNumber')}</span>
                                <span>{Global.formatNum(componentData.holdAddressCount)}</span>
                            </span>
                            <span className="defi-flex" style={{ justifyContent: 'space-between' }}>
                                <span className="defi-color0">{f('circulationMarketValue')}</span>
                                <span>$ {Global.formatNum(componentData.marketValue)}</span>
                            </span>
                        </div>
                        <div style={{ borderRight: '1px solid #343D47', flexShrink: 0, width: 20, marginRight: 20 }}></div>
                        <div className="defi-color2 defi-flex" style={{ flexDirection: 'column', width: 300 }}>
                            <span className="defi-flex" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                                <span className="defi-color0">{f('circulation')}</span>
                                <span>{Global.formatNum(componentData.circulation)} {componentData.symbol}</span>
                            </span>
                            <span className="defi-flex" style={{ justifyContent: 'space-between' }}>
                                <span className="defi-color0">{f('totalSupply')}</span>
                                <span>{Global.formatNum(componentData.supply)} {componentData.symbol}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', padding: '25px 24px 20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: 140, overflow: 'hidden' }}>{
                        componentData.communityList ? componentData.communityList.map((item, index) => {
                            return <span
                                key={index}
                                onClick={() => {
                                    window.open(item.url)
                                }}
                                style={{
                                    padding: '0 10px',
                                    border: '1px solid #343D47',
                                    borderRadius: 4,
                                    color: '#89979C',
                                    marginRight: 8,
                                    marginBottom: 12,
                                    height: 36,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>
                                <svg
                                    className="icon"
                                    aria-hidden="true"
                                    style={{
                                        width: 16,
                                        height: 16,
                                        marginRight: 10,
                                        verticalAlign: 'middle',
                                    }}>
                                    <use xlinkHref={`#icon-${logoIconArr[logoArr.indexOf(item.name)]}`}></use>
                                </svg>
                                <span style={{ fontSize: 12 }}>{logoNameArr[logoArr.indexOf(item.name)]}</span>
                            </span>
                        }) : null
                    }</div>
                </div>
                {componentData.communityList && componentData.communityList.length > 0 ?
                    <div style={{ position: 'absolute', left: '75%', bottom: 6, paddingLeft: 24 }} className="defi-color5">*Powered by Coingecko</div>
                    :
                    null
                }
            </div>
            <div className="defi-padding-RL-16" style={{ display: 'flex', width: '100%', height: '400px' }}>
                <div style={{ width: '75%', position: 'relative' }}>
                    <TVChartContainer
                        symbol={componentData.symbolAddr}
                        locale={currentLocale as LanguageCode}
                        mode={userInfo.pageMode}
                        onKlineLoaded={onKLineLoaded}
                    />
                    <img style={{
                        position: 'absolute',
                        right: '100px',
                        top: '260px',
                        width: '123px',
                        opacity: 0.3,
                        display: klineLoaded ? 'block' : 'none'
                    }} src="/images/line-watermark-info.svg" />
                </div>
                <div
                    className="symbol-volume-box"
                >
                    <div className="symbol-volume-div">
                        <p className="defi-color0" style={{ fontWeight: 'bold' }}>
                            {f('lpBaseSymbolVolume')}
                        </p>
                        {lpDetaiList && lpDetaiList.length > 0 ? <Popconfirm
                            className="symbol-volume-pop"
                            placement="bottomLeft"
                            okText="" cancelText=""
                            title={() => {
                                return (
                                    lpDetaiList && lpDetaiList.length > 0 ? lpDetaiList.map((item, index) => {
                                        return <div>
                                            <div style={{ display: 'flex', padding: '0 12px' }}>
                                                <img style={{ width: 16, height: 16, margin: '2px 5px 0 0' }} src={item.exchangeLogo} alt="" />
                                                <div>
                                                    <div className="defi-color2" style={{ fontWeight: 'bold' }}>{item.exchange + ' ' + item.pair}</div>
                                                    <div>{'$ ' + Global.formatNum(item.lpValue)}</div>
                                                    <div>{Global.formatNum(item.lpBaseSymbolVolume) + ' ' + item.lpBaseSymbol}</div>
                                                    <div>{Global.formatNum(item.lpPriceSymbolVolume) + ' ' + item.lpPriceSymbol}</div>
                                                </div>
                                            </div>
                                            <Divider style={{ margin: '10px 0' }} />
                                        </div>
                                    }) : null
                                )
                            }}
                            getPopupContainer={() =>
                                document.querySelector('.symbol-volume-div') as HTMLElement
                            }
                            onVisibleChange={(visible) => {
                                setPopVisible(visible)
                            }}
                        >
                            <p style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {'$ ' + Global.formatNum(componentData.lpValue)}
                                {
                                    popVisible ?
                                        <UpOutlined className="defi-color0" style={{ fontSize: 12, paddingLeft: 10 }} />
                                        :
                                        <DownOutlined className="defi-color0" style={{ fontSize: 12, paddingLeft: 10 }} />
                                }
                            </p>
                        </Popconfirm> :
                            <p>
                                {'$ ' + Global.formatNum(componentData.lpValue)}
                            </p>
                        }
                    </div>
                    <div className="symbol-volume-div">
                        <p className="defi-color0" style={{ fontWeight: 'bold' }}>{f('volume24h')}</p>
                        <p>
                            {Global.formatNum(componentData.volume24h) +
                                ' ' +
                                componentData.symbol} &nbsp;
                            {Global.formatIncreaseNumber(componentData.volume24hIncrease)}
                        </p>
                        <p style={{ fontSize: '10px' }}>
                            {'$ ' + Global.formatNum(
                                componentData.symbolTurnover
                            )}
                        </p>
                    </div>
                    <div className="defi-color2 defi-font-size-16">
                        <p className="defi-color0" style={{ fontWeight: 'bold' }}>{f('tradeCount')}</p>
                        <p>
                            {Global.formatNum(componentData.tradeCount)} &nbsp;
                            {Global.formatIncreaseNumber(componentData.tradeCountIncrease)}
                        </p>
                    </div>
                </div>
            </div>
            <ShareToken symbolAddr={componentData.symbolAddr} visible={visibleModal} onClose={() => { setVisibleModal(false) }} />
        </div>
    )
}
