import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import 'styles/adress-dynamic.less'
import {
    Select,
    DatePicker,
    Input,
    InputNumber,
    Table,
    Button,
    message,
} from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
    setSearchInfo,
    getAddrSymbolList,
    getAddrTradeList,
    getAddrTransferList,
    getAddrLpList,
} from 'redux/actions/AddressDynamicAction'
import Global from 'utils/Global'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import moment, { Moment } from 'moment'
const { RangePicker } = DatePicker
const { Option } = Select
import {
    trackAction,
    trackPage,
    ADDRESS_DYNAMIC,
} from 'utils/analyse/YMAnalyse'
import { AppState } from 'redux/reducers'
import { OptionData } from 'rc-select/lib/interface'
import { RangeValue } from 'rc-picker/lib/interface'
import {
    SymbolList, ResponseBodyList,
    TradeList,
    TransferList,
    LpList
} from 'redux/types/AddressDynamicTypes';
import { ColumnType } from 'antd/lib/table/interface'

export default function addressDynamic(props: any) {
    useEffect(() => {
        
        trackPage(ADDRESS_DYNAMIC.url)
    }, [])
    
    const router = useRouter()
    
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const dispatch = useDispatch()
    
    let searchInfo = useSelector((state: AppState) => state.addressDynamic.searchInfo)
    const symbolList =
        useSelector((state: AppState) => state.addressDynamic.symbolList) || []
    useEffect(() => {
        if (symbolList.length < 1) {
            dispatch(getAddrSymbolList())
        }
    }, [dispatch])
    const [addr, setAddr] = useState(searchInfo ? searchInfo.address : null) 
    useEffect(() => {
        if (router.query.addr) {
            searchInfo = null
        }
        setAddr(router.query.addr as string || (searchInfo ? searchInfo.address : null))
    }, [router])
    const arr =
        !router.query.addr && searchInfo
            ? searchInfo
            : {
                pageNo: 1,
                pageSize: 10,
                symbol: f('all'),
                symbolAddr: null,
                symbolContractAddr: null,
                address: addr || null,
                type: '1',
                direction: '0',
                directionList: [],
                max: '',
                min: '',
                startTime: Math.floor(
                    moment().subtract(7, 'd').valueOf() / 1000
                ),
                endTime: Math.floor(moment().valueOf() / 1000),
            }
    
    useEffect(() => {
        if (!router.query.addr && searchInfo) {
    
            switch (searchInfo.type) {
                case '1':
                    dispatch(getAddrTradeList(arr)) 
                    break
                case '2':
                    dispatch(getAddrTransferList(arr))
                    break
                case '3':
                    dispatch(getAddrLpList(arr))
                    break
                default:
                    break
            }
        } else {
            dispatch(setSearchInfo(null)) 
            const arrStr = {
                pageNo: 1,
                pageSize: 10,
                symbol: f('all'),
                symbolAddr: null,
                symbolContractAddr: null,
                address: addr || null,
                type: '1',
                direction: '0',
                directionList: [],
                max: '',
                min: '',
                startTime: Math.floor(
                    moment().subtract(7, 'd').valueOf() / 1000
                ),
                endTime: Math.floor(moment().valueOf() / 1000),
            }
            dispatch(
                getAddrTradeList({
                    ...arrStr,
                    symbol: router.query.symbol as string || f('all'),
                    symbolAddr:
                        router.query.symbol as string &&
                            router.query.symbol as string == f('symbolContract')
                            ? router.query.symbolContractAddr as string || null
                            : router.query.symbolAddr as string || null,
                    address: router.query.addr as string || null,
                })
            )
            setSearchCriteria(arrStr)
        }
    }, [router])
    const loading = useSelector((state: AppState) => state.addressDynamic.loading)
    const noMore = useSelector((state: AppState) => state.addressDynamic.noMore)
    const tradeList =
        useSelector((state: AppState) => state.addressDynamic.tradeList)
    const transferList = useSelector(
        (state: AppState) => state.addressDynamic.transferList
    )
    const lpList = useSelector((state: AppState) => state.addressDynamic.lpList)
    useEffect(() => {
        if (noMore) {
            message.info(f('lastPage'))
        }
    }, [noMore])

    const [searchCriteria, setSearchCriteria] = useState(arr) 
    useEffect(() => {
        dispatch(setSearchInfo(searchCriteria))
    }, [searchCriteria])
    const [symbol, setSymbol] = useState<string | null>(f('all')) 
    const [symbolAddr, setSymbolAddr] = useState<string | null>(null)
    const [symbolContractAddr, setSymbolContractAddr] = useState<string | null>(null) 

    useEffect(() => {
        const str = ['全部', '全部（不含ETH）', '币种合约', 'All', 'All (excluding ETH)', 'token contract']
        const str0 = ['all', 'allNoETH', 'symbolContract', 'all', 'allNoETH', 'symbolContract']
        setSymbol(
            router.query.symbol as string || (searchInfo ? searchInfo.symbol && str.indexOf(searchInfo.symbol) > -1 ? f(str0[str.indexOf(searchInfo.symbol)]) : searchInfo.symbol : f('all'))
        )
        setSymbolAddr(
            router.query.symbolAddr as string ||
            (searchInfo ? searchInfo.symbolAddr : null)
        )
        setSymbolContractAddr(
            router.query.symbolContractAddr as string ||
            (searchInfo ? searchInfo.symbolContractAddr : null)
        )
    }, [router])
    const [type, setType] = useState(searchInfo ? searchInfo.type : '1') 
    const [direction, setDirection] = useState(
        searchInfo ? searchInfo.direction : '0'
    ) //
    const [symbolOption, setSymbolOption] = useState(
        searchInfo && searchInfo.type == '2'
            ? [
                <Option value="null" key="null">{f('allNoETH')}</Option>,
                <Option value="nullSymbol" key="nullSymbol">{f('symbolContract')}</Option>,
            ]
            : [
                <Option value="null" key="null">{f('all')}</Option>,
                <Option value="nullSymbol" key="nullSymbol">{f('symbolContract')}</Option>,
            ]
    ) //

    const {locale} = router;
    useEffect(() => {
        const optionsList = searchInfo && searchInfo.type == '2'
        ? [
            <Option value="null" key="null">{f('allNoETH')}</Option>,
            <Option value="nullSymbol" key="nullSymbol">{f('symbolContract')}</Option>,
        ]
        : [
            <Option value="null" key="null">{f('all')}</Option>,
            <Option value="nullSymbol" key="nullSymbol">{f('symbolContract')}</Option>,
        ]
        setSymbolOption(optionsList);
    },[locale]);

    const [directionList, setDirectionList] = useState(
        symbolAddr
            ? [
                <Option value="1" key="1">
                    {f('swapDirection1')}
                </Option>,
                <Option value="2" key="2">
                    {f('swapDirection2')}
                </Option>,
            ]
            : searchInfo
                ? searchInfo.directionList
                : []
    ) //
    const [max, setMax] = useState(searchInfo ? searchInfo.max : undefined) //
    const [min, setMin] = useState(searchInfo ? searchInfo.min : undefined) //
    const [startTime, setStartTime] = useState<moment.Moment | null>(
        searchInfo
            ? moment(searchInfo.startTime * 1000)
            : moment().subtract(7, 'd')
    ) // 
    const [endTime, setEndTime] = useState<moment.Moment | null>(
        searchInfo ? moment(searchInfo.endTime * 1000) : moment()
    ) // 
    const [pageNo, setPageNo] = useState(searchInfo ? searchInfo.pageNo : 1)
    const [pageSize, setPageSize] = useState(
        searchInfo ? searchInfo.pageSize : 10
    )
    // 
    const resetSearch = () => {
        trackAction(ADDRESS_DYNAMIC.category, ADDRESS_DYNAMIC.actions.btn_reset)
        setSymbol(f('all')) // 
        setSymbolAddr(null) // 
        setSymbolContractAddr(null) // 
        setAddr(null) //
        setType('1') // 
        setDirection('0') // 
        setMax(undefined) // 
        setMin(undefined) // 
        setStartTime(moment().subtract(7, 'd')) // 
        setEndTime(moment()) // 
        setSearchCriteria({
            pageNo: 1,
            pageSize: 10,
            symbol: f('all'),
            symbolAddr: null,
            symbolContractAddr: null,
            address: addr || null,
            type: '1',
            direction: '0',
            directionList: [],
            max: '',
            min: '',
            startTime: Math.floor(moment().subtract(7, 'd').valueOf() / 1000),
            endTime: Math.floor(moment().valueOf() / 1000),
        })
        setPageNo(1)
        setPageSize(10)
        dispatch(
            getAddrTradeList({
                pageNo: 1,
                pageSize: 10,
                symbol: f('all'),
                symbolAddr: null,
                symbolContractAddr: null,
                address: addr || null,
                type: '1',
                direction: '0',
                directionList: [],
                max: '',
                min: '',
                startTime: Math.floor(
                    moment().subtract(7, 'd').valueOf() / 1000
                ),
                endTime: Math.floor(moment().valueOf() / 1000),
            })
        ) 
        dispatch(setSearchInfo(null)) 
    }
    
    const confirmSearch = () => {
        setPageNo(1)
        setPageSize(10)
        if (min && max) {
            if (min > max) {
                message.error(f('minMax'))
                return
            }
        }
        if (symbol == f('symbolContract') && !symbolContractAddr) {
            message.error(f('symbolContractAddrSpace'))
            return
        }
        const arrSearch = {
            pageNo: 1,
            pageSize: 10,
            symbol: symbol,
            symbolAddr:
                symbol == f('symbolContract')
                    ? symbolContractAddr || null
                    : symbolAddr || null, 
            symbolContractAddr: symbolContractAddr, 
            address: addr || null, 
            type: type,
            direction: direction, 
            directionList: directionList, 
            max: max || '', // 
            min: min || '', // 
            startTime: Math.floor(moment(startTime).valueOf() / 1000) || '', // 
            endTime: Math.floor(moment(endTime).valueOf() / 1000) || '', //
        }

        setSearchCriteria(arrSearch)
        trackAction(
            ADDRESS_DYNAMIC.category,
            ADDRESS_DYNAMIC.actions.btn_search
        )
        switch (type) {
            case '1':
                dispatch(getAddrTradeList(arrSearch)) // 
                trackAction(
                    ADDRESS_DYNAMIC.category,
                    ADDRESS_DYNAMIC.actions.type_swap
                )
                break
            case '2':
                dispatch(getAddrTransferList(arrSearch)) // 
                trackAction(
                    ADDRESS_DYNAMIC.category,
                    ADDRESS_DYNAMIC.actions.type_transfer
                )
                break
            case '3':
                dispatch(getAddrLpList(arrSearch)) // 
                trackAction(
                    ADDRESS_DYNAMIC.category,
                    ADDRESS_DYNAMIC.actions.type_lp
                )
                break
            default:
                break
        }
    }
    // 
    const typeChange = (value: string | number) => {
        setType(value)
        setDirection('0')
        switch (value) {
            case '1':
                setSymbol(f('all'))
                setSymbolAddr(null) // 
                setSymbolContractAddr(null) // 
                // setSymbolOption([{ label: f('all'), value: null }])
                setSymbolOption([
                    <Option value="null" key="null">{f('all')}</Option>,
                    <Option value="nullSymbol" key="nullSymbol">{f('symbolContract')}</Option>,
                ])
                if (symbolAddr) {
                    setDirectionList([
                        <Option value="1" key="1">
                            {f('swapDirection1')}
                        </Option>,
                        <Option value="2" key="2">
                            {f('swapDirection2')}
                        </Option>,
                    ])
                } else {
                    setDirectionList([])
                }
                break
            case '2':
                setSymbol(f('allNoETH'))
                setSymbolAddr(null) // 
                setSymbolContractAddr(null) // 
                // setSymbolOption([{ label: f('allNoETH'), value: null }])
                setSymbolOption([
                    <Option value="null" key="null">{f('allNoETH')}</Option>,
                    <Option value="nullSymbol" key="nullSymbol">{f('symbolContract')}</Option>,
                ])
                if (addr) {
                    setDirectionList([
                        <Option value="1" key="1">
                            {f('transferDirection1')}
                        </Option>,
                        <Option value="2" key="2">
                            {f('transferDirection2')}
                        </Option>,
                    ])
                } else {
                    setDirectionList([])
                }
                break
            case '3':
                setSymbol(f('all'))
                setSymbolAddr(null) // 
                setSymbolContractAddr(null) // 
                // setSymbolOption([{ label: f('all'), value: null }])
                setSymbolOption([
                    <Option value="null" key="null">{f('all')}</Option>,
                    <Option value="nullSymbol" key="nullSymbol">{f('symbolContract')}</Option>,
                ])
                setDirectionList([
                    <Option value="1" key="1">
                        {f('lpDirection1')}
                    </Option>,
                    <Option value="2" key="2">
                        {f('lpDirection2')}
                    </Option>,
                ])
                break
            default:
                break
        }
    }
    //

    const pageChange = (page: number) => {
        setPageNo(page)
        switch (type) {
            case '1':
                dispatch(getAddrTradeList({ ...searchCriteria, pageNo: page })) // 
                break
            case '2':
                dispatch(
                    getAddrTransferList({ ...searchCriteria, pageNo: page })
                ) // 
                break
            case '3':
                dispatch(getAddrLpList({ ...searchCriteria, pageNo: page })) // 
                break
            default:
                break
        }
    }
    // 
    const disabledStartDate = (startValue: number) => {
        const endValue = endTime
        if (!startValue || !endValue) {
            return false
        }
        return startValue.valueOf() > endValue.valueOf()
    }
    //const userInfo = useSelector((state: AppState) => state.userInfo)
    return (
        <>
            <p className="defi-label">{f('label')}</p>
            <div className="bitwaves-content">
                <div className="search-box">
                    <SearchComponent
                        symbolList={symbolList}
                        symbolOption={symbolOption}
                        params={{
                            symbol: symbol,
                            symbolAddr: symbolAddr,
                            symbolContractAddr: symbolContractAddr,
                            address: addr,
                            type: type,
                            direction: direction,
                            directionList: directionList,
                            startTime: startTime,
                            endTime: endTime,
                            min: min,
                            max: max,
                        }}
                        typeChange={typeChange}
                        onChange={{
                            setSymbol: setSymbol,
                            setSymbolAddr: setSymbolAddr,
                            setSymbolContractAddr: setSymbolContractAddr,
                            setAddr: setAddr,
                            setDirection: setDirection,
                            setStartTime: setStartTime,
                            setEndTime: setEndTime,
                            setMax: setMax,
                            setMin: setMin,
                            setDirectionList: setDirectionList,
                        }}
                    />
                    <div className="search-btns">
                        <div className="search-reset-btn" onClick={resetSearch}>
                            {f('resetBtn')}
                        </div>
                        <div
                            className="search-confirm-btn"
                            onClick={confirmSearch}
                        >
                            {f('searchBtn')}
                        </div>
                    </div>
                </div>
                <div className="common-table common-dark-table">
                    {searchCriteria.type == '1' ? (
                        <TradeTableComponent
                            params={{
                                pageNo: pageNo,
                                pageSize: pageSize,
                                loading: loading,
                            }}
                            tradeList={tradeList}
                        />
                    ) : null}
                    {searchCriteria.type == '2' ? (
                        <TransferTableComponent
                            params={{
                                pageNo: pageNo,
                                pageSize: pageSize,
                                loading: loading,
                            }}
                            transferList={transferList}
                        />
                    ) : null}
                    {searchCriteria.type == '3' ? (
                        <LpTableComponent
                            params={{
                                pageNo: pageNo,
                                pageSize: pageSize,
                                loading: loading,
                            }}
                            lpList={lpList}
                        />
                    ) : null}
                    <div className="dynamic-btn-box">
                        <Button
                            icon={<LeftOutlined />}
                            disabled={pageNo == 1}
                            onClick={() => {
                                let page = pageNo
                                page = page - 1
                                pageChange(page)
                            }}
                        ></Button>
                        <Button
                            icon={<RightOutlined />}
                            disabled={noMore}
                            onClick={() => {
                                let page = pageNo
                                page = page + 1
                                pageChange(page)
                            }}
                        ></Button>
                    </div>
                </div>
            </div>
        </>
    )
}

