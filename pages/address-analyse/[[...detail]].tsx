import React, { ChangeEvent, useEffect, useState } from 'react'
import 'styles/address-analyse.less'
import {
    Menu,
    message,
    Spin,
    Tooltip,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
    changeNFTTradeListCondition,
    changeShowTab, changeTradeListCondition, getAddressAnalyseDetailSuccess, setAddressAnalyseDetailLoading, setGoProDialogVisible
} from 'redux/actions/AddressAnalyseAction';
import { LoadingOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl'
import ApiClient from 'utils/ApiClient'
import { useRouter } from 'next/router'
import AddressInfo from 'components/AddressAnalyse/AddressInfo';
import NFTDataOverview from 'components/AddressAnalyse/NFTDataOverview';
import {
    trackPage,
    ADDRESS_ANALYSE,
} from 'utils/analyse/YMAnalyse'
import type { AppState } from 'redux/reducers'
import type { MenuInfo } from 'rc-menu/lib/interface';
import TradeRecords from 'components/AddressAnalyse/TradeRecords';
import { InfoDataProps } from 'redux/types/AddressAnalyseTypes';
import SubscriptionCombination from 'components/Subscription/combination';
import AddressData from 'components/AddressAnalyse/AddressData';
import NFTData from 'components/AddressAnalyse/NFTData';
import NFTTradeRecords from 'components/AddressAnalyse/NFTTradeRecords';
import type { CombinationRecommendDataList, ResponseBodyList } from 'redux/types/AddressCombinationTypes';
import Global from 'utils/Global';
import ProjectsDistribution from 'components/AddressAnalyse/ProjectsDistribution';
import ProfitLossDistribution from 'components/AddressAnalyse/ProfitLossDistribution';
import SubscriptionAnalyse from 'components/Subscription/analyse';
import HistoryProjectsDetail from 'components/AddressAnalyse/HistoryProjectsDetail';
import AssetsDistribution from 'components/AddressAnalyse/AssetsDistribution';
import PotentailRelateAddrs from 'components/AddressAnalyse/PotentailRelateAddrs';
import CreateAddress from 'components/AddressAnalyse/CreateAddress';
import TokenDataOverview from 'components/AddressAnalyse/TokenDataOverview';

interface SearchResult {
    address: any[] | null,
}

const apiClient = new ApiClient<SearchResult>();

function EmptyImage() {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const [keyword, setKeyword] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false);
    const [addressList, setAddressList] = useState<CombinationRecommendDataList[]>([]);
    const router = useRouter();
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    }
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (keyword.length === 0) {
                message.error(f('inputValidAddress'));
                return;
            }

            setVisible(true);
            try {
                const result = await apiClient.get(`/search/all?keyword=${keyword}`)
                if (result.data.address && result.data.address.length > 0) {
                    router.replace(`/address-analyse/${result.data.address[0].address}`);
                } else {
                    message.error(f('inputValidAddress'));
                }
            } catch (e) {
                message.error((e as unknown as Error).message);
            }
            setVisible(false);
        }
    }

    useEffect(() => {
        const href = window.location.href;
        const paths = href.split('/');
        if (paths.length > 0) {
            for (let i = 0; i < paths.length; i++) {
                if (paths[i] === 'address-analyse' && i === paths.length - 1) {
                    const apiClient = new ApiClient<ResponseBodyList<CombinationRecommendDataList[]>>();
                    apiClient.post(`/groupAddr/admin/addr/list`, {
                        data: {
                            page: 1,
                            pageSize: 9,
                        },
                    }).then(success => {
                        if (success.data.list.length > 9) {
                            setAddressList(success.data.list.slice(0, 9));
                        } else {
                            setAddressList(success.data.list);
                        }
                    }, fail => {

                    });
                    break;
                }
            }
        }
    }, []);

    const handleClickAddress = (e: React.MouseEvent, data: CombinationRecommendDataList) => {
        const url = `/address-analyse/${data.addressAll}/${data.id}`;
        Global.openNewTag(e, router, url)
    }

    let recommendAddresses = <></>;
    if (addressList.length > 0) {
        recommendAddresses = (
            <>
                <p style={{ width: 790, color: '#fff' }}>{f('hotAddress')}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '250px 250px 250px', gridRowGap: 10, gridColumnGap: 20 }}>
                    {
                        addressList.map((item: CombinationRecommendDataList, index: number) => {
                            const className = 'mark system-mark';
                            const addressTag = (
                                <span className={className} style={{ display: 'inline-block' }}>
                                    <Tooltip placement="top" title={item.addressTag}>{item.addressTag}</Tooltip>
                                </span>);
                            let address;
                            if (item.addresses.length > 1) {
                                address = f('addressGroup');
                            } else if (item.addresses.length === 1) {
                                address = Global.abbrSymbolAddress(item.addresses[0])
                            } else {
                                if (item.address.startsWith('0x')) {
                                    address = Global.abbrSymbolAddress(item.address)
                                } else {
                                    address = item.address;
                                }
                            }
                            return (
                                <div key={index} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={e => handleClickAddress(e, item)}>
                                    {addressTag}
                                    {address}
                                </div>);
                        })
                    }
                </div>
            </>);
    }

    return (
        <div className="no-data">
            <svg
                className="icon"
                aria-hidden="true"
                style={{
                    width: 200,
                    height: 39,
                }}>
                <use xlinkHref='#icon-search-definder'></use>
            </svg>
            <div className="search-empty">
                <input placeholder={f('searchAddress')} value={keyword} onChange={onChange} onKeyDown={handleKeyDown}></input>
                <svg
                    className="icon"
                    aria-hidden="true"
                    style={{
                        width: '24px',
                        height: '24px',
                        position: 'absolute',
                        top: '12px',
                        left: '33px'
                    }}>
                    <use xlinkHref='#icon-search-address'></use>
                </svg>
                <LoadingOutlined className="loading" spin style={{ display: visible ? 'block' : 'none' }} />
            </div>
            {recommendAddresses}
        </div>
    )
}

