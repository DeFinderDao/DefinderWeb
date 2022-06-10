import { useIntl } from 'react-intl'
import { NextRouter, useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Tooltip, Spin, Divider, message, Empty, BackTop, Modal, Row, Col, Radio, Button, InputNumber } from 'antd'
import {
    QuestionCircleOutlined, UpCircleOutlined, FilterFilled
} from '@ant-design/icons'
import loadable from '@loadable/component'
import React, { useEffect, useState } from 'react'
import {
    getCurrencyAddrRankPie,
    getCurrencyAddrRankList,
    listNoMore,
    currencyAddrListLoading,
} from 'redux/actions/MarketPage/CurrencyAddrRankAction'
import Global from 'utils/Global'
import moment from 'moment'
const Pie = loadable(() => import('@ant-design/plots/lib/components/pie'))
import AddressDetail from 'components/MarketComponents/AddressDetail'
import { trackAction, trackPage, MARKET_DETAIL } from 'utils/analyse/YMAnalyse'
import type { AppState } from 'redux/reducers'
import type { AddrRankItem, AddrRankListParams, AddrRankListResponse, AddrRankPieItem } from 'redux/types/CurrencyAddrRankTypes'
import type { TablePaginationConfig } from 'antd/lib/table/Table'
import type { Key } from 'react'
import type { ColumnType, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import type { Legend } from '@antv/g2plot/lib/types/legend'
import { ANT_CHARTS_DARK, DefaultLocale } from 'utils/env'
import DefinEmpty from 'components/Header/definEmpty'
import ApiClient from 'utils/ApiClient'
import { TokenLogo } from 'components/TokenLogo'
import WaterMarkContent from 'components/WaterMarkContent'

interface CurrencyAddrRankProps {
    flex: 'row' | 'row-reverse' | 'column' | 'column-reverse',
    symbolAddr: string,
    showMore?: boolean,
    symbol: string,
}

export default function CurrencyAddrRank({
    flex,
    symbolAddr,
    showMore,
    symbol,
}: CurrencyAddrRankProps) {
    useEffect(() => {
        if (flex != 'row') {
            trackPage((MARKET_DETAIL as any).urlLine)
        }
    }, [])
    const router = useRouter()
    const { locale = DefaultLocale }: NextRouter = router;
    const dispatch = useDispatch()
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    //noMore
    const noMore = useSelector((state: AppState) => state.currencyAddrRankReducer.noMore)
    const { level } = useSelector((state: AppState) => state.userInfo);
    const [currencyAddrRankListCondition, setCurrencyAddrRankListCondition] =
        useState<AddrRankListParams>({
            symbolAddr: symbolAddr,
            field: '',
            sort: '',
            addressType: 0,
            totalVolume: null,
            totalValue: null,
            profit: null,
            proceeds: null,
            pageNo: 1,
            pageSize: flex == 'row' || level == 0 ? 10 : 100,
        })
    useEffect(() => {
        dispatch(getCurrencyAddrRankPie({ symbolAddr: symbolAddr }))
        setCurrencyAddrRankListCondition({
            ...currencyAddrRankListCondition,
            symbolAddr,
        })
        dispatch(
            getCurrencyAddrRankList({
                ...currencyAddrRankListCondition,
                symbolAddr,
            })
        )
    }, [dispatch, symbolAddr])
    const loading = useSelector(
        (state: AppState) => state.currencyAddrRankReducer.loading
    )
    const currencyAddrRankPie = useSelector(
        (state: AppState) => state.currencyAddrRankReducer.currencyAddrRankPie
    )
    const currencyAddrRankList = useSelector(
        (state: AppState) => state.currencyAddrRankReducer.currencyAddrRankList
    )
    const scrollTop = () => {
        if (flex !== 'row' && level != 0) {
            const element = document.getElementsByClassName('currency-addr-rank-scroll')[0] as unknown as HTMLElement;
            element.scrollTop = 0;
        }
    }
    const [dataMore, setDataMore] = useState<AddrRankListResponse>()
    useEffect(() => {
        setDataMore(currencyAddrRankList as AddrRankListResponse)
    }, [currencyAddrRankList])

    let timeout
    const [timer, setTimer] = useState<number | null>(null)
    const [barName, setBarName] = useState('')
    const [barNoName, setBarNoName] = useState('')
    const setClassName = (callback: () => void) => {
        if (timer) {
            clearTimeout(timer)
            timeout = null
            setTimer(null)
        }
        const getData = () => {
            callback()
        }
        timeout = window.setTimeout(getData, 800)
        setTimer(timeout)
    }
    const onMouseMove = () => {
        setBarNoName('currency-addr-rank-no-scroll-true')
        setClassName(() => {
            setBarNoName('')
        })
    }
    const currencyAddrRankScroll = () => {
        setBarName('currency-addr-rank-scroll-true')
        setClassName(() => {
            setBarName('')
        })
        if (level != 1) {
            return;
        }
        const fatherHeight = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).offsetHeight
        const bodyHeight = (document.getElementsByClassName('ant-table-wrapper')[0] as HTMLDivElement).offsetHeight
        const bodyTop = (document.getElementsByClassName('currency-addr-rank-scroll')[0] as HTMLDivElement).scrollTop
        const dom = (document.querySelector('.currency-addr-rank-scroll .ant-spin') as HTMLDivElement)
        if (dom) {
            dom.style.top = `${bodyTop}px`
        }
        if (bodyHeight - bodyTop < fatherHeight + 100) {
            if (bodyTop != 0 && loading === false) {
                if (dataMore && dataMore.list && dataMore.list.length > 0 && !loading && !noMore) {
                    if (dom) {
                        dom.style.top = `${bodyTop}px`
                    }
                    getMoreData();
                }
            }
        }

    }
    const getMoreData = async () => {
        dispatch(currencyAddrListLoading(true))
        try {
            const apiClient = new ApiClient<AddrRankListResponse>()
            const data = await apiClient.post(
                `/market/hold/list`,
                {
                    data: {
                        symbolAddr: currencyAddrRankListCondition.symbolAddr,
                        field: currencyAddrRankListCondition.field,
                        sort: currencyAddrRankListCondition.sort,
                        pageNo: currencyAddrRankListCondition.pageNo + 1,
                        pageSize: 100,
                        addressType: currencyAddrRankListCondition.addressType,
                        totalVolume: currencyAddrRankListCondition.totalVolume,
                        totalValue: currencyAddrRankListCondition.totalValue,
                        profit: currencyAddrRankListCondition.profit,
                        proceeds: currencyAddrRankListCondition.proceeds,
                    }
                }
            )
            if (data.data.list && data.data.list.length > 0) {
                const arr = dataMore?.list.concat(data.data.list)
                setDataMore({ ...data.data, list: arr as AddrRankItem[] })
                setCurrencyAddrRankListCondition({
                    ...currencyAddrRankListCondition,
                    pageNo: currencyAddrRankListCondition.pageNo + 1,
                })
                if (currencyAddrRankListCondition.pageNo + 1 > 4) {
                    dispatch(listNoMore(true))
                }
                if (data.data.list.length < 100) {
                    dispatch(listNoMore(true))
                }
                dispatch(currencyAddrListLoading(false))
            } else {
                dispatch(listNoMore(true))
                dispatch(currencyAddrListLoading(false))
            }
        } catch (e) {
            dispatch(currencyAddrListLoading(false))
        }
    }

    const [sortedInfo, setSortedInfo] = useState<SorterResult<AddrRankItem>>({})
    const handleChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<AddrRankItem> | SorterResult<AddrRankItem>[], extra: TableCurrentDataSource<AddrRankItem>) => {
        scrollTop();
        if (!Array.isArray(sorter)) {
            setSortedInfo(sorter)
            let str: AddrRankListParams = {
                symbolAddr: currencyAddrRankListCondition.symbolAddr,
                field: '',
                sort: '',
                addressType: currencyAddrRankListCondition.addressType,
                totalVolume: currencyAddrRankListCondition.totalVolume,
                totalValue: currencyAddrRankListCondition.totalValue,
                profit: currencyAddrRankListCondition.profit,
                proceeds: currencyAddrRankListCondition.proceeds,
                pageNo: 1,
                pageSize: currencyAddrRankListCondition.pageSize,
            }
            str.field = sorter.order ? sorter.columnKey : null
            str.sort = sorter.order ? (sorter.order == 'ascend' ? 1 : 2) : null
            // if (pagination && pagination.current) {
            //     str.pageNo = pagination.current
            //     str.pageSize = pagination.pageSize
            // }
            setCurrencyAddrRankListCondition(str)
            dispatch(getCurrencyAddrRankList(str))
        }
    }
    const columnsRow: ColumnType<AddrRankItem>[] = [
        {
            title: f('marketDetailSymbolAddr'),
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => {
                // return <span>{Global.abbrSymbolAddress(record.address)}</span>
                return (
                    <AddressDetail
                        symbol={symbol}
                        address={record.address}
                        symbolAddr={record.symbolAddr}
                        isContract={record.isContract}
                        titles={record.titles}
                        label={record.addressLabel}
                    />
                )
            },
        },
        {
            title: f('marketDetailBalance'),
            dataIndex: 'totalVolume',
            key: 'totalVolume',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'totalVolume' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return <span>{Global.formatBigNum(record.totalVolume)}</span>
            },
        },
        {
            title: f('marketDetailRate'),
            dataIndex: 'rate',
            key: 'rate',
            align: 'right',
            render: (text, record) => {
                return <span>{record.rate}%</span>
            },
        },
        {
            title: f('marketDetailValue'),
            dataIndex: 'totalValue',
            key: 'totalValue',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'totalValue' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return (
                    <span>
                        $ {Global.formatBigNum(record.totalValue)}
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
        {
            title: f('marketDetailCostPrice'),
            dataIndex: 'costPrice',
            key: 'costPrice',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'costPrice' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return <span>{Global.formatBigNum(record.costPrice)}</span>
            },
        },
        {
            title: f('marketDetailProfit'),
            dataIndex: 'profit',
            key: 'profit',
            align: 'right',
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'profit' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return <span>{Global.formatBigNum(record.profit)}</span>
            },
        },
    ]

    const columns: ColumnType<AddrRankItem>[] = [
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
            title: f('marketDetailSymbolAddr'),
            dataIndex: 'address',
            width: 150,
            key: 'address',
            render: (text, record) => {
                // return <span>{Global.abbrSymbolAddress(record.address)}</span>
                return (
                    <AddressDetail
                        symbol={symbol}
                        address={record.address}
                        symbolAddr={record.symbolAddr}
                        isContract={record.isContract}
                        titles={record.titles}
                        label={record.addressLabel}
                    />
                )
            },
        },
        {
            title: f('marketDetailBalance'),
            dataIndex: 'totalVolume',
            key: 'totalVolume',
            align: 'right',
            width: 170,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'totalVolume' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return (
                    <span>
                        {Global.formatNum(record.totalVolume)} {record.symbol}
                    </span>
                )
            },
        },
        {
            title: f('marketDetailCostPrice'),
            dataIndex: 'costPrice',
            key: 'costPrice',
            align: 'right',
            width: 130,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'costPrice' ? sortedInfo.order : undefined,
            render: (text, record) => {
                if (Number(record.costPrice) < 0) {
                    return <span>-$ {Global.formatBigNum(Math.abs(Number(record.costPrice)))}</span>
                } else {
                    return <span>$ {Global.formatBigNum(record.costPrice)}</span>
                }
            },
        },
        {
            title: f('marketDetailRate'),
            dataIndex: 'rate',
            key: 'rate',
            align: 'right',
            width: 100,
            render: (text, record) => {
                return <span>{record.rate || 0}%</span>
            },
        },
        {
            title: f('marketDetailValue'),
            dataIndex: 'totalValue',
            key: 'totalValue',
            align: 'right',
            width: 150,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'totalValue' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return (
                    <span>
                        $ {Global.formatBigNum(record.totalValue)}
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
        {
            title: () => {
                return (
                    <span>
                        {f('marketDetailOrders')}
                        <Tooltip
                            placement="bottom"
                            title={<div>{f('marketDetailOrdersDesc')}</div>}
                        >
                            <QuestionCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    marginLeft: '10px',
                                }}
                            />
                        </Tooltip>
                    </span>
                )
            },
            dataIndex: 'orders',
            key: 'orders',
            align: 'right',
            width: 130,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'orders' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return (
                    <span>
                        {record.ordersType == 1
                            ? record.orders
                            : record.ordersType == 2
                                ? f('ordersDes31')
                                : f('ordersDes32')}
                    </span>
                )
            },
        },
        // {
        //     title: f('marketDetailProceeds'),
        //     dataIndex: 'proceeds',
        //     key: 'proceeds',
        //     align: 'right',
        //     sorter: true,
        // sortDirections: ['descend' as const, 'ascend' as const],
        //     sortOrder: sortedInfo.columnKey === 'proceeds' ? sortedInfo.order : undefined,
        //     render: (text, record) => {
        //         return Global.formatFluctuationRange(text)
        //     },
        // },
        {
            title: f('marketDetailProfit'),
            dataIndex: 'profit',
            key: 'profit',
            align: 'right',
            width: 150,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'profit' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return <span>{Global.formatFluctuationRange(record.profit, 0)}</span>
            },
        },
        {
            title: f('marketDetailProfitRate'),
            dataIndex: 'profitRate',
            key: 'profitRate',
            align: 'right',
            width: 80,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder:
                sortedInfo.columnKey === 'profitRate' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return <span>{Global.formatIncreaseNumber(record.profitRate)}</span>
            },
        },
        {
            title: f('marketDetailFirstTime'),
            dataIndex: 'firstTime',
            key: 'firstTime',
            align: 'right',
            width: 150,
            sorter: true,
            sortDirections: ['descend' as const, 'ascend' as const],
            sortOrder: sortedInfo.columnKey === 'firstTime' ? sortedInfo.order : undefined,
            render: (text, record) => {
                return (
                    <span>
                        {record.firstTime
                            ? moment(record.firstTime).format('YYYY-MM-DD HH:mm')
                            : '--:--'}
                    </span>
                )
            },
        },
    ]


    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    interface GolbalParams {
        addressType: number,
        totalVolume: number | null | string,
        totalValue: number | null | string,
        profit: number | null | string,
        proceeds: number | null | string,
        swap: number,
    }
    const [query, setQuery] = useState<GolbalParams>({
        addressType: 0,
        swap: 0,
        totalVolume: null,
        totalValue: null,
        profit: null,
        proceeds: null,
    })
    const [searchMenuColor, setSearchMenuColor] = useState(false)
    useEffect(() => {
        if (currencyAddrRankListCondition.addressType || currencyAddrRankListCondition.totalVolume || currencyAddrRankListCondition.totalValue || currencyAddrRankListCondition.profit || currencyAddrRankListCondition.proceeds) {
            setSearchMenuColor(true)
        } else {
            setSearchMenuColor(false)
        }
    }, [currencyAddrRankListCondition])
    const handleCancel = () => {
        setQuery({
            addressType: 0,
            swap: 0,
            totalVolume: null,
            totalValue: null,
            profit: null,
            proceeds: null,
        });
        const str = {
            addressType: 0,
            totalVolume: null,
            totalValue: null,
            profit: null,
            proceeds: null,
        }
        setCurrencyAddrRankListCondition({
            ...currencyAddrRankListCondition,
            ...str,
            pageNo: 1,
            pageSize: 100,
        })
        dispatch(
            getCurrencyAddrRankList({
                ...currencyAddrRankListCondition,
                ...str,
                pageNo: 1,
                pageSize: 100,
            })
        )
        setIsModalVisible(false);
    };
    const handleOk = () => {
        scrollTop();
        setCurrencyAddrRankListCondition({
            ...currencyAddrRankListCondition,
            ...query,
            pageNo: 1,
            pageSize: 100,
        })
        dispatch(
            getCurrencyAddrRankList({
                ...currencyAddrRankListCondition,
                ...query,
                pageNo: 1,
                pageSize: 100,
            })
        )
        setIsModalVisible(false);
    };

    const [swapRecordsVisible, setSwapRecordsVisible] = useState<boolean>(false);
    useEffect(() => {
        setSwapRecordsVisible(query.addressType === 2);
    }, [query.addressType]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: flex,
                alignItems: 'center',
                justifyContent: 'space-around',
            }}
        >
            {((currencyAddrRankPie && currencyAddrRankPie.length > 0) ||
                (currencyAddrRankList && currencyAddrRankList.list &&
                    currencyAddrRankList.list.length > 0)) ? (
                <>
                    <div style={{ width: '450px', height: '450px' }}>
                        <MemoTrend currencyAddrRankPie={currencyAddrRankPie} />
                    </div>

                    <div
                        style={
                            flex == 'row'
                                ? {
                                    width: 'calc(100% - 500px)',
                                    minWidth: 360,
                                    maxWidth: 800,
                                }
                                : { width: '100%' }
                        }
                    >
                        {flex != 'row' && level == 1 ?
                            <>
                                <span className="address-detail-popover" style={{ color: searchMenuColor ? '#7377de' : '#999', margin: '0 40px', cursor: 'pointer' }} onClick={showModal}>{f('SearchMenu')}<FilterFilled /></span>
                                <Modal
                                    visible={isModalVisible}
                                    forceRender
                                    onCancel={() => { setIsModalVisible(false) }}
                                    width={locale == 'zh' ? 520 : 700}
                                    footer={null}>
                                    <p className="modal-title">
                                        {f('SearchMenu')}
                                    </p>
                                    <Row style={{ marginBottom: 16 }}>
                                        <Col span={locale == 'zh' ? 6 : 8} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}>
                                            {f('searchMenuType')}
                                        </Col>
                                        <Col span={locale == 'zh' ? 18 : 16}>
                                            <Radio.Group value={query.addressType} buttonStyle="solid" onChange={(e) => {
                                                setQuery({
                                                    ...query,
                                                    addressType: e.target.value,
                                                })
                                            }}>
                                                <Radio.Button value={0}
                                                    style={{ borderRadius: '0px', width: 100, textAlign: 'center' }}>{f('searchMenuTypeAll')}</Radio.Button>
                                                <Radio.Button value={1}
                                                    style={{ marginLeft: '10px', borderRadius: '0px', width: locale == 'zh' ? 100 : 150, textAlign: 'center' }}>{f('searchMenuTypeLeft')}</Radio.Button>
                                                <Radio.Button value={2}
                                                    style={{ marginLeft: '10px', borderRadius: '0px', minWidth: 100, textAlign: 'center' }}>{f('searchMenuTypeRight')}</Radio.Button>
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: 16, display: swapRecordsVisible ? 'flex' : 'none' }}>
                                        <Col span={locale == 'zh' ? 6 : 8} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}>
                                            {f('swapRecords')}
                                        </Col>
                                        <Col span={locale == 'zh' ? 18 : 16}>
                                            <Radio.Group value={query.swap} buttonStyle="solid" onChange={(e) => {
                                                setQuery({
                                                    ...query,
                                                    swap: e.target.value,
                                                })
                                            }}>
                                                <Radio.Button value={0}
                                                    style={{ borderRadius: '0px', width: 100, textAlign: 'center' }}>{f('searchMenuTypeAll')}</Radio.Button>
                                                <Radio.Button value={1}
                                                    style={{ marginLeft: '10px', borderRadius: '0px', width: locale == 'zh' ? 100 : 150, textAlign: 'center' }}>{f('have')}</Radio.Button>
                                                <Radio.Button value={2}
                                                    style={{ marginLeft: '10px', borderRadius: '0px', minWidth: 100, textAlign: 'center' }}>{f('notHave')}</Radio.Button>
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: 16 }}>
                                        <Col span={locale == 'zh' ? 6 : 8} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}>
                                            {f('searchMenuTotalVolume')}：
                                        </Col>
                                        <Col span={locale == 'zh' ? 18 : 16}>
                                            <InputNumber placeholder={f('searchMenuNumberPlaceholder')} value={query.totalVolume as number} onChange={(value) => {
                                                setQuery({
                                                    ...query,
                                                    totalVolume: value as number | null | string || null,
                                                })
                                            }}
                                                style={{ width: '100%' }} />
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: 16 }}>
                                        <Col span={locale == 'zh' ? 6 : 8} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}>
                                            {f('searchMenuTotalValue')}：
                                        </Col>
                                        <Col span={locale == 'zh' ? 18 : 16}>
                                            <InputNumber placeholder={f('searchMenuNumberPlaceholder')} value={query.totalValue as number} onChange={(value) => {
                                                setQuery({
                                                    ...query,
                                                    totalValue: value as number | null | string || null,
                                                })
                                            }}
                                                style={{ width: '100%' }} />
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: 16 }}>
                                        <Col span={locale == 'zh' ? 6 : 8} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}>
                                            {f('searchMenuProfit')}：
                                        </Col>
                                        <Col span={locale == 'zh' ? 18 : 16}>
                                            <InputNumber placeholder={f('searchMenuNumberPlaceholder')} value={query.profit as number} onChange={(value) => {
                                                setQuery({
                                                    ...query,
                                                    profit: value as number | null | string || null,
                                                })
                                            }}
                                                style={{ width: '100%' }} />
                                        </Col>
                                    </Row>
                                    {/* <Row style={{ marginBottom: 40 }}>
                                        <Col span={locale == 'zh' ? 6 : 8} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}>
                                            {f('searchMenuProceeds')}：
                                        </Col>
                                        <Col span={locale == 'zh' ? 18 : 16}>
                                            <InputNumber placeholder={f('searchMenuNumberPlaceholder')} value={query.proceeds as number} onChange={(value) => {
                                                setQuery({
                                                    ...query,
                                                    proceeds: value as number | null | string || null,
                                                })
                                            }}
                                                style={{ width: '100%' }} />
                                        </Col>
                                    </Row> */}
                                    <div className="form-btns" style={{ textAlign: 'center' }}>
                                        <Button
                                            style={{
                                                marginRight: 100,
                                            }} onClick={handleCancel}>
                                            {f('resetBtn')}
                                        </Button>
                                        <Button type="primary" onClick={handleOk}>
                                            {f('searchBtn')}
                                        </Button>
                                    </div>
                                </Modal>
                            </>
                            :
                            null
                        }
                        <div
                            className="common-table"
                            style={{ boxShadow: 'none', padding: showMore ? '0 0 20px' : 0 }}
                        >
                            {flex == 'row' ? (
                                <>
                                    <Table
                                        rowKey="address"
                                        loading={loading}
                                        columns={columnsRow}
                                        dataSource={currencyAddrRankList?.list.slice(0, 10)}
                                        onChange={handleChange}
                                        pagination={false}
                                    />
                                </>
                            ) : (
                                level == 1 ?
                                    <div className={`currency-addr-rank-scroll ${barName}`} style={{
                                        position: 'relative', height: window.innerHeight < 850
                                            ? window.innerHeight - 150
                                            : window.innerHeight - 250, overflow: 'auto'
                                    }} onScroll={currencyAddrRankScroll}>
                                        <Table
                                            rowKey="address"
                                            loading={loading}
                                            columns={columns}
                                            dataSource={currencyAddrRankListCondition.pageNo == 1 ? currencyAddrRankList?.list : dataMore?.list}
                                            onChange={handleChange}
                                            pagination={false}
                                            // scroll={{ x: 1600 }}
                                            sticky
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
                                    :
                                    <div className={`currency-addr-rank-no-scroll ${barNoName}`} onMouseMove={onMouseMove}>
                                        <Table
                                            rowKey="address"
                                            loading={loading}
                                            columns={columns}
                                            dataSource={currencyAddrRankListCondition.pageNo == 1 ? currencyAddrRankList?.list : dataMore?.list}
                                            onChange={handleChange}
                                            pagination={false}
                                            // scroll={{ x: 1600 }}
                                            sticky
                                        />
                                    </div>
                            )}
                            <WaterMarkContent />
                        </div>
                        {showMore ? (
                            currencyAddrRankList && currencyAddrRankList.list &&
                                currencyAddrRankList.list.length >= 10 ? (
                                <div
                                    className="view-more-rank"
                                    onClick={(event) => {
                                        trackAction(
                                            MARKET_DETAIL.category,
                                            MARKET_DETAIL.actions
                                                .symbol_detail_currency_addr_rank,
                                            MARKET_DETAIL.actions.see_more
                                        )
                                        Global.openNewTag(event, router, `/market-detail-more/market-page/market-detail/currencyAddrRank/${symbolAddr}`)
                                    }}
                                >
                                    <span>+<span className="rank-more-text">{f('marketDetailSeeMore')}</span></span>
                                </div>
                            ) : null
                        ) : (
                            <div className="btnBox">
                                {!loading && noMore && level != 0 ? (
                                    <Divider className="no-more">
                                        {f('noMore')}
                                    </Divider>
                                ) : null}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="table-empty">
                    <DefinEmpty spinning={loading} />
                </div>
            )}
        </div>
    )
}

