import { useIntl } from 'react-intl'
import React, { useState, useEffect, Key } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, message, Tooltip } from 'antd'
import Link from 'next/link'
import Global from 'utils/Global'
import TimeChoose from 'components/MarketComponents/TimeChoose'
import AddressDetail from 'components/MarketComponents/AddressDetail'
import 'styles/MarketComponents/Comparison.less'
import { getIncreaseRankList, getDecreaseRankList } from 'redux/actions/MarketComponents/IncreaseAndDecreaseRankAction'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { AppState } from 'redux/reducers'
import { IncreaseRankItemResponse, IncreaseRankListParams } from 'redux/types/IncreaseAndDecreaseRankTypes'
import { ColumnType, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface'
import { TokenLogo } from 'components/TokenLogo'
import WaterMarkContent from 'components/WaterMarkContent'

interface IncreaseAndDecreaseRankProps {
    symbolAddr: string,
    pageSize: number,
    showMore?: boolean,
    symbol: string,
    radioType?: string,
    typeRank?: string,
}

export default function IncreaseAndDecreaseRank({
    symbolAddr,
    pageSize,
    showMore,
    symbol,
    radioType = '2',
    typeRank,
}: IncreaseAndDecreaseRankProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const [increaseRankCondition, setIncreaseRankCondition] = useState<IncreaseRankListParams>({
        symbolAddr: symbolAddr,
        dateType: radioType,
        field: null,
        sort: null,
        pageNo: 1,
        pageSize: pageSize,
    })
    const [oldSymbolAddr, setOldSymbolAddr] = useState(symbolAddr)
    useEffect(() => {
        if (symbolAddr != oldSymbolAddr) {
            setOldSymbolAddr(oldSymbolAddr)
            setIncreaseRankCondition({
                ...increaseRankCondition,
                symbolAddr: symbolAddr,
            })
        }
    }, [symbolAddr])
    useEffect(() => {
        if (radioType != increaseRankCondition.dateType) {
            setIncreaseRankCondition({
                ...increaseRankCondition,
                dateType: radioType as string,
            })
        }
    }, [radioType])
    useEffect(() => {
        if (increaseRankCondition.dateType) {
            if (typeRank == 'increaseRank') {
                dispatch(getIncreaseRankList(increaseRankCondition))
            } else {
                dispatch(getDecreaseRankList(increaseRankCondition))
            }
        }
    }, [typeRank, increaseRankCondition])
    //loading
    const increaseRankListLoading = typeRank == 'increaseRank'
        ? useSelector((state: AppState) => state.increaseAndDecreaseRankReducer.increaseRankListLoading)
        : useSelector(
            (state: AppState) => state.increaseAndDecreaseRankReducer.decreaseRankListLoading
        )
    //noMore
    const noMore = useSelector((state: AppState) => state.increaseAndDecreaseRankReducer.noMore)
    const increaseRankList = typeRank == 'increaseRank'
        ? useSelector(
            (state: AppState) => state.increaseAndDecreaseRankReducer.increaseRankData?.list || []
        )
        : useSelector(
            (state: AppState) => state.increaseAndDecreaseRankReducer.decreaseRankData?.list || []
        )
    const logoUrlDesc: string[] = [
        f('marketDetailWhale'),
        f('marketDetailRobot'),
        f('marketDetailElephant'),
    ]
    const warningColumns: ColumnType<IncreaseRankItemResponse>[] = [
        {
            title: f('marketDetailAddress'),
            dataIndex: 'address',
            key: 'address',
            render: (text: any, record: IncreaseRankItemResponse) => {
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
            title: typeRank == 'increaseRank'
                ? f('marketDetailIncreaseRankBalance')
                : f('marketDetailDecreaseRankBalance'),
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: any, record: IncreaseRankItemResponse) => {
                return (
                    Global.formatBigNum(record.amount) + ' ' + symbol
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
            title: typeRank == 'increaseRank'
                ? f('marketDetailIncreaseRankPrice')
                : f('marketDetailDecreaseRankPrice'),
            dataIndex: 'avgPrice',
            key: 'avgPrice',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: any, record: IncreaseRankItemResponse) => {
                return '$ ' + Global.formatBigNum(record.avgPrice)
            },
        },
    ]
    const warningColumns1: ColumnType<IncreaseRankItemResponse>[] = [
        {
            title: f('marketDetailAddress'),
            dataIndex: 'address',
            key: 'address',
            render: (text: any, record: IncreaseRankItemResponse) => {
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
            title: f('currentHoldingAsset'),
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
            title: f('currentHoldingProfit'),
            dataIndex: 'profit',
            key: 'profit',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return Global.formatFluctuationRange(record.profit)
            },
        },
        {
            title: f('currentHoldingProfitRate'),
            dataIndex: 'profitRate',
            key: 'profitRate',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return Global.formatIncreaseNumber(record.profitRate)
            },
        },
        {
            title: typeRank == 'increaseRank'
                ? f('marketDetailIncreaseRankBalance')
                : f('marketDetailDecreaseRankBalance'),
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: any, record: IncreaseRankItemResponse) => {
                return (
                    Global.formatBigNum(record.amount) + ' ' + symbol
                )
            },
        },
        {
            title: typeRank == 'increaseRank'
                ? f('marketDetailIncreaseRankPrice')
                : f('marketDetailDecreaseRankPrice'),
            dataIndex: 'avgPrice',
            key: 'avgPrice',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text: any, record: IncreaseRankItemResponse) => {
                return '$ ' + Global.formatBigNum(record.avgPrice)
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
            title: f('currentHoldingHoldCost'),
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
    return (
        <div className="comparison">
            <div className="table-box">
                {!showMore ? (
                    <TimeChoose
                        timeChange={(e) => {
                            setIncreaseRankCondition({
                                ...increaseRankCondition,
                                dateType: e.target.value,
                            })
                        }}
                    />
                ) : null}
                <div className="common-table" style={{ margin: '20px 0 0' }}>
                    <TableList
                        rowKey={'address'}
                        groupList={showMore ? increaseRankList.slice(0, pageSize) : increaseRankList}
                        groupColumns={showMore ? warningColumns : warningColumns1}
                        params={{
                            loading: increaseRankListLoading,
                        }}
                        onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<IncreaseRankItemResponse> | SorterResult<IncreaseRankItemResponse>[], extra: TableCurrentDataSource<IncreaseRankItemResponse>) => {
                            if (!Array.isArray(sorter)) {
                                if (sorter.order == 'ascend') {
                                    setIncreaseRankCondition({
                                        ...increaseRankCondition,
                                        sort: 1,
                                        field: sorter.field as string,
                                    })
                                } else if (sorter.order == 'descend') {
                                    setIncreaseRankCondition({
                                        ...increaseRankCondition,
                                        sort: 2,
                                        field: sorter.field as string,
                                    })
                                } else {
                                    setIncreaseRankCondition({
                                        ...increaseRankCondition,
                                        sort: null,
                                        field: null,
                                    })
                                }
                            }
                        }}
                    />
                    <WaterMarkContent position={showMore ? 'absolute' : 'fixed'} bottom={showMore ? 10 : 100} />
                </div>
            </div>
            {showMore && increaseRankList.length >= pageSize ? (
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
                    <Button
                        icon={<LeftOutlined />}
                        disabled={increaseRankCondition.pageNo == 1}
                        onClick={() => {
                            setIncreaseRankCondition({
                                ...increaseRankCondition,
                                pageNo: increaseRankCondition.pageNo - 1,
                            })
                        }}
                    ></Button>
                    <Button
                        icon={<RightOutlined />}
                        disabled={noMore}
                        onClick={() => {
                            setIncreaseRankCondition({
                                ...increaseRankCondition,
                                pageNo: increaseRankCondition.pageNo + 1,
                            })
                        }}
                    ></Button>
                </div>
            )}
        </div>
    )
}

interface TableListProps<RecordType> {
    rowKey: string,
    params: {
        loading: boolean
    },
    groupColumns: ColumnType<RecordType>[],
    groupList: IncreaseRankItemResponse[],
    onChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<RecordType> | SorterResult<RecordType>[], extra: TableCurrentDataSource<RecordType>) => void;
}

function TableList({
    rowKey,
    params,
    groupList,
    groupColumns,
    onChange,
}: TableListProps<IncreaseRankItemResponse>) {
    return (
        <Table
            rowKey={rowKey}
            columns={groupColumns}
            pagination={false}
            dataSource={groupList}
            loading={params.loading}
            onChange={onChange}
        />
    )
}
