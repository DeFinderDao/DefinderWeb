import { Divider, Table, TablePaginationConfig } from 'antd';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import React, { Key, useEffect, useState } from 'react';
import Global from 'utils/Global';
import { DefaultLocale } from 'utils/env';
import ApiClient from 'utils/ApiClient';
import Link from 'next/link';
import { SorterResult, SortOrder, TableCurrentDataSource } from 'antd/lib/table/interface';
import { TokenLogo } from 'components/TokenLogo';
import ColumnTwoSort from 'components/Table/ColumnTwoSort';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/reducers';
import WaterMarkContent from 'components/WaterMarkContent';
import SubscriptionSmartMoneyDiscover from 'components/Subscription/smartMoneyDiscover';
import UpdateTimeCom from 'components/UpdateTimeCom';
import { NFTDiscoverResponse, IncreaseProjectItem } from 'redux/types/NftDiscoverTypes';
import OnlyNewProject from './OnlyNewProject';

interface Props {
    showMore: boolean
}
export default function NFTHoldingAddressesIncreaseRapidly({ showMore }: Props) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { level } = useSelector((state: AppState) => state.userInfo);

    const [isShowNew, setIsShowNew] = useState(false);
    const [sortInfo, setSortInfo] = useState<{ sortFiled: null | string, sort: null | number }>({
        sortFiled: null,
        sort: null,
    });
    const comSortClick = (val: SortOrder | null, key: string, num: number) => {
        if (num == 1) {
            setClear1(false)
            setClear2(true)
        } else {
            setClear1(true)
            setClear2(false)
        }
        setSortedInfo({})
        setLoading(true);
        if (val == 'ascend') {
            getData(1, key, 1, isShowNew)
            setSortInfo({
                sortFiled: key,
                sort: 1,
            })
        } else if (val == 'descend') {
            getData(1, key, 0, isShowNew)
            setSortInfo({
                sortFiled: key,
                sort: 0,
            })
        } else {
            getData(1, null, null, isShowNew)
            setSortInfo({
                sortFiled: null,
                sort: null,
            })
        }
    }
    const [clear1, setClear1] = useState(false)
    const [clear2, setClear2] = useState(false)
    const [sortedInfo, setSortedInfo] = useState<SorterResult<IncreaseProjectItem>>({})
    const columns = [
        {
            title: f('project'),
            dataIndex: 'symbol',
            width: '20%',
            align: 'left' as const,
            render: (text: string, record: IncreaseProjectItem) => {
                return (
                    <span style={{ paddingLeft: 12, whiteSpace: 'nowrap' }}>
                        <TokenLogo src={record.logo} style={{ width: 16, height: 16, marginRight: 10 }} />
                        {record.symbol}
                    </span>)
            }
        },
        {
            title: f('currentHoldingAddress'),
            dataIndex: 'addressNum',
            key: 'addressNum',
            width: '20%',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'addressNum' ? sortedInfo.order : undefined,
            render: (text: string, record: IncreaseProjectItem) => {
                return (<span>{Global.formatBigNum(text)}</span>)
            }
        },
        {
            title: () => {
                return (
                    <ColumnTwoSort
                        sortOne={{ name: 'addAddress24', key: 'address24hNum' }}
                        sortTwo={{ name: 'gain', key: 'address24hIncrease' }}
                        clear={clear1}
                        comSortClick={(val, key) => { comSortClick(val, key, 1) }}
                    />
                )
            },
            dataIndex: 'address24hIncrease',
            width: '30%',
            align: 'center' as const,
            render: (text: string, record: IncreaseProjectItem) => {
                let flow = Global.formatIncreaseNumber(record.address24hIncrease)
                return (
                    <span className="token table-item-color">
                        <span>{Global.formatBigNum(record.address24hNum)}</span>
                        &nbsp;&nbsp;
                        {flow}
                    </span>)
            }
        },
        {
            title: () => {
                return (
                    <ColumnTwoSort
                        sortOne={{ name: 'addAddress4', key: 'address4hNum' }}
                        sortTwo={{ name: 'gain', key: 'address4hIncrease' }}
                        clear={clear2}
                        comSortClick={(val, key) => { comSortClick(val, key, 2) }}
                    />
                )
            },
            dataIndex: 'address4hIncrease',
            width: '30%',
            align: 'center' as const,
            render: (text: string, record: IncreaseProjectItem) => {
                let flow = Global.formatIncreaseNumber(record.address4hIncrease);
                return (
                    <span>
                        <span>{Global.formatBigNum(record.address4hNum)}</span>
                        &nbsp;&nbsp;
                        {flow}
                    </span>)
            }
        },
    ];

    useEffect(() => {
        if (level === 0 && !showMore) {
            return
        }
        getData(1, null, null, isShowNew)
    }, [level, showMore]);
    const getData = (pageNo: number, sortFiled: string | null, sort: string | null | number, isShowNew: boolean) => {
        const apiClient = new ApiClient<NFTDiscoverResponse>();
        apiClient.post('/nft/discover/increase/project/list', {
            data: {
                isShowNew: isShowNew ? 2 : 1,
                sortFile: sortFiled ? sortFiled : null,
                sort: sortFiled ? sort || 2 : null,
                apiType: 3,
                pageNo: pageNo,
                pageSize: showMore ? 5 : level == 0 ? 10 : 100,
            },
        }).then(success => {
            setData(success as any as NFTDiscoverResponse);
            setLoading(false);
        }, fail => {
            setLoading(false);
        });
    }

    const [data, setData] = useState<NFTDiscoverResponse>({
        data: { list: [] }
    });
    const [loading, setLoading] = useState(true);

    const { locale = DefaultLocale } = useRouter();

    const change = (checked: boolean) => {
        setIsShowNew(checked);
        getData(1, sortInfo.sortFiled, sortInfo.sort, checked)
    }
    return (
        <div className="discover-item">
            {showMore ?
                <div className="discover-item-title">
                    <div className="title-left" style={{ lineHeight: locale == 'zh' ? 'normal' : '18px' }}>
                        {f('NFTHoldingAddressesIncreaseRapidlyTitle')}
                    </div>
                    <OnlyNewProject disabled={level == 0} onChange={change} />
                </div>
                :
                <div className="discover-detail-item-title defi-align-center">
                    <OnlyNewProject disabled={level == 0} onChange={change} />
                    &nbsp;&nbsp;&nbsp;
                    <UpdateTimeCom updateTime={data.updateTime} />
                </div>
            }
            <div className="common-table"
                style={showMore ? { paddingLeft: 10, paddingRight: 10, paddingBottom: 15, margin: 0 } : {}}>
                <Table
                    columns={columns}
                    rowKey="address"
                    dataSource={showMore ? data.data.list.slice(0, level == 0 ? 2 : 5) as IncreaseProjectItem[] : data.data.list as IncreaseProjectItem[]}
                    loading={loading}
                    onRow={record => {
                        return {
                            onClick: event => {
                                Global.openNewTag(event, router, `/nft-analyse-detail/nft-analyse/${record.address}`)
                            },   
                        };
                    }}
                    pagination={false}
                    onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<IncreaseProjectItem> | SorterResult<IncreaseProjectItem>[], extra: TableCurrentDataSource<IncreaseProjectItem>) => {
                        if (!Array.isArray(sorter)) {
                            setClear1(true)
                            setClear2(true)
                            setSortedInfo(sorter)
                            setLoading(true);
                            if (sorter.order == 'ascend') {
                                getData(1, sorter.field as string, 1, isShowNew)
                                setSortInfo({
                                    sortFiled: sorter.field as string,
                                    sort: 1,
                                })
                            } else if (sorter.order == 'descend') {
                                getData(1, sorter.field as string, 0, isShowNew)
                                setSortInfo({
                                    sortFiled: sorter.field as string,
                                    sort: 0,
                                })
                            } else {
                                getData(1, null, null, isShowNew)
                                setSortInfo({
                                    sortFiled: null,
                                    sort: null,
                                })
                            }
                        }
                    }}
                />
                <WaterMarkContent position={showMore ? 'absolute' : 'fixed'} bottom={level == 0 ? 230 : showMore ? 100 : Global.setDiscoverWaterMarkBottom({ windowH: window.innerHeight, dataL: data.data.list.length })} />
                {!loading && data.data.list.length > 0 ? (showMore ? (
                    level == 0 ? <SubscriptionSmartMoneyDiscover row={data.data.list.length > 2 ? 2 : data.data.list.length} columns={columns} data={data.data.list[0]} /> :
                        <div style={{ position: 'relative' }}>
                            <div className="view-more">
                                <span>
                                    +
                                    <Link
                                        href={`/nft-discover-detail/nft-discover/nft-holding-addresses-increase-rapidly`}
                                    >
                                        <a>{f('NFTDiscoverSeeMore')}</a>
                                    </Link>
                                </span>
                            </div>
                            <div style={{ position: 'absolute', right: 0, top: 3 }}>
                                <UpdateTimeCom updateTime={data.updateTime} />
                            </div>
                        </div>
                ) : (level == 0 ? null : <div className="btnBox">
                    <Divider className="no-more">
                        {f('noMore')}
                    </Divider>
                </div>)) : <div style={{ height: 28, marginTop: 30 }}></div>}
            </div>
        </div>
    );
}