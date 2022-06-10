import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Tabs } from 'antd'
import 'styles/marketDetail.less'
import ApiClient from 'utils/ApiClient'
import Breadcrumb from 'components/Breadcrumb/breadcrumb'
import SymbolChart from 'components/MarketComponents/SymbolChart'
import Comparison from 'components/MarketComponents/Comparison'
import LpRank from 'components/MarketComponents/LpRank'
import CurrencyAddrLine from 'components/MarketComponents/CurrencyAddrLine'
import CurrencyAddrRank from 'components/MarketComponents/CurrencyAddrRank'
import TransactionHistory from 'components/MarketComponents/TransactionHistory'
import AnalysisBuyingToday from 'components/MarketComponents/AnalysisBuyingToday'
import BuySellLine from 'components/MarketComponents/BuySellLine'
import AddNewUser from 'components/MarketComponents/AddNewUser'
import { WarningFilled } from '@ant-design/icons'
import { trackPage, MARKET_DETAIL } from 'utils/analyse/YMAnalyse'
import {
    MarketPageDetailAction,
} from 'redux/types/MarketPageDetailTypes';
const { TabPane } = Tabs
import AnalysisUsers from 'components/MarketComponents/AnalysisUsers'
import { useRouter } from 'next/router'
import { getMarketDetailSuccess } from 'redux/actions/MarketPageAction'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'redux/reducers'
import DefinderLoading from 'components/DefinderLoading'
import { SubscriptionMarket } from 'components/Subscription/market'
import AddressRank from 'components/MarketComponents/AddressRank'

export default function MarketDetail() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { query } = router;
    const { detail } = query;
    const addr = detail && detail.length > 1 ? detail[detail.length - 1] : undefined;
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
    return (<>{isEmpty || marketDetail.symbolAddr == null || !addr || marketDetail.symbolAddr != addr ? <DefinderLoading /> : <MarketDetailBody props={marketDetail} />}</>)
}

function MarketDetailBody({ props }: { props: MarketPageDetailAction }) {
    useEffect(() => {
        
        trackPage(MARKET_DETAIL.url)
    }, [])
    
    const userInfo = useSelector((state: AppState) => state.userInfo)
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    return (
        <>
            <Breadcrumb lastItem={props.symbol} borderBottom={true} />
            <div className="market-detail">
                {
                    props.isHoneypot !== null && props.isHoneypot ? (
                    <div style={{textAlign: 'center'}}>
                        <span className="honey-pot-tips"><WarningFilled style={{color: 'red',marginRight: 5}}/>{f('honeypotTips')}</span>
                    </div>) : ''
                }
                <div className="item-box">
                    <div className="block-item" style={{ padding: 0, borderTop: 0, marginBottom: 50 }}>
                        <SymbolChart data={props} />
                    </div>
                </div>
                <Tabs
                    defaultActiveKey="1"
                    onChange={(key) => {
                    }}
                    className="market-detail-tabs"
                >
                    <TabPane tab={f('dataAna')} key="1">
                        <div className="item-box">
                            <CurrencyAddrLine
                                symbolAddr={props.symbolAddr}
                                symbol={props.symbol}
                            />
                            <BuySellLine
                                symbolAddr={props.symbolAddr}
                            />
                        </div>
                        <div className="item-box">
                            {userInfo.level == 1 ?
                                <AnalysisUsers
                                    symbolAddr={props.symbolAddr}
                                    symbol={props.symbol}
                                /> : <SubscriptionMarket />}
                            {/* <AnalysisBuyingUsers
                                symbolAddr={props.symbolAddr}
                                symbol={props.symbol}
                            />
                            <AnalysisSellingUsers
                                symbolAddr={props.symbolAddr}
                                symbol={props.symbol}
                            /> */}
                        </div>
                        <div className="item-box">
                            <AddNewUser
                                symbolAddr={props.symbolAddr}
                            />
                            <div className="block-item item-small">
                                <p className="item-title">
                                    {f('analysisBuyingTodayExplain')}
                                </p>
                                <AnalysisBuyingToday
                                    symbolAddr={props.symbolAddr}
                                    symbol={props.symbol}
                                />
                            </div>
                        </div>
                        <div className="item-box">
                            <div className="block-item">
                                <p className="item-title">
                                    {props.symbol}
                                    {f('marketDetailAddrRankTitle')}
                                </p>
                                <CurrencyAddrRank
                                    flex="row"
                                    symbolAddr={props.symbolAddr}
                                    showMore={true}
                                    symbol={props.symbol}
                                />

                                {/* <AddressRank symbol={props.symbol} symbolAddr={props.symbolAddr}/> */}
                            </div>
                        </div>
                        <div className="item-box">

                            <Comparison
                                symbolAddr={props.symbolAddr}
                                pageSize={5}
                                showMore={true}
                                symbol={props.symbol}
                            />
                            <div className="block-item item-small">
                                <p className="item-title">
                                    {f('marketDetailLpRankTitle')}
                                </p>
                                <LpRank
                                    symbolAddr={props.symbolAddr}
                                    pageSize={10}
                                    showMore={true}
                                    symbol={props.symbol}
                                />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab={f('tradeHistory')} key="2">
                        <div className="item-box">
                            <div className="block-item">
                                <TransactionHistory
                                    symbol0Addr={props.symbolAddr}
                                    symbol={props.symbol}
                                />
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </>
    )
}

// export async function getServerSideProps(context: next.NextPageContext) {
//     const { query } = context
//     const { detail } = query

//     if (typeof detail === 'undefined' || detail.length < 2) {
//         return {
//             redirect: {
//                 destination: '/_error',
//                 permanent: false,
//             },
//         }
//     } else {
//         const addr = detail[detail.length - 1];
//         try {
//             const apiClient = new ApiClient(context)
//             const response = await apiClient.get(`/market/detail?symbolAddr=${addr}`)
//             const data = response as unknown as Response<MarketPageDetailAction>;

//             return {
//                 props: {
//                     ...data.data,
//                 },
//             }
//         } catch (e) {
//             if (e.code === CODE_TOKEN_INVALID || e.code === CODE_TOKEN_NO) {
//                 return {
//                     props: {
//                         ...e,
//                     },
//                 }
//             }
//             return {
//                 redirect: {
//                     destination: '/_error',
//                     permanent: false,
//                 },
//             }
//         }
//     }
// }
