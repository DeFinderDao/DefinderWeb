import { useIntl } from 'react-intl'
import React, { useState, useEffect, Key } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, message, Tooltip } from 'antd'
import Link from 'next/link'
import Global from 'utils/Global'
import TimeChoose from './TimeChoose'
import AddressDetail from 'components/MarketComponents/AddressDetail'
import 'styles/MarketComponents/Comparison.less'
import { getNewAddressList } from 'redux/actions/MarketComponents/MarketComponentsAction'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { AppState } from 'redux/reducers'
import { ColumnsType, ColumnType, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface'
import { LPRankItemResponse, LPRankListParams, NewAddressItemResponse, NewAddressListParams } from 'redux/types/MarketComponentsTypes'
import { TokenLogo } from 'components/TokenLogo'

interface NewAddrRankProps {
    symbolAddr: string,
    pageSize: number,
    showMore?: boolean,
    symbol: string,
}

export default function NewAddrRank({
    symbolAddr,
    pageSize,
    showMore,
    symbol,
}: NewAddrRankProps) {
    const router = useRouter()
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    
    const [newAddressRankCondition, setNewAddressRankCondition] = useState<NewAddressListParams>({
        symbolAddr: symbolAddr,
        type: '2',
        field: null,
        sort: null,
        pageNo: 1,
        pageSize: pageSize,
    })
    
    const [oldSymbolAddr, setOldSymbolAddr] = useState(symbolAddr)
    useEffect(() => {
        if (symbolAddr != oldSymbolAddr) {
            setOldSymbolAddr(oldSymbolAddr)
            setNewAddressRankCondition({
                ...newAddressRankCondition,
                symbolAddr: symbolAddr,
            })
        }
    }, [symbolAddr])
    useEffect(() => {
        dispatch(getNewAddressList(newAddressRankCondition))
    }, [newAddressRankCondition])
    //loading
    const newAddrListLoading = useSelector(
        (state: AppState) => state.comparisonReducer.newAddrListLoading
    )
    //noMore
    const noMore = useSelector((state: AppState) => state.comparisonReducer.noMore)
    useEffect(() => {
        if (!showMore && noMore) {
            message.info(f('lastPage'))
        }
    }, [noMore])

    
    const newAddressList = useSelector(
        (state: AppState) => state.comparisonReducer.newAddressData?.list || []
    )
    
    const warningColumns: ColumnsType<NewAddressItemResponse> = [
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
            title: f('marketDetailBalance'),
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return Global.formatBigNum(record.balance) + ' ' + record.symbol
            },
        },
        {
            title: f('marketDetailValue'),
            dataIndex: 'value',
            key: 'value',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            render: (text, record) => {
                return (
                    <span>
                        $ {Global.formatBigNum(record.value)}
                        <span
                            style={{
                                display: 'inline-block',
                                width: 25,
                                height: 20,
                                paddingLeft: 5,
                            }}
                        >
                            {record.logoUrl ? (
                                <Tooltip
                                    title={<div>{f('marketDetailWhale')}</div>}
                                >
                                    <TokenLogo
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        src={record.logoUrl}
                                    />
                                </Tooltip>
                            ) : null}
                        </span>
                    </span>
                )
            },
        },
    ]
    return (
        <div className="comparison">
            <div className="table-box">
                <TimeChoose
                    timeChange={(e) => {
                        setNewAddressRankCondition({
                            ...newAddressRankCondition,
                            type: e.target.value,
                        })
                    }}
                />
                <TableList
                    rowKey={'index'}
                    groupList={newAddressList}
                    groupColumns={warningColumns}
                    params={{
                        loading: newAddrListLoading,
                    }}
                    onChange={(pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<NewAddressItemResponse> | SorterResult<NewAddressItemResponse>[], extra: TableCurrentDataSource<NewAddressItemResponse>) => {
                        if (!Array.isArray(sorter)) {
                            if (sorter.order == 'ascend') {
                                setNewAddressRankCondition({
                                    ...newAddressRankCondition,
                                    sort: 1,
                                    field: sorter.field as string,
                                })
                            } else if (sorter.order == 'descend') {
                                setNewAddressRankCondition({
                                    ...newAddressRankCondition,
                                    sort: 2,
                                    field: sorter.field as string,
                                })
                            } else if (!sorter.order) {
                                setNewAddressRankCondition({
                                    ...newAddressRankCondition,
                                    sort: null,
                                    field: null,
                                })
                            }
                        }
                    }}
                />
            </div>
            {showMore && newAddressList.length >= 10 ? (
                <div className="view-more">
                    <span>
                        +
                        <Link
                            href={`/market-detail-more/market-page/market-detail/newAddressRank/${symbolAddr}`}
                        >
                            <a>{f('marketDetailSeeMore')}</a>
                        </Link>
                    </span>
                </div>
            ) : showMore ? null : (
                <div className="btnBox">
                    <Button
                        icon={<LeftOutlined />}
                        disabled={newAddressRankCondition.pageNo == 1}
                        onClick={() => {
                            setNewAddressRankCondition({
                                ...newAddressRankCondition,
                                pageNo: newAddressRankCondition.pageNo - 1,
                            })
                        }}
                    ></Button>
                    <Button
                        icon={<RightOutlined />}
                        disabled={noMore}
                        onClick={() => {
                            setNewAddressRankCondition({
                                ...newAddressRankCondition,
                                pageNo: newAddressRankCondition.pageNo + 1,
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
    groupList: RecordType[],
    onChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<RecordType> | SorterResult<RecordType>[], extra: TableCurrentDataSource<RecordType>) => void;
}

function TableList({
    rowKey,
    params,
    groupList,
    groupColumns,
    onChange,
}: TableListProps<NewAddressItemResponse>) {
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