interface RankPieProps {
    currencyAddrRankPie: AddrRankPieItem[]
}

const MemoTrend = React.memo(RankPie, (prevProps: RankPieProps, nextProps: RankPieProps) => {
    return JSON.stringify(prevProps.currencyAddrRankPie) === JSON.stringify(nextProps.currencyAddrRankPie);
});

function RankPie({ currencyAddrRankPie }: RankPieProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    var config = {
        appendPadding: 10,
        data: currencyAddrRankPie || [],
        angleField: 'rate',
        colorField: 'address',
        radius: 1,
        innerRadius: 0.6,
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        legend: false as const,
        pieStyle: {
            stroke: null
        },
        tooltip: {
            position: 'bottom' as const,
            enterable: true,
            customContent: (title: string, data: any[]) => {
                if (data.length > 0) {
                    return (
                        <div style={{ padding: '20px 10px', minWidth: 300 }}>
                            <div style={{ padding: '10px 0' }}>
                                <span>{f('marketDetailSymbolAddr')}：</span>
                                <span>{(data[0].data as AddrRankPieItem).address}</span>
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                <span>{f('marketDetailRate')}：</span>
                                <span>{(data[0].data as AddrRankPieItem).rate}%</span>
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                <span>{f('marketDetailBalance')}：</span>
                                <span>{Global.formatNum((data[0].data as AddrRankPieItem).balance)}</span>
                            </div>
                        </div>
                    ) as unknown as string
                } else {
                    return <></> as unknown as string
                }
            },
        },
        interactions: [
            // {type: 'element-selected' },
            { type: 'element-active' },
        ],
        label: {
            type: 'inner',
            offset: '-50%',
            formatter: function formatter(item: Record<string, number>, mappingData: any, index: number) {
                if (item.rate > 2.2) {
                    return item.rate + '%'
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
                    if (currencyAddrRankPie && currencyAddrRankPie.length > 0) {
                        return (
                            <img
                                src={'/images/line-watermark.svg'}
                                style={{ width: '200px' }}
                            />
                        ) as unknown as string
                    } else {
                        return <></> as unknown as string
                    }
                },
            },
        },
        animation: false as const,
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
    )
}