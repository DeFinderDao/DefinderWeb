import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Spin, DatePicker, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getCurrencyAddrLineList } from 'redux/actions/MarketPage/CurrencyAddrLineAction'
import loadable from '@loadable/component'
import Global from 'utils/Global'
import { AppState } from 'redux/reducers'
import moment, { Moment } from 'moment'
import React from 'react'
import type { RangeValue } from 'rc-picker/lib/interface'
import { ANT_CHARTS_DARK, CHART_AXIS_COLOR, LINESTYLE_WIDTH } from 'utils/env'
import DefinEmpty from 'components/Header/definEmpty'
import { useRouter } from 'next/router'
import { HoldMarketItem } from 'redux/types/CurrencyAddrLineTypes'
const DualAxes = loadable(() => import('@ant-design/plots/lib/components/dualAxes'))
import WaterMarkCahrtContent from 'components/WaterMarkCahrtContent'
const { RangePicker } = DatePicker

const dateFormat = 'YYYY-MM-DD'

function convertDatesToMoments(startTime: number, endTime: number) {
    if (startTime && endTime) {
        return [moment(startTime, dateFormat), moment(endTime, dateFormat)]
    } else {
        return []
    }
}

interface CurrencyAddrLineProps {
    symbolAddr: string,
    symbol: string,
}


export default function CurrencyAddrLine({ symbolAddr }: CurrencyAddrLineProps) {
    const dispatch = useDispatch()
    const { formatMessage } = useIntl()
    const f = (id: string) => formatMessage({ id })
    const currencyAddrLineList = useSelector(
        (state: AppState) => state.currencyAddrLineReducer.currencyAddrLineList
    )
    const currencyAddrLoading = useSelector(
        (state: AppState) => state.currencyAddrLineReducer.currencyAddrLoading
    )

    const [query, setQuery] = useState({
        startTime: Math.floor(moment().subtract(30, 'd').valueOf() / 1000),
        endTime: Math.floor(moment().valueOf() / 1000),
    })
    
    // let start = daysNum({ startTime: moment(query.startTime * 1000), endTime: moment(query.endTime * 1000) })
    const { pageMode } = useSelector((state: AppState) => state.userInfo);
    const config = {
        data: [currencyAddrLineList, currencyAddrLineList],
        xField: 'date',
        yField: ['accountCount', 'price'],
        theme: pageMode === 'dark' ? ANT_CHARTS_DARK : undefined,
        geometryOptions: [
            {
                lineStyle: LINESTYLE_WIDTH
            },
            {
                lineStyle: LINESTYLE_WIDTH
            }
        ],
        yAxis: {
            accountCount: {
                label: {
                    formatter: (text: string) => {
                        return Global.formatYAxis(text, f);
                    },
                },
                ...Global.findMinAndMax(currencyAddrLineList.map((item: HoldMarketItem) => {
                    return item.accountCount as number;
                })),
                grid: null,
                line: {
                    style: {
                        stroke: CHART_AXIS_COLOR,
                        ...LINESTYLE_WIDTH
                    },
                },
            },
            price: {
                label: {
                    formatter: (text: string) => {
                        return Global.formatYAxis(text, f);
                    },
                },
                ...Global.findMinAndMax(currencyAddrLineList.map((item: HoldMarketItem) => {
                    return item.price as number;
                })),
                grid: null,
                line: {
                    style: {
                        stroke: CHART_AXIS_COLOR,
                        ...LINESTYLE_WIDTH
                    },
                },
            }
        },
        slider: {
            ...ANT_CHARTS_DARK.components.slider.common,
            start: 0,
            end: 1,
            formatter(time: number) {
                return moment(Number(time)).format('YYYY/MM/DD')
            },
            padding: [0, 0, -22, 0]
        },
        padding: [20, 30, 30, 30],
        tooltip: {
            title: 'time'
        },
        meta: {
            
            accountCount: {
                alias: f('currencyAddrLineAccountCount'),
                formatter: (accountCount: number) => {
                    return `${Global.formatNum(accountCount)}`
                },
            },
            
            price: {
                alias: f('currencyAddrLinePrice'),
                formatter: (price: number) => {
                    return `$ ${Global.formatNum(price)}`
                },
            },
            date: {
                sync: false,
            },
        },
        xAxis: {
            tickCount: 10,
            label: {
                formatter: (time: string) => {
                    return moment(Number(time)).format('yyyy/MM/DD')
                },
            },
            line: {
                style: {
                    stroke: CHART_AXIS_COLOR,
                    ...LINESTYLE_WIDTH
                },
            },
        },
    }
    
    const transferConditionValue = React.useMemo(() => {
        convertDatesToMoments(
            query.startTime,
            query.endTime
        )
    }, [query.startTime, query.endTime]);
    const handleDatePickerChange = (dates: RangeValue<Moment>) => {
        setQuery({
            ...query,
            startTime: Math.floor(moment(dates![0]).valueOf() / 1000),
            endTime: Math.floor(moment(dates![1]).valueOf() / 1000),
        })
    }
    const router = useRouter();
    const { locale } = router;
    useEffect(() => {
        dispatch(getCurrencyAddrLineList({
            symbolAddr: symbolAddr,
            startTime: query.startTime * 1000,
            endTime: query.endTime * 1000
        }))
    }, [dispatch, symbolAddr, query, locale])
    return (
        <div
            className="block-item item-small"
            style={{ minHeight: '400px' }}
        >
            <div className="item-title" style={{ marginBottom: 20 }}>
                <span>
                    {f('marketDetailAddrChangeTitle')}
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                {f(
                                    'marketDetailAddrChangeTips'
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
                </span>
                <RangePicker
                    defaultValue={[
                        moment().subtract(30, 'd'),
                        moment(),
                    ]}
                    format={dateFormat}
                    allowClear={false}
                    value={transferConditionValue as unknown as [Moment, Moment]}
                    onChange={handleDatePickerChange}
                    style={{ marginBottom: 10 }}
                />
            </div>
            {currencyAddrLineList && currencyAddrLineList.length > 0 ? (
                <div style={{ marginTop: '20px', height: '312px' }}>
                    <DualAxes
                        {...config}
                        fallback={
                            <div
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Spin></Spin>
                            </div>
                        }
                    />
                    <WaterMarkCahrtContent right={100} top={285} />
                </div>
            ) : (
                <div className="table-empty">
                    <DefinEmpty spinning={currencyAddrLoading} />
                </div>
            )}
        </div>
    )
}
