import { useIntl } from 'react-intl'
import React, { useState, useEffect, DetailedReactHTMLElement, ReactElement } from 'react'
import ApiClient from 'utils/ApiClient'
import { useRouter } from 'next/router'
import { Tooltip, Button } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import Global from 'utils/Global'
import { CODE_SUCCESS } from 'utils/ApiServerError'
import { showWalletDialog } from 'redux/actions/UserInfoAction'
import { AppState } from 'redux/reducers'
import { DefaultLocale } from 'utils/env'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { TokenLogo } from 'components/TokenLogo';
import NFTShare from './NFTShare';
import { NFTAnalyseDetailAction } from 'redux/types/NFTAnalyseDetailTypes';
import moment from 'moment';
import { PrimitiveType, FormatXMLElementFn } from 'intl-messageformat';
import { editAllList } from 'redux/actions/NFTAnalyseAction';
import type { Response } from 'redux/types';
import GlobalLabel from 'components/GlobalLabel';


export default function NFTAnalyseDetail({ data }: { data: NFTAnalyseDetailAction }) {
    const router = useRouter()
    const { locale = DefaultLocale } = router
    const userInfo = useSelector((state: AppState) => state.userInfo)
    const { formatMessage } = useIntl()
    const f = (id: string, value?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>> | undefined) => formatMessage({ id }, value)
    const dispatch = useDispatch()
    const apiClient = new ApiClient()
    const [starLoading, setStarLoading] = useState(false)
    const [componentData, setComponentData] = useState<NFTAnalyseDetailAction>(data)
    useEffect(() => {
        setComponentData(data)
    }, [data])
    const [currentLocale, setCurrentLocale] = useState(locale);
    useEffect(() => {
        setCurrentLocale(locale);
    }, [locale]);
    const followClick = async (item: NFTAnalyseDetailAction) => {
        if (!userInfo.address) {
            dispatch(showWalletDialog());
        } else {
            if (starLoading) {
                return
            }
            setStarLoading(true)
            try {
                const response = await apiClient.post(`/market/follow`, {
                    data: {
                        id: item.id,
                        star: item.isStar ? 0 : 1,
                        symbolAddr: item.symbolAddress,
                        symbolType: 2
                    },
                })
                const data = response as unknown as Response<number>;
                if (data.code === CODE_SUCCESS) {
                    setStarLoading(false)
                    if (item.isStar) {
                        message.success(f('nftAnalyseOptionalCancelSuc'))
                        setComponentData({ ...componentData, isStar: false })
                    } else {
                        message.success(f('nftAnalyseOptionalConfirmSuc'))
                        setComponentData({ ...componentData, isStar: true })
                    }
                    item.id = data.data
                    dispatch(editAllList(JSON.stringify(item)))
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

    const [visibleModal, setVisibleModal] = useState(false)

    const logoArr = ['official website', 'twitter', 'telegram', 'discord', 'github', 'reddit', 'facebook']
    const logoIconArr = ['official-website', 'twitter', 'telegram1', 'discord1', 'github', 'reddit', 'facebook']
    const logoNameArr = ['Official Website', 'Twitter', 'Telegram', 'Discord', 'Github', 'Reddit', 'Facebook']
    return (
        <div className="comparison">
            <div className='comparison-box' style={{ display: 'flex', width: '100%', position: 'relative' }}>
                <div style={{ width: '75%', position: 'relative' }}>
                    <div className='symbol-top-box'>
                        <div className="symbol-top defi-padding-RL-24" style={{ paddingTop: 25 }}>
                            {componentData.logo ? <TokenLogo
                                src={componentData.logo}
                                alt=""
                                width="40px"
                                height="40px"
                            /> : null}
                            <div>
                                <div>
                                    <span className="comparison-symbol defi-font-size-24">
                                        {componentData.symbol}
                                    </span>
                                    <svg
                                        className="icon definder-icon"
                                        aria-hidden="true"
                                        style={{ cursor: 'pointer', marginLeft: 20 }}
                                        onClick={() => {
                                            followClick(componentData)
                                        }}>
                                        <title>{!componentData.isStar ? f('nftOptionalConfirm') : f('nftOptionalCancel')}</title>
                                        <use xlinkHref={!componentData.isStar ? '#icon-collect' : '#icon-collect_active'}></use>
                                    </svg>
                                </div>
                                <div className='defi-color5' style={{ display: 'flex', marginLeft: 15 }}>
                                    <span>{moment(componentData.onLine).format('YYYY-MM-DD HH:mm')}</span>
                                    <div style={{ borderRight: '1px solid #343D47', flexShrink: 0, width: 20, marginRight: 20 }}></div>
                                    <span>{Global.formatNum(componentData.nftNum)} NFTS</span>
                                    <div style={{ borderRight: '1px solid #343D47', flexShrink: 0, width: 20, marginRight: 20 }}></div>
                                    <span>
                                        {Global.abbrSymbolAddress(componentData.symbolAddress)}
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
                                            value={componentData.symbolAddress}
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
                                            }}>
                                            <title>{f('copyAddress')}</title>
                                            <use xlinkHref="#icon-copy"></use>
                                        </svg>
                                        <svg
                                            className="icon"
                                            aria-hidden="true"
                                            style={{ width: 16, height: 16, marginLeft: 10, cursor: 'pointer' }}
                                            onClick={() => {
                                                window.open(componentData.chainUrl)
                                            }}>
                                            <use xlinkHref='#icon-etherscan'></use>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button type="primary" shape="round" onClick={() => { setVisibleModal(true) }}>
                            <ShareAltOutlined />
                            {f('shareProjectInformation')}
                        </Button>
                    </div>
                    <div className="comparison-symbol-info defi-padding-RL-24 defi-flex" style={{ justifyContent: 'space-between' }}>
                        <DetailItem
                            title={f('marketValueEth')}
                            desc={f('marketValueEthDesc')}
                            num={componentData.marketRanking}
                            value={Global.formatBigNum(componentData.marketValueEth)}
                            increase={Global.formatIncreaseNumber(componentData.marketValueIncrease)}
                            priceItem={<>$ {Global.formatBigNum(componentData.marketValueDollar)}</>} />
                        <DetailItem
                            title={f('tradingVolumeEth', { time: '24H' })}
                            desc={f('tradingVolumeEthDesc')}
                            num={componentData.tradingVolumeRanking}
                            value={Global.formatBigNum(componentData.tradingVolumeEth24H)}
                            increase={Global.formatIncreaseNumber(componentData.tradingVolumeIncrease24H)}
                            priceItem={<>$ {Global.formatBigNum(componentData.tradingVolumeDollar24H)}</>} />
                        <DetailItem
                            title={f('holdAddressCount')}
                            desc={f('holdAddressCountDesc')}
                            num={componentData.holdAddressRanking}
                            value={Global.formatBigNum(componentData.holdAddressCount)}
                            increase={Global.formatIncreaseNumber(componentData.holdAddressCountIncrease)}
                            priceItem={<>
                                <TokenLogo
                                    src={componentData.whaleLogo}
                                    alt=""
                                    width="20px"
                                    height="20px"
                                />
                                <span style={{ marginLeft: 10 }}>{Global.formatBigNum(componentData.whaleHoldAddressCount)}</span>
                                <Tooltip
                                    placement="right"
                                    title={f('whaleDesc')}
                                >
                                    <QuestionCircleOutlined
                                        style={{
                                            color: '#BEC4CC',
                                            fontSize: '16px',
                                            marginLeft: '10px',
                                        }}
                                    />
                                </Tooltip>
                            </>}
                            ethIcon={false} />
                        <DetailItem
                            title={f('floorPriceEth')}
                            desc={f('floorPriceEthDesc')}
                            value={Global.formatBigNum(componentData.floorPriceEth)}
                            increase={Global.formatIncreaseNumber(componentData.floorPriceIncrease)}
                            priceItem={<>$ {Global.formatBigNum(componentData.floorPriceDollar)}</>} />
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', padding: '25px 24px 20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: 140, overflow: 'hidden', alignContent: 'flex-start' }}>{
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
                    <div style={{ position: 'absolute', left: '75%', bottom: 6, paddingLeft: 24 }} className="defi-color5">*Powered by OpenSea</div>
                    :
                    null
                }
            </div>
            <NFTShare symbolAddr={componentData.symbolAddress} visible={visibleModal} onClose={() => { setVisibleModal(false) }} />
        </div>
    )
}

