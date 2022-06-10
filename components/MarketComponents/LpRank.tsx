import { useIntl } from 'react-intl'
import React, { useState, useEffect, Key } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Spin, Button, message, Empty, Divider, BackTop } from 'antd'
import Link from 'next/link'
import Global from 'utils/Global'
import AddressDetail from 'components/MarketComponents/AddressDetail'
import 'styles/MarketComponents/Comparison.less'
import {
    getLPRankList,
    getLPRankPie,
    lpRankListLoading as setLpRankListLoading
} from 'redux/actions/MarketComponents/MarketComponentsAction'
import loadable from '@loadable/component'
import { UpCircleOutlined } from '@ant-design/icons'
import { AppState } from 'redux/reducers'
import { LPRankItemResponse, LPRankListParams, LPRankPieItemResponse } from 'redux/types/MarketComponentsTypes'
import { ColumnsType, ColumnType, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface'
import { ANT_CHARTS_DARK } from 'utils/env'
import DefinEmpty from 'components/Header/definEmpty'
import WaterMarkContent from 'components/WaterMarkContent'

const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))

interface LPRankProps {
    symbolAddr: string,
    pageSize: number,
    showMore?: boolean,
    symbol: string,
}

export default function LPRank({
    symbolAddr,
    pageSize,
    showMore,
    symbol,
}: LPRankProps) {
    const router = useRouter()
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    
    const [LPRankCondition, setLPRankCondition] = useState<LPRankListParams>({
        symbolAddr: symbolAddr,
        field: null,
        sort: null,
        pageNo: 1,
        pageSize: pageSize,
    })
    
    const [oldSymbolAddr, setOldSymbolAddr] = useState(symbolAddr)
    useEffect(() => {
        if (symbolAddr != oldSymbolAddr) {
            setOldSymbolAddr(oldSymbolAddr)
            setLPRankCondition({
                ...LPRankCondition,
                symbolAddr: symbolAddr,
            })
        }
    }, [symbolAddr])
    useEffect(() => {
        dispatch(getLPRankList(LPRankCondition))
        if (!showMore) {
            dispatch(getLPRankPie({ symbolAddr: symbolAddr }))
        }
    }, [LPRankCondition])
    //loading
    const lpRankListLoading = useSelector(
        (state: AppState) => state.comparisonReducer.lpRankListLoading
    )
    //noMore
    const noMore = useSelector((state: AppState) => state.comparisonReducer.noMore)
    const LPRankPieData = useSelector(
        (state: AppState) => state.comparisonReducer.LPRankPieData?.symbolList || []
    )
    const lpRankPieLoading = useSelector(
        (state: AppState) => state.comparisonReducer.lpRankPieLoading
    )
    
    const LPRankData = useSelector(
        (state: AppState) => state.comparisonReducer.LPRankData
    )
    
    const LPRankList = useSelector(
        (state: AppState) => state.comparisonReducer.LPRankData?.list || []
    )
    
    const warningColumns: ColumnsType<LPRankItemResponse> = [
        {
            title: f('marketDetailAddress'),
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => {
                return (
                    <AddressDetail
                        symbol={symbol}
                        address={record.address}
                        symbolAddr={record.symbolAddr}
                        titles={record.titles}
                        label={record.addressLabel}
                    />
                )
            },
        },
        {
            title: f('marketDetailLPRankValue'),
            dataIndex: 'value',
            key: 'value',
            align: 'right',
            render: (text, record) => {
                return '$ ' + Global.formatBigNum(record.value)
            },
        },
        {
            title: f('marketDetailLPRankRate'),
            dataIndex: 'rate',
            key: 'rate',
            align: 'right',
            render: (text, record) => {
                return Global.formatNum(record.rate) + '%'
            },
        },
        {
            title: f('marketDetailLPRankAsset'),
            dataIndex: 'asset',
            key: 'asset',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return <span>$ {Global.formatBigNum(record.asset)}</span>
            },
        },
    ]
    const warningColumns1: ColumnsType<LPRankItemResponse> = [
        {
            title: '#',
            key: 'renderIndex',
            align: 'center',
            width: 55,
            render: (text, record, index) => {
                return <span style={{ width: '40', textAlign: 'center' }}>{`${index + 1}`}</span>;
            }
        },
        {
            title: f('marketDetailAddress'),
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => {
                return (
                    <AddressDetail
                        symbol={symbol}
                        address={record.address}
                        symbolAddr={record.symbolAddr}
                        titles={record.titles}
                        label={record.addressLabel}
                    />
                )
            },
        },
        {
            title: f('marketDetailLPRankValue'),
            dataIndex: 'value',
            key: 'value',
            align: 'right',
            render: (text, record) => {
                return '$ ' + Global.formatBigNum(record.value)
            },
        },
        {
            title: f('marketDetailLPRankRate'),
            dataIndex: 'rate',
            key: 'rate',
            align: 'right',
            render: (text, record) => {
                return Global.formatNum(record.rate) + '%'
            },
        },
        {
            title: f('marketDetailLPRankRank'),
            dataIndex: 'rank',
            key: 'rank',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return Global.formatNum(record.rank)
            },
        },
        {
            title: f('marketDetailLPRankAsset'),
            dataIndex: 'asset',
            key: 'asset',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return <span>$ {Global.formatBigNum(record.asset)}</span>
            },
        },
        {
            title: f('marketDetailLPRankBalance'),
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return Global.formatBigNum(record.balance) + ' ' + symbol
            },
        },
        {
            title: f('marketDetailLPRankHoldCost'),
            dataIndex: 'holdCost',
            key: 'holdCost',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return <span>$ {Global.formatBigNum(record.holdCost)}</span>
            },
        },
    ]
    const { pageMode, level } = useSelector((state: AppState) => state.userInfo);

    const scrollTop = () => {
        if (!showMore) {
            const element = document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement;
            element.scrollTop = 0;
        }
    }

    const currencyAddrRankScroll = () => {
        const fatherHeight = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).offsetHeight
        const bodyHeight = (document.getElementsByClassName('ant-table-wrapper')[0] as HTMLDivElement).offsetHeight
        const bodyTop = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).scrollTop
        const dom = (document.querySelector('.currency-addr-rank-scroll .ant-spin') as HTMLDivElement)
        if (dom) {
            dom.style.top = `${bodyTop}px`
        }
        if (bodyHeight - bodyTop < fatherHeight + 100) {
            if (bodyTop != 0 && lpRankPieLoading === false) {
                if (LPRankList && LPRankList.length > 0 && !lpRankPieLoading && !noMore) {
                    if (dom) {
                        dom.style.top = `${bodyTop}px`
                    }
                    getMoreData();
                }
            }
        }

    }

    const getMoreData = async () => {
        dispatch(setLpRankListLoading(true));
        setLPRankCondition({
            ...LPRankCondition,
            pageNo: LPRankCondition.pageNo + 1,
        })
    }

    return (
        <div className="comparison">
            <div className="table-box">
                {!showMore ? (
                    <div
                        style={{
                            width: '550px',
                            height: '450px',
                            margin: '0 auto',
                            marginBottom: '20px',
                        }}
                    >
                        {LPRankPieData.length > 0
                            ?
                            <MemoPieChart pageMode={pageMode} LPRankPieData={LPRankPieData} />
                            :
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    paddingTop: 122
                                }}
                            >
                                <DefinEmpty spinning={lpRankPieLoading} />
                            </div>}
                    </div>
                ) : null}
                {LPRankList && LPRankList.length > 0 ? (
                    <div className="common-table" style={{ margin: 0 }}>
                        {showMore ? (
                            <TableList
                                rowKey={(record: LPRankItemResponse, index?: number) => {
                                    return `${record.symbolAddr}${index}` as Key;
                                }}
                                groupList={LPRankList.slice(0, pageSize)}
                                groupColumns={warningColumns}
                                loading={lpRankListLoading}
                                onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<LPRankItemResponse> | SorterResult<LPRankItemResponse>[], extra: TableCurrentDataSource<LPRankItemResponse>) => {
                                    if (!Array.isArray(sorter)) {
                                        if (sorter.order == 'ascend') {
                                            setLPRankCondition({
                                                ...LPRankCondition,
                                                sort: 1,
                                                field: sorter.field as string,
                                            })
                                        } else if (sorter.order == 'descend') {
                                            setLPRankCondition({
                                                ...LPRankCondition,
                                                sort: 2,
                                                field: sorter.field as string,
                                            })
                                        } else {
                                            setLPRankCondition({
                                                ...LPRankCondition,
                                                sort: null,
                                                field: null,
                                            })
                                        }
                                    }
                                }}
                            />) : (
                            <div className="currency-addr-rank-scroll" style={level == 0 ? {} : {
                                position: 'relative', height: window.innerHeight < 850
                                    ? window.innerHeight - 100
                                    : window.innerHeight - 250, overflow: 'auto'
                            }} onScroll={currencyAddrRankScroll}>
                                <TableList
                                    rowKey={(record: LPRankItemResponse, index?: number) => {
                                        return `${record.symbolAddr}${index}` as Key;
                                    }}
                                    groupList={LPRankList}
                                    groupColumns={warningColumns1}
                                    loading={lpRankListLoading}
                                    onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<LPRankItemResponse> | SorterResult<LPRankItemResponse>[], extra: TableCurrentDataSource<LPRankItemResponse>) => {
                                        if (!Array.isArray(sorter)) {
                                            scrollTop();
                                            if (sorter.order == 'ascend') {
                                                setLPRankCondition({
                                                    ...LPRankCondition,
                                                    sort: 1,
                                                    field: sorter.field as string,
                                                    pageNo: 1,
                                                })
                                            } else if (sorter.order == 'descend') {
                                                setLPRankCondition({
                                                    ...LPRankCondition,
                                                    sort: 2,
                                                    field: sorter.field as string,
                                                    pageNo: 1,
                                                })
                                            } else {
                                                setLPRankCondition({
                                                    ...LPRankCondition,
                                                    sort: null,
                                                    field: null,
                                                    pageNo: 1,
                                                })
                                            }
                                        }
                                    }}
                                />
                                <BackTop target={() => {
                                    return document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement
                                }}>
                                    <div style={{
                                        height: 40,
                                        width: 40,
                                        borderRadius: 4,
                                        backgroundColor: 'rgba(16, 136, 233, 0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}><UpCircleOutlined style={{ fontSize: 27 }} /></div>
                                </BackTop>
                            </div>
                        )}
                        <WaterMarkContent />
                        {showMore && LPRankList.length >= 10 ? (
                            <div className="view-more">
                                <span>
                                    +
                                    <Link
                                        href={`/market-detail-more/market-page/market-detail/LpRank/${symbolAddr}`}
                                    >
                                        <a>{f('marketDetailSeeMore')}</a>
                                    </Link>
                                </span>
                            </div>
                        ) : showMore ? null : (
                            <div className="btnBox">
                                {!lpRankListLoading && noMore && level != 0 ? (
                                    <Divider className="no-more">
                                        {f('noMore')}
                                    </Divider>
                                ) : null}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="table-empty">
                        <DefinEmpty spinning={lpRankListLoading} />
                    </div>
                )}
            </div>
        </div>
    )
}