type DefiSearchProps = {
    symbolList: SymbolList[],
    symbolOption: JSX.Element[],
    params: any,
    typeChange: (value: string | number) => void,
    onChange: {
        setSymbol: any,
        setSymbolAddr: React.Dispatch<React.SetStateAction<string | null>>,
        setSymbolContractAddr: React.Dispatch<React.SetStateAction<string | null>>,
        setAddr: React.Dispatch<React.SetStateAction<string | null>>,
        setDirection: React.Dispatch<React.SetStateAction<string | number>>,
        setStartTime: React.Dispatch<React.SetStateAction<moment.Moment | null>>,
        setEndTime: React.Dispatch<React.SetStateAction<moment.Moment | null>>,
        setMax: React.Dispatch<React.SetStateAction<string | number | undefined>>,
        setMin: React.Dispatch<React.SetStateAction<string | number | undefined>>,
        setDirectionList: React.Dispatch<React.SetStateAction<any[]>>,
    },
}
function SearchComponent({
    symbolList,
    // searchInfo,
    symbolOption,
    params,
    typeChange,
    onChange,
}: DefiSearchProps) {
    //
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })

    return (
        <div className="search-option" style={{ padding: '20px 40px 20px'}}>
            <div className="search-option-line-1">
                <div className="common-select">
                    <Select
                        value={params.symbol}
                        key={params.symbolAddr}
                        showSearch
                        optionFilterProp="label"
                        onChange={(value, key) => {
                            onChange.setSymbolContractAddr(null)
                            if (value == 'null') {
                                value = null
                                if (params.type == '1') {
                                    onChange.setDirectionList([])
                                }
                            } else if (value == 'nullSymbol') {
                                if (params.type == '1') {
                                    onChange.setDirectionList([
                                        <Option value="1" key="1">
                                            {f('swapDirection1')}
                                        </Option>,
                                        <Option value="2" key="2">
                                            {f('swapDirection2')}
                                        </Option>,
                                    ])
                                }
                                onChange.setSymbolContractAddr('')
                            } else if (params.type == '1') {
                                onChange.setDirectionList([
                                    <Option value="1" key="1">
                                        {f('swapDirection1')}
                                    </Option>,
                                    <Option value="2" key="2">
                                        {f('swapDirection2')}
                                    </Option>,
                                ])
                            }
                            onChange.setSymbol((key as OptionData).children)
                            onChange.setSymbolAddr(value)
                        }}
                        filterOption={(input, option) => {
                            return (
                                option ? option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0 : false
                            )
                        }}
                    >
                        {symbolOption}
                        {symbolList.map((item: { address: string | number; symbol: string }) => {
                            return (
                                <Option value={item.address} key={item.address}>
                                    {item.symbol}
                                </Option>
                            )
                        })}
                    </Select>
                </div>
                {params.symbolContractAddr === null ||
                    params.symbolContractAddr === undefined ? null : (
                    <div className="common-input">
                        <Input
                            value={params.symbolContractAddr}
                            placeholder={f('symbolContractPlaceholder')}
                            onChange={({ target: { value } }) => {
                                onChange.setSymbolContractAddr(value)
                            }}
                        />
                    </div>
                )}
                <div className="common-input">
                    <Input
                        value={params.address}
                        placeholder={f('addressPlaceholder')}
                        onChange={({ target: { value } }) => {
                            onChange.setAddr(value)
                            if (value && params.type == '2') {
                                onChange.setDirectionList([
                                    <Option value="1" key="1">
                                        {f('transferDirection1')}
                                    </Option>,
                                    <Option value="2" key="2">
                                        {f('transferDirection2')}
                                    </Option>,
                                ])
                            } else if (!value && params.type == '2') {
                                onChange.setDirection('0')
                                onChange.setDirectionList([])
                            }
                        }}
                    />
                </div>
            </div>
            <div className="search-option-line-2">
                <div className="common-select">
                    <Select value={params.type} onChange={typeChange}>
                        <Option value="1">{f('swapTitle')}</Option>
                        <Option value="2">{f('transferTitle')}</Option>
                        <Option value="3">{f('lpTitle')}</Option>
                    </Select>
                </div>
                <div className="common-select">
                    <Select
                        value={params.direction}
                        onChange={(value) => {
                            onChange.setDirection(value)
                        }}
                    >
                        <Option value="0">{f('all')}</Option>
                        {params.directionList}
                    </Select>
                </div>
                <div
                    className="common-date-picker"
                    style={{ position: 'relative' }}
                >
                    <div style={{ position: 'absolute', paddingRight: '20px' }}>
                        <RangePicker
                            defaultValue={[moment().subtract(7, 'd'), moment()]}
                            value={[params.startTime, params.endTime]}
                            format={'YYYY-MM-DD HH:mm'}
                            showTime
                            allowClear={false}
                            onChange={(val: RangeValue<Moment>) => {
                                onChange.setStartTime(val && val[0])
                                onChange.setEndTime(val && val[1])
                            }}
                        />
                    </div>
                </div>
                <div className="common-input">
                    <InputNumber
                        value={params.min}
                        placeholder={f('minPlaceholder')}
                        onChange={(val) => onChange.setMin(val)}
                    />
                </div>
                <div className="common-input">
                    <InputNumber
                        value={params.max}
                        placeholder={f('maxPlaceholder')}
                        onChange={(val) => onChange.setMax(val)}
                    />
                </div>
            </div>
        </div>
    )
}

