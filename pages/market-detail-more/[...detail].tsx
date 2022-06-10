import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { BackTop, Breadcrumb } from 'antd'
import 'styles/marketDetailMore.less'
import { useRouter } from 'next/router'
import ApiClient from 'utils/ApiClient'
import CurrencyAddrRank from 'components/MarketComponents/CurrencyAddrRank'
import Comparison from 'components/MarketComponents/Comparison'
import NewAddressRank from 'components/MarketComponents/NewAddressRank'
import BuyRank from 'components/MarketComponents/BuyRank'
import LpRank from 'components/MarketComponents/LpRank'
import {
    CODE_TOKEN_INVALID,
    CODE_TOKEN_NO,
} from 'utils/ApiServerError'
import { trackPage, MARKET_DETAIL_MORE } from 'utils/analyse/YMAnalyse'
import { Response } from 'redux/types';
import {
    MarketPageDetailAction,
} from 'redux/types/MarketPageDetailTypes';
import IncreaseAndDecreaseRank from 'components/MarketComponents/AnalysisUsersCom/IncreaseAndDecreaseRank'
import DefinderLoading from 'components/DefinderLoading'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'redux/reducers'
import { getMarketDetailSuccess } from 'redux/actions/MarketPageAction'
import { SubscriptionMarket, SubscriptionMarketDetail } from 'components/Subscription/market'
import SMAddrRank from 'components/MarketComponents/SMAddrRank'
import Global from 'utils/Global'

export const LPRANK_PAGESIZE = 100;

export default function MarketDetailMore(props: MarketPageDetailAction) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { query } = router;
    const { detail } = query;

    const addr = detail && detail.length > 3 ? detail[detail.length - 1] : undefined;
    const isEmpty = typeof addr === 'undefined';
    const { marketDetail } = useSelector((state: AppState) => state.marketPage);

    useEffect(() => {
        if (addr) {
            const apiClient = new ApiClient<MarketPageDetailAction>()
            apiClient.get(`/market/detail?symbolAddr=${addr}`).then(result => {
                dispatch(getMarketDetailSuccess(result.data));
            }, e => {
                router.replace('/_error')
            });
        }
    }, [addr])

    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const navigateMarketPage = (event: React.MouseEvent) => Global.openNewTag(event, router, '/market-page', 'replace')
    const navigateMarketDetailPage = (event: React.MouseEvent) => Global.openNewTag(event, router, `/market-detail/market-page/${marketDetail.symbolAddr}`, 'replace')
    const pageType = typeof router.query.detail !== 'undefined' && router.query.detail.length > 2 ? router.query.detail[router.query.detail.length - 2] : null;
    useEffect(() => {
        if (pageType) {
            setType(pageType)
        }
    }, [pageType])

    const [type, setType] = useState<string | null>(pageType)
    const title = type === null ? '' : f(type);
    return (<>
        <div className="defi-breadcrumb">
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={navigateMarketPage}>{f('market-page')}</Breadcrumb.Item>
                <Breadcrumb.Item
                    onClick={navigateMarketDetailPage}
                >
                    {marketDetail.symbol}
                </Breadcrumb.Item>
                <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        {isEmpty || marketDetail.symbolAddr == null || !addr || marketDetail.symbolAddr != addr ?
            <DefinderLoading /> :
            <MarketDetailMoreBody props={marketDetail} />}</>)

}
function MarketDetailMoreBody({ props }: { props: MarketPageDetailAction }) {
    useEffect(() => {
        trackPage(MARKET_DETAIL_MORE.url)
        window!.document!.querySelector('.ant-layout-content')!.scrollTop = 0
    }, [])
    const router = useRouter()
    const userInfo = useSelector((state: AppState) => state.userInfo)
    
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    //to be optimizd！
    const pageType = typeof router.query.detail !== 'undefined' && router.query.detail.length > 2 ? router.query.detail[router.query.detail.length - 2] : null;
    const [type, setType] = useState<string | null>(pageType)
    const title = type === null ? '' : f(type);
    return (
        <>
            {userInfo.level != 1 && (type == 'buyRank' || type == 'sellRank' || type == 'increaseRank' || type == 'decreaseRank') ?
                <SubscriptionMarket /> :
                <div className="market-detail-more">
                    <div className="common-table attention-address common-dark-table common-table-tip">
                        <div className="tableAction">
                            <div className="tableTip">
                                <span>{title}</span>
                                <span className="tableTipHorn"></span>
                                <span className="tableTipTriangle"></span>
                            </div>
                            <span className="tipTitle">{f(type + 'Title')}</span>
                        </div>
                        <div className="content">
                            {type == 'currencyAddrRank' ? (
                                <CurrencyAddrRank
                                    flex="column"
                                    symbolAddr={props.symbolAddr}
                                    symbol={props.symbol}
                                />
                            ) : (
                                ''
                            )}
                            {type == 'SMAddrRank' ? (
                                <SMAddrRank
                                    flex="column"
                                    symbolAddr={props.symbolAddr}
                                    symbol={props.symbol}
                                />
                            ) : (
                                ''
                            )}
                            {type == 'comparison' ? (
                                <Comparison
                                    symbolAddr={props.symbolAddr}
                                    symbol={props.symbol}
                                    pageSize={userInfo.level == 0 ? 10 : 100}
                                />
                            ) : (
                                ''
                            )}
                            {type == 'newAddressRank' ? (
                                <NewAddressRank
                                    symbolAddr={props.symbolAddr}
                                    pageSize={userInfo.level == 0 ? 10 : 100}
                                    symbol={props.symbol}
                                />
                            ) : (
                                ''
                            )}
                            {type == 'buyRank' ? (
                                <BuyRank
                                    symbolAddr={props.symbolAddr}
                                    pageSize={userInfo.level == 0 ? 10 : 100}
                                    symbol={props.symbol}
                                    typeRank={type}
                                />
                            ) : (
                                ''
                            )}
                            {type == 'sellRank' ? (
                                <BuyRank
                                    symbolAddr={props.symbolAddr}
                                    pageSize={userInfo.level == 0 ? 10 : 100}
                                    typeRank={type}
                                    symbol={props.symbol}
                                />
                            ) : (
                                ''
                            )}
                            {type == 'increaseRank' ? (
                                <IncreaseAndDecreaseRank
                                    symbolAddr={props.symbolAddr}
                                    pageSize={userInfo.level == 0 ? 10 : 100}
                                    symbol={props.symbol}
                                    typeRank={type}
                                />
                            ) : (
                                ''
                            )}
                            {type == 'decreaseRank' ? (
                                <IncreaseAndDecreaseRank
                                    symbolAddr={props.symbolAddr}
                                    pageSize={userInfo.level == 0 ? 10 : 100}
                                    typeRank={type}
                                    symbol={props.symbol}
                                />
                            ) : (
                                ''
                            )}
                            {type == 'LpRank' ? (
                                <LpRank
                                    symbolAddr={props.symbolAddr}
                                    pageSize={userInfo.level == 0 ? 10 : 100}
                                    symbol={props.symbol}
                                />
                            ) : (
                                ''
                            )}
                        </div>
                        {userInfo.level != 1 ? <SubscriptionMarketDetail /> : null}
                    </div>
                </div>
            }
        </>
    )
}
