import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Menu, Tabs } from 'antd'
import 'styles/nftAnalyseDetail.less'
import ApiClient from 'utils/ApiClient'
import Breadcrumb from 'components/Breadcrumb/breadcrumb'
import type { MenuInfo } from 'rc-menu/lib/interface';
const { TabPane } = Tabs
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'redux/reducers'
import DefinderLoading from 'components/DefinderLoading'
import { getNFTAnalyseDetailSuccess } from 'redux/actions/NFTAnalyseAction'
import { NFTAnalyseDetailAction } from 'redux/types/NFTAnalyseDetailTypes'
import NFTAnalyseDetail from 'components/NFTAnalyseComponents/NFTAnalyseDetail'
import loadable from "@loadable/component";
const PriceChart = loadable(() => import('components/NftAnalyse/PriceChart'))
const AvgPriceAndVolume = loadable(() => import('components/NftAnalyse/AvgPriceAndVolume'));
import NFTHolderIndex from 'components/NFTAnalyseComponents/NFTHolderIndex'
import NFTHoldProfitRank from 'components/NFTAnalyseComponents/NFTHoldProfitRank'
const HoldersAndTraders = loadable(() => import('components/NftAnalyse/HoldersAndTraders'));
const BuyersAndSellersMarket = loadable(() => import('components/NftAnalyse/BuyersAndSellersMarket'));
import NftTradeHistory from 'components/NftAnalyse/NftTradeHistory';

export default function NFTDetail() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { query } = router;
    const { detail } = query;

    const addr = detail && detail.length > 1 ? detail[detail.length - 1] : undefined;
    const isEmpty = typeof addr === 'undefined';
    const { nftDetail } = useSelector((state: AppState) => state.NFTAnalyseReducer);

    useEffect(() => {
        if (addr) {
            const apiClient = new ApiClient<NFTAnalyseDetailAction>()
            apiClient.get(`/market/nft/detail?symbolAddr=${addr}`).then(result => {
                dispatch(getNFTAnalyseDetailSuccess(result.data));
            }, e => {
                router.replace('/_error')
            });
        }
    }, [addr])
    return (<>{isEmpty || (nftDetail as NFTAnalyseDetailAction).symbolAddress == null || !addr || (nftDetail as NFTAnalyseDetailAction).symbolAddress != addr ? <DefinderLoading /> : <NFTDetailBody props={(nftDetail as NFTAnalyseDetailAction)} />}</>)
}

function NFTDetailBody({ props }: { props: NFTAnalyseDetailAction }) {
    
    const { level } = useSelector((state: AppState) => state.userInfo)
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })

    const [showTab, setShowTab] = useState('1')
    const handleMenuClick = (e: MenuInfo) => {
        setShowTab(e.key as string);
    }
    return (
        <>
            <Breadcrumb lastItem={props.symbol} borderBottom={true} />
            <div className="nft-detail">
                <div className="item-box">
                    <div className="block-item" style={{ padding: 0, borderTop: 0, minHeight: 'auto' }}>
                        <NFTAnalyseDetail data={props} />
                    </div>
                </div>
                <Menu className="menu-header" onClick={handleMenuClick} selectedKeys={[showTab]} mode="horizontal">
                    <Menu.Item key="1">{f('nftOverview')}</Menu.Item>
                    <Menu.Item key="2">{f('nftHolder')}</Menu.Item>
                    <Menu.Item key="3">{f('nftTradeHistory')}</Menu.Item>
                </Menu>
                <div className='content'>
                    <div style={{ display: showTab === '1' ? 'block' : 'none' }}>
                        <div>
                            <AvgPriceAndVolume symbolAddr={props.symbolAddress} />
                            <PriceChart symbolAddr={props.symbolAddress} />
                            <div className='item-box' style={{ display: 'flex' }}>
                                <HoldersAndTraders symbolAddr={props.symbolAddress} />
                                {/*<BuyersAndSellersMarket symbolAddr={props.symbolAddress} />*/}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: showTab === '2' ? 'block' : 'none' }}>
                        <div className="item-box">
                            <NFTHolderIndex symbolAddr={props.symbolAddress} />
                        </div>
                        <div className="item-box">
                            <NFTHoldProfitRank symbol={'ETH'} symbolAddr={props.symbolAddress} />
                        </div>
                    </div>
                    <div style={{ display: showTab === '3' ? 'block' : 'none' }}>
                        <div className="item-box">
                            <NftTradeHistory symbolAddr={props.symbolAddress} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}