type DefiTableProps = {
    params: {
        pageNo: number,
        pageSize: number,
        loading: boolean,
    },
    tradeList?: ResponseBodyList<TradeList[]>,
    transferList?: ResponseBodyList<TransferList[]>,
    lpList?: ResponseBodyList<LpList[]>,
}

function TradeTableComponent({ params, tradeList }: DefiTableProps) {
    //
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const tradeColumns: ColumnType<TradeList>[] = [
        {
            title: f('tableTime'),
            dataIndex: 'date',
            // width: 120,
            key: 'date',
            render: (text: any, record: TradeList) => {
                return <span>{moment(record.date).format('MM-DD HH:mm')}</span>
            },
        },
        {
            title: f('tableType'),
            dataIndex: 'direction',
            // width: 100,
            key: 'direction',
            align: 'center',
            render: (text: any, record: TradeList) => {
                let name = f('swapTitle')
                switch (record.direction) {
                    case 0:
                        name = f('swapTitle')
                        break
                    case 1:
                        name = f('swapDirection1')
                        break
                    case 2:
                        name = f('swapDirection2')
                        break
                    default:
                        break
                }
                return (
                    <span
                        className={
                            record.direction == 0
                                ? "direction-all"
                                : record.direction == 1
                                    ? "direction-in"
                                    : "direction-out"
                        }
                    >
                        {name}
                    </span>
                )
            },
        },
        {
            title: f('tableSymbol'),
            dataIndex: 'symbol',
            // width: 250,
            key: 'symbol',
            align: 'right',
        },
        {
            title: f('tableAmount'),
            dataIndex: 'amount',
            // width: 150,
            key: 'amount',
            align: 'right',
            render: (text: any, record: TradeList) => {
                return Global.formatNum(record.amount)
            },
        },
        {
            title: f('tableValue'),
            dataIndex: 'value',
            // width: 200,
            key: 'value',
            align: 'right',
            render: (text: any, record: TradeList) => {
                return (
                    <span>
                        {Global.formatNum(record.value)}
                        <span className="value-symbol">
                            {record.valueSymbol}
                        </span>
                    </span>
                )
            },
        },
        {
            title: f('tablePrice'),
            dataIndex: 'price',
            // width: 200,
            key: 'price',
            align: 'right',
            render: (text: any, record: TradeList) => {
                return (
                    <span>
                        {Global.formatNum(record.price)}
                        <span className="value-symbol">
                            {record.valueSymbol}
                        </span>
                    </span>
                )
            },
        },
        {
            title: f('tableAddress'),
            dataIndex: 'address',
            key: 'address',
            align: 'right',
            // fixed: 'right',
            // width: 400,
            render: (text: any, record: TradeList) => {
                return (
                    <Link
                        href={`/address-analyse/${record.address}`}
                    >
                        <a className="a-link">
                            {Global.abbrSymbolAddress(record.address)}
                        </a>
                    </Link>
                )
            },
        },
    ]

    return (
        <div>
            <Table
                columns={tradeColumns}
                pagination={false}
                dataSource={tradeList&&tradeList.list}
                loading={params.loading}
                scroll={{ x: '1300px' }}
                rowKey={(record) => {
                    return record.id
                }}
            />
        </div>
    )
}

