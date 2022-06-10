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

interface Props {
    showMore: boolean
}

export default function HolderAddressIncrease({ showMore }: Props) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { level } = useSelector((state: AppState) => state.userInfo);

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
            getData(1, key, 1)
        } else if (val == 'descend') {
            getData(1, key, 0)
        } else {
            getData(1, null, null)
        }
    }
    const [clear1, setClear1] = useState(false)
    const [clear2, setClear2] = useState(false)
    const [sortedInfo, setSortedInfo] = useState<SorterResult<HolderAddressIncreaseItem>>({})
    const columns = [
        {
            title: f('token'),
            dataIndex: 'symbol',
            width: '20%',
            align: 'left' as const,
            render: (text: string, record: HolderAddressIncreaseItem) => {
                return (
                    <span style={{ paddingLeft: 12, whiteSpace: 'nowrap' }}>
                        <TokenLogo src={record.symbolLogo} style={{ width: 16, height: 16, marginRight: 10 }} />
                        {record.symbol}
                    </span>)
            }
        },
        {
            title: f('currentAddressNumber'),
            dataIndex: 'holdAddressCount',
            key: 'holdAddressCount',
            width: '20%',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'holdAddressCount' ? sortedInfo.order : undefined,
            render: (text: string, record: HolderAddressIncreaseItem) => {
                return (<span>{text}</span>)
            }
        },
        {
            title: () => {
                return (
                    <ColumnTwoSort
                        sortOne={{ name: 'newAddress24h01', key: 'holdIncreaseCount24h' }}
                        sortTwo={{ name: 'newAddress24h02', key: 'holdCountIncrease24h' }}
                        clear={clear1}
                        comSortClick={(val, key) => { comSortClick(val, key, 1) }}
                    />
                )
            },
            dataIndex: 'holdCountIncrease24h',
            width: '30%',
            align: 'center' as const,
            render: (text: string, record: HolderAddressIncreaseItem) => {
                let flow = Global.formatIncreaseNumber(record.holdCountIncrease24h)
                return (
                    <span className="token table-item-color">
                        <span>{record.holdIncreaseCount24h}</span>
                        &nbsp;&nbsp;
                        {flow}
                    </span>)
            }
        },
        {
            title: () => {
                return (
                    <ColumnTwoSort
                        sortOne={{ name: 'newAddress4h01', key: 'holdIncreaseCount4h' }}
                        sortTwo={{ name: 'newAddress4h02', key: 'holdCountIncrease4h' }}
                        clear={clear2}
                        comSortClick={(val, key) => { comSortClick(val, key, 2) }}
                    />
                )
            },
            dataIndex: 'holdCountIncrease4h',
            width: '30%',
            align: 'center' as const,
            render: (text: string, record: HolderAddressIncreaseItem) => {
                let flow = Global.formatIncreaseNumber(record.holdCountIncrease4h);
                return (
                    <span>
                        <span>{record.holdIncreaseCount4h}</span>
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
        getData(1, null, null)
    }, [level, showMore]);
    const getData = (pageNo: number, sortFiled: string | null, sort: string | null | number) => {
        const apiClient = new ApiClient<HolderAddressIncreaseResponse>();
        apiClient.get(`/discover/address/list/v2?pageNo=${pageNo}&pageSize=${showMore ? 5 : level == 0 ? 10 : 100}${sortFiled ? `&sortFiled=${sortFiled}&sort=${sort}` : ''}`).then(success => {
            setData(success as any as HolderAddressIncreaseResponse);
            setLoading(false);
        }, fail => {
            setLoading(false);
        });
    }

    const [data, setData] = useState<HolderAddressIncreaseResponse>({
        data: { list: [] }
    });
    const [loading, setLoading] = useState(true);

    const { locale = DefaultLocale } = useRouter();

    return (
        <div className="discover-item">
            {showMore ?
                <div className="discover-item-title">
                    <div className="title-left" style={{ lineHeight: locale == 'zh' ? 'normal' : '18px' }}>
                        {f('priceFlow')}
                    </div>
                    {
                        level == 0 ?
                            null
                            :
                            <UpdateTimeCom updateTime={data.updateTime} />
                    }
                </div>
                :
                <div className="discover-detail-item-title">
                    <UpdateTimeCom updateTime={data.updateTime} />
                </div>
            }
            <div className="common-table"
                style={showMore ? { paddingLeft: 10, paddingRight: 10, paddingBottom: 15, margin: 0 } : {}}>
                <Table
                    columns={columns}
                    rowKey="symbolAddr"
                    dataSource={showMore ? data.data.list.slice(0, level == 0 ? 2 : 5) : data.data.list}
                    loading={loading}
                    onRow={record => {
                        return {
                            onClick: event => {
                                Global.openNewTag(event, router, `/market-detail/market-page/${record.symbolAddr}`)
                            }, // 点击行
                        };
                    }}
                    pagination={false}
                    onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<HolderAddressIncreaseItem> | SorterResult<HolderAddressIncreaseItem>[], extra: TableCurrentDataSource<HolderAddressIncreaseItem>) => {
                        if (!Array.isArray(sorter)) {
                            setClear1(true)
                            setClear2(true)
                            setSortedInfo(sorter)
                            setLoading(true);
                            if (sorter.order == 'ascend') {
                                getData(1, sorter.field as string, 1)
                            } else if (sorter.order == 'descend') {
                                getData(1, sorter.field as string, 0)
                            } else {
                                getData(1, null, null)
                            }
                        }
                    }}
                />
                <WaterMarkContent position={showMore ? 'absolute' : 'fixed'} bottom={level == 0 ? 230 : showMore ? 100 : Global.setDiscoverWaterMarkBottom({ windowH: window.innerHeight, dataL: data.data.list.length })} />
                {!loading && data.data.list.length > 0 ? (showMore ? (
                    level == 0 ? <SubscriptionSmartMoneyDiscover row={data.data.list.length > 2 ? 2 : data.data.list.length} columns={columns} data={data.data.list[0]} /> :
                        <div className="view-more">
                            <span>
                                +
                                <Link
                                    href={`/market-discover-detail/market-discover/holderAddressIncrease`}
                                >
                                    <a>{f('marketDetailSeeMore')}</a>
                                </Link>
                            </span>
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

interface HolderAddressIncreaseResponse {
    updateTime?: number,
    data: { list: HolderAddressIncreaseItem[] }
}

interface HolderAddressIncreaseItem {
    symbol: string,
    symbolAddr: string,
    symbolLogo: string,
    holdAddressCount: number,
    holdIncreaseCount24h: number,
    holdCountIncrease24h: string,
    holdIncreaseCount4h: number,
    holdCountIncrease4h: string
}