interface TableListProps<RecordType> {
    rowKey: (record: LPRankItemResponse, index?: number) => Key,
    loading: boolean,
    groupColumns: ColumnType<RecordType>[],
    groupList: RecordType[],
    onChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<RecordType> | SorterResult<RecordType>[], extra: TableCurrentDataSource<RecordType>) => void;
}

function TableList({
    rowKey,
    loading,
    groupList,
    groupColumns,
    onChange,
}: TableListProps<LPRankItemResponse>) {
    return (
        <Table
            rowKey={rowKey}
            columns={groupColumns}
            pagination={false}
            dataSource={groupList}
            loading={loading}
            onChange={onChange}
            sticky
        />
    )
}

interface PieChartProps {
    LPRankPieData: LPRankPieItemResponse[],
    pageMode: 'light' | 'dark'
}

const MemoPieChart = React.memo(PieChart, (prevProps: PieChartProps, nextProps: PieChartProps) => {
    if (prevProps.pageMode === nextProps.pageMode && JSON.stringify(prevProps.LPRankPieData) === JSON.stringify(nextProps.LPRankPieData)) {
        return true;
    } else
        return true;
});

function PieChart({ LPRankPieData, pageMode }: PieChartProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const config = {
        appendPadding: 10,
        data: LPRankPieData,
        angleField: 'rate',
        colorField: 'address',
        radius: 1,
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        innerRadius: 0.6,
        pieStyle: {
            stroke: null
        },
        legend: false as const,
        tooltip: {
            position: 'bottom' as const,
            enterable: true,
            customContent: (title: string, data: any[]) => {
                if (data.length > 0) {
                    return (
                        <div style={{ padding: '20px 10px', minWidth: 300 }}>
                            <div style={{ padding: '10px 0' }}>
                                <span>{f('marketDetailSymbolAddr')}：</span>
                                <span>{data[0].data.address}</span>
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                <span>{f('marketDetailRate')}：</span>
                                <span>{data[0].data.rate}%</span>
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                <span>{f('lpMarketValue')}：</span>
                                <span>
                                    $ {Global.formatNum(data[0].data.amount)}
                                </span>
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                <span>{f('lpNumber')}：</span>
                                <span>
                                    {Global.formatNum(data[0].data.balance)}
                                </span>
                            </div>
                        </div>
                    ) as unknown as string
                } else {
                    return ''
                }
            },
        },
        interactions: [
            // { type: 'element-selected' },
            { type: 'element-active' },
        ],
        label: {
            type: 'inner',
            offset: '-50%',
            formatter: function formatter(item: Record<string, number>, mappingData: any, index: number) {
                if (item.rate > 2) {
                    return `${item.rate}%`
                } else {
                    return ''
                }
            },
            style: {
                textAlign: 'center',
                fontSize: 14,
                fill: '#fff',
            },
        },
        statistic: {
            title: false as const,
            content: {
                customHtml: function formatter() {
                    return (
                        <img
                            src={'/images/line-watermark.svg'}
                            style={{ width: '200px' }}
                        />
                    ) as unknown as string
                },
            },
        },
    }

    return (
        <Pie
            {...config}
            fallback={
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Spin></Spin>
                </div>
            }
        />
    );
}