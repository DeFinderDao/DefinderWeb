import { useIntl } from 'react-intl';
import { Divider, Table, TablePaginationConfig } from 'antd';
import { useRouter } from 'next/router';
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import React, { Key, useEffect, useState } from 'react';
import Global from 'utils/Global';
import { DefaultLocale } from 'utils/env';
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

export default function ConvergenceRateIncrease({ showMore }: Props) {

    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { locale = DefaultLocale } = router;
    const { level } = useSelector((state: AppState) => state.userInfo);

    const columns = [
        {
            title: f('token'),
            dataIndex: 'symbol',
            width: '20%',
            align: 'left' as const,
            render: (text: string, record: ConvergenceRateIncreaseItem) => {
                return (
                    <span style={{ paddingLeft: 12, whiteSpace: 'nowrap' }}>
                        <TokenLogo src={record.symbolLogo} style={{ width: 16, height: 16, marginRight: 10 }} />
                        {record.symbol}
                    </span>)
            }
        },
        {
            title: f('holderNumberRate100'),
            dataIndex: 'addressPercentage',
            width: '30%',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: string, record: ConvergenceRateIncreaseItem) => {
                return (<span>{`${text}%`}</span>)
            }
        },
        {
            title: f('holderNumberRate3days'),
            dataIndex: 'percentage3d',
            width: locale === DefaultLocale ? '30%' : '25%',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: string, record: ConvergenceRateIncreaseItem) => {
                return (<span>{`${text}%`}</span>)
            }
        },
        {
            title: f('changeFlow'),
            dataIndex: 'increase',
            width: locale === DefaultLocale ? '20%' : '25%',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: string, record: ConvergenceRateIncreaseItem) => {
                return Global.formatIncreaseNumber(record.increase)
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
        const apiClient = new ApiClient<ConvergenceRateIncreaseResponse>();
        apiClient.get(`/discover/counterCentralized/list/v2?pageNo=${pageNo}&pageSize=${showMore ? 5 : level == 0 ? 10 : 100}${sortFiled ? `&sortFiled=${sortFiled}&sort=${sort}` : ''}`).then(success => {
            setData(success as any as ConvergenceRateIncreaseResponse);
            setLoading(false);
        }, fail => {
            setLoading(false);
        });
    }

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState<ConvergenceRateIncreaseResponse>({
        data: { list: [] }
    });

    return (
        <div className="discover-item">
            {showMore ?
                <div className="discover-item-title">
                    <div className="title-left">
                        {f('convergenceRateIncrease')}
                        <Tooltip
                            placement="right"
                            title={
                                <>
                                    <div>{f('convergenceRateIncreaseTip')}</div>
                                </>}
                        >
                            <QuestionCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    marginLeft: '10px',
                                }}
                            />
                        </Tooltip>
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
                    onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<ConvergenceRateIncreaseItem> | SorterResult<ConvergenceRateIncreaseItem>[], extra: TableCurrentDataSource<ConvergenceRateIncreaseItem>) => {
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
                                    href={`/market-discover-detail/market-discover/convergenceRateIncrease`}
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

interface ConvergenceRateIncreaseResponse {
    updateTime?: number,
    data: { list: ConvergenceRateIncreaseItem[] }
}

interface ConvergenceRateIncreaseItem {
    symbol: string,
    symbolLogo: string,
    symbolAddr: string,
    addressPercentage: string,
    percentage_3d: string,
    increase: string,
}

