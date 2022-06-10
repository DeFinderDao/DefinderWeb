import { useIntl } from 'react-intl';
import { Divider, Table, TablePaginationConfig } from 'antd';
import Global from 'utils/Global';
import { DefaultLocale } from 'utils/env';
import { useRouter } from 'next/router';
import React, { Key, useEffect, useState } from 'react';
import ApiClient from 'utils/ApiClient';
import Link from 'next/link';
import { SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface';
import { TokenLogo } from 'components/TokenLogo';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/reducers';
import WaterMarkContent from 'components/WaterMarkContent';
import SubscriptionSmartMoneyDiscover from 'components/Subscription/smartMoneyDiscover';
import UpdateTimeCom from 'components/UpdateTimeCom';

interface Props {
    showMore: boolean
}

export default function NewTokenIncreaseRapidly({ showMore }: Props) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const { level } = useSelector((state: AppState) => state.userInfo);
    const columns = [
        {
            title: f('token'),
            dataIndex: 'symbol',
            width: '25%',
            align: 'left' as const,
            render: (text: string, record: NewTokenIncreaseRapidlyItem) => {
                return (
                    <span style={{ paddingLeft: 12 }}>
                        <TokenLogo src={record.symbolLogo} style={{ width: 16, height: 16, marginRight: 10 }} />
                        {record.symbol}
                    </span>)
            }
        },
        {
            title: f('onlineTime'),
            dataIndex: 'onlineTime',
            width: '25%',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: string, record: NewTokenIncreaseRapidlyItem) => {
                return (<span>{Global.distanceFromCurrent(record.onlineTime, locale)}</span>)
            }
        },
        {
            title: f('priceLimit24hr'),
            dataIndex: 'increase24h',
            width: '25%',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: string, record: NewTokenIncreaseRapidlyItem) => {
                return Global.formatIncreaseNumber(record.increase24h);
            }
        },
        {
            title: f('priceLimit4hr'),
            dataIndex: 'increase4h',
            width: '25%',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: string, record: NewTokenIncreaseRapidlyItem) => {
                return Global.formatIncreaseNumber(record.increase4h)
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
        const apiClient = new ApiClient<NewTokenIncreaseRapidlyItemResponse>();
        apiClient.get(`/discover/newCoin/list/v2?pageNo=${pageNo}&pageSize=${showMore ? 5 : level == 0 ? 10 : 100}${sortFiled ? `&sortFiled=${sortFiled}&sort=${sort}` : ''}`).then(success => {
            setData(success as any as NewTokenIncreaseRapidlyItemResponse);
            setLoading(false);
        }, fail => {
            setLoading(false);
        });
    }

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState<NewTokenIncreaseRapidlyItemResponse>({
        data: { list: [] }
    });

    return (
        <div className="discover-item">
            {showMore ?
                <div className="discover-item-title">
                    <div className="title-left">
                        {f('newTokenIncreaseRapidly')}
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
                style={showMore ? { paddingLeft: 10, paddingRight: 10, paddingBottom: 15, margin: 0 } : {}}
            >
                <Table
                    columns={columns}
                    rowKey="symbolAddr"
                    dataSource={showMore ? data.data.list.slice(0, level == 0 ? 2 : 5) : data.data.list}
                    loading={loading}
                    onRow={record => {
                        return {
                            onClick: event => {
                                Global.openNewTag(event, router, `/market-detail/market-page/${record.symbolAddr}`)
                            },   
                        };
                    }}
                    pagination={false}
                    onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<NewTokenIncreaseRapidlyItem> | SorterResult<NewTokenIncreaseRapidlyItem>[], extra: TableCurrentDataSource<NewTokenIncreaseRapidlyItem>) => {
                        if (!Array.isArray(sorter)) {
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
                                    href={`/market-discover-detail/market-discover/newTokenIncreaseRapidly`}
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

interface NewTokenIncreaseRapidlyItemResponse {
    updateTime?: number,
    data: { list: NewTokenIncreaseRapidlyItem[] }
}

interface NewTokenIncreaseRapidlyItem {
    symbol: string,
    symbolAddr: string,
    symbolLogo: string,
    onlineTime: number,
    increase24h: number,
    increase4h: number,
}

