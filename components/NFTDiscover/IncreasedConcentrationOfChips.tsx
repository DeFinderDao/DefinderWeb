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
import { IncreaseProjectItem, NFTDiscoverResponse } from 'redux/types/NftDiscoverTypes';
import OnlyNewProject from './OnlyNewProject';

interface Props {
    showMore: boolean
}
export default function IncreasedConcentrationOfChips({ showMore }: Props) {
    const { formatMessage } = useIntl();
    const f = (id: string) => formatMessage({ id });
    const router = useRouter();
    const { level } = useSelector((state: AppState) => state.userInfo);

    const [isShowNew, setIsShowNew] = useState(false);
    const [sortInfo, setSortInfo] = useState<{ sortFiled: null | string, sort: null | number }>({
        sortFiled: null,
        sort: null,
    });
    const [sortedInfo, setSortedInfo] = useState<SorterResult<IncreaseProjectItem>>({})
    const columns = [
        {
            title: f('project'),
            dataIndex: 'symbol',
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
            title: `${f('positionsNumber')}/${f('proportion')}`,
            dataIndex: 'holdNumRate',
            key: 'holdNumRate',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'holdNumRate' ? sortedInfo.order : undefined,
            render: (text: string, record: IncreaseProjectItem) => {
                let flow = Global.formatIncreaseNumber(record.holdNumRate)
                return (
                    <span className="token table-item-color">
                        <span>{Global.formatBigNum(record.holdNum)}</span>
                        &nbsp;&nbsp;
                        {flow}
                    </span>)
            }
        },
        {
            title: f('percentage'),
            dataIndex: 'hold24hRate',
            key: 'hold24hRate',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'hold24hRate' ? sortedInfo.order : undefined,
            render: (text: string, record: IncreaseProjectItem) => {
                return (<span>{Global.formatIncreaseNumber(record.hold24hRate)}</span>)
            }
        },
        {
            title: f('changeRange'),
            dataIndex: 'changRange',
            key: 'changRange',
            align: 'center' as const,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'changRange' ? sortedInfo.order : undefined,
            render: (text: string, record: IncreaseProjectItem) => {
                return (<span>{Global.formatIncreaseNumber(record.changRange)}</span>)
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
                apiType: 5,
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
                        {f('increasedConcentrationOfChipsTitle')}
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
                            setSortedInfo(sorter)
                            setLoading(true);
                            if (sorter.order == 'ascend') {
                                getData(1, sorter.field as string, 1,isShowNew)
                                setSortInfo({
                                    sortFiled: sorter.field as string,
                                    sort: 1,
                                })
                            } else if (sorter.order == 'descend') {
                                getData(1, sorter.field as string, 0,isShowNew)
                                setSortInfo({
                                    sortFiled: sorter.field as string,
                                    sort: 0,
                                })
                            } else {
                                getData(1, null, null,isShowNew)
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
                                        href={`/nft-discover-detail/nft-discover/increased-concentration-of-chips`}
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