interface DetailItemProps {
    title: string,
    desc: string,
    num?: number,
    value: HTMLElement | string | number,
    increase: DetailedReactHTMLElement<{ className: string; }, HTMLElement>,
    priceItem: ReactElement<any, any>
    ethIcon?: boolean
}
function DetailItem({ title, desc, num, value, increase, priceItem, ethIcon = true }: DetailItemProps) {
    return (
        <div className='nft-detail-item'>
            <div className='detail-title defi-color5'>
                <span>
                    {title}
                    <Tooltip
                        placement="right"
                        title={desc}
                    >
                        <QuestionCircleOutlined
                            style={{
                                color: '#BEC4CC',
                                fontSize: '16px',
                                marginLeft: '10px',
                            }}
                        />
                    </Tooltip>
                </span>
                {num ? <GlobalLabel label={`#${num}`} maxLength={5} /> : null}
            </div>
            <div className='detail-increase'>
                <span className='defi-flex defi-align-center' style={{ fontSize: 20 }}>
                    {ethIcon ?
                        <svg
                            className="icon"
                            aria-hidden="true"
                            style={{
                                width: 16,
                                height: 16,
                                verticalAlign: 'middle',
                            }}>
                            <use xlinkHref={`#icon-ETH1`}></use>
                        </svg>
                        : null
                    }
                    {value}
                </span>
                <span>{increase}</span>
            </div>
            <div className='detail-price defi-color5'>
                {priceItem}
            </div>
        </div>
    )
}