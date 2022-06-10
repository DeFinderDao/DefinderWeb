import { useIntl } from 'react-intl'
import React, { useState, useEffect, Key } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, message, Tooltip, BackTop, Divider } from 'antd'
import Link from 'next/link'
import Global from 'utils/Global'
import TimeChoose from './TimeChoose'
import AddressDetail from 'components/MarketComponents/AddressDetail'
import 'styles/MarketComponents/Comparison.less'
import { buyRankListLoading as setBuyRankListLoading, getBuyRankList, getSellRankList, sellRankListLoading } from 'redux/actions/MarketComponents/MarketComponentsAction'
import { UpCircleOutlined } from '@ant-design/icons'
import { AppState } from 'redux/reducers'
import { BuyRankItemResponse, BuyRankListParams } from 'redux/types/MarketComponentsTypes'
import { ColumnType, GetRowKey, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface'
import { TokenLogo } from 'components/TokenLogo'
import WaterMarkContent from 'components/WaterMarkContent'

interface BuyRankProps {
    symbolAddr: string,
    pageSize: number,
    showMore?: boolean,
    symbol: string,
    radioType?: string,
    typeRank?: string,
}

export default function BuyRank({
    symbolAddr,
    pageSize,
    showMore,
    symbol,
    radioType = '2',
    typeRank,
}: BuyRankProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const [buyRankCondition, setBuyRankCondition] = useState<BuyRankListParams>({
        symbolAddr: symbolAddr,
        dateType: radioType,
        field: null,
        sort: null,
        pageNo: 1,
        pageSize: pageSize,
    })
    const [oldSymbolAddr, setOldSymbolAddr] = useState(symbolAddr)
    const scrollTop = () => {
        const element = document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement;
        //console.log(element.scrollTop);
        element.scrollTop = 0;
    }
    useEffect(() => {
        if (symbolAddr != oldSymbolAddr) {
            setOldSymbolAddr(oldSymbolAddr)
            setBuyRankCondition({
                ...buyRankCondition,
                symbolAddr: symbolAddr,
                pageNo: 1,
            })
        }
    }, [symbolAddr])
    useEffect(() => {
        if (radioType != buyRankCondition.dateType) {
            setBuyRankCondition({
                ...buyRankCondition,
                dateType: radioType as string,
                pageNo: 1,
            })
        }
    }, [radioType])
    useEffect(() => {
        if (buyRankCondition.dateType) {
            if (typeRank == 'buyRank') {
                dispatch(getBuyRankList(buyRankCondition))
            } else {
                dispatch(getSellRankList(buyRankCondition))
            }
        }
    }, [typeRank, buyRankCondition])
    const { level } = useSelector((state: AppState) => state.userInfo);
    
    const buyRankListLoading = typeRank == 'buyRank'
        ? useSelector((state: AppState) => state.comparisonReducer.buyRankListLoading)
        : useSelector((state: AppState) => state.comparisonReducer.sellRankListLoading)
    //noMore
    const noMore = useSelector((state: AppState) => state.comparisonReducer.noMore)
    const buyRankList = typeRank == 'buyRank'
        ? useSelector(
            (state: AppState) => state.comparisonReducer.buyRankData?.list || []
        )
        : useSelector(
            (state: AppState) => state.comparisonReducer.sellRankData?.list || []
        )
    const logoUrlDesc: string[] = [
        f('marketDetailWhale'),
        f('marketDetailRobot'),
        f('marketDetailElephant'),
    ]

    const warningColumns: ColumnType<BuyRankItemResponse>[] = [
        {
            title: f('marketDetailAddress'),
            dataIndex: 'address',
            key: 'address',
            render: (text: any, record: BuyRankItemResponse) => {
                return (
                    <div style={{ display: 'flex' }}>
                        <AddressDetail
                            symbol={symbol}
                            address={record.address}
                            symbolAddr={symbolAddr}
                            titles={record.titles}
                            label={record.addressLabel}
                        />
                        {
                            record.logoUrl ? (
                                <Tooltip
                                    title={
                                        <div>
                                            {
                                                logoUrlDesc[
                                                record.description! - 1
                                                ]
                                            }
                                        </div>
                                    }
                                >
                                    <TokenLogo
                                        style={{ width: 20, height: 20, marginLeft: 10 }}
                                        src={record.logoUrl}
                                        alt=""
                                    />
                                </Tooltip>
                            ) : null
                        }
                    </div>
                )
            },
        },
        {
            title: typeRank == 'buyRank'
                ? f('marketDetailBuyRankBalance')
                : f('marketDetailSellRankBalance'),
            dataIndex: 'netBuyAmount',
            key: 'netBuyAmount',
            width: 150,
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: any, record: BuyRankItemResponse) => {
                return (
                    Global.formatBigNum(record.netBuyAmount) + ' ' + symbol
                )
            },
        },
        {
            title: f('currentHoldingQuantity'),
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return Global.formatNum(record.balance)
            },
        },
        {
            title: typeRank == 'buyRank'
                ? f('marketDetailBuyRankPrice')
                : f('marketDetailSellRankPrice'),
            dataIndex: 'costPrice',
            key: 'costPrice',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: any, record: BuyRankItemResponse) => {
                return '$ ' + Global.formatBigNum(record.costPrice)
            },
        },
    ]
    const warningColumns1: ColumnType<BuyRankItemResponse>[] = [
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
            width: 150,
            render: (text: any, record: BuyRankItemResponse) => {
                return (
                    <div style={{ display: 'flex' }}>
                        <AddressDetail
                            symbol={symbol}
                            address={record.address}
                            symbolAddr={symbolAddr}
                            titles={record.titles}
                            label={record.addressLabel}
                        />
                        {
                            record.logoUrl ? (
                                <Tooltip
                                    title={
                                        <div>
                                            {
                                                logoUrlDesc[
                                                record.description! - 1
                                                ]
                                            }
                                        </div>
                                    }
                                >
                                    <img
                                        style={{ width: 20, height: 20, marginLeft: 10 }}
                                        src={record.logoUrl}
                                        alt=""
                                    />
                                </Tooltip>
                            ) : null
                        }
                    </div>
                )
            },
        },
        {
            title: f('currentHoldingAsset'),
            dataIndex: 'netAsset',
            key: 'netAsset',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            width: 150,
            render: (text, record) => {
                return <span>$ {Global.formatBigNum(record.netAsset, 0)}</span>
            },
        },
        {
            title: f('currentHoldingProfit'),
            dataIndex: 'profit',
            key: 'profit',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            width: 150,
            render: (text, record) => {
                return Global.formatFluctuationRange(record.profit, 0)
            },
        },
        {
            title: f('currentHoldingProfitRate'),
            dataIndex: 'profitRate',
            key: 'profitRate',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            width: 150,
            render: (text, record) => {
                return Global.formatIncreaseNumber(record.profitRate)
            },
        },
        {
            title: typeRank == 'buyRank'
                ? f('marketDetailBuyRankBalance')
                : f('marketDetailSellRankBalance'),
            dataIndex: 'netBuyAmount',
            key: 'netBuyAmount',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            width: 160,
            render: (text: any, record: BuyRankItemResponse) => {
                return (
                    Global.formatBigNum(record.netBuyAmount) + ' ' + symbol
                )
            },
        },
        {
            title: typeRank == 'buyRank'
                ? f('marketDetailBuyRankPrice')
                : f('marketDetailSellRankPrice'),
            dataIndex: 'costPrice',
            key: 'costPrice',
            align: 'right',
            width: 140,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: any, record: BuyRankItemResponse) => {
                return '$ ' + Global.formatBigNum(record.costPrice)
            },
        },
        {
            title: f('currentHoldingQuantity'),
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            width: 150,
            render: (text, record) => {
                return Global.formatNum(record.balance)
            },
        },
        {
            title: f('currentHoldingHoldCost'),
            dataIndex: 'holdCost',
            key: 'holdCost',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            width: 150,
            render: (text, record) => {
                return <span>$ {Global.formatBigNum(record.holdCost)}</span>
            },
        },
    ]

    const dataMore = useSelector((state: AppState) => state.comparisonReducer.buyRankData);
    const currencyAddrRankScroll = () => {
        const fatherHeight = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).offsetHeight
        const bodyHeight = (document.getElementsByClassName('ant-table-wrapper')[0] as HTMLDivElement).offsetHeight
        const bodyTop = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).scrollTop
        const dom = (document.querySelector('.currency-addr-rank-scroll .ant-spin') as HTMLDivElement)
        if (dom) {
            dom.style.top = `${bodyTop}px`
        }
        if (bodyHeight - bodyTop < fatherHeight + 100) {
            if (bodyTop != 0 && buyRankListLoading === false) {
                if (dataMore && dataMore.list && dataMore.list.length > 0 && !buyRankListLoading && !noMore) {
                    if (dom) {
                        dom.style.top = `${bodyTop}px`
                    }
                    getMoreData();
                }
            }
        }

    }

    const getMoreData = async () => {
        if (typeRank === 'buyRank') {
            dispatch(setBuyRankListLoading(true))
        } else {
            dispatch(sellRankListLoading(true))
        }

        setBuyRankCondition({
            ...buyRankCondition,
            pageNo: buyRankCondition.pageNo + 1,
        })
    }

    return (
        <div className="comparison">
            <div className="table-box">
                {!showMore ? (
                    <TimeChoose
                        timeChange={(e) => {
                            scrollTop();
                            setBuyRankCondition({
                                ...buyRankCondition,
                                dateType: e.target.value,
                                pageNo: 1,
                            })
                        }}
                    />
                ) : null}
                <div className="common-table" style={{ margin: '20px 0 0' }}>
                    {
                        showMore ?
                            <>
                                <TableList
                                    rowKey={(record: BuyRankItemResponse, index?: number) => {
                                        return `${record.address}${index}`;
                                    }}
                                    groupList={buyRankList.slice(0, pageSize)}
                                    groupColumns={showMore ? warningColumns : warningColumns1}
                                    params={{
                                        loading: buyRankListLoading,
                                    }}
                                    onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<BuyRankItemResponse> | SorterResult<BuyRankItemResponse>[], extra: TableCurrentDataSource<BuyRankItemResponse>) => {
                                        if (!Array.isArray(sorter)) {
                                            if (sorter.order == 'ascend') {
                                                setBuyRankCondition({
                                                    ...buyRankCondition,
                                                    sort: 1,
                                                    field: sorter.field as string,
                                                    pageNo: 1,
                                                })
                                            } else if (sorter.order == 'descend') {
                                                setBuyRankCondition({
                                                    ...buyRankCondition,
                                                    sort: 2,
                                                    field: sorter.field as string,
                                                    pageNo: 1,
                                                })
                                            } else {
                                                setBuyRankCondition({
                                                    ...buyRankCondition,
                                                    sort: null,
                                                    field: null,
                                                    pageNo: 1,
                                                })
                                            }
                                        }
                                    }}
                                />
                            </> :
                            (
                                <div className="currency-addr-rank-scroll" style={{
                                    position: 'relative', height: window.innerHeight < 850
                                        ? window.innerHeight - 150
                                        : window.innerHeight - 250, overflow: 'auto'
                                }} onScroll={currencyAddrRankScroll}>
                                    <TableList
                                        rowKey={(record: BuyRankItemResponse, index?: number) => {
                                            return `${record.address}${index}`;
                                        }}
                                        groupList={buyRankList}
                                        groupColumns={warningColumns1}
                                        params={{
                                            loading: buyRankListLoading,
                                        }}
                                        onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<BuyRankItemResponse> | SorterResult<BuyRankItemResponse>[], extra: TableCurrentDataSource<BuyRankItemResponse>) => {
                                            if (!Array.isArray(sorter)) {
                                                scrollTop();
                                                if (sorter.order == 'ascend') {
                                                    setBuyRankCondition({
                                                        ...buyRankCondition,
                                                        sort: 1,
                                                        field: sorter.field as string,
                                                        pageNo: 1,
                                                    })
                                                } else if (sorter.order == 'descend') {
                                                    setBuyRankCondition({
                                                        ...buyRankCondition,
                                                        sort: 2,
                                                        field: sorter.field as string,
                                                        pageNo: 1,
                                                    })
                                                } else {
                                                    setBuyRankCondition({
                                                        ...buyRankCondition,
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
                            )
                    }
                    <WaterMarkContent bottom={showMore ? 10 : 100} />
                </div>
            </div>
            {showMore && buyRankList.length >= pageSize ? (
                <div className="view-more">
                    <span>
                        +
                        <Link
                            href={`/market-detail-more/market-page/market-detail/${typeRank}/${symbolAddr}`}
                        >
                            <a>{f('marketDetailSeeMore')}</a>
                        </Link>
                    </span>
                </div>
            ) : showMore ? null : (
                <div className="btnBox">
                    {!buyRankListLoading && noMore && level != 0 ? (
                        <Divider className="no-more">
                            {f('noMore')}
                        </Divider>
                    ) : null}
                </div>
            )}
        </div>
    )
}

interface TableListProps<RecordType> {
    rowKey: GetRowKey<BuyRankItemResponse>,
    params: {
        loading: boolean
    },
    groupColumns: ColumnType<RecordType>[],
    groupList: BuyRankItemResponse[],
    onChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<RecordType> | SorterResult<RecordType>[], extra: TableCurrentDataSource<RecordType>) => void;
}

function TableList({
    rowKey,
    params,
    groupList,
    groupColumns,
    onChange,
}: TableListProps<BuyRankItemResponse>) {
    return (
        <Table
            rowKey='address'
            columns={groupColumns}
            pagination={false}
            dataSource={groupList}
            loading={params.loading}
            onChange={onChange}
            sticky
        />
    )
}