function TransferTableComponent({ params, transferList }: DefiTableProps) {
    //
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const transferColumns: ColumnType<TransferList>[] = [
        {
            title: f('tableTime'),
            dataIndex: 'date',
            // width: 120,
            key: 'date',
            render: (text: any, record: TransferList) => {
                return <span>{moment(record.date).format('MM-DD HH:mm')}</span>
            },
        },
        {
            title: f('tableType'),
            dataIndex: 'direction',
            // width: 100,
            key: 'direction',
            align: 'right',
            render: (text: any, record: TransferList) => {
                let name = f('transferTitle')
                switch (record.direction) {
                    case 0:
                        name = f('transferTitle')
                        break
                    case 1:
                        name = f('transferDirection1')
                        break
                    case 2:
                        name = f('transferDirection2')
                        break
                    default:
                        break
                }
                return (
                    <span
                        className={
                            record.direction == 0
                                ? "direction-all"
                                : record.direction == 1
                                    ? "direction-in"
                                    : "direction-out"
                        }
                    >
                        {name}
                    </span>
                )
            },
        },
        {
            title: f('tableSymbol'),
            dataIndex: 'symbol',
            // width: 250,
            key: 'symbol',
            align: 'right',
        },
        {
            title: f('tableAmount'),
            dataIndex: 'amount',
            // width: 150,
            key: 'amount',
            align: 'right',
            render: (text: any, record: TransferList) => {
                return Global.formatNum(record.amount)
            },
        },
        {
            title: f('tableTransferAddress'),
            // width: 400,
            dataIndex: 'outAddr',
            key: 'outAddr',
            align: 'right',
            render: (text: any, record: TransferList) => {
                return (
                    <Link
                        href={`/address-analyse/${record.outAddr}`}
                    >
                        <a className="a-link">
                            {Global.abbrSymbolAddress(record.outAddr)}
                        </a>
                    </Link>
                )
            },
        },
        {
            title: f('tableCollectionAddress'),
            // width: 400,
            dataIndex: 'inAddr',
            key: 'inAddr',
            align: 'right',
            render: (text: any, record: TransferList) => {
                return (
                    <Link
                        href={`/address-analyse/${record.inAddr}`}
                    >
                        <a className="a-link">
                            {Global.abbrSymbolAddress(record.inAddr)}
                        </a>
                    </Link>
                )
            },
        },
    ]

    return (
        <Table
            columns={transferColumns}
            pagination={false}
            dataSource={transferList&&transferList.list}
            loading={params.loading}
            scroll={{ x: '1200px' }}
            rowKey={(record) => {
                return record.id
            }}
        />
    )
}

