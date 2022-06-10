import React, { useState, useEffect, Key, ReactElement } from 'react'
import { useIntl } from 'react-intl'
import { Select, Table, Menu, Tooltip, Modal, Row, Col, DatePicker, Radio, InputNumber, Input, Button } from 'antd'
import { SwapRightOutlined, SwapLeftOutlined, FilterFilled } from '@ant-design/icons'
const { Option } = Select
import 'styles/market-page.less'
import Global from 'utils/Global'
import { useDispatch, useSelector } from 'react-redux'
import 'styles/address-combination.less'
import {
    getTransactionHistoryBusList,
    getTransactionHistoryLpList,
    getTransactionHistoryTransferList,
} from 'redux/actions/MarketPage/TransactionHistoryAction'
import AddressDetail from 'components/MarketComponents/AddressDetail'
import type { AppState } from 'redux/reducers'
import type { TransactionHistoryItem, TransactionHistoryParams, TransactionHistoryResponse } from 'redux/types/TransactionHistoryTypes'
import type { MenuInfo } from 'rc-menu/lib/interface'
import type { TablePaginationConfig } from 'antd/lib/table'
import type { ColumnsType, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { NextRouter, useRouter } from 'next/router'
import { DefaultLocale } from 'utils/env'
import moment, { Moment } from 'moment'
import type { RangeValue } from 'rc-picker/lib/interface'
import type { RadioChangeEvent } from 'antd/lib/radio/interface'
import { TokenLogo } from 'components/TokenLogo'
import WaterMarkContent from 'components/WaterMarkContent'
const { RangePicker } = DatePicker

interface TransactionHistoryProps {
    symbol0Addr: string,
    symbol: string,
}
interface GolbalParams {
    startTime: number | null,
    endTime: number | null,
    direction?: number | null,
    type?: number | null,
    address: string | null,
    fromAddr?: string | null,
    toAddr?: string | null,
    minAmount: number | null | string,
}

export default function TransactionHistory({
    symbol0Addr,
    symbol,
}: TransactionHistoryProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    const router = useRouter()
    const { locale = DefaultLocale }: NextRouter = router;

    const [busCondition, setBusCondition] = useState<TransactionHistoryParams>({
        symbol0Addr: symbol0Addr,
        pageNo: 1,
        pageSize: 20,
        startTime: null,
        endTime: null,
        direction: 0,
        address: null,
        minAmount: null,
    })
    const [lpCondition, setLpCondition] = useState<TransactionHistoryParams>({
        symbol0Addr: symbol0Addr,
        pageNo: 1,
        pageSize: 20,
        startTime: null,
        endTime: null,
        direction: 0,
        address: null,
        minAmount: null,
    })
    const [transferCondition, setTransferCondition] = useState<TransactionHistoryParams>({
        symbolAddr: symbol0Addr,
        pageNo: 1,
        pageSize: 20,
        startTime: null,
        endTime: null,
        type: 0,
        address: null,
        fromAddr: null,
        toAddr: null,
        minAmount: null,
    })

    const loadingBus = useSelector(
        (state: AppState) => state.transactionHistoryReducer.loadingBus
    )
    const loadingLp = useSelector(
        (state: AppState) => state.transactionHistoryReducer.loadingLp
    )
    const loadingTransfer = useSelector(
        (state: AppState) => state.transactionHistoryReducer.loadingTransfer
    )
    const transactionHistoryBusList = useSelector(
        (state: AppState) => state.transactionHistoryReducer.transactionHistoryBusList
    )
    const transactionHistoryLpList = useSelector(
        (state: AppState) => state.transactionHistoryReducer.transactionHistoryLpList
    )
    const transactionHistoryTransferList = useSelector(
        (state: AppState) => state.transactionHistoryReducer.transactionHistoryTransferList
    )

    const [current, setCurrent] = useState<Key>('TransactionBus')

    useEffect(() => {
        setBusCondition({
            ...busCondition,
            symbol0Addr: symbol0Addr,
        })
        dispatch(
            getTransactionHistoryBusList({
                ...busCondition,
                symbol0Addr: symbol0Addr,
            })
        )
        setLpCondition({
            ...lpCondition,
            symbol0Addr: symbol0Addr,
        })
        dispatch(
            getTransactionHistoryLpList({
                ...lpCondition,
                symbol0Addr: symbol0Addr,
            })
        )
        setTransferCondition({
            ...transferCondition,
            symbolAddr: symbol0Addr,
        })
        dispatch(
            getTransactionHistoryTransferList({
                ...transferCondition,
                symbolAddr: symbol0Addr,
            })
        )
    }, [dispatch, symbol0Addr])

    //切换menu
    const menuClick = (e: MenuInfo) => {
        if (e.key == 'SearchMenu') {
            if (current == 'TransferRecord') {
                showTransferModal()
            } else {
                showModal()
            }
        } else {
            setCurrent(e.key)
            if (e.key == 'TransactionBus') {
                dispatch(getTransactionHistoryBusList(busCondition))
            } else if (e.key == 'TransactionLp') {
                dispatch(getTransactionHistoryLpList(lpCondition))
            } else {
                dispatch(getTransactionHistoryTransferList(transferCondition))
            }
        }
    }

    const handleOptionalTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
        setBusCondition({
            ...busCondition,
            symbol0Addr: busCondition.symbol0Addr,
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
        })
        dispatch(
            getTransactionHistoryBusList({
                ...busCondition,
                symbol0Addr: busCondition.symbol0Addr,
                pageNo: pagination.current,
                pageSize: pagination.pageSize,
            })
        )
    }
    const handleAllTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
        setLpCondition({
            ...lpCondition,
            symbol0Addr: lpCondition.symbol0Addr,
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
        })
        dispatch(
            getTransactionHistoryLpList({
                ...lpCondition,
                symbol0Addr: lpCondition.symbol0Addr,
                pageNo: pagination.current,
                pageSize: pagination.pageSize,
            })
        )
    }
    const handleTransferTableChange = (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
        setTransferCondition({
            ...transferCondition,
            symbolAddr: transferCondition.symbolAddr,
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
        })
        dispatch(
            getTransactionHistoryTransferList({
                ...transferCondition,
                symbolAddr: transferCondition.symbolAddr,
                pageNo: pagination.current,
                pageSize: pagination.pageSize,
            })
        )
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
        // setIsTransferModalVisible(false);
    };
    const showTransferModal = () => {
        setIsTransferModalVisible(true);
        // setIsModalVisible(false);
    };
    const handleOk = () => {
        setBusCondition({
            ...busCondition,
            ...query,
            pageNo: 1,
            pageSize: 20,
        })
        dispatch(
            getTransactionHistoryBusList({
                ...busCondition,
                ...query,
                pageNo: 1,
                pageSize: 20,
            })
        )
        setLpCondition({
            ...lpCondition,
            ...query,
            pageNo: 1,
            pageSize: 20,
        })
        dispatch(
            getTransactionHistoryLpList({
                ...lpCondition,
                ...query,
                pageNo: 1,
                pageSize: 20,
            })
        )
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setQuery({
            startTime: null,
            endTime: null,
            direction: 0,
            address: null,
            minAmount: null,
        });
        const str = {
            startTime: null,
            endTime: null,
            direction: 0,
            address: null,
            minAmount: null,
        }
        setBusCondition({
            ...busCondition,
            ...str
        })
        dispatch(
            getTransactionHistoryBusList({
                ...busCondition,
                ...str
            })
        )
        setLpCondition({
            ...lpCondition,
            ...str
        })
        dispatch(
            getTransactionHistoryLpList({
                ...lpCondition,
                ...str
            })
        )
        setIsModalVisible(false);
    };
    const handleOkTransfer = () => {
        setTransferCondition({
            ...transferCondition,
            ...queryTransfer,
            pageNo: 1,
            pageSize: 20,
        })
        dispatch(
            getTransactionHistoryTransferList({
                ...transferCondition,
                ...queryTransfer,
                pageNo: 1,
                pageSize: 20,
            })
        )
        setIsTransferModalVisible(false);
    };
    const handleCancelTransfer = () => {
        setQueryTransfer({
            startTime: null,
            endTime: null,
            type: 0,
            address: null,
            fromAddr: null,
            toAddr: null,
            minAmount: null,
        });
        const str = {
            startTime: null,
            endTime: null,
            type: 0,
            address: null,
            fromAddr: null,
            toAddr: null,
            minAmount: null,
        }
        setTransferCondition({
            ...transferCondition,
            ...str
        })
        dispatch(
            getTransactionHistoryTransferList({
                ...transferCondition,
                ...str
            })
        )
        setIsTransferModalVisible(false);
    }

    const [query, setQuery] = useState<GolbalParams>({
        startTime: null,
        endTime: null,
        direction: 0,
        address: null,
        minAmount: null,
    })
    const [queryTransfer, setQueryTransfer] = useState<GolbalParams>({
        startTime: null,
        endTime: null,
        type: 0,
        address: null,
        fromAddr: null,
        toAddr: null,
        minAmount: null,
    })
    const handleDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
        setQuery({
            ...query,
            startTime: Math.floor(moment(dates![0]).valueOf()),
            endTime: Math.floor(moment(dates![1]).valueOf()),
        })
    }
    const handleTransferDatePickerChange = (dates: RangeValue<Moment>, dateStrings: string[]) => {
        setQueryTransfer({
            ...queryTransfer,
            startTime: Math.floor(moment(dates![0]).valueOf()),
            endTime: Math.floor(moment(dates![1]).valueOf()),
        })
    }

    const [searchMenuColor, setSearchMenuColor] = useState(false)
    useEffect(() => {
        if (current == 'TransferRecord') {
            if (queryTransfer.startTime || queryTransfer.endTime || queryTransfer.direction || queryTransfer.address || queryTransfer.minAmount || queryTransfer.fromAddr || queryTransfer.toAddr) {
                setSearchMenuColor(true)
            } else {
                setSearchMenuColor(false)
            }
        } else {
            if (query.startTime || query.endTime || query.direction || query.address || query.minAmount) {
                setSearchMenuColor(true)
            } else {
                setSearchMenuColor(false)
            }
        }
    }, [query, current])

    return (
        <div className="chance-warning address-combination">
            <div className="menuBox transaction-history-menu-box">
                <Menu
                    selectedKeys={[current as string]}
                    mode="horizontal"
                    style={{ background: 'transparent' }}
                    onClick={menuClick}
                >
                    <Menu.Item key="TransactionBus">
                        {f('marketDetailTransactionBus')}
                    </Menu.Item>
                    <Menu.Item key="TransactionLp">
                        {f('marketDetailTransactionLp')}
                    </Menu.Item>
                    <Menu.Item key="TransferRecord">
                        {f('marketDetailTransferRecord')}
                    </Menu.Item>
                    <Menu.Item key="SearchMenu" className={`search-menu ${searchMenuColor ? 'search-menu-active' : ''}`}>
                        {f('SearchMenu')}<FilterFilled />
                    </Menu.Item>
                </Menu>
            </div>
            <Modal
                visible={isModalVisible}
                forceRender
                onCancel={() => { setIsModalVisible(false) }}
                width={locale == 'zh' ? 520 : 620}
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
                        {f('searchMenuTimeInterval')}：
                    </Col>
                    <Col span={locale == 'zh' ? 18 : 16}>
                        <RangePicker
                            format={'YYYY-MM-DD'}
                            allowClear={false}
                            value={query.startTime ? [moment(query.startTime), moment(query.endTime)] : [] as unknown as [Moment, Moment]}
                            onChange={handleDatePickerChange}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={locale == 'zh' ? 6 : 8} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {f(`searchMenuBusiness${current}`)}
                    </Col>
                    <Col span={locale == 'zh' ? 18 : 16}>
                        <Radio.Group value={query.direction} buttonStyle="solid" onChange={(e) => {
                            setQuery({
                                ...query,
                                direction: e.target.value,
                            })
                        }}>
                            <Radio.Button value={0}
                                style={{ borderRadius: '0px', width: 100, textAlign: 'center' }}>{f('searchMenuBusinessAll')}</Radio.Button>
                            <Radio.Button value={1}
                                style={{ marginLeft: '10px', borderRadius: '0px', width: locale == 'zh' ? 100 : 120, textAlign: 'center' }}>{f(`search${current}Left`)}</Radio.Button>
                            <Radio.Button value={2}
                                style={{ marginLeft: '10px', borderRadius: '0px', minWidth: 100, textAlign: 'center' }}>{f(`search${current}Right`)}</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={locale == 'zh' ? 6 : 8} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {f('searchMenuAddress')}：
                    </Col>
                    <Col span={locale == 'zh' ? 18 : 16}>
                        <Input placeholder={f('searchMenuAddressPlaceholder')} value={query.address as string} onChange={(e) => {
                            setQuery({
                                ...query,
                                address: e.target.value || null,
                            })
                        }} />
                    </Col>
                </Row>
                <Row style={{ marginBottom: 40 }}>
                    <Col span={locale == 'zh' ? 6 : 8} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {f('searchMenuNumber')}：
                    </Col>
                    <Col span={locale == 'zh' ? 18 : 16}>
                        <InputNumber placeholder={f('searchMenuNumberPlaceholder')} value={query.minAmount as number} onChange={(value) => {
                            setQuery({
                                ...query,
                                minAmount: value as number | null | string || null,
                            })
                        }}
                            style={{ width: '100%' }} />
                    </Col>
                </Row>
                <div className="form-btns">
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
            <Modal
                visible={isTransferModalVisible}
                forceRender
                onCancel={() => { setIsTransferModalVisible(false) }}
                width={550}
                footer={null}>
                <p className="modal-title">
                    {f('SearchMenu')}
                </p>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={6} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {f('searchMenuTimeInterval')}：
                    </Col>
                    <Col span={18}>
                        <RangePicker
                            format={'YYYY-MM-DD'}
                            allowClear={false}
                            value={queryTransfer.startTime ? [moment(queryTransfer.startTime), moment(queryTransfer.endTime)] : [] as unknown as [Moment, Moment]}
                            onChange={handleTransferDatePickerChange}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={6} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {f(`searchMenuBusiness${current}`)}
                    </Col>
                    <Col span={18}>
                        <Radio.Group value={queryTransfer.type} buttonStyle="solid" onChange={(e) => {
                            setQueryTransfer({
                                ...queryTransfer,
                                type: e.target.value,
                            })
                        }}>
                            <Radio.Button value={0}
                                style={{ borderRadius: '0px', width: 100, textAlign: 'center' }}>{f('searchMenuBusinessAll')}</Radio.Button>
                            <Radio.Button value={1}
                                style={{ marginLeft: '10px', borderRadius: '0px', width: 100, textAlign: 'center' }}>{f(`search${current}Left`)}</Radio.Button>
                            <Radio.Button value={2}
                                style={{ marginLeft: '10px', borderRadius: '0px', minWidth: 100, textAlign: 'center' }}>{f(`search${current}Right`)}</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={6} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {f('searchMenuAddressFrom')}：
                    </Col>
                    <Col span={18}>
                        <Input placeholder={f('searchMenuAddressPlaceholder')} value={queryTransfer.fromAddr as string} onChange={(e) => {
                            setQueryTransfer({
                                ...queryTransfer,
                                fromAddr: e.target.value || null,
                            })
                        }} />
                    </Col>
                </Row>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={6} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {f('searchMenuAddressTo')}：
                    </Col>
                    <Col span={18}>
                        <Input placeholder={f('searchMenuAddressPlaceholder')} value={queryTransfer.toAddr as string} onChange={(e) => {
                            setQueryTransfer({
                                ...queryTransfer,
                                toAddr: e.target.value || null,
                            })
                        }} />
                    </Col>
                </Row>
                <Row style={{ marginBottom: 40 }}>
                    <Col span={6} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {f('searchMenuNumberThan')}：
                    </Col>
                    <Col span={18}>
                        <InputNumber placeholder={f('searchMenuNumberPlaceholder')} value={queryTransfer.minAmount as number} onChange={(value) => {
                            setQueryTransfer({
                                ...queryTransfer,
                                minAmount: value as number | null | string || null,
                            })
                        }}
                            style={{ width: '100%' }} />
                    </Col>
                </Row>
                <div className="form-btns">
                    <Button
                        style={{
                            marginRight: 100,
                        }} onClick={handleCancelTransfer}>
                        {f('resetBtn')}
                    </Button>
                    <Button type="primary" onClick={handleOkTransfer}>
                        {f('searchBtn')}
                    </Button>
                </div>
            </Modal>
            <div className="contentContainer">
                {current == 'TransactionBus' ? (
                    <div
                        className="common-table"
                        style={{ boxShadow: 'none', padding: '0 0 20px' }}
                    >
                        <WaterMarkContent />
                        <TableList
                            symbol={symbol}
                            tableName="bus"
                            params={{
                                loading: loadingBus,
                                pageNo: busCondition.pageNo,
                                pageSize: busCondition.pageSize,
                                current: current,
                            }}
                            groupList={transactionHistoryBusList}
                            handleTableChange={handleOptionalTableChange}
                            locale={locale}
                        />
                    </div>
                ) : null}
                {current == 'TransactionLp' ? (
                    <div
                        className="common-table"
                        style={{ boxShadow: 'none', padding: '0 0 20px' }}
                    >
                        <WaterMarkContent />
                        <TableList
                            symbol={symbol}
                            tableName="lp"
                            params={{
                                loading: loadingLp,
                                pageNo: lpCondition.pageNo,
                                pageSize: lpCondition.pageSize,
                                current: current as string,
                            }}
                            groupList={transactionHistoryLpList}
                            handleTableChange={handleAllTableChange}
                            locale={locale}
                        />
                    </div>
                ) : null}
                {current == 'TransferRecord' ? (
                    <div
                        className="common-table"
                        style={{ boxShadow: 'none', padding: '0 0 20px' }}
                    >
                        <WaterMarkContent />
                        <TableList
                            symbol={symbol}
                            tableName="transfer"
                            params={{
                                loading: loadingTransfer,
                                pageNo: transferCondition.pageNo,
                                pageSize: transferCondition.pageSize,
                                current: current as string,
                            }}
                            groupList={transactionHistoryTransferList}
                            handleTableChange={handleTransferTableChange}
                            locale={locale}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    )
}

interface TableListProps {
    params: {
        loading: boolean,
        pageNo: number | undefined,
        pageSize: number | undefined,
        current: string,
    },
    groupList: TransactionHistoryResponse | null,
    handleTableChange: (pagination: TablePaginationConfig, filters: Record<string, (Key | boolean)[] | null>, sorter: SorterResult<TransactionHistoryItem> | SorterResult<TransactionHistoryItem>[], extra: TableCurrentDataSource<TransactionHistoryItem>) => void;
    symbol: string,
    tableName: string,
    locale: string
}

interface TableTypeColumn {
    [key: string]: ReactElement[]
}

function TableList({ params, groupList, handleTableChange, symbol, tableName, locale }: TableListProps) {
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const logoUrlDesc: string[] = [
        f('marketDetailWhale'),
        f('marketDetailRobot'),
        f('marketDetailElephant'),
    ]
    const tableTypeColumn: TableTypeColumn = {
        TransactionBus: [
            <span style={{ color: '#1FA300', display: 'flex' }}>
                <SwapLeftOutlined />
            </span>,
            <span style={{ color: '#EF6D59', display: 'flex' }}>
                <SwapRightOutlined />
            </span>,
        ],
        TransactionLp: [
            <span style={{ color: '#1FA300', display: 'flex' }}>
                <svg
                    className="icon"
                    aria-hidden="true"
                    style={{ width: 16, height: 16 }}>
                    <title>{f('marketDetailLpDown')}</title>
                    <use xlinkHref='#icon-lp_down'></use>
                </svg>
            </span>,
            <span style={{ color: '#EF6D59', display: 'flex' }}>
                <svg
                    className="icon"
                    aria-hidden="true"
                    style={{ width: 16, height: 16 }}>
                    <title>{f('marketDetailLpUp')}</title>
                    <use xlinkHref='#icon-lp_up'></use>
                </svg>
            </span>,
        ],
    }
    const groupColumns: ColumnsType<TransactionHistoryItem> = [
        {
            title: f('marketDetailTradeTime'),
            dataIndex: 'tradeTime',
            key: 'tradeTime',
            // width: 100,
            render: (text, record) => {
                return Global.distanceFromCurrent(record.tradeTime, locale)
            },
        },
        {
            title: f('marketDetailAddress'),
            dataIndex: 'address',
            key: 'address',
            // width: 100,
            align: 'right',
            render: (text, record) => {
                return (
                    <AddressDetail
                        symbol={symbol}
                        address={record.address}
                        symbolAddr={record.symbol0Addr}
                        titles={record.titles}
                        label={record.addressLabel}
                    />
                )
            },
        },
        {
            title: f('marketDetailType'),
            dataIndex: 'type',
            width: 100,
            key: 'type',
            align: 'center',
            render: (text, record) => {
                if (record.type == 1) {
                    return (
                        <span style={{ color: '#1FA300' }}>
                            {f('marketDetailTypeIn')}
                        </span>
                    )
                } else if (record.type == 2) {
                    return (
                        <span style={{ color: '#EF6D59' }}>
                            {f('marketDetailTypeOut')}
                        </span>
                    )
                }
            },
        },
        {
            title: f('marketDetailDetails'),
            dataIndex: 'volume0',
            // width: 400,
            key: 'volume0',
            // align: 'center',
            render: (text, record) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span
                                style={{
                                    display: 'block',
                                    width: 150,
                                    textAlign: 'left',
                                }}
                            >
                                {Global.formatBigNum(record.volume0)} {record.symbol0}
                            </span>
                            <span style={{
                                display: 'block',
                                width: 30,
                                textAlign: 'center'
                            }}>
                                {
                                    tableTypeColumn[params.current][
                                    record.type - 1
                                    ]
                                }
                            </span>
                            <span
                                style={{
                                    display: 'block',
                                    width: 150,
                                    textAlign: 'right',
                                }}
                            >
                                {Global.formatBigNum(record.volume1)} {record.symbol1}
                            </span>
                        </div>
                        <span style={{
                            display: 'block',
                            width: 30
                        }}>
                            {record.logoUrl ? (
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
                            ) : null}
                        </span>
                    </div>
                )
            },
        },
        {
            title: f('marketDetailPrice'),
            dataIndex: 'price0',
            // width: 200,
            key: 'price0',
            align: 'right',
            render: (text, record) => {
                return record.price0 && record.price0.toLowerCase().includes('e')
                    ? `${record.price0} ${record.symbol1}`
                    : `${Global.formatBigNum(record.price0)} ${record.symbol1}`
            },
        },
        {
            title: f('marketDetailPrice') + '/USD',
            dataIndex: 'price1',
            key: 'price1',
            align: 'right',
            // fixed: 'right',
            // width: 200,
            render: (text, record) => {
                return record.price1 !== null
                    ? record.price1.toLowerCase().includes('e')
                        ? `${record.price1}`
                        : `${Global.formatBigNum(record.price1)}`
                    : ''
            },
        },
        {
            title: f('marketDetailTxHash'),
            dataIndex: 'txHash',
            key: 'txHash',
            align: 'right',
            // fixed: 'right',
            // width: 200,
            render: (text, record) => {
                return (
                    <svg
                        className="icon"
                        aria-hidden="true"
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                        onClick={() => {
                            window.open(record.txHash)
                        }}>
                        <use xlinkHref='#icon-etherscan'></use>
                    </svg>
                )
            },
        },
    ]
    const groupLpColumns: ColumnsType<TransactionHistoryItem> = [
        {
            title: f('marketDetailTradeTime'),
            dataIndex: 'tradeTime',
            key: 'tradeTime',
            // width: 100,
            render: (text, record) => {
                return Global.distanceFromCurrent(record.tradeTime, locale)
            },
        },
        {
            title: f('marketDetailAddress'),
            dataIndex: 'address',
            key: 'address',
            // width: 100,
            // align: 'left',
            render: (text, record) => {
                return (
                    <div style={{ display: 'flex', }}>
                        <AddressDetail
                            symbol={symbol}
                            address={record.address}
                            symbolAddr={record.symbol0Addr}
                            titles={record.titles}
                            label={record.addressLabel}
                        />
                        <span style={{
                            display: 'block',
                            width: 30
                        }}>
                            {record.logoUrl ? (
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
                            ) : null}
                        </span>
                    </div>
                )
            },
        },
        {
            title: f('marketDetailType'),
            dataIndex: 'type',
            width: 200,
            key: 'type',
            align: 'center',
            render: (text, record) => {
                if (record.type == 1) {
                    return (
                        <span style={{ color: '#1FA300' }}>
                            {f('marketDetailLpDown')}
                        </span>
                    )
                } else if (record.type == 2) {
                    return (
                        <span style={{ color: '#EF6D59' }}>
                            {f('marketDetailLpUp')}
                        </span>
                    )
                }
            },
        },
        {
            title: f('marketDetailDetails'),
            dataIndex: 'volume1',
            // width: 310,
            key: 'volume1',
            // align: 'center',
            render: (text, record) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{
                                display: 'flex',
                                width: 30,
                                alignItems: 'center'
                            }}>
                                {
                                    tableTypeColumn[params.current][
                                    record.type - 1
                                    ]
                                }
                            </span>
                            <span>
                                <span
                                    style={{
                                        display: 'block',
                                        // width: 150,
                                        textAlign: 'left',
                                    }}
                                >
                                    {Global.formatBigNum(record.volume0)} {record.symbol0}
                                </span>
                                +
                                <span
                                    style={{
                                        display: 'block',
                                        // width: 150,
                                        textAlign: 'left',
                                    }}
                                >
                                    {Global.formatBigNum(record.volume1)} {record.symbol1}
                                </span>
                            </span>
                        </div>
                    </div>
                )
            },
        },
        {
            title: f('marketDetailTxHash'),
            dataIndex: 'txHash',
            key: 'txHash',
            align: 'right',
            // fixed: 'right',
            // width: 200,
            render: (text, record) => {
                return (
                    <svg
                        className="icon"
                        aria-hidden="true"
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                        onClick={() => {
                            window.open(record.txHash)
                        }}>
                        <use xlinkHref='#icon-etherscan'></use>
                    </svg>
                )
            },
        },
    ]
    const groupTransferColumns: ColumnsType<TransactionHistoryItem> = [
        {
            title: f('marketDetailTradeTime'),
            dataIndex: 'tradeTime',
            key: 'tradeTime',
            // width: 100,
            render: (text, record) => {
                return Global.distanceFromCurrent(record.tradeTime, locale)
            },
        },
        {
            title: f('marketDetailAddressFrom'),
            dataIndex: 'from',
            key: 'from',
            width: 160,
            render: (text, record) => {
                return (
                    <div style={{ display: 'flex' }}>
                        <AddressDetail
                            symbol={symbol}
                            address={record.from?.address as string}
                            symbolAddr={record.symbolAddr as string}
                            titles={record.from?.titles as string[]}
                            label={record.fromAddrLabel}
                        />
                        <span style={{
                            display: 'block',
                            width: 30
                        }}>
                            {record.from?.logoUrl ? (
                                <Tooltip
                                    title={
                                        <div>
                                            {
                                                logoUrlDesc[
                                                record.from?.description! - 1
                                                ]
                                            }
                                        </div>
                                    }
                                >
                                    <TokenLogo
                                        style={{ width: 20, height: 20, marginLeft: 10 }}
                                        src={record.from.logoUrl}
                                        alt=""
                                    />
                                </Tooltip>
                            ) : null}
                        </span>
                    </div>
                )
            }
        },
        {
            title: ' ',
            dataIndex: 'address',
            key: 'address',
            width: 50,
            align: 'center',
            render: (text, record) => {
                return (
                    <span style={{ color: '#EF6D59', display: 'flex' }}>
                        <SwapRightOutlined />
                    </span>
                )
            },
        },
        {
            title: f('marketDetailAddressTo'),
            dataIndex: 'to',
            width: 160,
            key: 'to',
            render: (text, record) => {
                return (
                    <div style={{ display: 'flex' }}>
                        <AddressDetail
                            symbol={symbol}
                            address={record.to?.address as string}
                            symbolAddr={record.symbolAddr as string}
                            titles={record.to?.titles as string[]}
                            label={record.toAddrLabel}
                        />

                        <span style={{
                            display: 'block',
                            width: 30
                        }}>
                            {record.to?.logoUrl ? (
                                <Tooltip
                                    title={
                                        <div>
                                            {
                                                logoUrlDesc[
                                                record.to?.description! - 1
                                                ]
                                            }
                                        </div>
                                    }
                                >
                                    <TokenLogo
                                        style={{ width: 20, height: 20, marginLeft: 10 }}
                                        src={record.to.logoUrl}
                                        alt=""
                                    />
                                </Tooltip>
                            ) : null}
                        </span>
                    </div>
                )
            },
        },
        {
            title: f('marketDetailAddressAmount'),
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (text, record) => {
                return `${Global.formatBigNum(record.amount)}`
            },
        },
        {
            title: f('marketDetailAddressValue'),
            dataIndex: 'value',
            key: 'value',
            align: 'right',
            render: (text, record) => {
                return `$ ${Global.formatBigNum(record.value)}`
            },
        },
        {
            title: f('marketDetailAddressPrice'),
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (text, record) => {
                return `$ ${Global.formatBigNum(record.price)}`
            },
        },
        {
            title: f('marketDetailTxHash'),
            dataIndex: 'txHash',
            key: 'txHash',
            align: 'right',
            render: (text, record) => {
                return (
                    <svg
                        className="icon"
                        aria-hidden="true"
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                        onClick={() => {
                            window.open(record.txHash)
                        }}>
                        <use xlinkHref='#icon-etherscan'></use>
                    </svg>
                )
            },
        },
    ]
    return (
        <Table
            rowKey="index"
            columns={tableName == 'bus' ? groupColumns : tableName == 'lp' ? groupLpColumns : groupTransferColumns}
            pagination={{
                showQuickJumper: true,
                showSizeChanger: false,
                current: params.pageNo,
                pageSize: params.pageSize,
                total: groupList?.totalSize,
                position: ['bottomCenter'],
            }}
            dataSource={groupList?.list}
            loading={params.loading}
            // scroll={{ x: tableName == 'bus' ? '1300px' : true }}
            onChange={handleTableChange}
        />
    )
}
