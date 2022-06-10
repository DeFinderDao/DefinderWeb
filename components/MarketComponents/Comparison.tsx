import { useIntl } from 'react-intl'
import React, { useState, useEffect, Key } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Radio, Table, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Global from 'utils/Global'
import TimeChoose from './TimeChoose'
import AddressDetail from 'components/MarketComponents/AddressDetail'
import 'styles/MarketComponents/Comparison.less'
import { getComparisonList } from 'redux/actions/MarketComponents/MarketComponentsAction'
import { AppState } from 'redux/reducers'
import { ColumnType, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface'
import { ComparisonResponseInnerData } from 'redux/types/MarketComponentsTypes'
import WaterMarkContent from 'components/WaterMarkContent'

interface ComparisonProps {
    symbolAddr: string,
    showMore?: boolean,
    symbol: string,
    pageSize: number
}

export default function Comparison({
    symbolAddr,
    showMore,
    symbol,
    pageSize,
}: ComparisonProps) {
    const router = useRouter()
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()

    const [comparisonCondition, setComparisonCondition] = useState({
        symbolAddr: symbolAddr,
        type: '2',
        pageNo: 1,
        pageSize: pageSize,
    })
    const [oldSymbolAddr, setOldSymbolAddr] = useState(symbolAddr)

    useEffect(() => {
        if (symbolAddr != oldSymbolAddr) {
            setOldSymbolAddr(symbolAddr)
            setComparisonCondition({
                ...comparisonCondition,
                symbolAddr: symbolAddr,
            })
        }
    }, [symbolAddr])

    useEffect(() => {
        dispatch(getComparisonList(comparisonCondition))
    }, [comparisonCondition])
    //loading
    const comparisonLoading = useSelector(
        (state: AppState) => state.comparisonReducer.comparisonLoading
    )
    
    const comparisonData = useSelector(
        (state: AppState) => state.comparisonReducer.comparisonData
    )
    const comparisonList = useSelector(
        (state: AppState) => state.comparisonReducer.comparisonData?.innerData || []
    )

    const warningColumns: ColumnType<ComparisonResponseInnerData>[] = [
        {
            title: f('marketDetailComparisonAddAddress'),
            dataIndex: 'addAddress',
            key: 'addAddress',
            render: (text, record) => {
                return (
                    <AddressDetail
                        symbol={symbol}
                        address={record.addAddress}
                        symbolAddr={record.symbolAddr}
                        titles={record.addTitles}
                        label={record.addAddressLabel}
                    />
                )
            },
        },
        {
            title: f('marketDetailComparisonAddVolume'),
            dataIndex: 'addVolume',
            key: 'addVolume',
            align: 'right',
            render: (text, record) => {
                if (record.addAddress) {
                    return (
                        '+' +
                        Global.formatBigNum(record.addVolume) +
                        ' ' +
                        record.symbol
                    )
                } else {
                    return ''
                }
            },
        },
        {
            title: f('marketDetailComparisonSubAddress'),
            dataIndex: 'subAddress',
            key: 'subAddress',
            render: (text, record) => {
                return (
                    <AddressDetail
                        symbol={symbol}
                        address={record.subAddress}
                        symbolAddr={record.symbolAddr}
                        titles={record.subTitles}
                        label={record.subAddressLabel}
                    />
                )
            },
        },
        {
            title: f('marketDetailComparisonSubVolume'),
            dataIndex: 'subVolume',
            key: 'subVolume',
            align: 'right',
            render: (text, record) => {
                if (record.subAddress) {
                    return Global.formatBigNum(record.subVolume) + ' ' + record.symbol
                } else {
                    return ''
                }
            },
        },
    ]
    const warningColumns1: ColumnType<ComparisonResponseInnerData>[] = [
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
            title: f('marketDetailComparisonAddAddress'),
            dataIndex: 'addAddress',
            key: 'addAddress',
            render: (text, record) => {
                return (
                    <AddressDetail
                        symbol={symbol}
                        address={record.addAddress}
                        symbolAddr={record.symbolAddr}
                        titles={record.addTitles}
                        label={record.addAddressLabel}
                    />
                )
            },
        },
        {
            title: f('currentHoldingQuantity'),
            dataIndex: 'addBalance',
            key: 'addBalance',
            align: 'right',
            render: (text, record) => {
                if (record.addAddress) {

                    return (
                        Global.formatNum(record.addBalance)
                    )
                } else {
                    return ''
                }
            },
        },
        {
            title: f('marketDetailComparisonAddVolume'),
            dataIndex: 'addVolume',
            key: 'addVolume',
            align: 'right',
            render: (text, record) => {
                if (record.addAddress) {

                    return (
                        '+' +
                        Global.formatBigNum(record.addVolume) +
                        ' ' +
                        record.symbol
                    )
                } else {
                    return ''
                }
            },
        },
        {
            title: f('marketDetailComparisonSubAddress'),
            dataIndex: 'subAddress',
            key: 'subAddress',
            render: (text, record) => {
                return (
                    <AddressDetail
                        symbol={symbol}
                        address={record.subAddress}
                        symbolAddr={record.symbolAddr}
                        titles={record.subTitles}
                        label={record.subAddressLabel}
                    />
                )
            },
        },
        {
            title: f('currentHoldingQuantity'),
            dataIndex: 'subBalance',
            key: 'subBalance',
            align: 'right',
            render: (text, record) => {
                if (record.subAddress) {
                    return (
                        Global.formatNum(record.subBalance)
                    )
                } else {
                    return ''
                }
            },
        },
        {
            title: f('marketDetailComparisonSubVolume'),
            dataIndex: 'subVolume',
            key: 'subVolume',
            align: 'right',
            render: (text, record) => {
                if (record.subAddress) {
                    return Global.formatBigNum(record.subVolume) + ' ' + record.symbol
                } else {
                    return ''
                }
            },
        },
    ]
    return (
        <div className="block-item item-small">
            <div className="item-title">
                {showMore ? <span>
                    {f('marketDetailComparisonTitle')}
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                {f(
                                    'marketDetailComparisonTips'
                                )}
                            </div>
                        }
                    >
                        <QuestionCircleOutlined
                            style={{
                                fontSize: '16px',
                                marginLeft: '10px',
                            }}
                        />
                    </Tooltip>
                </span> : null}
                {showMore ? <div className="defi-radio-group-time">
                    <Radio.Group
                        defaultValue="2"
                        buttonStyle="solid"
                        onChange={(e) => {
                            setComparisonCondition({
                                ...comparisonCondition,
                                type: e.target.value,
                            })
                        }}
                    >
                        <Radio.Button value="4">
                            {f('marketDetailTimeChoose30Days')}
                        </Radio.Button>
                        <Radio.Button value="3">
                            {f('marketDetailTimeChoose7Days')}
                        </Radio.Button>
                        <Radio.Button value="2">
                            {f('marketDetailTimeChoose3Days')}
                        </Radio.Button>
                        <Radio.Button value="1">
                            {f('marketDetailTimeChoose24Hours')}
                        </Radio.Button>
                        <Radio.Button value="5">
                            {f('marketDetailTimeChoose4Hours')}
                        </Radio.Button>
                    </Radio.Group>
                </div> : <TimeChoose
                    timeChange={(e) => {
                        setComparisonCondition({
                            ...comparisonCondition,
                            type: e.target.value,
                        })
                    }}
                />}
            </div>
            <div className="comparison">
                <div className="table-box" style={{ minHeight: 384 }}>
                    <div className="comparison-bar-box">
                        <div className="comparison-bar-item">
                            <p>{f('marketDetailComparisonAddAddressNum')}</p>
                            <div className="bar-box">
                                <div className="out-bar">
                                    <div
                                        className="in-bar green-bar"
                                        style={{
                                            minWidth:
                                                comparisonData ?
                                                    ((comparisonData.addPositionsCount /
                                                        (comparisonData.addPositionsCount + Math.abs(comparisonData.subPositionsCount))) *
                                                        100 + '%')
                                                    : '0%',
                                        }}
                                    >
                                        {Global.formatNum(comparisonData?.addPositionsCount)}
                                    </div>
                                </div>
                                <div className="out-bar">
                                    <div
                                        className="in-bar red-bar"
                                        style={{
                                            minWidth:
                                                comparisonData ? ((Math.abs(comparisonData.subPositionsCount) /
                                                    (comparisonData.addPositionsCount +
                                                        Math.abs(comparisonData.subPositionsCount))) *
                                                    100 + '%')
                                                    : '0%',
                                        }}
                                    >
                                        {Global.formatNum(comparisonData ? Math.abs(comparisonData.subPositionsCount) : 0)}
                                    </div>
                                </div>

                            </div>
                            <p>{f('marketDetailComparisonSubAddressNum')}</p>
                        </div>
                        <div className="comparison-bar-item">
                            <p>{f('marketDetailComparisonAddValue')}</p>
                            <div className="bar-box">
                                <div className="out-bar">
                                    <div
                                        className="in-bar green-bar"
                                        style={{
                                            minWidth:
                                                comparisonData ? (comparisonData.addValue /
                                                    (comparisonData.addValue +
                                                        Math.abs(comparisonData.subValue))) *
                                                    100 + '%' : '0%',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        $ {Global.formatBigNum(comparisonData ? comparisonData.addValue : 0)}
                                    </div>
                                </div>
                                <div className="out-bar">
                                    <div
                                        className="in-bar red-bar"
                                        style={{
                                            minWidth:
                                                comparisonData ? (Math.abs(comparisonData.subValue) /
                                                    (comparisonData.addValue +
                                                        Math.abs(comparisonData.subValue))) *
                                                    100 + '%' : '0%',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        $ {Global.formatBigNum(comparisonData ? Math.abs(comparisonData.subValue) : 0)}
                                    </div>
                                </div>
                            </div>
                            <p>{f('marketDetailComparisonSubValue')}</p>
                        </div>
                        <div className="comparison-bar-item">
                            <p>{f('marketDetailComparisonAddBalance')}</p>
                            <div className="bar-box">
                                <div className="out-bar">
                                    <div
                                        className="in-bar green-bar"
                                        style={{
                                            minWidth:
                                                comparisonData ? ((comparisonData.addHoldVolume /
                                                    (comparisonData.addHoldVolume +
                                                        Math.abs(comparisonData.subHoldVolume))) *
                                                    100 + '%')
                                                    : '0%',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {Global.formatBigNum(
                                            comparisonData ? comparisonData.addHoldVolume : null
                                        ) +
                                            ' ' +
                                            symbol}
                                    </div>
                                </div>
                                <div className="out-bar">
                                    <div
                                        className="in-bar red-bar"
                                        style={{
                                            minWidth:
                                                comparisonData ? ((Math.abs(comparisonData.subHoldVolume) /
                                                    (comparisonData.addHoldVolume +
                                                        Math.abs(comparisonData.subHoldVolume))) *
                                                    100 + '%')
                                                    : '0%',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {Global.formatBigNum(
                                            comparisonData ? Math.abs(comparisonData.subHoldVolume) : null
                                        ) +
                                            ' ' +
                                            symbol}
                                    </div>
                                </div>
                            </div>
                            <p>{f('marketDetailComparisonSubBalance')}</p>
                        </div>
                        <div className="common-table" style={{ margin: 0 }}>
                            <TableList
                                rowKey={'index'}
                                groupList={showMore ? comparisonList.slice(0, 5) : comparisonList}
                                groupColumns={showMore ? warningColumns : warningColumns1}
                                params={{
                                    loading: comparisonLoading,
                                }}
                            />
                            <WaterMarkContent position={showMore ? 'absolute' : 'fixed'} bottom={showMore ? 10 : 100} />
                        </div>
                    </div>
                    {showMore && comparisonList.length >= 5 ? (
                        <div className="view-more">
                            <span>
                                +
                                <Link
                                    href={`/market-detail-more/market-page/market-detail/comparison/${symbolAddr}`}
                                >
                                    <a>{f('marketDetailSeeMore')}</a>
                                </Link>
                            </span>
                        </div>
                    ) : null}
                </div>
            </div>
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
}

function TableList({
    rowKey,
    params,
    groupList,
    groupColumns
}: TableListProps<ComparisonResponseInnerData>) {
    return (
        <Table
            rowKey={rowKey}
            columns={groupColumns}
            pagination={false}
            dataSource={groupList}
            loading={params.loading}
            sticky
        />
    )
}