const isQueryEmpty = (detail: undefined | string[] | string) => {
    return typeof detail === 'undefined' || !Array.isArray(detail) || (Array.isArray(detail) && detail[0] === '[[...detail]]');
}

export default function AdddressAnalyse() {
    useEffect(() => {
        trackPage(ADDRESS_ANALYSE.url)
        window!.document!.querySelector('.ant-layout-content')!.scrollTop = 0
    }, [])
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id });
    const { showTab } = useSelector((state: AppState) => state.addressAnalyse);
    const dispatch = useDispatch();
    const handleMenuClick = (e: MenuInfo) => {
        dispatch(changeShowTab(e.key as string));
    }

    const router = useRouter();
    const { query } = router;
    const { detail } = query;
    const groupId = detail && detail.length > 1 && Array.isArray(detail) ? detail[1] : undefined;
    const addr = detail && detail.length > 0 && !isQueryEmpty(detail) ? detail[0] : undefined;
    const isEmpty = typeof addr === 'undefined';

    const { addressBaseInfo, goProDialogVisible } = useSelector((state: AppState) => state.addressAnalyse);
    useEffect(() => {
        if (addr !== addressBaseInfo.addrName && addr) {
            const apiClient = new ApiClient<InfoDataProps>()
            dispatch(setAddressAnalyseDetailLoading(true));
            dispatch(changeShowTab("address-data"));
            apiClient.post('/addr/base/info', {
                data: {
                    addrName: addr,
                    groupId,
                }
            }).then(result => {
                dispatch(setAddressAnalyseDetailLoading(false));
                dispatch(getAddressAnalyseDetailSuccess(result.data));
            }, e => {
                dispatch(setAddressAnalyseDetailLoading(false));
                message.error(e.message);
            });
        }
    }, [addr, groupId, addressBaseInfo.addrName]);
    const userInfo = useSelector((state: AppState) => state.userInfo)

    const { baseInfoLoading } = useSelector((state: AppState) => state.addressAnalyse);

    const hideGoProDialog = () => {
        dispatch(setGoProDialogVisible(false));
    }

    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    /*useEffect(() => {
        const onScroll = () => {
            console.log(111);
        }
        window.addEventListener('scroll',onScroll);
        return () => {
            window.removeEventListener('scroll',onScroll);
        }
    },[]);*/

    return (
        <div className="address-analyse" ref={setContainer} style={{ overflowY: 'visible' }}>
            <p className="defi-label">{f('label')}</p>
            {
                isEmpty ?
                    <EmptyImage /> :
                    (
                        <>
                            {baseInfoLoading ?
                                <div className="table-empty" style={{ height: 200 }}>
                                    <Spin>
                                        <div style={{ height: 200, display: 'flex', flexDirection: 'column', color: "rgba(255, 255, 255, 0.85)" }}></div>
                                    </Spin>
                                </div> : <div className="content">
                                    <div className="address-info">
                                        <AddressInfo {...addressBaseInfo} />
                                        <div style={{ display: 'flex' }}>
                                            <TokenDataOverview props={{ ...addressBaseInfo }} addrName={addr} groupId={groupId} />
                                            <NFTDataOverview props={{ ...addressBaseInfo }} addrName={addr} groupId={groupId} />
                                        </div>
                                    </div>
                                </div>}

                            <Menu className="menu-header" onClick={handleMenuClick} selectedKeys={[showTab]} mode="horizontal">
                                <Menu.Item key="address-data">{f('tokenData')}</Menu.Item>
                                <Menu.Item key="address-transactions">{f('tokenTradeRecords')}</Menu.Item>
                                <Menu.Item key="nft-data">{f('nftData')}</Menu.Item>
                                <Menu.Item key="nft-transactions">{f('nftTradeRecords')}</Menu.Item>
                            </Menu>

                            <div className='content'>
                                <div className="address-info" style={{ display: showTab === 'address-data' ? 'block' : 'none' }}>
                                    <AddressData groupId={groupId} addr={addr} level={userInfo.level} />
                                </div>
                                <div className="trade-records" style={{ display: showTab === 'address-transactions' ? 'block' : 'none' }}>
                                    <TradeRecords addressList={addressBaseInfo.addressList} addrName={addr} groupId={groupId} />
                                </div>
                                <div className='nft-data address-info' style={{ display: showTab === 'nft-data' ? 'block' : 'none' }}>
                                    <NFTData groupId={groupId} addr={addr} />
                                </div>
                                <div className='nft-transactions trade-records' style={{ display: showTab === 'nft-transactions' ? 'block' : 'none' }}>
                                    <NFTTradeRecords addressList={addressBaseInfo.addressList} addrName={addr} groupId={groupId} />
                                </div>
                            </div>
                            <SubscriptionCombination
                                visible={goProDialogVisible}
                                onCancel={hideGoProDialog}
                                zIndex={1001}
                                text={{
                                    title: (showTab === 'address-data' || showTab === 'address-transactions') ? f('notAllowedToSeeTokenInvestDetailTitle') : f('notAllowedToSeeNFTInvestDetailTitle'),
                                    desc: (showTab === 'address-data' || showTab === 'address-transactions') ? f('notAllowedToSeeTokenInvestDetailContent') : f('notAllowedToSeeNFTInvestDetailContent'),
                                    okText: f('subscriptionBtn'),
                                }} />
                        </>
                    )
            }
        </div>
    );
}