function LpTableComponent({ params, lpList }: DefiTableProps) {
    //
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const lpColumns: ColumnType<LpList>[] = [
        {
            title: f('tableTime'),
            dataIndex: 'date',
            // width: 120,
            key: 'date',
            render: (text: any, record: LpList) => {
                return <span>{moment(record.date).format('MM-DD HH:mm')}</span>
            },
        },
        {
            title: f('tableType'),
            dataIndex: 'direction',
            key: 'direction',
            align: 'center',
            // width: 100,
            render: (text: any, record: LpList) => {
                let name =
                    record.direction == 1
                        ? f('lpDirection1')
                        : f('lpDirection2')
                return (
                    <span
                        className={
                            record.direction == 1
                                ? "direction-in"
                                : "direction-out"
                        }
                    >
                        {name}
                    </span>
                )
            },
        },
        {
            title: f('tableSymbol1'),
            dataIndex: 'symbol0',
            // width: 250,
            key: 'symbol0',
            align: 'right',
        },
        {
            title: f('tableAmount'),
            dataIndex: 'amount0',
            // width: 150,
            key: 'amount0',
            align: 'right',
            render: (text: any, record: LpList) => {
                return Global.formatNum(record.amount0)
            },
        },
        {
            title: f('tableSymbol2'),
            dataIndex: 'symbol1',
            // width: 250,
            key: 'symbol1',
            align: 'right',
        },
        {
            title: f('tableAmount'),
            dataIndex: 'amount1',
            // width: 150,
            key: 'amount1',
            align: 'right',
            render: (text: any, record: LpList) => {
                return Global.formatNum(record.amount1)
            },
        },
        {
            title: f('tableLpAddress'),
            dataIndex: 'address',
            // width: 400,
            key: 'address',
            align: 'right',
            render: (text: any, record: LpList) => {
                return (
                    <Link
                        href={`/address-analyse/${record.address}`}
                    >
                        <a className="a-link">
                            {Global.abbrSymbolAddress(record.address)}
                        </a>
                    </Link>
                )
            },
        },
        {
            title: f('tableContractAddress'),
            dataIndex: 'contractAddr',
            // width: 400,
            key: 'contractAddr',
            align: 'right',
            render: (text: any, record: LpList) => {
                return (
                    <Link
                        href={`/address-analyse/${record.contractAddr}`}
                    >
                        <a className="a-link">
                            {Global.abbrSymbolAddress(record.contractAddr)}
                        </a>
                    </Link>
                )
            },
        },
    ]

    return (
        <Table
            columns={lpColumns}
            pagination={false}
            dataSource={lpList&&lpList.list}
            loading={params.loading}
            scroll={{ x: '1400px' }}
            rowKey={(record) => {
                return record.id
            }}
        />
    )
}
